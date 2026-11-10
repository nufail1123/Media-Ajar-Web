<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../../stores/gameStore'
import { RotateCcw, Menu, Lightbulb, HeartCrack } from 'lucide-vue-next'

const store = useGameStore()

const encouragementMessages = [
  'Jangan menyerah! Kesalahan adalah guru terbaik kita.',
  'Hebat sudah mencoba! Ayo baca petunjuknya dan coba lagi.',
  'Tetap semangat! Perhatikan kata kuncinya dan taklukkan soal ini!',
  'Kamu semakin dekat untuk menguasainya. Ayo ulangi sekali lagi!',
]

const randomEncouragement = computed(() => {
  const idx = Math.floor(Math.random() * encouragementMessages.length)
  return encouragementMessages[idx]
})
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div class="bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-rose-500/80 rounded-3xl max-w-md w-full p-5 sm:p-7 text-center shadow-2xl animate-pop text-white relative overflow-hidden">
      <!-- Glow ambient background -->
      <div class="absolute -top-12 -left-12 w-40 h-40 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />

      <!-- Ikon Game Over -->
      <div class="inline-flex p-3 sm:p-4 bg-rose-500/20 border border-rose-500/40 rounded-3xl mb-3 shadow-inner">
        <HeartCrack class="w-10 h-10 sm:w-12 sm:h-12 text-rose-400 animate-pulse" />
      </div>

      <h2 class="text-2xl sm:text-3xl font-black font-fredoka text-rose-400 drop-shadow">
        PERMAINAN SELESAI
      </h2>
      <p class="text-xs sm:text-sm text-slate-300 font-medium mb-4">
        {{ randomEncouragement }}
      </p>

      <!-- Rekap Pembahasan Soal yang Gagal Dijawab -->
      <div
        v-if="store.lastMistake"
        class="bg-slate-950/60 rounded-2xl p-4 border border-rose-900/60 text-left mb-6 space-y-2 text-xs sm:text-sm"
      >
        <div class="flex items-center gap-1.5 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <Lightbulb class="w-4 h-4 shrink-0" />
          <span>Catatan Pembahasan Belajar:</span>
        </div>

        <div class="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 space-y-1">
          <p class="text-slate-400 text-xs">
            Pertanyaan:
            <span class="text-slate-200 font-semibold">{{ store.lastMistake.questionTitle }}</span>
          </p>

          <p v-if="store.lastMistake.userAttempt" class="text-rose-400 text-xs">
            Upayamu:
            <span class="line-through">{{ store.lastMistake.userAttempt }}</span>
          </p>

          <p class="text-emerald-400 text-xs font-bold">
            Jawaban Tepat:
            <span>{{ store.lastMistake.correctAnswer }}</span>
          </p>
        </div>

        <p class="text-slate-300 text-xs leading-relaxed italic pt-1">
          💡 {{ store.lastMistake.explanation }}
        </p>
      </div>

      <div
        v-else
        class="bg-slate-950/40 rounded-2xl p-3 border border-slate-800 mb-6 text-xs text-slate-400"
      >
        Waktu atau nyawa habis! Ayo coba lagi dan selesaikan seluruh pertanyaan.
      </div>

      <!-- Tombol Aksi -->
      <div class="grid grid-cols-2 gap-3">
        <button
          type="button"
          @click="store.goToMenu()"
          class="min-h-[48px] py-2.5 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 active:scale-95 text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow"
        >
          <Menu class="w-4 h-4" />
          <span>Menu Utama</span>
        </button>

        <button
          type="button"
          @click="store.retryCurrentStage()"
          class="min-h-[48px] py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg"
        >
          <RotateCcw class="w-4 h-4" />
          <span>Coba Lagi</span>
        </button>
      </div>
    </div>
  </div>
</Teleport>
</template>
