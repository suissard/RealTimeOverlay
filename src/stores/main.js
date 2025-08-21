import { defineStore } from 'pinia'
import { io } from 'socket.io-client'

export const useMainStore = defineStore('main', {
  state: () => ({
    roomId: null,
    isConnected: false,
    message: null,
    socket: null,
  }),

  actions: {
    generateRoomId() {
      this.roomId = 'xxxx-xxxx-xxxx-xxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },

    connect(roomId) {
      this.socket = io();

      this.socket.on('connect', () => {
        this.isConnected = true;
        console.log(`Connected to socket server with id: ${this.socket.id}`);
        this.socket.emit('join', roomId);
        console.log(`Joined room: ${roomId}`);
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
