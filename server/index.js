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

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on('join', async (data) => {
    await socket.join(data.roomId);
    console.log(`Socket ${socket.id} joined room ${data.roomId}`);
    socket.emit("room_joined", { roomId: data.roomId });

    const sockets = await io.in(data.roomId).fetchSockets();
    const users = sockets.map(s => s.id);
    io.to(data.roomId).emit("user_joined", { users });
  });

  socket.on('control_message', (data) => {
    console.log(`Message received for room ${data.room}: ${data.message}`);
    // Broadcast to the room, excluding the sender
    socket.to(data.room).emit('control_message', data.message);
  });

  socket.on('disconnect', () => {
    console.log(`A user disconnected: ${socket.id}`);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
