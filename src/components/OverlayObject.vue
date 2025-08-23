<template>
  <div :style="style" v-html="overlay.html"></div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  overlay: {
    type: Object,
    required: true,
  },
});

const style = computed(() => ({
  position: 'absolute',
  left: `${props.overlay.positionX}px`,
  top: `${props.overlay.positionY}px`,
  width: `${props.overlay.container[0]}px`,
  height: `${props.overlay.container[1]}px`,
  ...props.overlay.props,
}));

let styleElement = null;

const updateStyle = () => {
  if (styleElement) {
    styleElement.innerHTML = props.overlay.css;
  } else if (props.overlay.css) {
    styleElement = document.createElement('style');
    styleElement.innerHTML = props.overlay.css;
    document.head.appendChild(styleElement);
  }
};

const runJs = () => {
  if (props.overlay.js) {
    try {
      const func = new Function(props.overlay.js);
      func();
    } catch (error) {
      console.error('Error executing overlay JS:', error);
    }
  }
};

watch(() => props.overlay.css, updateStyle);
watch(() => props.overlay.js, runJs);

onMounted(() => {
  updateStyle();
  runJs();
});

onUnmounted(() => {
  if (styleElement) {
    styleElement.remove();
  }
});
</script>
