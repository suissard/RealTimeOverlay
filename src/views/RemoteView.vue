<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useMainStore } from '@/stores/main'
import { useOverlayStore } from '@/stores/overlay'
import { storeToRefs } from 'pinia'
import { throttle, cloneDeep } from 'lodash'
import OverlayEditor from '@/components/OverlayEditor.vue'
import FakeScreen from '@/components/FakeScreen.vue'
import { presets } from '@/lib/presets'

const route = useRoute()
const mainStore = useMainStore()
const overlayStore = useOverlayStore()

const { isConnected, room, roomId } = storeToRefs(mainStore)
const { overlays } = storeToRefs(overlayStore)

const error = ref(null)
const newOverlayName = ref('')
const activeTab = ref('editor') // Default to editor tab
const selectedOverlayId = ref(null)
const selectedPresetType = ref(presets.length > 0 ? presets[0].type : null)

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
  const selectedPreset = presets.find(p => p.type === selectedPresetType.value)
  if (!selectedPreset) {
    console.error('No preset selected or found')
    return
  }

  // Use cloneDeep to avoid mutations affecting the preset template
  const newOverlayData = cloneDeep(selectedPreset.initialData)

  // Assign a custom name if provided, otherwise use the preset's default name
  if (newOverlayName.value.trim()) {
    newOverlayData.name = newOverlayName.value.trim()
  }

  overlayStore.addOverlay(newOverlayData)

  // Reset fields
  newOverlayName.value = ''
  if (presets.length > 0) {
    selectedPresetType.value = presets[0].type
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

const handleOverlayUpdate = (updatedOverlay) => {
  overlayStore.updateOverlay(updatedOverlay.id, updatedOverlay)
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
      </div>

      <div v-show="activeTab === 'editor'" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Left Column: Create and List -->
          <div class="md:col-span-1 space-y-4">
            <!-- Create New Overlay -->
            <div class="space-y-4 p-4 border border-base-300 rounded-box">
              <h2 class="text-xl font-bold">Create New</h2>
              <form @submit.prevent="createOverlay" class="space-y-2">
                <div class="form-control">
                  <label for="presetType" class="label"><span class="label-text">Preset</span></label>
                  <select id="presetType" v-model="selectedPresetType" class="select select-bordered w-full">
                    <option v-for="preset in presets" :key="preset.type" :value="preset.type">
                      {{ preset.name }}
                    </option>
                  </select>
                </div>
                <div class="form-control">
                  <label for="newName" class="label"><span class="label-text">Overlay Name</span></label>
                  <input
                    id="newName"
                    v-model="newOverlayName"
                    type="text"
                    class="input input-bordered w-full"
                    placeholder="e.g., 'Main Scoreboard'"
                  />
                </div>
                <button type="submit" class="btn btn-primary w-full">Create</button>
              </form>
            </div>

            <div class="divider"></div>

            <!-- List of Overlays -->
            <div class="space-y-2">
               <h2 class="text-xl font-bold">Overlays</h2>
              <ul class="menu bg-base-200 rounded-box">
                <li v-for="overlay in overlays" :key="overlay.id">
                  <a @click="selectOverlay(overlay.id)" :class="{ 'active': selectedOverlayId === overlay.id }" class="flex justify-between items-center">
                    <span>{{ overlay.name }}</span>
                    <button @click.stop="deleteOverlay(overlay.id)" class="btn btn-xs btn-error">X</button>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <!-- Right Column: Editor -->
          <div class="md:col-span-2 grid grid-rows-2 gap-4">
            <div class="bg-base-200 rounded-box p-4 flex justify-center items-center">
              <div class="aspect-video w-full max-w-full overflow-hidden">
                <div class="transform scale-25 -translate-x-[150%] -translate-y-[150%]">
                  <FakeScreen
                    v-if="selectedOverlay"
                    :overlay="selectedOverlay"
                    @update:overlay="handleOverlayUpdate"
                    class="w-[1920px] h-[1080px]"
                  />
                </div>
              </div>
            </div>
            <div v-if="selectedOverlay">
              <OverlayEditor :overlay="selectedOverlay" />
            </div>
            <div v-else class="text-center p-8 bg-base-200 rounded-box h-full flex items-center justify-center">
              <p>Select an overlay to edit, or create a new one.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
