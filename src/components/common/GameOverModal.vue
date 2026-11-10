<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../../stores/gameStore'
import { RotateCcw, Menu, Lightbulb, HeartCrack } from 'lucide-vue-next'

const store = useGameStore()

const encouragementMessages = [
  'Jangan menyerah! Belajar dari kesalahan membuat kita makin pintar.',
  'Hebat sudah mencoba! Ayo baca petunjuknya dan taklukkan soal ini!',
  'Tetap semangat! Perhatikan kata kuncinya dan coba sekali lagi!',
  'Kamu semakin dekat untuk menguasainya. Ayo coba ulangi!',
]

const randomEncouragement = computed(() => {
  const idx = Math.floor(Math.random() * encouragementMessages.length)
  return encouragementMessages[idx]
})
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div class="bg-white border-4 border-rose-300 rounded-3xl max-w-md w-full p-5 sm:p-7 text-center shadow-2xl animate-pop text-slate-800 relative overflow-hidden">
        <!-- Ikon Game Over -->
        <div class="inline-flex p-3 sm:p-4 bg-rose-100 border-2 border-rose-300 rounded-3xl mb-3 shadow-inner">
          <HeartCrack class="w-10 h-10 sm:w-12 sm:h-12 text-rose-500 animate-pulse" />
        </div>

        <h2 class="text-2xl sm:text-3xl font-black font-fredoka text-rose-950">
          PERMAINAN SELESAI
        </h2>
        <p class="text-xs sm:text-sm text-slate-600 font-medium mb-4">
          {{ randomEncouragement }}
        </p>

        <!-- Rekap Pembahasan Soal yang Gagal Dijawab -->
        <div
          v-if="store.lastMistake"
          class="bg-rose-50/80 rounded-2xl p-4 border-2 border-rose-200 text-left mb-6 space-y-2 text-xs sm:text-sm"
        >
          <div class="flex items-center gap-1.5 text-amber-800 font-black text-xs uppercase tracking-wider font-fredoka">
            <Lightbulb class="w-4 h-4 shrink-0 text-amber-600" />
            <span>Catatan Pembahasan Belajar:</span>
          </div>

          <div class="bg-white rounded-xl p-3 border border-rose-200 space-y-1 shadow-sm">
            <p class="text-slate-600 text-xs">
              Pertanyaan:
              <span class="text-slate-900 font-bold">{{ store.lastMistake.questionTitle }}</span>
            </p>

            <p v-if="store.lastMistake.userAttempt" class="text-rose-600 text-xs">
              Pilihanmu:
              <span class="line-through">{{ store.lastMistake.userAttempt }}</span>
            </p>

            <p class="text-emerald-700 text-xs font-black">
              Jawaban Tepat:
              <span>{{ store.lastMistake.correctAnswer }}</span>
            </p>
          </div>

          <p class="text-slate-700 text-xs leading-relaxed italic pt-1">
            💡 {{ store.lastMistake.explanation }}
          </p>
        </div>

        <div
          v-else
          class="bg-slate-50 rounded-2xl p-4 border-2 border-slate-200 mb-6 text-xs text-slate-600 leading-relaxed"
        >
          Waktu atau nyawa habis! Ayo coba lagi dan selesaikan seluruh pertanyaan dengan teliti.
        </div>

        <!-- Tombol Aksi Chunky 3D -->
        <div class="grid grid-cols-2 gap-3">
          <button
            type="button"
            @click="store.goToMenu()"
            class="min-h-[46px] py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 border-b-4 border-slate-300 active:border-b-0 active:translate-y-1 text-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow touch-manipulation"
          >
            <Menu class="w-4 h-4" />
            <span>Menu Utama</span>
          </button>

          <button
            type="button"
            @click="store.retryCurrentStage()"
            class="min-h-[46px] py-2.5 px-4 rounded-2xl bg-rose-500 hover:bg-rose-400 border-b-4 border-rose-700 active:border-b-0 active:translate-y-1 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md touch-manipulation font-fredoka"
          >
            <RotateCcw class="w-4 h-4" />
            <span>Coba Lagi</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
