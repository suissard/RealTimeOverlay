import express from 'express';
import http from 'http';
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

app.use(express.static('public'));

const rooms = {};

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on('join', ({ roomId, isRemote }) => {
    if (!rooms[roomId]) {
      rooms[roomId] = {
        users: [],
        capacity: 2,
        id: roomId
      };
    }

    if (rooms[roomId].users.length >= rooms[roomId].capacity) {
      return socket.emit('room_full');
    }

    socket.join(roomId);
    rooms[roomId].users.push({ id: socket.id, isRemote });
    console.log(`Socket ${socket.id} joined room ${roomId}`);
    io.to(roomId).emit('room_joined', rooms[roomId]);
  });

  socket.on('control_message', (data) => {
    console.log(`Message received for room ${data.room}: ${data.message}`);
    // Broadcast to the room, excluding the sender
    socket.to(data.room).emit('control_message', data.message);
  });

  socket.on('manage_slots', ({ roomId, action }) => {
    const room = rooms[roomId];
    if (!room) {
      return;
    }

    const user = room.users.find(u => u.id === socket.id);
    if (!user || !user.isRemote) {
      return;
    }

    if (action === 'add') {
      room.capacity++;
    } else if (action === 'remove') {
      if (room.capacity > room.users.length) {
        room.capacity--;
      }
    }
    io.to(roomId).emit('room_updated', room);
  });

  socket.on('disconnect', () => {
    console.log(`A user disconnected: ${socket.id}`);
    for (const roomId in rooms) {
      const room = rooms[roomId];
      const userIndex = room.users.findIndex(user => user.id === socket.id);
      if (userIndex !== -1) {
        room.users.splice(userIndex, 1);
        io.to(roomId).emit('room_left', room);
        if (room.users.length === 0) {
          delete rooms[roomId];
          console.log(`Room ${roomId} is empty and has been deleted.`);
        }
        break;
      }
    }
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
