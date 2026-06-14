import { ref } from 'vue'

// Global state so it persists across page navigations
const isPlaying = ref(false)
const isInitialized = ref(false)

// Web Audio API instances
let audioContext: AudioContext | null = null
let gainNode: GainNode | null = null
let audioBuffer: AudioBuffer | null = null
let sourceNode: AudioBufferSourceNode | null = null

export const useBgm = () => {
  const supabase = useSupabaseClient()

  const initBgm = async () => {
    if (isInitialized.value) return // already initialized

    // We assume the file is named 'Moonbeam_Bounce.mp3' in the 'bgm' bucket
    const { data } = supabase.storage.from('bgm').getPublicUrl('Moonbeam_Bounce.mp3')
    
    // Browsers require user interaction before playing audio
    const setupAudio = async () => {
      document.removeEventListener('click', setupAudio)
      document.removeEventListener('keydown', setupAudio)
      
      try {
        // Initialize Web Audio API for gapless playback
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
        audioContext = new AudioContextClass()
        
        gainNode = audioContext.createGain()
        gainNode.gain.value = 0.4 // Comfortable volume
        gainNode.connect(audioContext.destination)

        // Fetch and decode the MP3 file
        const response = await fetch(data.publicUrl)
        const arrayBuffer = await response.arrayBuffer()
        audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
        
        playSource()
        isPlaying.value = true
        isInitialized.value = true
      } catch (err) {
        console.error('Failed to initialize gapless audio:', err)
      }
    }
    
    document.addEventListener('click', setupAudio)
    document.addEventListener('keydown', setupAudio)
  }

  const playSource = () => {
    if (!audioContext || !audioBuffer || !gainNode) return
    
    sourceNode = audioContext.createBufferSource()
    sourceNode.buffer = audioBuffer
    sourceNode.loop = true // Web Audio API loops perfectly without gaps
    sourceNode.connect(gainNode)
    sourceNode.start()
  }

  const toggleBgm = () => {
    if (!audioContext) return
    
    if (isPlaying.value) {
      audioContext.suspend()
      isPlaying.value = false
    } else {
      audioContext.resume()
      isPlaying.value = true
    }
  }

  return { initBgm, toggleBgm, isPlaying }
}
