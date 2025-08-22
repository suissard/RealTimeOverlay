<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useMainStore } from '@/stores/main'
import { useOverlayStore } from '@/stores/overlay'
import { storeToRefs } from 'pinia'
import { throttle } from 'lodash'

const route = useRoute()
const mainStore = useMainStore()
const overlayStore = useOverlayStore()

const { isConnected, room, roomId } = storeToRefs(mainStore)
const { overlays } = storeToRefs(overlayStore)

const error = ref(null)
const newOverlayName = ref('')

const hasOverlay = computed(() => {
  if (!room.value) return false
  return room.value.users.some(u => !u.isRemote)
})

onMounted(() => {
  const id = route.query.roomId
  if (id) {
    mainStore.connect(id, true) // isRemote = true
  } else {
    error.value = 'No Room ID was provided'
  }
})

const onInput = throttle((event) => {
  mainStore.sendMessage(event.target.value)
}, 300)

function manageSlots(action) {
  mainStore.manageSlots(action)
}
const createOverlay = () => {
  if (newOverlayName.value.trim()) {
    overlayStore.addOverlay({ name: newOverlayName.value.trim() })
    newOverlayName.value = ''
  }
}

const updateOverlay = (id, data) => {
  overlayStore.updateOverlay(id, data)
}

const deleteOverlay = (id) => {
  overlayStore.removeOverlay(id)
}
</script>

<template>
  <div class="remote-view p-4">
    <div v-if="error" class="alert alert-error">{{ error }}</div>

    <div v-if="!isConnected && !error" class="text-center">
      <p>Connecting to room...</p>
    </div>

    <div v-if="isConnected && !hasOverlay" class="text-center">
      <p>En attente de connexion à un overlay...</p>
    </div>

    <div v-if="isConnected" class="space-y-4">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">Remote</h1>
        <div class="flex items-center gap-2">
          <span class="font-mono bg-base-200 px-2 py-1 rounded">{{ roomId }}</span>
          <div class="w-4 h-4 rounded-full bg-success"></div>
        </div>
      </div>

      <div v-if="hasOverlay" class="controls space-y-2">
        <input
          type="text"
          class="input input-bordered w-full"
          placeholder="Message"
          @input="onInput"
        />
        <div class="flex gap-2">
          <button class="btn btn-primary" @click="manageSlots('add')">Add Slot</button>
          <button class="btn btn-secondary" @click="manageSlots('remove')">Remove Slot</button>
        </div>
      </div>
    </div>

    <div class="divider"></div>

    <div class="space-y-4">
      <h2 class="text-xl font-bold">Overlays</h2>
      <form @submit.prevent="createOverlay" class="flex gap-2">
        <input
          id="newName"
          v-model="newOverlayName"
          type="text"
          class="input input-bordered w-full"
          placeholder="New Overlay Name"
        />
        <button type="submit" class="btn btn-primary">Create</button>
      </form>

      <ul class="space-y-2">
        <li v-for="overlay in overlays" :key="overlay.id" :data-overlay-id="overlay.id" class="overlay-editor flex items-center gap-2 p-2 bg-base-200 rounded">
          <input
            :id="`name-${overlay.id}`"
            :value="overlay.name"
            type="text"
            class="input input-bordered w-full"
            @input="updateOverlay(overlay.id, { name: $event.target.value })"
          />
          <div class="button-group">
            <button class="btn btn-ghost" @click="deleteOverlay(overlay.id)">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
