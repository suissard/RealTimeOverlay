<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import MainLayout from './layouts/MainLayout.vue';
import BlankLayout from './layouts/BlankLayout.vue';

const route = useRoute();

const layouts = {
  MainLayout,
  BlankLayout
};

const layout = computed(() => {
  const layoutName = route.meta.layout || 'BlankLayout';
  return layouts[layoutName];
});
</script>
