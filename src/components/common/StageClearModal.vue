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
      particleCount: 80,
      spread: 70,
      origin: { y: 0.55 },
      colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'],
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
  <div class="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
    <div class="bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-amber-400 rounded-3xl max-w-md w-full p-5 sm:p-7 text-center shadow-2xl animate-pop text-white relative overflow-hidden">
      <!-- Glow ambient background -->
      <div class="absolute -top-12 -left-12 w-40 h-40 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
      <div class="absolute -bottom-12 -right-12 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

      <!-- Piala & Badge Stage Clear -->
      <div class="inline-flex p-3 sm:p-4 bg-amber-400/20 border border-amber-400/40 rounded-3xl mb-3 shadow-inner">
        <Trophy class="w-10 h-10 sm:w-12 sm:h-12 text-amber-400 animate-bounce" />
      </div>

      <h2 class="text-2xl sm:text-3xl font-black font-fredoka text-amber-300 drop-shadow">
        STAGE SELESAI!
      </h2>
      <p class="text-xs sm:text-sm text-slate-300 font-semibold mb-4">
        Hebat! Kamu berhasil menaklukkan tantangan <span class="text-amber-400 font-bold">{{ store.activeStageInfo.title }}</span>!
      </p>

      <!-- Rating Bintang (Animasi 1–3) -->
      <div class="flex items-center justify-center gap-3 py-3 mb-5 bg-slate-950/40 rounded-2xl border border-slate-700/50">
        <div
          v-for="i in 3"
          :key="i"
          class="transition-all duration-300 transform"
          :class="[
            i <= starsRevealed
              ? 'scale-110 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]'
              : 'scale-90 text-slate-600 opacity-40'
          ]"
        >
          <Star class="w-9 h-9 sm:w-11 sm:h-11 fill-current" />
        </div>
      </div>

      <!-- Rekap Skor & Statistik -->
      <div class="bg-slate-800/80 rounded-2xl p-3.5 border border-slate-700/80 mb-6 space-y-2 text-xs sm:text-sm">
        <div class="flex justify-between items-center text-slate-300">
          <span class="flex items-center gap-1.5 font-bold">
            <Sparkles class="w-4 h-4 text-amber-400" />
            Skor Akhir
          </span>
          <span class="font-black font-fredoka text-amber-300 text-lg">
            {{ store.score }}
          </span>
        </div>

        <div class="flex justify-between items-center text-slate-300">
          <span class="flex items-center gap-1.5 font-semibold">
            <Clock class="w-4 h-4 text-emerald-400" />
            Bonus Sisa Waktu
          </span>
          <span class="font-bold text-emerald-400">
            +{{ store.timeBonus }}
          </span>
        </div>

        <div class="flex justify-between items-center text-slate-300">
          <span class="flex items-center gap-1.5 font-semibold">
            <Flame class="w-4 h-4 text-rose-400" />
            Combo Beruntun Terbaik
          </span>
          <span class="font-bold text-rose-300">
            {{ store.maxStreak }}x Streak
          </span>
        </div>

        <div v-if="isNewHighScore" class="mt-2 pt-2 border-t border-slate-700 text-center">
          <span class="inline-flex items-center gap-1 bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            🏆 Rekor Baru Tercipta!
          </span>
        </div>
      </div>

      <!-- Tombol Aksi (Mobile-first responsive) -->
      <div class="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
        <button
          type="button"
          @click="store.goToMenu()"
          class="flex-1 min-h-[48px] py-2.5 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 active:scale-95 text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow"
        >
          <Menu class="w-4 h-4" />
          <span>Menu</span>
        </button>

        <button
          type="button"
          @click="store.retryCurrentStage()"
          class="flex-1 min-h-[48px] py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow"
        >
          <RotateCcw class="w-4 h-4" />
          <span>Main Lagi</span>
        </button>

        <button
          type="button"
          @click="store.nextStage()"
          class="flex-1 min-h-[48px] py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-lg"
        >
          <span>Lanjut</span>
          <ArrowRight class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>
