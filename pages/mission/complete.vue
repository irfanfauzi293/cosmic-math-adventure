<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const { fireConfetti, stopConfetti } = useConfetti()
const router = useRouter()
const route = useRoute()
let interval: any

onMounted(() => {
  // Fire confetti continuously for a bit
  interval = setInterval(fireConfetti, 1000)
  setTimeout(() => clearInterval(interval), 5000)
})

onUnmounted(() => {
  clearInterval(interval)
  stopConfetti()
})

const replayMission = () => {
  const missionId = route.query.id
  if (missionId) {
    router.push(`/mission/${missionId}`)
  } else {
    router.push('/journey')
  }
}

const goToMap = () => {
  router.push('/journey')
}
</script>

<template>
  <div class="min-h-screen flex flex-col relative overflow-hidden z-0 bg-background items-center justify-center p-6 text-center">
    <TwinklingStars />
    
    <!-- Background Glows -->
    <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-[rgba(0,242,255,0.2)] rounded-full blur-[80px]"></div>
    <div class="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[rgba(76,227,70,0.2)] rounded-full blur-[80px]"></div>

    <!-- Header -->
    <div class="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
      <h1 class="font-bold text-white tracking-widest text-lg">Misi Antariksa</h1>
      <button class="w-10 h-10 rounded-full border border-outline flex items-center justify-center text-on-surface hover:text-primary">
        <span class="material-symbols-outlined">help</span>
      </button>
    </div>

    <div class="z-10 flex flex-col items-center">
      <div class="flex items-end justify-center mb-8 h-48 animate-bounce">
        <!-- Trophy & Astronaut -->
        <span class="material-symbols-outlined text-[120px] text-tertiary glow-yellow" style="font-variation-settings: 'FILL' 1">emoji_events</span>
        <span class="material-symbols-outlined text-[80px] text-primary glow-cyan -ml-8 mb-4">rocket_launch</span>
      </div>

      <h1 class="text-4xl md:text-display-lg font-bold text-tertiary uppercase drop-shadow-[0_4px_0_rgba(150,150,0,0.5)] leading-tight mb-2">
        HORE! KAMU HEBAT,<br>KAPTEN!
      </h1>
      <p class="text-xl md:text-2xl text-primary font-bold mb-12">
        Semua misi luar angkasa telah selesai!
      </p>

      <div class="flex flex-col md:flex-row gap-4 w-full max-w-md">
        <AnswerBubble 
          variant="secondary" 
          label="Main Lagi" 
          icon="replay"
          class="flex-1 w-full text-xl py-4"
          @click="replayMission"
        >
          <div class="flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-2xl group-hover:-rotate-180 transition-all duration-500">replay</span>
            Main Lagi
          </div>
        </AnswerBubble>

        <AnswerBubble 
          variant="primary" 
          label="Kembali ke Peta" 
          class="flex-1 w-full text-xl py-4"
          @click="goToMap"
        >
          <div class="flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-2xl">map</span>
            Ke Peta
          </div>
        </AnswerBubble>
      </div>
    </div>
  </div>
</template>
