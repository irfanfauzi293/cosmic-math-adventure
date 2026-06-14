<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const supabase = useSupabaseClient()
const router = useRouter()

const username = ref('')
const displayName = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

const handleRegister = async () => {
  if (!username.value || !displayName.value || !password.value) {
    errorMsg.value = 'Semua data harus diisi Kapten!'
    return
  }

  if (password.value.length < 6) {
    errorMsg.value = 'Sandi rahasia minimal 6 karakter!'
    return
  }

  loading.value = true
  errorMsg.value = ''
  
  // Format username to dummy email
  const email = `${username.value.trim().toLowerCase()}@cosmomath.com`

  const { error } = await supabase.auth.signUp({
    email,
    password: password.value,
    options: {
      data: {
        username: username.value.trim().toLowerCase(),
        display_name: displayName.value.trim()
      }
    }
  })

  if (error) {
    if (error.message.includes('already registered')) {
      errorMsg.value = 'Nama Kapten sudah dipakai, cari nama lain ya!'
    } else {
      errorMsg.value = error.message
    }
    loading.value = false
  } else {
    // If successful, our database trigger handles profile creation
    // Supabase auto-logs in the user. Redirect to journey!
    router.push('/journey')
  }
}

const handleGuestLogin = async () => {
  loading.value = true
  errorMsg.value = ''
  
  const randomId = Math.floor(Math.random() * 1000000)
  const guestUsername = `tamu_${randomId}`
  const email = `${guestUsername}@cosmomath.com`
  const guestPassword = `tamu_pass_${randomId}`

  const { error } = await supabase.auth.signUp({
    email,
    password: guestPassword,
    options: {
      data: {
        username: guestUsername,
        display_name: `Tamu ${randomId.toString().substring(0, 3)}`
      }
    }
  })

  if (error) {
    errorMsg.value = 'Gagal masuk sebagai tamu. Coba lagi.'
    loading.value = false
  } else {
    router.push('/journey')
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 relative z-0">
    <TwinklingStars />
    
    <div class="absolute top-6 flex flex-col items-center">
      <span class="material-symbols-outlined text-[60px] text-tertiary glow-yellow animate-float">stars</span>
    </div>

    <GlassCard class="w-full max-w-md mt-16 z-10 flex flex-col items-center">
      <h1 class="text-headline-md font-bold text-white mb-2 text-center drop-shadow-md">Daftar Kapten Baru</h1>
      <p class="text-on-surface-variant mb-6 text-center">Siapkan dirimu untuk menjelajah angkasa!</p>

      <form @submit.prevent="handleRegister" class="w-full flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label class="text-white font-bold ml-2">Nama Panggilan Kapten</label>
          <input 
            v-model="displayName" 
            type="text" 
            placeholder="Contoh: Budi"
            class="w-full bg-surface-container-high border-2 border-outline rounded-xl px-4 py-3 text-white placeholder:text-outline-variant focus:outline-none focus:border-tertiary focus:ring-4 focus:ring-tertiary/20 transition-all"
          >
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-white font-bold ml-2">Username Login</label>
          <input 
            v-model="username" 
            type="text" 
            placeholder="Unik, tidak boleh spasi (cth: kaptenbudi)"
            class="w-full bg-surface-container-high border-2 border-outline rounded-xl px-4 py-3 text-white placeholder:text-outline-variant focus:outline-none focus:border-tertiary focus:ring-4 focus:ring-tertiary/20 transition-all"
          >
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-white font-bold ml-2">Sandi Rahasia</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="Minimal 6 huruf/angka"
            class="w-full bg-surface-container-high border-2 border-outline rounded-xl px-4 py-3 text-white placeholder:text-outline-variant focus:outline-none focus:border-tertiary focus:ring-4 focus:ring-tertiary/20 transition-all"
          >
        </div>

        <div v-if="errorMsg" class="bg-error-container text-error px-4 py-2 rounded-xl text-center font-bold text-sm mt-2">
          {{ errorMsg }}
        </div>

        <AnswerBubble 
          type="submit" 
          variant="tertiary" 
          label="DAFTAR SEKARANG" 
          class="w-full py-4 text-xl mt-4"
          :disabled="loading"
        >
          <span v-if="loading" class="material-symbols-outlined animate-spin">sync</span>
          <span v-else>DAFTAR SEKARANG</span>
        </AnswerBubble>

        <div class="relative flex items-center py-2 mt-2">
          <div class="flex-grow border-t border-outline-variant"></div>
          <span class="flex-shrink-0 mx-4 text-on-surface-variant text-sm font-bold">ATAU</span>
          <div class="flex-grow border-t border-outline-variant"></div>
        </div>

        <AnswerBubble 
          type="button" 
          variant="secondary" 
          label="MAIN SEBAGAI TAMU" 
          class="w-full py-4 text-xl"
          :disabled="loading"
          @click.prevent="handleGuestLogin"
        >
          <span v-if="loading" class="material-symbols-outlined animate-spin">sync</span>
          <span v-else>MAIN SEBAGAI TAMU</span>
        </AnswerBubble>
      </form>

      <div class="mt-6 text-center text-on-surface-variant">
        Sudah punya identitas? 
        <NuxtLink to="/login" class="text-tertiary font-bold hover:underline">Masuk di sini</NuxtLink>
      </div>
    </GlassCard>
  </div>
</template>
