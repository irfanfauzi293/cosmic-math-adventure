<script setup lang="ts">
import { navigateTo } from '#app'

// This will be caught by middleware if not authenticated, redirecting to /login
// If authenticated, it just redirects to journey
navigateTo('/journey')
</script>

<template>
  <div>Loading...</div>
</template>
