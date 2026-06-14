<script setup lang="ts">
defineProps({
  glow: {
    type: String,
    default: 'cyan', // 'cyan', 'green', 'yellow', 'none'
  },
  padding: {
    type: String,
    default: 'p-6'
  }
})
</script>

<template>
  <div 
    class="glass-panel"
    :class="[
      padding,
      glow === 'cyan' ? 'glow-cyan' : '',
      glow === 'green' ? 'glow-green' : '',
      glow === 'yellow' ? 'glow-yellow' : ''
    ]"
  >
    <slot />
  </div>
</template>
