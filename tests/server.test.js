import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { spawn } from 'child_process';
import { io } from 'socket.io-client';
import axios from 'axios';

let clients = [];

const createClient = () => {
    return new Promise((resolve) => {
        const socket = io('http://localhost:3000', {
            reconnection: false,
            forceNew: true,
        });
        socket.on('connect', () => {
            clients.push(socket);
            resolve(socket);
        });
    });
};

describe('Server tests', () => {
  let serverProcess;

  beforeAll(() => {
    return new Promise((resolve) => {
      serverProcess = spawn('node', ['server/index.js']);
      serverProcess.stdout.on('data', (data) => {
        if (data.toString().includes('listening on *:3000')) {
          resolve();
        }
      });
      serverProcess.stderr.on('data', (data) => {
        console.error(`Server stderr: ${data}`);
      });
    });
  }, 15000);

  afterAll(() => {
    if (serverProcess) {
      serverProcess.kill();
    }
  });

  beforeEach(async () => {
    // Clear history before each test
    await axios.get('http://localhost:3000/history/clear');
    clients = [];
  });

  afterEach(() => {
    // Disconnect all clients after each test
    clients.forEach(socket => socket.disconnect());
  });


  it('should allow a user to join a room', async () => {
    const clientSocket = await createClient();
    const roomId = 'test-room-join';

    const joinPromise = new Promise(resolve => {
        clientSocket.once('room_joined', (room) => { // Using once is safer here too
            expect(room.users).toHaveLength(1);
            expect(room.users[0].id).toBe(clientSocket.id);
            resolve();
        });
    });

    clientSocket.emit('join', { roomId, isRemote: false });
    await joinPromise;
  });

  it('should broadcast a control message to other users in the room', async () => {
    const client1 = await createClient();
    const client2 = await createClient();
    const roomId = 'test-room-message';

    const messagePromise = new Promise(resolve => {
        client2.on('control_message', (message) => {
            expect(message).toBe('hello');
            resolve();
        });
    });

    // client1 joins, and we wait for confirmation
    const join1Promise = new Promise(resolve => {
        client1.once('room_joined', (room) => {
            expect(room.users).toHaveLength(1);
            resolve();
        });
    });
    client1.emit('join', { roomId, isRemote: true });
    await join1Promise;

    // client2 joins, and we wait for confirmation
    const join2Promise = new Promise(resolve => {
        client2.once('room_joined', (room) => {
            expect(room.users).toHaveLength(2);
            resolve();
        });
    });
    client2.emit('join', { roomId, isRemote: false });
    await join2Promise;

    // client1 sends a message
    client1.emit('control_message', { room: roomId, message: 'hello' });

    await messagePromise;
  });

  it('should notify other users when a user disconnects', async () => {
    const client1 = await createClient();
    const client2 = await createClient();
    const roomId = 'test-room-disconnect';

    const disconnectPromise = new Promise(resolve => {
        client1.on('room_left', (room) => {
            expect(room.users.find(u => u.id === client2.id)).toBeUndefined();
            expect(room.users.find(u => u.id === client1.id)).toBeDefined();
            expect(room.users).toHaveLength(1);
            resolve();
        });
    });

    // client1 joins, and we wait for confirmation
    const join1Promise = new Promise(resolve => {
        client1.once('room_joined', (room) => {
            expect(room.users).toHaveLength(1);
            resolve();
        });
    });
    client1.emit('join', { roomId, isRemote: false });
    await join1Promise;

    // client2 joins, and we wait for confirmation
    const join2Promise = new Promise(resolve => {
        client2.once('room_joined', (room) => {
            expect(room.users).toHaveLength(2);
            resolve();
        });
    });
    client2.emit('join', { roomId, isRemote: false });
    await join2Promise;

    client2.disconnect();

    await disconnectPromise;
  });

  it('should record control messages in history and expose it via /history', async () => {
    const client = await createClient();
    const roomId = 'test-room-history';
    const message = { text: 'test-message' };

    // Join room
    const joinPromise = new Promise(resolve => {
        client.once('room_joined', () => resolve());
    });
    client.emit('join', { roomId, isRemote: false });
    await joinPromise;

    // Send control message
    client.emit('control_message', { room: roomId, message });

    // Allow some time for the server to process the message and update history
    await new Promise(resolve => setTimeout(resolve, 200));

    // Fetch history
    const response = await axios.get('http://localhost:3000/history');
    const history = response.data;

    // Assertions
    expect(history).toBeInstanceOf(Array);
    expect(history.length).toBeGreaterThan(0);
    const lastEntry = history[history.length - 1];
    expect(lastEntry.user).toBe(client.id);
    expect(lastEntry.room).toBe(roomId);
    expect(lastEntry.message).toEqual(message);
    expect(lastEntry.timestamp).toBeDefined();
  }, 10000);
});
