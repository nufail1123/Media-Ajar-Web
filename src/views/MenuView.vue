<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore, STAGES, type StageId } from '../stores/gameStore'
import {
  Search,
  Hammer,
  Layers,
  Blocks,
  Scroll,
  Star,
  Lock,
  Trophy,
  Play,
  Volume2,
  VolumeX,
  Sparkles,
  RotateCcw,
} from 'lucide-vue-next'

const store = useGameStore()
const showResetConfirm = ref(false)

const iconMap: Record<string, any> = {
  ejaan: Search,
  imbuhan: Hammer,
  semantik: Layers,
  spok: Blocks,
  pantun: Scroll,
}

function handleStartStage(id: StageId) {
  if (!store.isStageUnlocked(id)) return
  store.startStage(id)
}

function confirmReset() {
  store.resetAllProgress()
  showResetConfirm.value = false
}
</script>

<template>
  <div class="w-full flex flex-col justify-between items-center text-white py-2 sm:py-4">
    <!-- Header Arcade Judul -->
    <header class="text-center mb-6 sm:mb-8 animate-pop">
      <!-- Tag Pembuka -->
      <div class="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 border border-amber-400/40 px-3.5 py-1 rounded-full text-xs sm:text-sm font-extrabold text-amber-300 shadow-sm mb-3">
        <Sparkles class="w-4 h-4 text-amber-400 animate-spin" />
        <span>Game Edukasi Arcade SD (Fase B/C)</span>
      </div>

      <!-- Judul Raksasa Arcade -->
      <h1 class="text-4xl sm:text-6xl md:text-7xl font-black font-fredoka tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-orange-500 text-arcade-shadow uppercase select-none">
        Petualang Kata
      </h1>

      <p class="text-sm sm:text-base font-bold text-slate-300 mt-1 max-w-md mx-auto">
        Tantang ketangkasan bahasa: Ejaan, Morfologi, Semantik, SPOK, dan Pantun!
      </p>

      <!-- Bar Statistik Koleksi Bintang & Kontrol Cepat -->
      <div class="mt-4 flex flex-wrap items-center justify-center gap-3">
        <!-- Badge Total Bintang -->
        <div class="inline-flex items-center gap-2 bg-slate-800/90 border border-amber-400/50 px-4 py-1.5 rounded-2xl shadow-md">
          <Star class="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse" />
          <span class="text-xs sm:text-sm font-extrabold text-slate-300">
            Total Bintang:
            <span class="text-amber-400 font-black font-fredoka text-base sm:text-lg">
              {{ store.totalStars }} / 15
            </span>
          </span>
        </div>

        <!-- Tombol Suara -->
        <button
          type="button"
          @click="store.toggleSound()"
          class="inline-flex items-center gap-1.5 bg-slate-800/90 hover:bg-slate-700 active:scale-95 border border-slate-700 px-3.5 py-1.5 rounded-2xl text-xs sm:text-sm font-bold text-slate-300 transition-all shadow"
          :title="store.soundEnabled ? 'Matikan Efek Suara' : 'Nyalakan Efek Suara'"
        >
          <Volume2 v-if="store.soundEnabled" class="w-4 h-4 text-emerald-400" />
          <VolumeX v-else class="w-4 h-4 text-slate-500" />
          <span>{{ store.soundEnabled ? 'Suara Aktif' : 'Mute' }}</span>
        </button>

        <!-- Tombol Reset Data -->
        <button
          type="button"
          @click="showResetConfirm = true"
          class="inline-flex items-center gap-1 bg-slate-800/90 hover:bg-slate-700 active:scale-95 border border-slate-700 px-3 py-1.5 rounded-2xl text-xs font-semibold text-slate-400 hover:text-rose-400 transition-all"
          title="Reset Progres Belajar"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>
    </header>

    <!-- Grid 5 Modul Pembelajaran -->
    <main class="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-6">
      <div
        v-for="(stage, idx) in STAGES"
        :key="stage.id"
        class="relative rounded-3xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 border-2 shadow-xl group overflow-hidden select-none"
        :class="[
          store.isStageUnlocked(stage.id)
            ? 'bg-slate-800/95 border-slate-700 hover:border-amber-400/70 hover:shadow-2xl hover:-translate-y-1'
            : 'bg-slate-900/80 border-slate-800 opacity-60 grayscale-[40%]'
        ]"
      >
        <!-- Latar Warna Gradasi Halus -->
        <div
          class="absolute inset-0 opacity-10 bg-gradient-to-br pointer-events-none transition-opacity group-hover:opacity-20"
          :class="stage.gradient"
        />

        <!-- Bagian Atas Kartu: Ikon & Bintang -->
        <div class="flex items-start justify-between mb-3 relative z-10">
          <div
            class="p-3 rounded-2xl shadow-md text-white"
            :class="[
              store.isStageUnlocked(stage.id)
                ? stage.badgeColor
                : 'bg-slate-700 text-slate-400'
            ]"
          >
            <component :is="iconMap[stage.id]" class="w-6 h-6" />
          </div>

          <!-- Bintang yang Diperoleh -->
          <div class="flex items-center gap-1 bg-slate-950/60 px-2.5 py-1 rounded-xl border border-slate-700/60">
            <Star
              v-for="s in 3"
              :key="s"
              class="w-4 h-4"
              :class="[
                s <= (store.stageStars[stage.id] || 0)
                  ? 'text-amber-400 fill-amber-400 drop-shadow'
                  : 'text-slate-600'
              ]"
            />
          </div>
        </div>

        <!-- Deskripsi Materi -->
        <div class="mb-4 relative z-10">
          <span class="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
            {{ stage.subtitle }}
          </span>
          <h2 class="text-xl sm:text-2xl font-black font-fredoka text-white group-hover:text-amber-300 transition-colors">
            {{ stage.title }}
          </h2>
          <p class="text-xs text-slate-300 mt-1.5 leading-relaxed line-clamp-2">
            {{ stage.description }}
          </p>

          <!-- Rekor Skor Tertinggi jika ada -->
          <div
            v-if="store.highScores[stage.id]"
            class="mt-2.5 flex items-center gap-1.5 text-[11px] font-bold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-lg w-fit"
          >
            <Trophy class="w-3.5 h-3.5" />
            <span>Skor Terbaik: {{ store.highScores[stage.id] }}</span>
          </div>
        </div>

        <!-- Tombol Aksi / Indikator Gembok -->
        <div class="relative z-10 pt-2 border-t border-slate-700/40">
          <button
            v-if="store.isStageUnlocked(stage.id)"
            type="button"
            @click="handleStartStage(stage.id)"
            class="w-full min-h-[48px] py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 active:scale-95 text-slate-950 font-black font-fredoka text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Play class="w-4 h-4 fill-slate-950" />
            <span>{{ store.stageStars[stage.id] ? 'MAIN LAGI' : 'MULAI MAIN' }}</span>
          </button>

          <div
            v-else
            class="w-full min-h-[48px] py-2.5 px-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-slate-400 font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed"
          >
            <Lock class="w-4 h-4 text-slate-500" />
            <span>Selesaikan Modul {{ idx }} Dahulu</span>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer Ramah Edukasi -->
    <footer class="text-center text-xs text-slate-400 pb-2">
      <p class="font-semibold text-slate-300">
        Disusun sesuai Capaian Pembelajaran Kurikulum Merdeka Bahasa Indonesia SD Kelas 4–6.
      </p>
      <p class="text-[11px] text-slate-500 mt-0.5">
        Client-Side Arcade Web App • Dilengkapi Sintesis Web Audio API & Responsif Semua Perangkat
      </p>
    </footer>

    <!-- Modal Konfirmasi Reset Progres -->
    <Teleport to="body">
      <div
        v-if="showResetConfirm"
        class="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <div class="bg-slate-800 border-2 border-rose-500/60 rounded-3xl max-w-sm w-full p-5 text-center shadow-2xl animate-pop text-white">
          <h3 class="text-lg font-bold font-fredoka text-rose-400 mb-2">
            Reset Seluruh Progres?
          </h3>
          <p class="text-xs sm:text-sm text-slate-300 mb-5">
            Seluruh perolehan bintang, skor tertinggi, dan modul yang terbuka akan dikembalikan ke kondisi awal.
          </p>
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              @click="showResetConfirm = false"
              class="min-h-[44px] py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-sm active:scale-95 transition-all"
            >
              Batal
            </button>
            <button
              type="button"
              @click="confirmReset"
              class="min-h-[44px] py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm active:scale-95 transition-all"
            >
              Ya, Reset
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
