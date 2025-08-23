<template>
  <div>
    <!-- This will render the selected overlay -->
    <OverlayObject v-if="activeOverlay" :overlay="activeOverlay" />

    <!-- If no overlay is active, show the connection screen -->
    <div v-else class="flex items-center justify-center h-screen">
      <div v-if="roomId" class="text-center">
        <h1 class="text-2xl font-bold mb-4">Overlay Ready</h1>
        <p class="mb-2">Scan this QR code with your remote device to connect.</p>
        <div class="inline-block p-4 bg-white rounded-lg">
          <QrcodeVue :value="remoteUrl" :size="200" level="H" />
        </div>
        <p class="mt-4">
          Or open this link on your remote device:
          <a :href="remoteUrl" target="_blank" class="link">{{ remoteUrl }}</a>
        </p>
        <div class="text-sm mt-4 font-mono">Room ID: {{ roomId }}</div>
      </div>
      <div v-else class="text-center">
        <div class="text-2xl">Generating session...</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMainStore } from '@/stores/main';
import { storeToRefs } from 'pinia';
import QrcodeVue from 'qrcode.vue';
import OverlayObject from '@/components/OverlayObject.vue';

const route = useRoute();
const router = useRouter();
const mainStore = useMainStore();

// Reactive state from the store
const { message, roomId } = storeToRefs(mainStore);

// Local state
const activeOverlay = ref(null);

// Computed property for the remote control URL
const remoteUrl = computed(() => {
  if (!roomId.value) return '';
  return `${window.location.origin}/remote?roomId=${roomId.value}`;
});

// Watch for incoming messages to update the active overlay
watch(message, (newMessage) => {
  // Assuming the message for updating the overlay has a specific structure
  if (newMessage && newMessage.type === 'overlay') {
    activeOverlay.value = newMessage.content;
  }
}, { deep: true });

// Component lifecycle hook
onMounted(() => {
  const idFromQuery = route.query.roomId;
  if (idFromQuery) {
    // If a room ID is present in the URL, use it to connect
    mainStore.roomId = idFromQuery;
    mainStore.connect(idFromQuery, false); // isRemote = false
  } else {
    // If no room ID is in the URL, generate one, update the URL, and then connect
    mainStore.generateRoomId();
    // Use router.replace to avoid adding a new entry to the history
    router.replace({ query: { roomId: mainStore.roomId } }).then(() => {
      mainStore.connect(mainStore.roomId, false); // isRemote = false
    });
  }
});
</script>

<style scoped>
/* Scoped styles can remain as they are, they were not problematic */
.link {
  @apply text-blue-500 underline;
}
</style>
