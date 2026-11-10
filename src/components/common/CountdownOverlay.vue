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
  <Teleport to="body">
    <div class="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-4">
      <div class="text-center animate-pop">
        <div class="inline-flex items-center gap-2 bg-amber-400 text-amber-950 px-4 py-1.5 rounded-full text-xs sm:text-sm uppercase font-black font-fredoka tracking-widest shadow-md mb-3">
          ⭐ Bersiaplah! ⭐
        </div>
        <div class="text-7xl sm:text-9xl font-black font-fredoka text-amber-300 text-arcade-shadow text-arcade-stroke animate-bounce select-none">
          {{ label }}
        </div>
        <div class="text-sm sm:text-base font-bold text-amber-100 mt-4 bg-slate-900/60 px-4 py-1 rounded-full border border-amber-400/40">
          Konsentrasi dan raih bintang sempurna!
        </div>
      </div>
    </div>
  </Teleport>
</template>
