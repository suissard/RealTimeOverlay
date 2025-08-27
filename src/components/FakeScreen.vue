<template>
  <div class="fake-screen" :class="$attrs.class">
    <VisualOverlay
      v-for="overlay in overlays"
      :key="overlay.id"
      :overlay="overlay"
      @update:overlay="onOverlayUpdate"
    >
      <OverlayObject :overlay="overlay" />
    </VisualOverlay>
  </div>
</template>

<script setup>
import VisualOverlay from './VisualOverlay.vue';
import OverlayObject from './OverlayObject.vue';

defineProps({
  overlays: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update:overlay']);

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
