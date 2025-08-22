<template>
  <div>
     <div v-if="store.room?.users.length <= 1">
      <div v-if="store.roomId" class="qr-container">
        <qrcode-vue :value="remoteUrl" :size="qrSize" level="H" />
        <a :href="remoteUrl">Link</a>
      </div>
    </div>

    <OverlayObject v-for="overlay in overlayStore.overlays" :key="overlay.id" :overlay="overlay" />
  </div>
</template>

<script setup>
import { useOverlayStore } from '@/stores/overlay';
import OverlayObject from '@/components/OverlayObject.vue';

const overlayStore = useOverlayStore();

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
  store.connect(store.roomId, false);
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
  background-color: #ffffff; /* Default background */
  transition: background-color 0.5s ease;
}
.container.connected {
  background-color: transparent;
}
.qr-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.message-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.message {
  font-size: 10rem;
  font-weight: bold;
  color: #000000;
  text-align: center;
  padding: 2rem;
}
</style>
