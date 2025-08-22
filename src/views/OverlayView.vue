<template>
  <div>
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
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMainStore } from '@/stores/main'
import { storeToRefs } from 'pinia'
import OverlayObject from '@/components/OverlayObject.vue'

const route = useRoute()
const mainStore = useMainStore()

const { message } = storeToRefs(mainStore)
const activeOverlay = ref(null)

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
  }
})
</script>
