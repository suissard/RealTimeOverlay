<script setup>
import { ref, watch, computed } from 'vue'
import { useOverlayStore } from '@/stores/overlay'
import { useMainStore } from '@/stores/main'

const props = defineProps({
  overlay: {
    type: Object,
    required: true
  }
})

const overlayStore = useOverlayStore()
const mainStore = useMainStore()

const editableOverlay = ref(JSON.parse(JSON.stringify(props.overlay)))

const updateOverlay = () => {
  overlayStore.updateOverlay(editableOverlay.value.id, editableOverlay.value)
}

const sendOverlay = () => {
  mainStore.sendOverlay(editableOverlay.value)
}

const previewContent = computed(() => {
  const { html, css, js } = editableOverlay.value
  return `
    <html>
      <head>
        <style>${css || ''}</style>
      </head>
      <body>
        ${html || ''}
        <script>${js || ''}<\/script>
      </body>
    </html>
  `
})

const handleJsonEdit = (key, value) => {
  try {
    editableOverlay.value.props[key] = JSON.parse(value)
    updateOverlay()
  } catch (e) {
    console.error("Invalid JSON format", e)
    // Optionally, provide user feedback here
  }
}

watch(() => props.overlay, (newOverlay) => {
  editableOverlay.value = JSON.parse(JSON.stringify(newOverlay))
  // Ensure props is an object
  if (typeof editableOverlay.value.props !== 'object' || editableOverlay.value.props === null) {
    try {
      // Attempt to parse it if it's a string
      editableOverlay.value.props = JSON.parse(editableOverlay.value.props)
    } catch (e) {
      // If parsing fails, initialize as an empty object
      editableOverlay.value.props = {}
    }
  }
}, { deep: true, immediate: true })

watch(editableOverlay, (newVal) => {
  updateOverlay()
}, { deep: true })
</script>

<template>
  <div class="overlay-editor-component p-4 bg-base-100 rounded-lg shadow-lg">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="editor-form space-y-4">
        <div>
          <label class="label">Name</label>
          <input type="text" v-model="editableOverlay.name" @input="updateOverlay" class="input input-bordered w-full" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="label">Position X</label>
            <input type="number" v-model="editableOverlay.positionX" @input="updateOverlay" class="input input-bordered w-full" />
          </div>
          <div>
            <label class="label">Position Y</label>
            <input type="number" v-model="editableOverlay.positionY" @input="updateOverlay" class="input input-bordered w-full" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="label">Container Width</label>
            <input type="number" v-model="editableOverlay.container[0]" @input="updateOverlay" class="input input-bordered w-full" />
          </div>
          <div>
            <label class="label">Container Height</label>
            <input type="number" v-model="editableOverlay.container[1]" @input="updateOverlay" class="input input-bordered w-full" />
          </div>
        </div>
        <div>
          <label class="label">Parent</label>
          <input type="text" v-model="editableOverlay.parent" @input="updateOverlay" class="input input-bordered w-full" />
        </div>
        <div>
          <label class="label">Props</label>
          <div v-if="editableOverlay.props" class="props-grid space-y-2 p-2 border border-base-300 rounded-box">
            <div v-for="(value, key) in editableOverlay.props" :key="key" class="form-control">
              <label class="label">
                <span class="label-text capitalize">{{ key.replace(/([A-Z])/g, ' $1') }}</span>
              </label>

              <!-- Input for numbers -->
              <input v-if="typeof value === 'number'" type="number" v-model.number="editableOverlay.props[key]" @input="updateOverlay" class="input input-sm input-bordered w-full" />

              <!-- Input for booleans -->
              <input v-else-if="typeof value === 'boolean'" type="checkbox" v-model="editableOverlay.props[key]" @change="updateOverlay" class="checkbox" />

              <!-- Textarea for arrays/objects -->
              <textarea v-else-if="typeof value === 'object' && value !== null" :value="JSON.stringify(value, null, 2)" @change="e => handleJsonEdit(key, e.target.value)" class="textarea textarea-sm textarea-bordered w-full" rows="3"></textarea>

              <!-- Input for strings -->
              <input v-else type="text" v-model="editableOverlay.props[key]" @input="updateOverlay" class="input input-sm input-bordered w-full" />

            </div>
          </div>
        </div>
        <div>
          <label class="label">HTML</label>
          <textarea v-model="editableOverlay.html" @input="updateOverlay" class="textarea textarea-bordered w-full" rows="5" data-testid="html-input"></textarea>
        </div>
        <div>
          <label class="label">CSS</label>
          <textarea v-model="editableOverlay.css" @input="updateOverlay" class="textarea textarea-bordered w-full" rows="5" data-testid="css-input"></textarea>
        </div>
        <div>
          <label class="label">JS</label>
          <textarea v-model="editableOverlay.js" @input="updateOverlay" class="textarea textarea-bordered w-full" rows="5" data-testid="js-input"></textarea>
        </div>
        <button @click="sendOverlay" class="btn btn-primary w-full">Send Overlay</button>
      </div>
      <div class="preview">
        <h3 class="text-lg font-bold mb-2">Preview</h3>
        <div class="preview-container bg-base-200 p-2 rounded">
          <iframe :srcdoc="previewContent" class="w-full h-96 border-none"></iframe>
        </div>
      </div>
    </div>
  </div>
</template>
