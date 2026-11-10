<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useGameStore } from '../../stores/gameStore'
import { Blocks, RotateCcw, Check, X, HelpCircle } from 'lucide-vue-next'

const store = useGameStore()

const q = computed(() => store.currentQuestion)

// Mode 1: Susun Balok Kata (Sequence Mode)
const availableBlocks = ref<string[]>([])
const selectedBlocks = ref<string[]>([])

// Mode 2: Pilihan Ganda Struktur / Kalimat Pasif (Choice Mode)
const selectedChoice = ref<string | null>(null)
const isChoiceSubmitted = ref(false)

const isSequenceMode = computed(() => {
  return q.value?.mode === 'sequence' || (!q.value?.mode && !!q.value?.words)
})

watch(
  () => store.currentQuestionIndex,
  () => {
    initQuestion()
  },
  { immediate: true }
)

function initQuestion() {
  selectedBlocks.value = []
  selectedChoice.value = null
  isChoiceSubmitted.value = false

  if (isSequenceMode.value && q.value?.words) {
    availableBlocks.value = shuffleArray([...q.value.words])
  } else {
    availableBlocks.value = []
  }
}

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

function handleBlockClick(word: string, index: number) {
  if (store.currentState !== 'PLAYING') return

  selectedBlocks.value.push(word)
  availableBlocks.value.splice(index, 1)

  if (availableBlocks.value.length === 0) {
    checkSequenceAnswer()
  }
}

function handleUndoBlock(index: number) {
  if (store.currentState !== 'PLAYING') return

  const word = selectedBlocks.value[index]
  selectedBlocks.value.splice(index, 1)
  availableBlocks.value.push(word)
}

function resetSequence() {
  if (store.currentState !== 'PLAYING') return
  if (!q.value?.words) return
  selectedBlocks.value = []
  availableBlocks.value = shuffleArray([...q.value.words])
}

function checkSequenceAnswer() {
  const assembled = selectedBlocks.value.join(' ')
  const isCorrect = assembled === q.value?.correct

  setTimeout(() => {
    if (isCorrect) {
      store.handleCorrectAnswer(120)
    } else {
      store.handleWrongAnswer({
        questionTitle: `Susun Balok SPOK: Pola ${q.value?.pattern || 'Kalimat'}`,
        userAttempt: assembled,
        correctAnswer: q.value?.correct || '',
        explanation: q.value?.explanation || 'Susunlah balok mengikuti urutan Subjek (Pelaku), Predikat (Kerja), Objek (Penderita), dan Keterangan.',
      })
      resetSequence()
    }
  }, 400)
}

function handleChoiceSelect(choice: string) {
  if (store.currentState !== 'PLAYING' || isChoiceSubmitted.value) return

  selectedChoice.value = choice
  isChoiceSubmitted.value = true

  const isCorrect = choice === q.value?.correct

  setTimeout(() => {
    if (isCorrect) {
      store.handleCorrectAnswer(100)
    } else {
      store.handleWrongAnswer({
        questionTitle: `Kalimat Efektif: "${q.value?.sentence}"`,
        userAttempt: choice,
        correctAnswer: q.value?.correct || '',
        explanation: q.value?.explanation || 'Perhatikan subjek dan kata kerja aktif/pasif yang sesuai kaidah tata bahasa.',
      })
    }

    selectedChoice.value = null
    isChoiceSubmitted.value = false
  }, 450)
}
</script>

