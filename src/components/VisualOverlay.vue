<template>
  <div
    class="visual-overlay"
    :style="style"
    @mousedown="onMouseDown"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  overlay: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update:overlay']);

const style = computed(() => ({
  position: 'absolute',
  left: `${props.overlay.positionX}px`,
  top: `${props.overlay.positionY}px`,
  width: `${props.overlay.container[0]}px`,
  height: `${props.overlay.container[1]}px`,
  cursor: 'move',
}));

const onMouseDown = (event) => {
  const startX = event.clientX;
  const startY = event.clientY;
  const startLeft = props.overlay.positionX;
  const startTop = props.overlay.positionY;

  const onMouseMove = (moveEvent) => {
    const newLeft = startLeft + moveEvent.clientX - startX;
    const newTop = startTop + moveEvent.clientY - startY;
    emit('update:overlay', { ...props.overlay, positionX: newLeft, positionY: newTop });
  };

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};
</script>

<style scoped>
.visual-overlay {
  position: absolute;
  border: 2px solid red;
}
</style>
