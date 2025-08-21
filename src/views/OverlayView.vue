<template>
  <div class="container">
    <div v-if="store.roomId" class="qr-container">
      <qrcode-vue :value="remoteUrl" :size="qrSize" level="H" />
    </div>
    <div v-else>
      <p>Generating session...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import { useMainStore } from '../stores/main';
import QrcodeVue from 'vue-qrcode';

const store = useMainStore();
const qrSize = ref(Math.min(window.innerWidth, window.innerHeight) * 0.9);


const remoteUrl = computed(() => {
  if (!store.roomId) return '';
  // Construct the URL for the remote page
  return `${window.location.origin}/remote?roomId=${store.roomId}`;
});

onMounted(() => {
  // When the component is mounted, generate a new room ID and connect
  store.generateRoomId();
  store.connect(store.roomId);
  window.addEventListener('resize', () => {
    qrSize.value = Math.min(window.innerWidth, window.innerHeight) * 0.9;
  });
});
</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
}
.qr-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
</style>
