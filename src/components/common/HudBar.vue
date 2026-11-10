<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGameStore } from '../../stores/gameStore'
import {
  Heart,
  Volume2,
  VolumeX,
  ArrowLeft,
  Flame,
  Clock,
} from 'lucide-vue-next'

const store = useGameStore()
const showConfirmQuit = ref(false)

const timerPercentage = computed(() => {
  if (store.maxTime === 0) return 0
  return Math.max(0, Math.min(100, (store.timeRemaining / store.maxTime) * 100))
})

const timerColorClass = computed(() => {
  if (timerPercentage.value > 50) {
    return 'bg-gradient-to-r from-emerald-400 to-green-500'
  }
  if (timerPercentage.value >= 20) {
    return 'bg-gradient-to-r from-amber-400 to-yellow-500'
  }
  return 'bg-gradient-to-r from-rose-500 to-red-600 animate-pulse'
})

const comboTier = computed(() => {
  if (store.multiplier >= 3.0) return { label: 'ULTRA x3.0', color: 'bg-purple-600 text-purple-100 ring-2 ring-purple-300' }
  if (store.multiplier >= 2.0) return { label: 'SUPER x2.0', color: 'bg-amber-500 text-amber-950 ring-2 ring-amber-300' }
  if (store.multiplier >= 1.5) return { label: 'COMBO x1.5', color: 'bg-blue-500 text-blue-100 ring-2 ring-blue-300' }
  return null
})

function handleBackClick() {
  if (store.currentState === 'PLAYING' || store.currentState === 'ROUND_FEEDBACK') {
    showConfirmQuit.value = true
  } else {
    store.goToMenu()
  }
}

function confirmQuit() {
  showConfirmQuit.value = false
  store.goToMenu()
}

function cancelQuit() {
  showConfirmQuit.value = false
}
</script>

