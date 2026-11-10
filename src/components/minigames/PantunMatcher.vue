<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '../../stores/gameStore'
import { Sparkles, Scroll, Check, X, HelpCircle } from 'lucide-vue-next'

const store = useGameStore()
const selectedIndex = ref<number | null>(null)
const isSubmitted = ref(false)

const q = computed(() => store.currentQuestion)

function handleSelect(index: number) {
  if (store.currentState !== 'PLAYING' || isSubmitted.value) return
  selectedIndex.value = index
  isSubmitted.value = true

  if (index === q.value.correctIndex) {
    store.handleCorrectAnswer(120)
  } else {
    const chosen = q.value.options[index]
    const correct = q.value.options[q.value.correctIndex]
    store.handleWrongAnswer({
      questionTitle: 'Rima Runtun: Pasangan Rima Belum Tepat',
      userAttempt: chosen ? chosen.join(' / ') : 'Pilihan belum tepat',
      correctAnswer: correct ? correct.join(' / ') : 'Rima a-b-a-b selaras',
      explanation: q.value.explanation || 'Pantun memiliki pola rima akhir a-b-a-b: bunyi akhir baris ke-1 sama dengan baris ke-3, dan baris ke-2 sama dengan baris ke-4.',
    })
  }

  setTimeout(() => {
    selectedIndex.value = null
    isSubmitted.value = false
  }, 500)
}
</script>

<template>
  <div class="flex flex-col justify-between h-full w-full gap-4 sm:gap-6">
    <!-- Header Instruksi Pantun -->
    <div class="bg-rose-50 border border-rose-200 rounded-2xl p-3 sm:p-4 text-rose-900 shadow-sm flex items-center gap-3">
      <div class="p-2.5 bg-rose-500 text-white rounded-xl shadow shrink-0 hidden sm:block">
        <Scroll class="w-5 h-5" />
      </div>
      <div>
        <span class="text-xs font-black uppercase tracking-wider text-rose-700">Misi Sastra Pantun:</span>
        <p class="text-sm sm:text-base font-bold font-fredoka leading-snug">
          {{ q?.instruction || 'Pilih dua baris isi yang memiliki rima a-b-a-b selaras!' }}
        </p>
      </div>
    </div>

    <!-- Tampilan Sampiran (Baris 1 & 2) -->
    <div class="bg-gradient-to-b from-rose-500/10 via-rose-50/60 to-white border-2 border-rose-300 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm text-center flex flex-col items-center justify-center relative">
      <span class="text-[11px] font-black uppercase tracking-wider text-rose-700 bg-rose-100 px-3 py-0.5 rounded-full mb-3">
        Sampiran (Baris 1 & 2)
      </span>

      <div class="space-y-1 sm:space-y-2">
        <p class="text-base sm:text-xl font-extrabold text-slate-800 font-fredoka">
          {{ q?.sampiran?.[0] }}
        </p>
        <p class="text-base sm:text-xl font-extrabold text-slate-800 font-fredoka">
          {{ q?.sampiran?.[1] }}
        </p>
      </div>

      <!-- Garis Pemisah Pantun -->
      <div class="mt-4 flex items-center justify-center gap-2 text-rose-400">
        <div class="h-0.5 w-12 bg-rose-200 rounded-full" />
        <Sparkles class="w-4 h-4 text-rose-400" />
        <div class="h-0.5 w-12 bg-rose-200 rounded-full" />
      </div>

      <span class="text-[11px] font-bold text-slate-400 mt-2">
        Pilihlah pasangan Baris 3 & 4 (Isi Pantun) di bawah ini:
      </span>
    </div>

    <!-- Pilihan Pasangan Baris Isi (Options) -->
    <div class="flex flex-col gap-2.5 sm:gap-3">
      <button
        v-for="(pair, idx) in q?.options"
        :key="idx"
        type="button"
        @click="handleSelect(Number(idx))"
        class="min-h-[52px] sm:min-h-[60px] p-3 sm:p-4 rounded-2xl font-nunito transition-all duration-150 flex items-center justify-between shadow-sm active:scale-98 touch-manipulation select-none text-left border-2"
        :class="[
          isSubmitted && idx === q?.correctIndex
            ? 'bg-emerald-500 text-white ring-4 ring-emerald-300 shadow-md border-emerald-400 font-bold'
            : isSubmitted && selectedIndex === idx && idx !== q?.correctIndex
            ? 'bg-rose-500 text-white ring-4 ring-rose-300 border-rose-400 animate-shake'
            : 'bg-white hover:bg-rose-50 text-slate-800 border-slate-200 hover:border-rose-400 hover:shadow-md'
        ]"
      >
        <div class="flex flex-col leading-snug">
          <span class="text-xs sm:text-sm font-semibold">
            {{ pair[0] }}
          </span>
          <span class="text-xs sm:text-sm font-extrabold">
            {{ pair[1] }}
          </span>
        </div>

        <div class="w-6 flex justify-end shrink-0 ml-3">
          <Check v-if="isSubmitted && idx === q?.correctIndex" class="w-5 h-5 text-white" />
          <X v-else-if="isSubmitted && selectedIndex === idx && idx !== q?.correctIndex" class="w-5 h-5 text-white" />
        </div>
      </button>
    </div>

    <!-- Hint Footnote -->
    <div class="text-center text-xs text-slate-400 font-medium flex items-center justify-center gap-1">
      <HelpCircle class="w-4 h-4 text-rose-500" />
      <span>Rima pantun adalah pola silang a-b-a-b (suku kata ujung baris 1 = 3, baris 2 = 4).</span>
    </div>
  </div>
</template>
