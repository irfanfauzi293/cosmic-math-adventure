<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'primary' // 'primary', 'secondary', 'tertiary', 'purple'
  },
  unlocked: {
    type: Boolean,
    default: false
  },
  score: {
    type: Number,
    default: 0
  }
})

const colorClasses = computed(() => {
  if (!props.unlocked) return 'bg-surface-container border-outline text-outline-variant grayscale'
  
  const map: Record<string, string> = {
    primary: 'bg-primary-container border-primary text-primary glow-cyan',
    secondary: 'bg-secondary-container border-secondary text-secondary glow-green',
    tertiary: 'bg-tertiary-container border-tertiary text-tertiary glow-yellow',
    purple: 'bg-[#4a148c] border-[#e040fb] text-[#e040fb] drop-shadow-[0_0_15px_rgba(224,64,251,0.4)]'
  }
  return map[props.color] || map.primary
})

const iconMap = ['looks_one', 'looks_two', 'looks_3', 'looks_4']
const iconName = computed(() => iconMap[props.id - 1] || 'public')
</script>

<template>
  <button 
    class="relative rounded-full w-24 h-24 md:w-32 md:h-32 flex flex-col items-center justify-center border-4 transition-all duration-300"
    :class="[
      colorClasses,
      unlocked ? 'hover:scale-110 active:scale-95 cursor-pointer' : 'cursor-not-allowed opacity-60'
    ]"
    :disabled="!unlocked"
  >
    <span class="material-symbols-outlined text-4xl md:text-5xl" :style="{ fontVariationSettings: '\'FILL\' 1' }">
      {{ unlocked ? 'public' : 'lock' }}
    </span>
    
    <!-- Stars rating -->
    <div v-if="unlocked" class="absolute -bottom-4 flex gap-1 bg-surface rounded-full px-2 py-1 border-2 border-[inherit]">
      <span 
        v-for="n in 3" 
        :key="n"
        class="material-symbols-outlined text-[12px]"
        :class="n <= (score / 5 * 3) ? 'text-tertiary glow-yellow' : 'text-outline-variant'"
        style="font-variation-settings: 'FILL' 1"
      >
        star
      </span>
    </div>
  </button>
  <div class="mt-4 text-center">
    <h3 class="font-bold text-white text-lg md:text-xl drop-shadow-md">{{ name }}</h3>
    <p v-if="!unlocked" class="text-xs text-outline-variant uppercase tracking-widest mt-1">Terkunci</p>
  </div>
</template>
