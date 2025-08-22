<template>
  <div class="container">
    <h1>Overlay Editor</h1>

    <div class="editor-section">
      <h2>Create New Overlay</h2>
      <form @submit.prevent="createNewOverlay">
        <div class="form-group">
          <label for="newName">Name:</label>
          <input id="newName" v-model="newOverlay.name" type="text" required />
        </div>
        <button type="submit">Create Overlay</button>
      </form>
    </div>

    <div class="editor-section">
      <h2>Edit Overlays</h2>
      <div v-if="overlayStore.overlays.length === 0" class="no-overlays">
        No overlays to edit.
      </div>
      <div v-else>
        <div v-for="overlay in overlayStore.overlays" :key="overlay.id" class="overlay-editor">
          <h3>{{ overlay.name }} (ID: {{ overlay.id }})</h3>
          <form @submit.prevent="updateExistingOverlay(overlay.id)">
            <div class="form-grid">
              <div class="form-group">
                <label :for="'name-' + overlay.id">Name:</label>
                <input :id="'name-' + overlay.id" v-model="editableOverlays[overlay.id].name" type="text" />
              </div>
              <div class="form-group">
                <label :for="'positionX-' + overlay.id">Position X:</label>
                <input :id="'positionX-' + overlay.id" v-model.number="editableOverlays[overlay.id].positionX" type="number" />
              </div>
              <div class="form-group">
                <label :for="'positionY-' + overlay.id">Position Y:</label>
                <input :id="'positionY-' + overlay.id" v-model.number="editableOverlays[overlay.id].positionY" type="number" />
              </div>
              <div class="form-group">
                <label :for="'width-' + overlay.id">Width:</label>
                <input :id="'width-' + overlay.id" v-model.number="editableOverlays[overlay.id].container[0]" type="number" />
              </div>
              <div class="form-group">
                <label :for="'height-' + overlay.id">Height:</label>
                <input :id="'height-' + overlay.id" v-model.number="editableOverlays[overlay.id].container[1]" type="number" />
              </div>
            </div>
            <div class="form-group">
              <label :for="'html-' + overlay.id">HTML:</label>
              <textarea :id="'html-' + overlay.id" v-model="editableOverlays[overlay.id].html"></textarea>
            </div>
            <div class="form-group">
              <label :for="'css-' + overlay.id">CSS:</label>
              <textarea :id="'css-' + overlay.id" v-model="editableOverlays[overlay.id].css"></textarea>
            </div>
            <div class="form-group">
              <label :for="'js-' + overlay.id">JavaScript:</label>
              <textarea :id="'js-' + overlay.id" v-model="editableOverlays[overlay.id].js"></textarea>
            </div>
            <div class="button-group">
              <button type="button" @click="updateOverlayThrottled(overlay.id)">Save Changes</button>
              <button type="button" class="danger" @click="overlayStore.removeOverlay(overlay.id)">Delete Overlay</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, reactive } from 'vue';
import { useOverlayStore } from '@/stores/overlay';
import { throttle } from 'lodash';

const overlayStore = useOverlayStore();

const newOverlay = ref({
  name: '',
});

const editableOverlays = reactive({});

// Initialize editableOverlays with a deep copy of the store's overlays
watch(
  () => overlayStore.overlays,
  (newOverlays) => {
    newOverlays.forEach(overlay => {
      if (!editableOverlays[overlay.id]) {
        editableOverlays[overlay.id] = JSON.parse(JSON.stringify(overlay));
      }
    });
  },
  { immediate: true, deep: true }
);

const createNewOverlay = () => {
  overlayStore.addOverlay({
    name: newOverlay.value.name,
    html: '<div>New Overlay</div>',
    css: 'div { color: blue; }',
  });
  newOverlay.value.name = '';
};

const updateOverlayThrottled = throttle((overlayId) => {
  const updatedData = editableOverlays[overlayId];
  overlayStore.updateOverlay(overlayId, updatedData);
}, 500);

</script>

<style scoped>
.container {
  padding: 2rem;
  font-family: sans-serif;
}
.editor-section {
  margin-bottom: 2rem;
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 8px;
}
h1, h2 {
  text-align: center;
}
.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}
.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}
textarea {
  min-height: 100px;
  font-family: monospace;
}
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}
.overlay-editor {
  margin-top: 1.5rem;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
}
.button-group {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
}
button {
  padding: 0.8rem 1.2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #42b983;
  color: white;
}
button.danger {
  background-color: #e74c3c;
}
.no-overlays {
  text-align: center;
  color: #888;
  padding: 1rem;
}
</style>
