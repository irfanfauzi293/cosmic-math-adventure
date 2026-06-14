<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  title: {
    type: String,
    required: false
  },
  showBack: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    required: false // 0 to 100
  },
  score: {
    type: Number,
    required: false
  }
})

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<template>
  <header class="w-full p-4 flex items-center justify-between z-10 relative">
    <!-- Left Section: Back Button -->
    <div class="flex-1 flex items-center">
      <button 
        v-if="showBack"
        @click="goBack"
        class="w-12 h-12 bg-[rgba(21,26,49,0.8)] border-2 border-outline hover:border-primary rounded-full flex items-center justify-center transition-all text-on-surface hover:text-primary active:scale-95"
      >
        <span class="material-symbols-outlined text-2xl">arrow_back</span>
      </button>
    </div>

    <!-- Center Section: Title or Progress -->
    <div class="flex-[2] flex flex-col items-center justify-center text-center">
      <h1 v-if="title" class="text-headline-md-mobile md:text-headline-md font-bold text-white drop-shadow-md">
        {{ title }}
      </h1>
      
      <div v-if="progress !== undefined" class="w-full max-w-md mt-2 flex items-center gap-3">
        <span class="material-symbols-outlined text-primary text-2xl">rocket_launch</span>
        <div class="h-4 bg-surface-container-high rounded-full w-full overflow-hidden border border-outline-variant relative">
          <div 
            class="h-full bg-primary rounded-full transition-all duration-500 relative"
            :style="{ width: `${progress}%` }"
          >
            <!-- Engine glow -->
            <div class="absolute right-0 top-0 bottom-0 w-8 bg-white/30 blur-[4px]"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Section: Score/Stars -->
    <div class="flex-1 flex justify-end">
      <div v-if="score !== undefined" class="bg-[rgba(21,26,49,0.8)] border-2 border-tertiary rounded-full px-4 py-1.5 flex items-center gap-2 glow-yellow">
        <span class="material-symbols-outlined text-tertiary text-xl" style="font-variation-settings: 'FILL' 1">star</span>
        <span class="font-bold text-white text-lg">{{ score }}</span>
      </div>
    </div>
  </header>
</template>
