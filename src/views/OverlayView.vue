<template>
  <div>
    {{ store.room }}
    <div v-if="store.room?.users.length <= 1">
      <div v-if="store.roomId" class="qr-container">
        <qrcode-vue :value="remoteUrl" :size="qrSize" level="H" type="image/webp" />
        <a :href="remoteUrl">Link</a>
      </div>
    </div>

    <OverlayObject v-if="activeOverlay" :overlay="activeOverlay" />
    <div v-else class="flex items-center justify-center h-screen">
      <div class="text-center">
        <div class="text-2xl">En attente d'un overlay...</div>
        <div class="text-sm">Room ID: {{ mainStore.roomId }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useMainStore } from '@/stores/main'
// import { useOverlayStore } from '@/stores/overlay'
import { storeToRefs } from 'pinia'
import OverlayObject from '@/components/OverlayObject.vue'

// const overlayStore = useOverlayStore();

import QrcodeVue from 'vue-qrcode';

const store = useMainStore();
const qrSize = ref(Math.min(window.innerWidth, window.innerHeight) * 10.9);


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
    const id = route.query.roomId
  if (id) {
    mainStore.roomId = id
    mainStore.connect(id, false) // isRemote = false
  }
});
const route = useRoute()
const mainStore = useMainStore()

const { message } = storeToRefs(mainStore)
const activeOverlay = ref(null)

watch(message, (newMessage) => {
  if (newMessage && newMessage.type === 'overlay') {
    activeOverlay.value = newMessage.content
  }
}, { deep: true })

</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: #ffffff;
  /* Default background */
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
