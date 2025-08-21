<template>
  <nav>
    <router-link to="/">Overlay</router-link>
    <router-link to="/remote">Remote</router-link>
  </nav>
</template>

<script setup>
</script>

<style scoped>
nav {
  background-color: #333;
  padding: 1rem;
  display: flex;
  gap: 1rem;
}

nav a {
  color: white;
  text-decoration: none;
}

nav a:hover {
  text-decoration: underline;
}
</style>