<template>
  <header class="w-full bg-[#1a382b]/95 backdrop-blur-md border-4 sm:border-[6px] border-[#854d27] rounded-3xl p-3 sm:p-4 shadow-board text-white font-nunito mb-3 sm:mb-5 relative overflow-visible">
    <!-- Desktop Layout (md:flex md:flex-row md:items-center md:justify-between) -->
    <div class="hidden md:flex md:flex-row items-center justify-between gap-4">
      <!-- Tombol Kembali & Info Stage -->
      <div class="flex items-center gap-3">
        <button
          type="button"
          @click="handleBackClick"
          class="px-3.5 py-2 rounded-2xl bg-amber-500 hover:bg-amber-400 border-b-4 border-amber-700 active:border-b-0 active:translate-y-1 transition-all text-amber-950 flex items-center gap-1.5 text-xs sm:text-sm font-black font-fredoka shadow-md touch-manipulation"
          title="Kembali ke Menu"
        >
          <ArrowLeft class="w-4 h-4 stroke-[3]" />
          <span>Menu</span>
        </button>

        <div class="flex flex-col">
          <span class="text-[11px] font-black text-emerald-200/90 uppercase tracking-wider">
            {{ store.activeStageInfo.subtitle }}
          </span>
          <span class="text-base font-black text-amber-300 font-fredoka flex items-center gap-1.5 drop-shadow">
            {{ store.activeStageInfo.title }}
          </span>
        </div>
      </div>

      <!-- Timer Bar Tengah -->
      <div class="flex-1 max-w-xs flex flex-col gap-1">
        <div class="flex justify-between items-center text-xs font-black text-emerald-100 font-fredoka">
          <span class="flex items-center gap-1">
            <Clock class="w-3.5 h-3.5 text-emerald-300" />
            Waktu
          </span>
          <span :class="{'text-rose-400 font-extrabold animate-pulse': timerPercentage < 20}">
            {{ store.timeRemaining }}s
          </span>
        </div>
        <div class="w-full bg-slate-950/80 rounded-full h-3.5 overflow-hidden p-0.5 border border-emerald-900 shadow-inner">
          <div
            class="h-full rounded-full transition-all duration-300 ease-linear shadow"
            :class="timerColorClass"
            :style="{ width: `${timerPercentage}%` }"
          />
        </div>
      </div>

      <!-- Status Kanan: HP, Skor, Combo & Volume -->
      <div class="flex items-center gap-3.5">
        <!-- Combo Badge -->
        <div
          v-if="comboTier"
          class="px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1 animate-bounce shadow-md font-fredoka"
          :class="comboTier.color"
        >
          <Flame class="w-3.5 h-3.5" />
          {{ comboTier.label }}
        </div>

        <!-- Skor -->
        <div class="flex flex-col items-end">
          <span class="text-[10px] font-black text-emerald-300 uppercase tracking-widest font-fredoka">Skor</span>
          <span class="text-xl font-black font-fredoka text-amber-300 tracking-wide drop-shadow">
            {{ store.displayedScore }}
          </span>
        </div>

        <!-- Indikator Hati (HP) -->
        <div class="flex items-center gap-1 bg-slate-950/70 px-3 py-1.5 rounded-2xl border border-emerald-800/60 shadow-inner">
          <Heart
            v-for="i in store.maxHp"
            :key="i"
            class="w-5 h-5 transition-transform"
            :class="[
              i <= store.hp
                ? 'text-rose-500 fill-rose-500 drop-shadow'
                : 'text-slate-700 fill-slate-900 opacity-40',
              store.hp === 1 && i === 1 ? 'animate-pulse text-rose-400 scale-110' : ''
            ]"
          />
        </div>

        <!-- Toggle Suara (Chunky Green) -->
        <button
          type="button"
          @click="store.toggleSound()"
          class="p-2 rounded-2xl bg-[#22c55e] hover:bg-[#16a34a] border-b-4 border-[#15803d] active:border-b-0 active:translate-y-1 transition-all text-white shadow-md touch-manipulation"
          :title="store.soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'"
        >
          <Volume2 v-if="store.soundEnabled" class="w-5 h-5 text-white" />
          <VolumeX v-else class="w-5 h-5 text-white/70" />
        </button>
      </div>
    </div>

    <!-- Mobile Layout (Vertical 2 Rows) -->
    <div class="flex flex-col gap-2.5 md:hidden">
      <!-- Baris 1: Tombol Kembali, Judul Ringkas, Hati, Audio -->
      <div class="flex items-center justify-between">
        <button
          type="button"
          @click="handleBackClick"
          class="p-2 rounded-xl bg-amber-500 border-b-2 border-amber-700 text-amber-950 active:translate-y-0.5"
          aria-label="Kembali"
        >
          <ArrowLeft class="w-4 h-4 stroke-[3]" />
        </button>

        <!-- Modul & Hati -->
        <div class="flex items-center gap-2">
          <span class="text-xs font-black font-fredoka text-amber-300 truncate max-w-[120px]">
            {{ store.activeStageInfo.title }}
          </span>

          <div class="flex items-center gap-0.5 bg-slate-950/70 px-2 py-1 rounded-xl border border-emerald-800/60">
            <Heart
              v-for="i in store.maxHp"
              :key="i"
              class="w-4 h-4 transition-transform"
              :class="[
                i <= store.hp
                  ? 'text-rose-500 fill-rose-500'
                  : 'text-slate-700 fill-slate-900 opacity-40',
                store.hp === 1 && i === 1 ? 'animate-pulse text-rose-400 scale-110' : ''
              ]"
            />
          </div>
        </div>

        <button
          type="button"
          @click="store.toggleSound()"
          class="p-2 rounded-xl bg-[#22c55e] border-b-2 border-[#15803d] text-white active:translate-y-0.5"
          aria-label="Suara"
        >
          <Volume2 v-if="store.soundEnabled" class="w-4 h-4 text-white" />
          <VolumeX v-else class="w-4 h-4 text-white/70" />
        </button>
      </div>

      <!-- Baris 2: Timer Bar & Skor / Combo -->
      <div class="flex items-center gap-2.5 pt-1.5 border-t border-emerald-900/60">
        <!-- Timer Bar -->
        <div class="flex-1 flex flex-col gap-0.5">
          <div class="flex justify-between text-[11px] font-black text-emerald-100 font-fredoka">
            <span class="flex items-center gap-1">
              <Clock class="w-3 h-3 text-emerald-300" />
              Sisa Waktu
            </span>
            <span :class="{'text-rose-400 font-extrabold animate-pulse': timerPercentage < 20}">
              {{ store.timeRemaining }}s
            </span>
          </div>
          <div class="w-full bg-slate-950/80 rounded-full h-2.5 overflow-hidden p-0.5 border border-emerald-900">
            <div
              class="h-full rounded-full transition-all duration-300 ease-linear shadow"
              :class="timerColorClass"
              :style="{ width: `${timerPercentage}%` }"
            />
          </div>
        </div>

        <!-- Combo & Skor -->
        <div class="flex items-center gap-2">
          <div
            v-if="comboTier"
            class="px-2 py-0.5 rounded-lg text-[10px] font-black flex items-center gap-0.5 shadow font-fredoka"
            :class="comboTier.color"
          >
            <Flame class="w-3 h-3" />
            x{{ store.multiplier.toFixed(1) }}
          </div>

          <div class="bg-amber-400/20 border border-amber-400/40 px-2.5 py-0.5 rounded-xl text-center min-w-[52px]">
            <span class="text-xs font-black font-fredoka text-amber-300 leading-none block">
              {{ store.displayedScore }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Konfirmasi Keluar saat Permainan Berjalan -->
    <Teleport to="body">
      <div
        v-if="showConfirmQuit"
        class="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <div class="bg-white border-4 border-amber-300 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl animate-pop text-slate-800">
          <div class="w-12 h-12 mx-auto mb-3 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
            <ArrowLeft class="w-6 h-6 stroke-[3]" />
          </div>
          <h3 class="text-xl font-black font-fredoka text-slate-900 mb-2">
            Kembali ke Menu Utama?
          </h3>
          <p class="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
            Permainan stage saat ini belum selesai. Skor sementara tidak akan disimpan jika kamu keluar sekarang.
          </p>
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              @click="cancelQuit"
              class="min-h-[46px] py-2.5 px-3 rounded-2xl bg-slate-200 hover:bg-slate-300 border-b-4 border-slate-300 active:border-b-0 active:translate-y-1 text-slate-700 font-bold text-sm transition-all"
            >
              Lanjut Main
            </button>
            <button
              type="button"
              @click="confirmQuit"
              class="min-h-[46px] py-2.5 px-3 rounded-2xl bg-rose-500 hover:bg-rose-400 border-b-4 border-rose-700 active:border-b-0 active:translate-y-1 text-white font-black text-sm transition-all shadow-md"
            >
              Ya, Keluar
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </header>
</template>
