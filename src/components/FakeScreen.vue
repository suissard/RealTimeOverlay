<template>
  <div class="fake-screen" ref="fakeScreenRef" :class="$attrs.class">
    <VisualOverlay
      v-if="overlay"
      :overlay="overlay"
      @update:overlay="onOverlayUpdate"
    >
      <OverlayObject :overlay="overlay" />
    </VisualOverlay>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import VisualOverlay from './VisualOverlay.vue';
import OverlayObject from './OverlayObject.vue';

const props = defineProps({
  overlay: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['update:overlay']);

const fakeScreenRef = ref(null);

const onOverlayUpdate = (updatedOverlay) => {
  emit('update:overlay', updatedOverlay);
};
</script>

<style scoped>
.fake-screen {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  overflow: hidden;
}
</style>
