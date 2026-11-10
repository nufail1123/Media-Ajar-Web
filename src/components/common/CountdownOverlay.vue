<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../../stores/gameStore'

const store = useGameStore()

const label = computed(() => {
  if (store.countdownValue > 0) return store.countdownValue
  return 'MULAI!'
})
</script>

<template>
  <div class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-4">
    <div class="text-center animate-pop">
      <div class="text-xs uppercase font-extrabold tracking-widest text-amber-400 mb-2">
        Bersiaplah!
      </div>
      <div class="text-7xl sm:text-9xl font-black font-fredoka text-white text-arcade-shadow animate-bounce">
        {{ label }}
      </div>
      <div class="text-sm font-semibold text-slate-300 mt-4">
        Konsentrasi dan raih skor tertinggi!
      </div>
    </div>
  </div>
</template>
