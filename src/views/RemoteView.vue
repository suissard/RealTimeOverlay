<template>
  <div class="container">
    <h1>Remote Control</h1>
    <div v-if="store.isConnected" class="controls">
      <p>Connected to room: <code>{{ store.roomId }}</code></p>
      <input v-model="message" @keyup.enter="sendMessage" type="text" placeholder="Enter a message" />
      <button @click="sendMessage">Send Message</button>
    </div>
    <div v-else-if="error">
      <p class="error">{{ error }}</p>
    </div>
    <div v-else>
      <p>Connecting to room...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useMainStore } from '../stores/main';

const store = useMainStore();
const route = useRoute();
const message = ref('Hello from the remote!');
const error = ref(null);

onMounted(() => {
  const roomId = route.query.roomId;
  if (roomId) {
    store.roomId = roomId;
    store.connect(roomId);
  } else {
    error.value = 'Error: No Room ID was provided in the URL. Please scan the QR code again.';
    console.error(error.value);
  }
});

const sendMessage = () => {
  if (message.value && store.isConnected) {
    store.sendMessage(message.value);
  } else {
    console.warn('Cannot send message, not connected or message is empty.');
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  max-width: 600px;
  margin: auto;
  text-align: center;
}
.controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}
input {
  padding: 0.8rem;
  font-size: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
}
button {
  padding: 0.8rem;
  font-size: 1rem;
  border-radius: 0.5rem;
  border: none;
  background-color: #42b983;
  color: white;
  cursor: pointer;
}
button:hover {
  background-color: #36a374;
}
.error {
  color: #e74c3c;
}
</style>
