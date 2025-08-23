<template>
  <div
    class="visual-overlay"
    :style="style"
    @mousedown="onMouseDown"
  >
    <div class="resizable-handle" @mousedown.stop="onResizeMouseDown"></div>
    <slot></slot>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

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

const onResizeMouseDown = (event) => {
  const startX = event.clientX;
  const startY = event.clientY;
  const startWidth = props.overlay.container[0];
  const startHeight = props.overlay.container[1];

  const onMouseMove = (moveEvent) => {
    const newWidth = startWidth + moveEvent.clientX - startX;
    const newHeight = startHeight + moveEvent.clientY - startY;
    emit('update:overlay', { ...props.overlay, container: [newWidth, newHeight] });
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
  border: 1px dashed #ccc;
}

.resizable-handle {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  background-color: #333;
  cursor: se-resize;
}
</style>
