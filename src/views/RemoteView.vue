<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useMainStore } from '@/stores/main'
import { useOverlayStore } from '@/stores/overlay'
import { storeToRefs } from 'pinia'
import { throttle } from 'lodash'
import OverlayEditor from '@/components/OverlayEditor.vue'

const route = useRoute()
const mainStore = useMainStore()
const overlayStore = useOverlayStore()

const { isConnected, room, roomId } = storeToRefs(mainStore)
const { overlays } = storeToRefs(overlayStore)

const error = ref(null)
const newOverlayName = ref('')
const activeTab = ref('general')
const selectedOverlayId = ref(null)

const hasOverlay = computed(() => {
  if (!room.value) return false
  return room.value.users.some(u => !u.isRemote)
})

const selectedOverlay = computed(() => {
  if (!selectedOverlayId.value) return null
  return overlays.value.find(o => o.id === selectedOverlayId.value)
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

const deleteOverlay = (id) => {
  if (selectedOverlayId.value === id) {
    selectedOverlayId.value = null
  }
  overlayStore.removeOverlay(id)
}

const selectOverlay = (id) => {
  selectedOverlayId.value = id
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

      <div class="tabs tabs-boxed">
        <a class="tab" :class="{ 'tab-active': activeTab === 'general' }" @click="activeTab = 'general'">General</a>
        <a class="tab" :class="{ 'tab-active': activeTab === 'editor' }" @click="activeTab = 'editor'">Editor</a>
      </div>

      <div v-show="activeTab === 'general'">
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
        </div>
      </div>

      <div v-show="activeTab === 'editor'" class="space-y-4">
        <h2 class="text-xl font-bold">Overlay Editor</h2>
        <div class="flex gap-4">
          <div class="w-1/4">
            <ul class="menu bg-base-200 rounded-box">
              <li v-for="overlay in overlays" :key="overlay.id">
                <a @click="selectOverlay(overlay.id)" :class="{ 'active': selectedOverlayId === overlay.id }">
                  {{ overlay.name }}
                </a>
              </li>
            </ul>
          </div>
          <div class="w-3/4">
            <div v-if="selectedOverlay">
              <OverlayEditor :overlay="selectedOverlay" />
            </div>
            <div v-else class="text-center p-8">
              <p>Select an overlay to edit.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
