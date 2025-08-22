<template>
  <div>
    <OverlayObject v-for="overlay in overlayStore.overlays" :key="overlay.id" :overlay="overlay" />
  </div>
</template>

<script setup>
import { useOverlayStore } from '@/stores/overlay';
import OverlayObject from '@/components/OverlayObject.vue';

const overlayStore = useOverlayStore();
</script>
