<template>
  <div>
    <OverlayObject v-if="activeOverlay" :overlay="activeOverlay" />
    <div v-else class="flex items-center justify-center h-screen">
      <div v-if="mainStore.roomId" class="text-center">
        <h1 class="text-2xl font-bold mb-4">Overlay Ready</h1>
        <p class="mb-2">Scan this QR code with your remote device to connect.</p>
        <div class="flex justify-center p-4 bg-white rounded-lg">
          <QrcodeVue :value="remoteUrl" :size="200" />
        </div>
        <p class="mt-4">
          Or open this link on your remote device:
          <a :href="remoteUrl" target="_blank" class="link">{{ remoteUrl }}</a>
        </p>
        <div class="text-sm mt-4">Room ID: {{ mainStore.roomId }}</div>
      </div>
      <div v-else class="text-center">
        <div class="text-2xl">Generating session...</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMainStore } from '@/stores/main'
import { storeToRefs } from 'pinia'
import QrcodeVue from 'qrcode.vue'
import OverlayObject from '@/components/OverlayObject.vue'

const route = useRoute()
const router = useRouter()
const mainStore = useMainStore()

const { message, roomId } = storeToRefs(mainStore)
const activeOverlay = ref(null)

const remoteUrl = computed(() => {
  if (!roomId.value) return ''
  return `${window.location.origin}/remote?roomId=${roomId.value}`
})

watch(message, (newMessage) => {
  if (newMessage && newMessage.type === 'overlay') {
    activeOverlay.value = newMessage.content
  }
}, { deep: true })

onMounted(() => {
  const id = route.query.roomId
  if (id) {
    mainStore.roomId = id
    mainStore.connect(id, false) // isRemote = false
  } else {
    mainStore.generateRoomId()
    router.push({ query: { roomId: mainStore.roomId } })
  }
})
</script>
