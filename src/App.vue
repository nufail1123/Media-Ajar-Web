<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { useGameStore } from './stores/gameStore'
import MenuView from './views/MenuView.vue'
import HudBar from './components/common/HudBar.vue'
import CountdownOverlay from './components/common/CountdownOverlay.vue'
import StageClearModal from './components/common/StageClearModal.vue'
import GameOverModal from './components/common/GameOverModal.vue'

// 5 Modul Minigame
import TypoSmasher from './components/minigames/TypoSmasher.vue'
import AffixFactory from './components/minigames/AffixFactory.vue'
import SemanticsSorter from './components/minigames/SemanticsSorter.vue'
import SpokBuilder from './components/minigames/SpokBuilder.vue'
import PantunMatcher from './components/minigames/PantunMatcher.vue'

const store = useGameStore()

// Timer references to prevent memory leaks
let gameTimerInterval: ReturnType<typeof setInterval> | null = null
let countdownInterval: ReturnType<typeof setInterval> | null = null

function clearTimers() {
  if (gameTimerInterval) {
    clearInterval(gameTimerInterval)
    gameTimerInterval = null
  }
  if (countdownInterval) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }
}

// Watch state changes to drive timers cleanly
watch(
  () => store.currentState,
  (newState) => {
    clearTimers()

    if (newState === 'COUNTDOWN') {
      countdownInterval = setInterval(() => {
        store.tickCountdown()
      }, 1000)
    } else if (newState === 'PLAYING') {
      gameTimerInterval = setInterval(() => {
        store.tickTimer()
      }, 1000)
    }
  },
  { immediate: true }
)

// Map stageId to corresponding Vue minigame component
const currentMinigameComponent = computed(() => {
  switch (store.activeStageId) {
    case 'ejaan':
      return TypoSmasher
    case 'imbuhan':
      return AffixFactory
    case 'semantik':
      return SemanticsSorter
    case 'spok':
      return SpokBuilder
    case 'pantun':
      return PantunMatcher
    default:
      return TypoSmasher
  }
})

// Progress tracker indicator (e.g. Soal 2 dari 5)
const questionProgressText = computed(() => {
  return `Soal ${store.currentQuestionIndex + 1} dari ${store.totalQuestions}`
})

// Prevent accidental tab close while in the middle of a stage
function handleBeforeUnload(e: BeforeUnloadEvent) {
  if (store.currentState === 'PLAYING') {
    e.preventDefault()
    e.returnValue = ''
  }
}

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onUnmounted(() => {
  clearTimers()
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
</script>

<template>
  <div
    class="min-h-screen w-full bg-slate-900 text-slate-800 flex flex-col items-center justify-between p-2 sm:p-4 md:p-6 overflow-x-hidden select-none transition-colors duration-300 relative"
    :class="[
      store.isShaking ? 'animate-shake' : '',
      store.feedbackType === 'correct' ? 'bg-emerald-950/40 ring-inset ring-8 ring-emerald-500/30' : '',
      store.feedbackType === 'wrong' ? 'bg-rose-950/40 ring-inset ring-8 ring-rose-500/30' : ''
    ]"
  >
    <!-- Background Decorator Gradients -->
    <div class="fixed top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
    <div class="fixed bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

    <!-- TAMPILAN 1: MENU VIEW -->
    <div
      v-if="store.currentState === 'MENU'"
      class="w-full max-w-5xl my-auto flex flex-col items-center z-10"
    >
      <MenuView />
    </div>

    <!-- TAMPILAN 2: SESI GAMEPLAY AKTIF (COUNTDOWN, PLAYING, ROUND_FEEDBACK, STAGE_CLEAR, GAME_OVER) -->
    <div
      v-else
      class="w-full flex-1 flex flex-col items-center justify-center max-w-xl md:max-w-3xl z-10 my-auto py-2"
    >
      <!-- HUD Bar Adaptif Atas -->
      <HudBar />

      <!-- Kartu Konsol Arcade Tengah -->
      <main
        class="w-full bg-white rounded-2xl md:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 flex flex-col justify-between min-h-[460px] sm:min-h-[520px] transition-all relative overflow-hidden"
      >
        <!-- Bar Indikator Nomor Soal -->
        <div class="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 text-xs sm:text-sm font-bold text-slate-500">
          <span class="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-fredoka">
            {{ questionProgressText }}
          </span>

          <span class="text-[11px] font-semibold text-slate-400">
            Fase B/C SD
          </span>
        </div>

        <!-- Wadah Minigame Sesuai Modul yang Sedang Dimainkan -->
        <component :is="currentMinigameComponent" />
      </main>
    </div>

    <!-- OVERLAYS & MODALS -->
    <!-- 1. Countdown Overlay (3-2-1 Mulai) -->
    <CountdownOverlay v-if="store.currentState === 'COUNTDOWN'" />

    <!-- 2. Modal Stage Clear (Kemenangan & Konfeti) -->
    <StageClearModal v-if="store.currentState === 'STAGE_CLEAR'" />

    <!-- 3. Modal Game Over (Pembahasan & Coba Lagi) -->
    <GameOverModal v-if="store.currentState === 'GAME_OVER'" />
  </div>
</template>
