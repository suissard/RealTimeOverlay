<template>
  <div class="container">
    <h1>Overlay Display</h1>
    <div v-if="store.roomId" class="qr-container">
      <p>Scan this QR code with your remote device to connect.</p>
      <qrcode-vue :value="remoteUrl" :size="300" level="H" />
      <p class="room-id">Room ID: <code>{{ store.roomId }}</code></p>
    </div>
    <div v-else>
      <p>Generating session...</p>
    </div>

    <div v-if="store.message" class="message-box">
      <h2>Message Received:</h2>
      <p class="message">{{ store.message }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useMainStore } from '../stores/main';
import QrcodeVue from 'vue-qrcode';

const store = useMainStore();

const remoteUrl = computed(() => {
  if (!store.roomId) return '';
  // Construct the URL for the remote page
  return `${window.location.origin}/remote?roomId=${store.roomId}`;
});

onMounted(() => {
  // When the component is mounted, generate a new room ID and connect
  store.generateRoomId();
  store.connect(store.roomId);
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  background-color: #2c3e50;
  color: white;
}
.qr-container {
  padding: 2rem;
  background-color: white;
  border-radius: 1rem;
  color: #333;
  margin-bottom: 2rem;
}
.room-id {
  margin-top: 1rem;
  font-size: 0.9rem;
}
.message-box {
  margin-top: 2rem;
  padding: 1rem;
  border: 1px solid #444;
  border-radius: 0.5rem;
}
.message {
  font-size: 1.5rem;
  color: #42b983;
}
</style>
