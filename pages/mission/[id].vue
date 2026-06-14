<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, onUnmounted } from 'vue'

const route = useRoute()
const router = useRouter()
const missionId = parseInt(route.params.id as string) || 1

const { profile } = useMissionProgress()
const { stopConfetti } = useConfetti()

const {
  currentQuestionIndex,
  totalQuestions,
  correctAnswers,
  question,
  options,
  isFinished,
  showSuccessOverlay,
  shakeButtonIndex,
  progressPercentage,
  checkAnswer
} = useGameEngine(missionId)

onUnmounted(() => {
  stopConfetti()
})

const titleMap = [
  '',
  'Koloni Berhitung',
  'Asteroid Penjumlahan',
  'Bintang Pengurangan',
  'Komet Perbandingan'
]
const missionTitle = computed(() => titleMap[missionId])

// Watch for finish to navigate to complete screen
watch(isFinished, (val) => {
  if (val) {
    router.push(`/mission/complete?id=${missionId}`)
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col relative overflow-hidden z-0">
    <TwinklingStars />
    <AppHeader 
      :title="missionTitle" 
      :show-back="true" 
      :progress="progressPercentage"
    />

    <main class="flex-1 w-full max-w-4xl mx-auto p-4 flex flex-col relative z-10">
      
      <!-- MISSION 1: COUNTING -->
      <template v-if="missionId === 1 && question">
        <GlassCard class="mb-8 text-center text-xl md:text-2xl font-bold text-white">
          Bantu Astronaut menghitung jumlah objek ini!
        </GlassCard>
        
        <div class="flex-1 flex items-center justify-center min-h-[200px]">
          <div class="flex flex-wrap justify-center gap-4 md:gap-8 max-w-2xl">
            <div 
              v-for="n in question.count" 
              :key="n"
              class="w-16 h-16 md:w-20 md:h-20 bg-primary/20 rounded-full border-2 border-primary flex items-center justify-center glow-cyan animate-float"
              :style="{ animationDelay: `${n * 0.1}s` }"
            >
              <span class="material-symbols-outlined text-4xl text-primary">emoji_nature</span>
            </div>
          </div>
        </div>

        <div class="flex justify-center gap-6 mt-8">
          <AnswerBubble
            v-for="(opt, idx) in options"
            :key="idx"
            :label="opt"
            size="lg"
            variant="primary"
            :shake="shakeButtonIndex === idx"
            @click="checkAnswer(opt, idx)"
          />
        </div>
      </template>

      <!-- MISSION 2: ADDITION -->
      <template v-if="missionId === 2 && question">
        <GlassCard class="mb-8 text-center text-xl md:text-2xl font-bold text-white">
          Gabungkan semua satelit! Berapa jumlahnya?
        </GlassCard>

        <div class="flex-1 flex items-center justify-center gap-2 md:gap-6 w-full">
          <!-- Left Group -->
          <GlassCard class="flex-1 min-h-[150px] flex flex-wrap justify-center items-center gap-2 p-4 border-primary">
            <span v-for="n in question.left" :key="`l-${n}`" class="material-symbols-outlined text-3xl md:text-5xl text-primary glow-cyan animate-bounce">satellite_alt</span>
          </GlassCard>
          
          <!-- Operator -->
          <div class="w-12 h-12 md:w-16 md:h-16 bg-secondary text-on-secondary rounded-full flex items-center justify-center flex-shrink-0 font-bold text-3xl glow-green shadow-lg z-10">
            +
          </div>
          
          <!-- Right Group -->
          <GlassCard class="flex-1 min-h-[150px] flex flex-wrap justify-center items-center gap-2 p-4 border-tertiary">
            <span v-for="n in question.right" :key="`r-${n}`" class="material-symbols-outlined text-3xl md:text-5xl text-tertiary glow-yellow animate-bounce" :style="{ animationDelay: '0.2s' }">satellite_alt</span>
          </GlassCard>
        </div>

        <div class="grid grid-cols-2 gap-4 mt-8 max-w-md mx-auto w-full">
          <AnswerBubble
            v-for="(opt, idx) in options"
            :key="idx"
            :label="opt"
            class="w-full h-24 md:h-32 text-4xl"
            variant="secondary"
            :shake="shakeButtonIndex === idx"
            @click="checkAnswer(opt, idx)"
          />
        </div>
      </template>

      <!-- MISSION 3: SUBTRACTION -->
      <template v-if="missionId === 3 && question">
        <div class="mb-4 flex items-center gap-4 bg-surface-container/80 p-4 rounded-2xl">
          <div class="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center shrink-0 glow-cyan">
            <span class="material-symbols-outlined text-4xl text-primary">face</span>
          </div>
          <div class="bg-white text-background px-4 py-3 rounded-2xl rounded-tl-none font-bold relative">
            Monster memakan {{ question.eaten }} kue. Sisa berapa kue Astronaut sekarang?
          </div>
        </div>

        <GlassCard class="flex-1 flex items-center justify-center min-h-[200px] border-tertiary">
          <div class="flex flex-wrap justify-center gap-4 max-w-2xl">
            <div 
              v-for="n in question.total" 
              :key="n"
              class="relative w-16 h-16 md:w-20 md:h-20"
            >
              <span 
                class="material-symbols-outlined text-[64px] md:text-[80px] absolute inset-0 text-tertiary drop-shadow-lg"
                :class="{ 'opacity-30 grayscale': n <= question.eaten }"
                style="font-variation-settings: 'FILL' 1"
              >
                cookie
              </span>
              <!-- X Mark for eaten -->
              <span v-if="n <= question.eaten" class="material-symbols-outlined absolute inset-0 text-error text-[64px] md:text-[80px] z-10">close</span>
            </div>
          </div>
        </GlassCard>

        <div class="flex justify-center gap-6 mt-8">
          <AnswerBubble
            v-for="(opt, idx) in options"
            :key="idx"
            :label="opt"
            size="lg"
            variant="tertiary"
            :shake="shakeButtonIndex === idx"
            @click="checkAnswer(opt, idx)"
          />
        </div>
      </template>

      <!-- MISSION 4: COMPARISON -->
      <template v-if="missionId === 4 && question">
        <GlassCard class="mb-8 text-center text-xl md:text-2xl font-bold text-white">
          Pilih area yang memiliki LEBIH BANYAK bintang!
        </GlassCard>

        <div class="flex-1 flex items-stretch justify-center gap-4 md:gap-8 w-full">
          <!-- Left Zone -->
          <div 
            class="flex-1 relative glass-panel border-4 border-primary hover:glow-cyan cursor-pointer transition-all active:scale-95 flex flex-col"
            @click="checkAnswer('Kiri', 0)"
            :class="{ 'animate-[bounce_0.2s_ease-in-out_2]': shakeButtonIndex === 0 }"
          >
            <div class="flex-1 p-4 flex flex-wrap content-start justify-center gap-2 overflow-hidden">
              <span v-for="n in question.left" :key="`l-${n}`" class="material-symbols-outlined text-3xl md:text-4xl text-tertiary animate-float" style="font-variation-settings: 'FILL' 1">star</span>
            </div>
            <div class="p-4 bg-primary text-on-primary text-center font-bold text-2xl uppercase tracking-widest rounded-b-[12px]">Kiri</div>
          </div>
          
          <!-- Right Zone -->
          <div 
            class="flex-1 relative glass-panel border-4 border-secondary hover:glow-green cursor-pointer transition-all active:scale-95 flex flex-col"
            @click="checkAnswer('Kanan', 1)"
            :class="{ 'animate-[bounce_0.2s_ease-in-out_2]': shakeButtonIndex === 1 }"
          >
            <div class="flex-1 p-4 flex flex-wrap content-start justify-center gap-2 overflow-hidden">
              <span v-for="n in question.right" :key="`r-${n}`" class="material-symbols-outlined text-3xl md:text-4xl text-tertiary animate-float" style="font-variation-settings: 'FILL' 1">star</span>
            </div>
            <div class="p-4 bg-secondary text-on-secondary text-center font-bold text-2xl uppercase tracking-widest rounded-b-[12px]">Kanan</div>
          </div>
        </div>
      </template>

    </main>

    <!-- Success Overlay -->
    <div 
      v-if="showSuccessOverlay"
      class="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center"
    >
      <span class="material-symbols-outlined text-[120px] text-tertiary glow-yellow animate-bounce" style="font-variation-settings: 'FILL' 1">stars</span>
      <h2 class="text-4xl font-bold text-white mt-4 drop-shadow-lg">Hebat!</h2>
      <p class="text-xl text-primary mt-2 font-bold">Jawabanmu Benar!</p>
    </div>

  </div>
</template>
