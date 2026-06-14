<script setup lang="ts">
const navItems = [
  { name: 'Journey', icon: 'map', path: '/journey' },
  { name: 'Profile', icon: 'person', path: '/profile' }
]
</script>

<template>
  <nav class="fixed bottom-0 left-0 w-full bg-[rgba(21,26,49,0.9)] backdrop-blur-md border-t-2 border-outline z-50 px-4 py-2">
    <div class="flex justify-evenly items-center max-w-md mx-auto">
      <NuxtLink 
        v-for="item in navItems" 
        :key="item.name"
        :to="item.path"
        class="flex flex-col items-center p-2 rounded-xl transition-all w-16"
        active-class="text-primary bg-primary/10 glow-cyan"
        :class="$route.path === item.path ? 'text-primary' : 'text-on-surface-variant'"
      >
        <span class="material-symbols-outlined text-3xl mb-1" :style="{ fontVariationSettings: $route.path === item.path ? '\'FILL\' 1' : '\'FILL\' 0' }">
          {{ item.icon }}
        </span>
        <span class="text-[10px] font-bold uppercase tracking-wider">{{ item.name }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>
