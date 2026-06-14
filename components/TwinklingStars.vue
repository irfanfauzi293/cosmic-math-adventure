<script setup lang="ts">
import { ref, onMounted } from 'vue'

const stars = ref<Array<{ x: number; y: number; size: number; delay: number; duration: number }>>([])

onMounted(() => {
  // Generate 60 random stars
  const generatedStars = []
  for (let i = 0; i < 60; i++) {
    generatedStars.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1, // 1px to 4px
      delay: Math.random() * 2, // 0s to 2s delay
      duration: Math.random() * 2 + 1, // 1s to 3s duration
    })
  }
  stars.value = generatedStars
})
</script>

<template>
  <div class="fixed inset-0 pointer-events-none z-[-1] bg-background overflow-hidden">
    <!-- Radial Nebula Gradients -->
    <div class="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-[rgba(0,242,255,0.05)] blur-[100px]"></div>
    <div class="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[rgba(76,227,70,0.05)] blur-[100px]"></div>
    
    <!-- Stars -->
    <div
      v-for="(star, index) in stars"
      :key="index"
      class="absolute bg-white rounded-full animate-twinkle"
      :style="{
        left: `${star.x}%`,
        top: `${star.y}%`,
        width: `${star.size}px`,
        height: `${star.size}px`,
        animationDelay: `${star.delay}s`,
        animationDuration: `${star.duration}s`
      }"
    ></div>
  </div>
</template>
