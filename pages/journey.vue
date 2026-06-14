<script setup lang="ts">
import { watch } from 'vue'
import { useRouter } from 'vue-router'

const user = useSupabaseUser()
const { profile, missions, loading, fetchProfileAndProgress, errorMessage } = useMissionProgress()
const router = useRouter()

watch(user, (newUser) => {
  if (newUser) {
    fetchProfileAndProgress()
  }
}, { immediate: true })

const getMissionState = (id: number) => {
  const m = missions.value?.find((m: any) => m.mission_id === id)
  return {
    unlocked: m?.is_unlocked || false,
    score: m?.best_score || 0
  }
}

const planets = [
  { id: 1, name: 'Koloni Berhitung', color: 'secondary' },
  { id: 2, name: 'Asteroid Penjumlahan', color: 'purple' },
  { id: 3, name: 'Bintang Pengurangan', color: 'tertiary' },
  { id: 4, name: 'Komet Perbandingan', color: 'primary' }
]

const goToMission = (id: number) => {
  const state = getMissionState(id)
  if (state.unlocked) {
    router.push(`/mission/${id}`)
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col relative pb-24 overflow-x-hidden">
    <TwinklingStars />

    <!-- Header -->
    <header class="p-6 flex items-center justify-between z-10 sticky top-0 bg-background/80 backdrop-blur-md border-b border-outline/30">
      <div class="flex items-center gap-4">
        <div class="w-14 h-14 bg-surface-container-high rounded-full border-2 border-primary flex items-center justify-center overflow-hidden animate-bounce">
          <img v-if="profile?.avatar_url" :src="profile.avatar_url" alt="Avatar" class="w-full h-full object-cover">
          <span v-else class="material-symbols-outlined text-3xl text-primary">face</span>
        </div>
        <div class="bg-[rgba(21,26,49,0.8)] border border-primary/50 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl px-4 py-2 relative">
          <div class="absolute -left-2 top-0 w-4 h-4 bg-[rgba(21,26,49,0.8)] border-l border-t border-primary/50 rotate-[-45deg] origin-top-right"></div>
          <p class="text-white font-bold">Halo <span class="text-primary">{{ profile?.display_name || 'Kapten' }}</span>!</p>
          <p class="text-xs text-on-surface-variant">Pilih misimu hari ini.</p>
        </div>
      </div>
    </header>

    <!-- Map Area -->
    <main class="flex-1 relative w-full max-w-lg mx-auto py-12 px-8 flex flex-col items-center gap-16 z-10">
      
      <!-- Error Message Box -->
      <div v-if="errorMessage" class="bg-error-container text-error px-4 py-3 rounded-xl w-full text-center border-2 border-error">
        <p class="font-bold">Database Error:</p>
        <p class="text-sm mt-1">{{ errorMessage }}</p>
      </div>

      <div v-if="loading" class="text-white">Memuat Peta Galaksi...</div>
      
      <template v-else>
        <!-- Orbit Path Background -->
        <div class="absolute top-12 bottom-12 left-1/2 -translate-x-1/2 w-1 border-l-4 border-dashed border-outline-variant/30 z-0"></div>

        <div 
          v-for="(planet, index) in planets" 
          :key="planet.id"
          class="w-full flex flex-col relative z-10"
          :class="index % 2 === 0 ? 'items-start' : 'items-end'"
        >
          <div class="flex flex-col items-center" @click="goToMission(planet.id)">
            <PlanetCard 
              :id="planet.id"
              :name="planet.name"
              :color="planet.color"
              :unlocked="getMissionState(planet.id).unlocked"
              :score="getMissionState(planet.id).score"
            />
          </div>
        </div>
      </template>
    </main>

    <BottomNav />
  </div>
</template>
