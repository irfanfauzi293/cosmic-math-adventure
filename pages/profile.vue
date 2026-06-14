<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()
const { profile, missions } = useMissionProgress()

const isLoggingOut = ref(false)

const completedMissionsCount = computed(() => {
  return missions.value?.filter((m: any) => m.is_completed).length || 0
})

const rankName = computed(() => {
  const count = completedMissionsCount.value
  if (count >= 4) return 'Kapten Galaksi'
  if (count >= 2) return 'Pilot Bintang'
  if (count >= 1) return 'Kadet Angkasa'
  return 'Penjelajah Baru'
})

const handleLogout = async () => {
  isLoggingOut.value = true
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    // Redirect to login or home
    router.push('/')
  } catch (error: any) {
    console.error('Logout error:', error)
    alert('Gagal logout: ' + error.message)
  } finally {
    isLoggingOut.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col relative pb-24 overflow-x-hidden">
    <TwinklingStars />

    <AppHeader title="Profil Kapten" :showBack="false" />

    <main class="flex-1 w-full max-w-md mx-auto p-6 flex flex-col items-center gap-6 z-10">
      
      <!-- Profile Card -->
      <GlassCard class="w-full flex flex-col items-center p-8 gap-4">
        <!-- Avatar -->
        <div class="w-24 h-24 bg-surface-container-high rounded-full border-4 border-primary flex items-center justify-center overflow-hidden">
          <img v-if="profile?.avatar_url" :src="profile.avatar_url" alt="Avatar" class="w-full h-full object-cover">
          <span v-else class="material-symbols-outlined text-6xl text-primary">face</span>
        </div>

        <!-- Info -->
        <div class="text-center">
          <h2 class="text-2xl font-bold text-white mb-1">{{ profile?.display_name || 'Kapten' }}</h2>
          <p class="text-on-surface-variant text-sm">@{{ profile?.username || 'username' }}</p>
        </div>

        <!-- Stats -->
        <div class="flex gap-4 w-full mt-4">
          <div class="flex-1 bg-surface-container/50 rounded-xl p-4 flex flex-col items-center border border-outline-variant">
            <span class="material-symbols-outlined text-tertiary text-3xl mb-1" style="font-variation-settings: 'FILL' 1">task_alt</span>
            <span class="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider text-center">Misi Selesai</span>
            <span class="text-xl font-bold text-white mt-1">{{ completedMissionsCount }} / 4</span>
          </div>
          <div class="flex-1 bg-surface-container/50 rounded-xl p-4 flex flex-col items-center border border-outline-variant">
            <span class="material-symbols-outlined text-secondary text-3xl mb-1" style="font-variation-settings: 'FILL' 1">rocket_launch</span>
            <span class="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider text-center">Pangkat</span>
            <span class="text-lg font-bold text-white mt-1 text-center leading-tight">{{ rankName }}</span>
          </div>
        </div>
      </GlassCard>

      <!-- Logout Button -->
      <button 
        @click="handleLogout"
        :disabled="isLoggingOut"
        class="w-full mt-4 bg-error-container hover:bg-error border-2 border-error text-white font-bold py-4 rounded-full transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <span class="material-symbols-outlined">logout</span>
        {{ isLoggingOut ? 'KELUAR...' : 'KELUAR DARI PESAWAT' }}
      </button>

    </main>

    <BottomNav />
  </div>
</template>
