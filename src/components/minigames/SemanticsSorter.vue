<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useGameStore } from '../../stores/gameStore'
import { Layers, Check, X, HelpCircle, Quote } from 'lucide-vue-next'

const store = useGameStore()

const q = computed(() => store.currentQuestion)
const selectedOption = ref<string | null>(null)
const isSubmitted = ref(false)
const shuffledOptions = ref<string[]>([])

const optionLetters = ['A', 'B', 'C', 'D']

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

function shuffleDifferent<T>(arr: T[]): T[] {
  if (arr.length <= 1) return [...arr]
  let shuffled = shuffleArray([...arr])
  let attempts = 0
  while (shuffled.every((item, i) => item === arr[i]) && attempts < 5) {
    shuffled = shuffleArray([...arr])
    attempts++
  }
  return shuffled
}

watch(
  () => store.currentQuestionIndex,
  () => {
    selectedOption.value = null
    isSubmitted.value = false
    if (q.value?.options) {
      shuffledOptions.value = shuffleArray([...q.value.options])
    } else {
      shuffledOptions.value = []
    }
  },
  { immediate: true }
)

function handleSelect(option: string) {
  if (store.currentState !== 'PLAYING' || isSubmitted.value) return

  selectedOption.value = option
  isSubmitted.value = true

  const isCorrect = option === q.value?.correct

  setTimeout(() => {
    if (isCorrect) {
      store.handleCorrectAnswer(110)
    } else {
      store.handleWrongAnswer({
        questionTitle: `Pilah Cepat Makna: "${q.value?.sentence}"`,
        userAttempt: `Kamu memilih "${option}"`,
        correctAnswer: `Kategori yang tepat: "${q.value?.correct}"`,
        explanation: q.value?.explanation || 'Pahami konteks apakah makna kalimat bermakna lugas (denotatif) atau kiasan (konotatif/majas).',
      })
      // Acak ulang lokasi ABCD ketika menjawab salah
      shuffledOptions.value = shuffleDifferent([...shuffledOptions.value])
    }

    selectedOption.value = null
    isSubmitted.value = false
  }, 450)
}
</script>

<template>
  <div class="flex flex-col justify-between h-full w-full gap-4 sm:gap-6">
    <!-- Instruksi Modul Semantik -->
    <div class="bg-sky-50 border-2 border-sky-200 rounded-3xl p-3 sm:p-4 text-sky-950 shadow-sm flex items-center gap-3">
      <div class="p-2.5 bg-sky-500 text-white rounded-2xl shadow shrink-0 hidden sm:block">
        <Layers class="w-5 h-5" />
      </div>
      <div>
        <span class="text-xs font-black uppercase tracking-wider text-sky-700 font-fredoka">Misi Semantik & Majas:</span>
        <p class="text-sm sm:text-base font-bold font-fredoka leading-snug">
          {{ q?.instruction || 'Pilihlah kategori makna atau majas yang tepat!' }}
        </p>
      </div>
    </div>

    <!-- Kartu Kalimat & Frasa Sorotan -->
    <div class="flex-1 flex flex-col justify-center items-center py-6 sm:py-8 px-4 bg-gradient-to-b from-sky-100/50 via-sky-50/40 to-white border-4 border-sky-200 rounded-3xl shadow-sm text-center relative overflow-hidden">
      <!-- Tag Frasa Sorotan jika ada -->
      <div v-if="q?.phrase" class="mb-3">
        <span class="inline-flex items-center gap-1.5 bg-sky-600 border-b-2 border-sky-800 text-white font-fredoka text-xs sm:text-sm font-black px-4 py-1 rounded-full uppercase tracking-wider shadow">
          <Quote class="w-3.5 h-3.5" />
          Frasa: {{ q.phrase }}
        </span>
      </div>

      <!-- Teks Kalimat Utama -->
      <div class="max-w-xl bg-white px-5 py-4 rounded-2xl border-2 border-sky-200 shadow-sm">
        <p class="text-base sm:text-2xl font-black text-slate-800 leading-relaxed font-nunito">
          "{{ q?.sentence }}"
        </p>
      </div>
    </div>

    <!-- Pilihan Kategori Chunky 3D Acak ABCD (Responsive Grid) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      <button
        v-for="(opt, idx) in shuffledOptions"
        :key="opt"
        type="button"
        @click="handleSelect(opt)"
        class="min-h-[50px] sm:min-h-[56px] px-4 py-3 rounded-2xl font-black font-fredoka text-base sm:text-lg transition-all duration-100 flex items-center justify-between shadow-md border-2 border-b-4 active:border-b-2 active:translate-y-1 touch-manipulation select-none"
        :class="[
          isSubmitted && opt === q?.correct
            ? 'bg-emerald-500 border-emerald-600 border-b-emerald-700 text-white'
            : isSubmitted && selectedOption === opt && opt !== q?.correct
            ? 'bg-rose-500 border-rose-600 border-b-rose-700 text-white animate-shake'
            : 'bg-white hover:bg-sky-50 text-slate-800 border-sky-200 border-b-sky-300 hover:border-sky-400'
        ]"
      >
        <span
          class="w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center font-fredoka shadow-sm shrink-0"
          :class="[
            isSubmitted && (opt === q?.correct || selectedOption === opt)
              ? 'bg-white/20 text-white'
              : 'bg-sky-200 text-sky-900'
          ]"
        >
          {{ optionLetters[idx] || idx + 1 }}
        </span>

        <span class="flex-1 text-center font-black px-2">
          {{ opt }}
        </span>

        <span class="w-6 flex justify-end shrink-0">
          <Check v-if="isSubmitted && opt === q?.correct" class="w-5 h-5 text-white stroke-[3]" />
          <X v-else-if="isSubmitted && selectedOption === opt && opt !== q?.correct" class="w-5 h-5 text-white stroke-[3]" />
        </span>
      </button>
    </div>

    <!-- Footnote Hint -->
    <div class="text-center text-xs text-slate-500 font-bold flex items-center justify-center gap-1 font-fredoka">
      <HelpCircle class="w-4 h-4 text-sky-500" />
      <span>Pilih cepat sebelum waktu timer per stage habis!</span>
    </div>
  </div>
</template>
