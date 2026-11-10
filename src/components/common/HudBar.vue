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
  <header class="w-full bg-slate-800/90 backdrop-blur-md border border-slate-700/60 rounded-2xl p-2.5 sm:p-3.5 shadow-lg text-white font-nunito mb-3 sm:mb-5">
    <!-- Desktop Layout (md:flex md:flex-row md:items-center md:justify-between) -->
    <div class="hidden md:flex md:flex-row items-center justify-between gap-4">
      <!-- Tombol Kembali & Info Stage -->
      <div class="flex items-center gap-3">
        <button
          type="button"
          @click="handleBackClick"
          class="p-2 rounded-xl bg-slate-700/80 hover:bg-slate-600 active:scale-95 transition-all text-slate-200 hover:text-white flex items-center gap-1.5 text-sm font-bold shadow-sm"
          title="Kembali ke Menu"
        >
          <ArrowLeft class="w-5 h-5" />
          <span>Menu</span>
        </button>

        <div class="flex flex-col">
          <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {{ store.activeStageInfo.subtitle }}
          </span>
          <span class="text-base font-extrabold text-amber-400 font-fredoka flex items-center gap-1.5">
            {{ store.activeStageInfo.title }}
          </span>
        </div>
      </div>

      <!-- Timer Bar Tengah -->
      <div class="flex-1 max-w-xs flex flex-col gap-1">
        <div class="flex justify-between items-center text-xs font-bold text-slate-300">
          <span class="flex items-center gap-1">
            <Clock class="w-3.5 h-3.5 text-slate-400" />
            Waktu
          </span>
          <span :class="{'text-rose-400 font-extrabold animate-pulse': timerPercentage < 20}">
            {{ store.timeRemaining }}s
          </span>
        </div>
        <div class="w-full bg-slate-700/80 rounded-full h-3 overflow-hidden p-0.5 shadow-inner">
          <div
            class="h-full rounded-full transition-all duration-300 ease-linear shadow"
            :class="timerColorClass"
            :style="{ width: `${timerPercentage}%` }"
          />
        </div>
      </div>

      <!-- Status Kanan: HP, Skor, Combo & Volume -->
      <div class="flex items-center gap-4">
        <!-- Combo Badge -->
        <div
          v-if="comboTier"
          class="px-2.5 py-1 rounded-full text-xs font-black flex items-center gap-1 animate-bounce shadow-md font-fredoka"
          :class="comboTier.color"
        >
          <Flame class="w-3.5 h-3.5" />
          {{ comboTier.label }}
        </div>

        <!-- Skor -->
        <div class="flex flex-col items-end">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Skor</span>
          <span class="text-xl font-black font-fredoka text-amber-300 tracking-wide drop-shadow">
            {{ store.displayedScore }}
          </span>
        </div>

        <!-- Indikator Hati (HP) -->
        <div class="flex items-center gap-1 bg-slate-900/60 px-2.5 py-1.5 rounded-xl border border-slate-700/50">
          <Heart
            v-for="i in store.maxHp"
            :key="i"
            class="w-5 h-5 transition-transform"
            :class="[
              i <= store.hp
                ? 'text-rose-500 fill-rose-500'
                : 'text-slate-600 fill-slate-800 opacity-40',
              store.hp === 1 && i === 1 ? 'animate-pulse text-rose-400 scale-110' : ''
            ]"
          />
        </div>

        <!-- Toggle Suara -->
        <button
          type="button"
          @click="store.toggleSound()"
          class="p-2 rounded-xl bg-slate-700/80 hover:bg-slate-600 active:scale-95 transition-all text-slate-300 hover:text-white"
          :title="store.soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'"
        >
          <Volume2 v-if="store.soundEnabled" class="w-5 h-5 text-emerald-400" />
          <VolumeX v-else class="w-5 h-5 text-slate-500" />
        </button>
      </div>
    </div>

    <!-- Mobile Layout (Vertical 2 Rows for High Ergonomics) -->
    <div class="flex flex-col gap-2 md:hidden">
      <!-- Baris 1: Tombol Kembali, Judul Ringkas, Hati, Audio -->
      <div class="flex items-center justify-between">
        <button
          type="button"
          @click="handleBackClick"
          class="p-2 rounded-xl bg-slate-700/80 active:scale-90 transition-transform text-slate-200"
          aria-label="Kembali"
        >
          <ArrowLeft class="w-5 h-5" />
        </button>

        <!-- Modul & Hati -->
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold font-fredoka text-amber-400 truncate max-w-[120px]">
            {{ store.activeStageInfo.title }}
          </span>

          <div class="flex items-center gap-0.5 bg-slate-900/60 px-2 py-1 rounded-lg border border-slate-700/50">
            <Heart
              v-for="i in store.maxHp"
              :key="i"
              class="w-4 h-4 transition-transform"
              :class="[
                i <= store.hp
                  ? 'text-rose-500 fill-rose-500'
                  : 'text-slate-600 fill-slate-800 opacity-40',
                store.hp === 1 && i === 1 ? 'animate-pulse text-rose-400 scale-110' : ''
              ]"
            />
          </div>
        </div>

        <button
          type="button"
          @click="store.toggleSound()"
          class="p-2 rounded-xl bg-slate-700/80 active:scale-90 transition-transform text-slate-300"
          aria-label="Suara"
        >
          <Volume2 v-if="store.soundEnabled" class="w-5 h-5 text-emerald-400" />
          <VolumeX v-else class="w-5 h-5 text-slate-500" />
        </button>
      </div>

      <!-- Baris 2: Timer Bar & Skor / Combo -->
      <div class="flex items-center gap-2.5 pt-1 border-t border-slate-700/40">
        <!-- Timer Bar -->
        <div class="flex-1 flex flex-col gap-0.5">
          <div class="flex justify-between text-[11px] font-bold text-slate-300">
            <span class="flex items-center gap-1">
              <Clock class="w-3 h-3 text-slate-400" />
              Sisa Waktu
            </span>
            <span :class="{'text-rose-400 font-extrabold animate-pulse': timerPercentage < 20}">
              {{ store.timeRemaining }}s
            </span>
          </div>
          <div class="w-full bg-slate-700/80 rounded-full h-2.5 overflow-hidden p-0.5">
            <div
              class="h-full rounded-full transition-all duration-300 ease-linear"
              :class="timerColorClass"
              :style="{ width: `${timerPercentage}%` }"
            />
          </div>
        </div>

        <!-- Combo & Skor -->
        <div class="flex items-center gap-2">
          <div
            v-if="comboTier"
            class="px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-0.5 shadow font-fredoka"
            :class="comboTier.color"
          >
            <Flame class="w-3 h-3" />
            x{{ store.multiplier.toFixed(1) }}
          </div>

          <div class="bg-amber-400/10 border border-amber-500/30 px-2.5 py-1 rounded-xl text-center min-w-[56px]">
            <span class="text-xs font-black font-fredoka text-amber-300 leading-none block">
              {{ store.displayedScore }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Konfirmasi Keluar saat Permainan Berjalan -->
    <div
      v-if="showConfirmQuit"
      class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div class="bg-slate-800 border-2 border-amber-500/50 rounded-2xl max-w-sm w-full p-5 text-center shadow-2xl animate-pop">
        <h3 class="text-lg font-bold font-fredoka text-amber-400 mb-2">
          Keluar ke Menu Utama?
        </h3>
        <p class="text-xs sm:text-sm text-slate-300 mb-5">
          Permainan stage saat ini belum selesai. Skor sementara tidak akan disimpan jika keluar sekarang.
        </p>
        <div class="grid grid-cols-2 gap-3">
          <button
            type="button"
            @click="cancelQuit"
            class="min-h-[44px] py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-sm active:scale-95 transition-all"
          >
            Lanjut Main
          </button>
          <button
            type="button"
            @click="confirmQuit"
            class="min-h-[44px] py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm active:scale-95 transition-all"
          >
            Ya, Keluar
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
