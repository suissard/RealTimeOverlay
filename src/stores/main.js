import { defineStore } from 'pinia'
import { io } from 'socket.io-client'

export const useMainStore = defineStore('main', {
  state: () => ({
    roomId: null,
    isConnected: false,
    isRemote: false,
    message: null,
    socket: null,
    users: [],
  }),

  actions: {
    generateRoomId() {
      this.roomId = 'xxxx-xxxx-xxxx-xxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },

   connect(roomId, isRemote = false) {
      this.isRemote = isRemote;
      this.socket = io('http://localhost:3000');

      this.socket.on('connect', () => {
        console.log(`Connected to socket server with id: ${this.socket.id}`);
        this.socket.emit('join', { roomId, isRemote });
        console.log(`Sent join request for room: ${roomId}`);
        if (this.isRemote) {
          this.isConnected = true;
        }
      });

      this.socket.on('room_joined', (data) => {
        this.isConnected = true;
        console.log(`Successfully joined room: ${data.roomId}`);
      });

      this.socket.on('user_joined', (data) => {
        this.users = data.users;
        console.log(`Users in room: ${data.users}`);
      });

      this.socket.on('room_left', () => {
        this.isConnected = false;
        console.log(`A user left room: ${roomId}`);
      });

      this.socket.on('disconnect', () => {
        this.isConnected = false;
        console.log('Disconnected from socket server');
      });

      this.socket.on('control_message', (msg) => {
        console.log('Control message received:', msg);
        this.message = msg;
      });
    },

    sendMessage(message) {
      if (this.socket && this.roomId) {
        const payload = { room: this.roomId, message: message };
        this.socket.emit('control_message', payload);
        console.log(`Sent message to room ${this.roomId}:`, message);
      } else {
        console.error('Socket not connected or roomId not set.');
      }
    }
  }
})
