<script setup>
import { ref, watch, computed } from 'vue'
import { useOverlayStore } from '@/stores/overlay'

const props = defineProps({
  overlay: {
    type: Object,
    required: true
  }
})

const overlayStore = useOverlayStore()

const editableOverlay = ref(JSON.parse(JSON.stringify(props.overlay)))

const updateOverlay = () => {
  overlayStore.updateOverlay(editableOverlay.value.id, editableOverlay.value)
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

watch(() => props.overlay, (newOverlay) => {
  editableOverlay.value = JSON.parse(JSON.stringify(newOverlay))
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
          <label class="label">Props (JSON)</label>
          <textarea v-model="editableOverlay.props" @input="updateOverlay" class="textarea textarea-bordered w-full" rows="3" data-testid="props-input"></textarea>
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
