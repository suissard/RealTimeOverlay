import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn } from 'child_process';
import { io } from 'socket.io-client';

const createClient = () => {
    return new Promise((resolve) => {
        const socket = io('http://localhost:3000', {
            reconnection: false,
            forceNew: true,
        });
        socket.on('connect', () => {
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
    clientSocket.disconnect();
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
    client1.disconnect();
    client2.disconnect();
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
    client1.disconnect();
  });
});
