<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary', // 'primary', 'secondary', 'tertiary'
  },
  label: {
    type: [String, Number],
    required: false
  },
  icon: {
    type: String,
    required: false
  },
  size: {
    type: String,
    default: 'md' // 'sm', 'md', 'lg'
  },
  shake: {
    type: Boolean,
    default: false
  }
})

const variantClass = computed(() => {
  if (props.variant === 'secondary') return 'btn-secondary'
  if (props.variant === 'tertiary') return 'btn-tertiary'
  return 'btn-primary'
})

const sizeClass = computed(() => {
  if (props.size === 'sm') return 'w-16 h-16 text-2xl'
  if (props.size === 'lg') return 'w-32 h-32 md:w-48 md:h-48 text-[64px]'
  return 'w-24 h-24 text-4xl' // md
})
</script>

<template>
  <button
    class="rounded-full flex items-center justify-center font-bold outline-none focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
    :class="[variantClass, sizeClass, { 'animate-[bounce_0.2s_ease-in-out_2]': shake }]"
    v-bind="$attrs"
  >
    <slot>
      <span v-if="icon" class="material-symbols-outlined text-[inherit]" :class="{'text-[0.8em]': true}">{{ icon }}</span>
      <span v-else>{{ label }}</span>
    </slot>
  </button>
</template>

<style scoped>
/* 
  Custom shake animation definition inside tailwind isn't strict enough for a fast buzz shake.
  Adding a quick shake keyframe for error states.
*/
@keyframes bounce {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
}
</style>
