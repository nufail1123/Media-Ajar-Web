<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import confetti from 'canvas-confetti'
import { useGameStore } from '../../stores/gameStore'
import { Trophy, Star, RotateCcw, ArrowRight, Menu, Sparkles, Clock, Flame } from 'lucide-vue-next'

const store = useGameStore()
const starsRevealed = ref(0)

const isNewHighScore = computed(() => {
  const currentBest = store.highScores[store.activeStageId] || 0
  return store.score >= currentBest && store.score > 0
})

onMounted(() => {
  // Efek semburan konfeti selebrasi
  try {
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.55 },
      colors: ['#F59E0B', '#10B981', '#38BDF8', '#EC4899', '#A855F7'],
    })

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      })
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      })
    }, 250)
  } catch (e) {
    console.warn('Confetti error:', e)
  }

  // Animasi bintang muncul satu per satu
  const targetStars = store.earnedStars
  for (let i = 1; i <= targetStars; i++) {
    setTimeout(() => {
      starsRevealed.value = i
    }, i * 350)
  }
})
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div class="bg-white border-4 border-amber-300 rounded-3xl max-w-md w-full p-5 sm:p-7 text-center shadow-2xl animate-pop text-slate-800 relative overflow-hidden">
        <!-- Piala & Badge Stage Clear -->
        <div class="inline-flex p-3 sm:p-4 bg-amber-100 border-2 border-amber-300 rounded-3xl mb-3 shadow-inner">
          <Trophy class="w-10 h-10 sm:w-12 sm:h-12 text-amber-500 animate-bounce" />
        </div>

        <h2 class="text-2xl sm:text-3xl font-black font-fredoka text-amber-950">
          STAGE SELESAI!
        </h2>
        <p class="text-xs sm:text-sm text-slate-600 font-semibold mb-4">
          Hebat! Kamu berhasil menaklukkan tantangan <span class="text-amber-600 font-black">{{ store.activeStageInfo.title }}</span>!
        </p>

        <!-- Rating Bintang (Animasi 1–3) -->
        <div class="flex items-center justify-center gap-3 py-3 mb-5 bg-amber-50 rounded-2xl border-2 border-amber-200">
          <div
            v-for="i in 3"
            :key="i"
            class="transition-all duration-300 transform"
            :class="[
              i <= starsRevealed
                ? 'scale-110 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]'
                : 'scale-90 text-slate-300'
            ]"
          >
            <Star class="w-10 h-10 sm:w-12 sm:h-12 fill-current" />
          </div>
        </div>

        <!-- Rekap Skor & Statistik -->
        <div class="bg-slate-50 rounded-2xl p-4 border-2 border-slate-200 mb-6 space-y-2 text-xs sm:text-sm">
          <div class="flex justify-between items-center text-slate-700">
            <span class="flex items-center gap-1.5 font-bold">
              <Sparkles class="w-4 h-4 text-amber-500" />
              Skor Akhir
            </span>
            <span class="font-black font-fredoka text-amber-600 text-xl">
              {{ store.score }}
            </span>
          </div>

          <div class="flex justify-between items-center text-slate-600">
            <span class="flex items-center gap-1.5 font-semibold">
              <Clock class="w-4 h-4 text-emerald-600" />
              Bonus Sisa Waktu
            </span>
            <span class="font-bold text-emerald-600">
              +{{ store.timeBonus }}
            </span>
          </div>

          <div class="flex justify-between items-center text-slate-600">
            <span class="flex items-center gap-1.5 font-semibold">
              <Flame class="w-4 h-4 text-rose-500" />
              Combo Beruntun Terbaik
            </span>
            <span class="font-bold text-rose-600">
              {{ store.maxStreak }}x Streak
            </span>
          </div>

          <div v-if="isNewHighScore" class="mt-2 pt-2 border-t border-slate-200 text-center">
            <span class="inline-flex items-center gap-1 bg-amber-200 text-amber-900 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              🏆 Rekor Baru Tercipta!
            </span>
          </div>
        </div>

        <!-- Tombol Aksi Chunky 3D -->
        <div class="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
          <button
            type="button"
            @click="store.goToMenu()"
            class="flex-1 min-h-[46px] py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 border-b-4 border-slate-300 active:border-b-0 active:translate-y-1 text-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow touch-manipulation"
          >
            <Menu class="w-4 h-4" />
            <span>Menu</span>
          </button>

          <button
            type="button"
            @click="store.retryCurrentStage()"
            class="flex-1 min-h-[46px] py-2.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 border-b-4 border-amber-700 active:border-b-0 active:translate-y-1 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow touch-manipulation font-fredoka"
          >
            <RotateCcw class="w-4 h-4" />
            <span>Main Lagi</span>
          </button>

          <button
            type="button"
            @click="store.nextStage()"
            class="flex-1 min-h-[46px] py-2.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-md touch-manipulation font-fredoka"
          >
            <span>Lanjut</span>
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
