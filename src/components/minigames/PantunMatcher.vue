<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useGameStore } from '../../stores/gameStore'
import { Scroll, Sparkles, Check, X, HelpCircle } from 'lucide-vue-next'

const store = useGameStore()

const q = computed(() => store.currentQuestion)
const selectedIndex = ref<number | null>(null)
const isSubmitted = ref(false)

interface PantunOptionItem {
  pair: [string, string]
  isCorrect: boolean
}

const shuffledOptions = ref<PantunOptionItem[]>([])
const optionLetters = ['A', 'B', 'C', 'D']

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

watch(
  () => store.currentQuestionIndex,
  () => {
    selectedIndex.value = null
    isSubmitted.value = false
    if (q.value?.options) {
      const correctIdx = q.value.correctIndex ?? 0
      const items: PantunOptionItem[] = q.value.options.map(
        (pair: [string, string], idx: number) => ({
          pair,
          isCorrect: idx === correctIdx,
        })
      )
      shuffledOptions.value = shuffleArray(items)
    } else {
      shuffledOptions.value = []
    }
  },
  { immediate: true }
)

function handleSelect(index: number) {
  if (store.currentState !== 'PLAYING' || isSubmitted.value) return

  selectedIndex.value = index
  isSubmitted.value = true

  const chosen = shuffledOptions.value[index]
  const isCorrect = chosen?.isCorrect ?? false

  setTimeout(() => {
    if (isCorrect) {
      store.handleCorrectAnswer(120)
    } else {
      const correctItem = shuffledOptions.value.find((item) => item.isCorrect)
      const correctPairStr = correctItem?.pair.join(' / ') || ''
      const userAttemptStr = chosen?.pair.join(' / ') || ''

      store.handleWrongAnswer({
        questionTitle: `Sastra Pantun: "${q.value?.sampiran?.[0]}"`,
        userAttempt: userAttemptStr,
        correctAnswer: correctPairStr,
        explanation:
          q.value?.explanation ||
          'Ingat rima pantun berpola a-b-a-b, baris ke-3 berima dengan baris ke-1, baris ke-4 berima dengan baris ke-2.',
      })
    }

    selectedIndex.value = null
    isSubmitted.value = false
  }, 450)
}
</script>

<template>
  <div class="flex flex-col justify-between h-full w-full gap-4 sm:gap-6">
    <!-- Instruksi Modul Pantun -->
    <div class="bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-3 sm:p-4 text-emerald-950 shadow-sm flex items-center gap-3">
      <div class="p-2.5 bg-emerald-500 text-white rounded-2xl shadow shrink-0 hidden sm:block">
        <Scroll class="w-5 h-5" />
      </div>
      <div>
        <span class="text-xs font-black uppercase tracking-wider text-emerald-700 font-fredoka">Misi Sastra Pantun:</span>
        <p class="text-sm sm:text-base font-bold font-fredoka leading-snug">
          {{ q?.instruction || 'Pilihlah baris isi pantun yang rimanya selaras (a-b-a-b)!' }}
        </p>
      </div>
    </div>

    <!-- Tampilan Sampiran (Baris 1 & 2) -->
    <div class="bg-gradient-to-b from-emerald-100/50 via-emerald-50/40 to-white border-4 border-emerald-200 rounded-3xl p-4 sm:p-6 shadow-sm text-center flex flex-col items-center justify-center relative">
      <span class="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3.5 py-1 rounded-full mb-3 font-fredoka">
        Sampiran (Baris 1 & 2)
      </span>

      <div class="space-y-1 sm:space-y-2">
        <p class="text-base sm:text-xl font-black text-slate-800 font-fredoka">
          {{ q?.sampiran?.[0] }}
        </p>
        <p class="text-base sm:text-xl font-black text-slate-800 font-fredoka">
          {{ q?.sampiran?.[1] }}
        </p>
      </div>

      <!-- Garis Pemisah Pantun -->
      <div class="mt-4 flex items-center justify-center gap-2 text-emerald-500">
        <div class="h-0.5 w-12 bg-emerald-200 rounded-full" />
        <Sparkles class="w-4 h-4 text-emerald-500" />
        <div class="h-0.5 w-12 bg-emerald-200 rounded-full" />
      </div>

      <span class="text-[11px] font-bold text-slate-500 mt-2 font-fredoka">
        Pilihlah pasangan Baris 3 & 4 (Isi Pantun) di bawah ini:
      </span>
    </div>

    <!-- Pilihan Pasangan Baris Isi (Chunky 3D Buttons Acak ABCD) -->
    <div class="flex flex-col gap-3 sm:gap-3.5">
      <button
        v-for="(item, idx) in shuffledOptions"
        :key="idx"
        type="button"
        @click="handleSelect(idx)"
        class="min-h-[52px] sm:min-h-[60px] p-3 sm:p-4 rounded-2xl font-nunito transition-all duration-100 flex items-center justify-between shadow-md active:border-b-2 active:translate-y-1 touch-manipulation select-none text-left border-2 border-b-4"
        :class="[
          isSubmitted && item.isCorrect
            ? 'bg-emerald-500 border-emerald-600 border-b-emerald-700 text-white'
            : isSubmitted && selectedIndex === idx && !item.isCorrect
            ? 'bg-rose-500 border-rose-600 border-b-rose-700 text-white animate-shake'
            : 'bg-white hover:bg-emerald-50 text-slate-800 border-emerald-200 border-b-emerald-300 hover:border-emerald-400'
        ]"
      >
        <div class="flex items-center gap-3 flex-1">
          <!-- Lencana ABCD Acak -->
          <span
            class="w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center font-fredoka shadow-sm shrink-0"
            :class="[
              isSubmitted && (item.isCorrect || selectedIndex === idx)
                ? 'bg-white/20 text-white'
                : 'bg-emerald-200 text-emerald-900'
            ]"
          >
            {{ optionLetters[idx] || idx + 1 }}
          </span>

          <div class="flex flex-col leading-snug flex-1">
            <span
              class="text-xs sm:text-sm font-semibold"
              :class="isSubmitted && (item.isCorrect || selectedIndex === idx) ? 'text-white/90' : 'text-slate-600'"
            >
              {{ item.pair[0] }}
            </span>
            <span
              class="text-xs sm:text-sm font-black font-fredoka"
              :class="isSubmitted && (item.isCorrect || selectedIndex === idx) ? 'text-white' : 'text-slate-900'"
            >
              {{ item.pair[1] }}
            </span>
          </div>
        </div>

        <div class="w-6 flex justify-end shrink-0 ml-3">
          <Check v-if="isSubmitted && item.isCorrect" class="w-5 h-5 text-white stroke-[3]" />
          <X v-else-if="isSubmitted && selectedIndex === idx && !item.isCorrect" class="w-5 h-5 text-white stroke-[3]" />
        </div>
      </button>
    </div>

    <!-- Hint Footnote -->
    <div class="text-center text-xs text-slate-500 font-bold flex items-center justify-center gap-1 font-fredoka">
      <HelpCircle class="w-4 h-4 text-emerald-500" />
      <span>Rima pantun adalah pola silang a-b-a-b (suku kata ujung baris 1 = 3, baris 2 = 4).</span>
    </div>
  </div>
</template>
