<template>
  <div class="hero min-h-screen bg-base-200">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold">Real-time Overlay</h1>
        <p class="py-6">
          This application allows you to control an overlay in real-time using a remote control.
          The overlay page will display content that is pushed from the remote page via websockets.
        </p>
        <p>
          To get started, open the <router-link to="/remote" class="link">Remote</router-link> page to send commands, and the <router-link to="/overlay" class="link">Overlay</router-link> page to see the results.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
