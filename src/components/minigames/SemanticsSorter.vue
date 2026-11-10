<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '../../stores/gameStore'
import { Layers, Quote, Check, X, HelpCircle } from 'lucide-vue-next'

const store = useGameStore()
const selectedOption = ref<string | null>(null)
const isSubmitted = ref(false)

const q = computed(() => store.currentQuestion)

function handleSelect(option: string) {
  if (store.currentState !== 'PLAYING' || isSubmitted.value) return
  selectedOption.value = option
  isSubmitted.value = true

  if (option === q.value.correct) {
    store.handleCorrectAnswer(100)
  } else {
    store.handleWrongAnswer({
      questionTitle: 'Pilah Cepat Makna: Kategori Belum Tepat',
      userAttempt: `Kamu memilih "${option}"`,
      correctAnswer: `Jawaban benar: "${q.value.correct}"`,
      explanation: q.value.explanation || 'Perhatikan apakah makna sebenarnya (denotatif) atau kiasan/majas (konotatif).',
    })
  }

  setTimeout(() => {
    selectedOption.value = null
    isSubmitted.value = false
  }, 500)
}
</script>

<template>
  <div class="flex flex-col justify-between h-full w-full gap-4 sm:gap-6">
    <!-- Instruksi Modul Semantik -->
    <div class="bg-sky-50 border border-sky-200 rounded-2xl p-3 sm:p-4 text-sky-900 shadow-sm flex items-center gap-3">
      <div class="p-2.5 bg-sky-500 text-white rounded-xl shadow shrink-0 hidden sm:block">
        <Layers class="w-5 h-5" />
      </div>
      <div>
        <span class="text-xs font-black uppercase tracking-wider text-sky-700">Misi Semantik & Majas:</span>
        <p class="text-sm sm:text-base font-bold font-fredoka leading-snug">
          {{ q?.instruction || 'Pilihlah kategori makna atau majas yang tepat!' }}
        </p>
      </div>
    </div>

    <!-- Kartu Kalimat & Frasa Sorotan -->
    <div class="flex-1 flex flex-col justify-center items-center py-6 sm:py-8 px-4 bg-gradient-to-b from-sky-500/10 via-sky-50/50 to-white border-2 border-sky-300 rounded-2xl sm:rounded-3xl shadow-sm text-center relative overflow-hidden">
      <!-- Tag Frasa Sorotan jika ada -->
      <div v-if="q?.phrase" class="mb-3">
        <span class="inline-flex items-center gap-1.5 bg-sky-600 text-white font-fredoka text-xs sm:text-sm font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow">
          <Quote class="w-3.5 h-3.5" />
          Frasa: {{ q.phrase }}
        </span>
      </div>

      <!-- Teks Kalimat Utama -->
      <div class="max-w-xl bg-white px-5 py-4 rounded-2xl border border-sky-200 shadow-sm">
        <p class="text-base sm:text-2xl md:text-2xl font-extrabold text-slate-800 leading-relaxed">
          "{{ q?.sentence }}"
        </p>
      </div>
    </div>

    <!-- Pilihan Kategori (Responsive Grid) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
      <button
        v-for="opt in q?.options"
        :key="opt"
        type="button"
        @click="handleSelect(opt)"
        class="min-h-[48px] sm:min-h-[56px] px-4 py-3 rounded-2xl font-bold font-fredoka text-base sm:text-lg transition-all duration-150 flex items-center justify-between shadow-sm active:scale-95 touch-manipulation select-none"
        :class="[
          isSubmitted && opt === q?.correct
            ? 'bg-emerald-500 text-white ring-4 ring-emerald-300 shadow-md scale-102'
            : isSubmitted && selectedOption === opt && opt !== q?.correct
            ? 'bg-rose-500 text-white ring-4 ring-rose-300 animate-shake'
            : 'bg-white hover:bg-sky-50 text-slate-800 border-2 border-slate-200 hover:border-sky-400 hover:shadow-md'
        ]"
      >
        <span class="flex-1 text-center font-extrabold">
          {{ opt }}
        </span>
        <span class="w-6 flex justify-end">
          <Check v-if="isSubmitted && opt === q?.correct" class="w-5 h-5 text-white" />
          <X v-else-if="isSubmitted && selectedOption === opt && opt !== q?.correct" class="w-5 h-5 text-white" />
        </span>
      </button>
    </div>

    <!-- Footnote Hint -->
    <div class="text-center text-xs text-slate-400 font-medium flex items-center justify-center gap-1">
      <HelpCircle class="w-4 h-4 text-sky-500" />
      <span>Pilih cepat sebelum waktu timer per stage habis!</span>
    </div>
  </div>
</template>