<template>
  <div class="flex flex-col justify-between h-full w-full gap-4 sm:gap-6">
    <!-- Instruksi Modul SPOK -->
    <div class="bg-rose-50 border-2 border-rose-200 rounded-3xl p-3 sm:p-4 text-rose-950 shadow-sm flex items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <div class="p-2.5 bg-rose-500 text-white rounded-2xl shadow shrink-0 hidden sm:block">
          <Blocks class="w-5 h-5" />
        </div>
        <div>
          <span class="text-xs font-black uppercase tracking-wider text-rose-700 font-fredoka">Misi Pola Kalimat:</span>
          <p class="text-sm sm:text-base font-bold font-fredoka leading-snug">
            {{ q?.instruction }}
          </p>
        </div>
      </div>

      <!-- Tombol Reset jika dalam mode susun balok -->
      <button
        v-if="isSequenceMode && selectedBlocks.length > 0"
        type="button"
        @click="resetSequence"
        class="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-rose-200 hover:bg-rose-300 border-b-2 border-rose-300 text-rose-900 text-xs font-black transition-all active:translate-y-0.5 shadow-sm font-fredoka"
        title="Ulangi Balok"
      >
        <RotateCcw class="w-3.5 h-3.5" />
        <span class="hidden sm:inline">Ulangi</span>
      </button>
    </div>

    <!-- TAMPILAN MODE 1: SUSUN BALOK KATA (SEQUENCE MODE) -->
    <div v-if="isSequenceMode" class="flex-1 flex flex-col justify-between gap-4">
      <!-- Area Wadah Kalimat yang Terbentuk -->
      <div class="min-h-[110px] sm:min-h-[130px] p-4 bg-gradient-to-b from-rose-50 to-white border-4 border-dashed border-rose-200 rounded-3xl flex flex-col items-center justify-center text-center shadow-inner relative">
        <span class="text-[11px] font-black uppercase tracking-wider text-rose-400 absolute top-2 left-4 font-fredoka">
          Hasil Rangkaian (Ketuk balok untuk melepas):
        </span>

        <div v-if="selectedBlocks.length > 0" class="flex flex-wrap gap-2 justify-center items-center mt-3">
          <button
            v-for="(word, idx) in selectedBlocks"
            :key="idx"
            type="button"
            @click="handleUndoBlock(idx)"
            class="px-4 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 border-b-4 border-rose-700 text-white font-fredoka font-black text-sm sm:text-base md:text-lg shadow-md active:translate-y-0.5 transition-transform flex items-center gap-1.5 animate-pop"
          >
            <span>{{ word }}</span>
            <span class="text-rose-200 text-xs font-mono font-bold">✕</span>
          </button>
        </div>

        <div v-else class="text-slate-400 text-xs sm:text-sm italic font-medium mt-3 font-nunito">
          Ketuk balok-balok di bawah secara berurutan sesuai pola kalimat...
        </div>
      </div>

      <!-- Bank Balok Kata Tersedia (Chunky Tiles) -->
      <div class="flex-1 flex flex-col items-center justify-center p-4 bg-rose-50/50 border-2 border-rose-200 rounded-3xl min-h-[120px]">
        <span class="text-[11px] font-black uppercase tracking-wider text-rose-700 mb-3 block font-fredoka">
          Pilihan Balok Kata:
        </span>
        <div class="flex flex-wrap gap-2.5 sm:gap-3.5 justify-center">
          <button
            v-for="(word, idx) in availableBlocks"
            :key="idx"
            type="button"
            @click="handleBlockClick(word, idx)"
            class="min-h-[48px] sm:min-h-[52px] px-4 py-2.5 rounded-2xl bg-white hover:bg-rose-50 text-slate-800 border-2 border-rose-300 border-b-4 hover:border-rose-400 active:border-b-2 active:translate-y-1 font-black font-fredoka text-sm sm:text-base md:text-lg shadow-md transition-all touch-manipulation select-none"
          >
            {{ word }}
          </button>
        </div>
      </div>
    </div>

    <!-- TAMPILAN MODE 2: PILIHAN GANDA STRUKTUR / PASIF (CHOICE MODE) -->
    <div v-else class="flex-1 flex flex-col justify-between gap-4">
      <!-- Kalimat Acuan -->
      <div class="p-5 bg-gradient-to-b from-rose-50/70 to-white border-4 border-rose-200 rounded-3xl shadow-sm text-center flex flex-col justify-center items-center min-h-[110px]">
        <span class="text-xs uppercase font-black tracking-widest text-rose-700 bg-rose-100 px-3.5 py-0.5 rounded-full mb-2 font-fredoka">
          Kalimat Asal
        </span>
        <p class="text-base sm:text-2xl font-black text-slate-800 font-fredoka">
          {{ q?.sentence }}
        </p>
      </div>

      <!-- Opsi Jawaban Chunky 3D (Responsive Grid) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <button
          v-for="opt in q?.options"
          :key="opt"
          type="button"
          @click="handleChoiceSelect(opt)"
          class="min-h-[50px] sm:min-h-[56px] px-4 py-3 rounded-2xl font-black font-fredoka text-sm sm:text-base transition-all duration-100 flex items-center justify-between shadow-md border-2 border-b-4 active:border-b-2 active:translate-y-1 touch-manipulation select-none text-left"
          :class="[
            isChoiceSubmitted && opt === q?.correct
              ? 'bg-emerald-500 border-emerald-600 border-b-emerald-700 text-white'
              : isChoiceSubmitted && selectedChoice === opt && opt !== q?.correct
              ? 'bg-rose-500 border-rose-600 border-b-rose-700 text-white animate-shake'
              : 'bg-white hover:bg-rose-50 text-slate-800 border-rose-200 border-b-rose-300 hover:border-rose-400'
          ]"
        >
          <span class="flex-1 leading-snug">
            {{ opt }}
          </span>
          <span class="w-6 flex justify-end shrink-0 ml-2">
            <Check v-if="isChoiceSubmitted && opt === q?.correct" class="w-5 h-5 text-white stroke-[3]" />
            <X v-else-if="isChoiceSubmitted && selectedChoice === opt && opt !== q?.correct" class="w-5 h-5 text-white stroke-[3]" />
          </span>
        </button>
      </div>
    </div>

    <!-- Footnote Hint -->
    <div class="text-center text-xs text-slate-500 font-bold flex items-center justify-center gap-1 font-fredoka">
      <HelpCircle class="w-4 h-4 text-rose-500" />
      <span>Pola SPOK: Subjek (Siapa), Predikat (Melakukan apa), Objek (Dikenai apa), Keterangan (Di mana/Kapan).</span>
    </div>
  </div>
</template>
