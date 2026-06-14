<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const username = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')
const shake = ref(false)

const handleLogin = async () => {
  if (!username.value || !password.value) {
    showError('Username dan password harus diisi!')
    return
  }

  loading.value = true
  errorMsg.value = ''
  
  // Format username to dummy email
  const email = `${username.value.trim().toLowerCase()}@cosmomath.com`

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: password.value,
  })

  if (error) {
    showError('Username atau password salah!')
    loading.value = false
  } else {
    // Redirect to journey
    router.push('/journey')
  }
}

const showError = (msg: string) => {
  errorMsg.value = msg
  shake.value = true
  setTimeout(() => { shake.value = false }, 500)
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
    showError('Gagal masuk sebagai tamu. Coba lagi.')
    loading.value = false
  } else {
    router.push('/journey')
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 relative z-0">
    <TwinklingStars />
    
    <div class="absolute top-10 flex flex-col items-center animate-bounce">
      <span class="material-symbols-outlined text-[80px] text-primary glow-cyan">rocket_launch</span>
    </div>

    <GlassCard class="w-full max-w-md mt-16 z-10 flex flex-col items-center">
      <h1 class="text-headline-md font-bold text-white mb-2 text-center drop-shadow-md">Masuk ke Pesawat!</h1>
      <p class="text-on-surface-variant mb-8 text-center">Masukkan sandi rahasia Kapten.</p>

      <form @submit.prevent="handleLogin" class="w-full flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label class="text-white font-bold ml-2">Nama Kapten (Username)</label>
          <input 
            v-model="username" 
            type="text" 
            placeholder="Contoh: kaptenbudi"
            class="w-full bg-surface-container-high border-2 border-outline rounded-xl px-4 py-3 text-white placeholder:text-outline-variant focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all"
          >
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-white font-bold ml-2">Sandi Rahasia</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="********"
            class="w-full bg-surface-container-high border-2 border-outline rounded-xl px-4 py-3 text-white placeholder:text-outline-variant focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all"
          >
        </div>

        <div v-if="errorMsg" class="bg-error-container text-error px-4 py-2 rounded-xl text-center font-bold text-sm mt-2">
          {{ errorMsg }}
        </div>

        <AnswerBubble 
          type="submit" 
          variant="primary" 
          label="MULAI MISI" 
          class="w-full py-4 text-xl mt-4"
          :shake="shake"
          :disabled="loading"
        >
          <span v-if="loading" class="material-symbols-outlined animate-spin">sync</span>
          <span v-else>MULAI MISI</span>
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
        Belum punya akses? 
        <NuxtLink to="/register" class="text-primary font-bold hover:underline">Daftar Kapten Baru</NuxtLink>
      </div>
    </GlassCard>
  </div>
</template>
