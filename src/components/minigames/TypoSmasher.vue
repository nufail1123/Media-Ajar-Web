<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useGameStore } from '../../stores/gameStore'
import { CheckCircle2, Sparkles, HelpCircle } from 'lucide-vue-next'

const store = useGameStore()

interface TokenState {
  word: string
  isError: boolean
  correct?: string
  hint?: string
  isFixed: boolean
  shaking: boolean
}

const currentTokens = ref<TokenState[]>([])

// Initialize or update tokens when current question changes
watch(
  () => store.currentQuestionIndex,
  () => {
    initQuestion()
  },
  { immediate: true }
)

function initQuestion() {
  const q = store.currentQuestion
  if (!q || !q.tokens) return
  currentTokens.value = q.tokens.map((t: any) => ({
    ...t,
    isFixed: false,
    shaking: false,
  }))
}

const totalErrors = computed(() => {
  return currentTokens.value.filter((t) => t.isError).length
})

const fixedErrorsCount = computed(() => {
  return currentTokens.value.filter((t) => t.isError && t.isFixed).length
})

const remainingErrors = computed(() => {
  return totalErrors.value - fixedErrorsCount.value
})

function handleTokenClick(index: number) {
  if (store.currentState !== 'PLAYING') return
  const token = currentTokens.value[index]
  if (!token) return

  // Sudah diperbaiki, abaikan
  if (token.isFixed) return

  if (token.isError) {
    // Menemukan kata yang salah!
    token.isFixed = true

    // Cek apakah seluruh kesalahan dalam kalimat ini sudah ditemukan
    if (remainingErrors.value === 0) {
      store.handleCorrectAnswer(120)
    } else {
      // Masih ada kesalahan lain
      store.handleCorrectAnswer(60)
    }
  } else {
    // Kata ini sebenarnya sudah benar, siswa salah ketuk
    token.shaking = true
    setTimeout(() => {
      token.shaking = false
    }, 400)

    store.handleWrongAnswer({
      questionTitle: 'Detektif Typo: Kata Sudah Tepat',
      userAttempt: `Kamu mengetuk kata "${token.word}"`,
      correctAnswer: 'Kata tersebut sudah benar ejaannya',
      explanation: 'Carilah kata atau tanda baca yang benar-benar keliru, seperti huruf kecil di nama orang/tempat atau koma yang tertinggal.',
    })
  }
}
</script>

<template>
  <div class="flex flex-col justify-between h-full w-full gap-4 sm:gap-6">
    <!-- Instruksi & Indikator Sisa Kesalahan -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-2 bg-amber-50 border-2 border-amber-300 rounded-3xl p-3 sm:p-4 text-amber-950 shadow-sm">
      <div class="flex items-center gap-2.5 text-center sm:text-left">
        <div class="w-10 h-10 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-black shrink-0 hidden sm:flex shadow-sm">
          <Sparkles class="w-5 h-5 text-amber-950" />
        </div>
        <div>
          <h2 class="text-xs font-black uppercase tracking-wider text-amber-800 font-fredoka">Misi Detektif:</h2>
          <p class="text-sm sm:text-base font-bold font-fredoka leading-tight text-amber-950">
            {{ store.currentQuestion?.instruction || 'Ketuk kata yang salah ejaannya!' }}
          </p>
        </div>
      </div>

      <div class="inline-flex items-center gap-1.5 bg-orange-500 border-b-2 border-orange-700 text-white px-3.5 py-1 rounded-full text-xs sm:text-sm font-black shadow font-fredoka shrink-0">
        <span>Kesalahan:</span>
        <span class="bg-orange-700 px-2 py-0.5 rounded-full text-amber-200">
          {{ remainingErrors }} tersisa
        </span>
      </div>
    </div>

    <!-- Area Kalimat & Token Interaktif (Chunky Candy Tiles) -->
    <div class="flex-1 flex flex-col justify-center items-center py-5 sm:py-8 px-3 sm:px-6 bg-[#fef9ee] border-4 border-amber-200 rounded-3xl shadow-inner min-h-[180px] sm:min-h-[220px]">
      <div class="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 max-w-2xl">
        <button
          v-for="(token, idx) in currentTokens"
          :key="idx"
          type="button"
          @click="handleTokenClick(idx)"
          class="relative px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-base sm:text-xl md:text-2xl font-black font-fredoka transition-all duration-150 min-h-[48px] touch-manipulation select-none border-2 border-b-4 shadow-md"
          :class="[
            token.isFixed
              ? 'bg-emerald-500 border-emerald-600 border-b-emerald-700 text-white scale-105'
              : 'bg-white hover:bg-amber-100 text-slate-800 border-amber-300 border-b-amber-400 active:border-b-2 active:translate-y-1',
            token.shaking ? 'animate-shake bg-rose-100 text-rose-800 border-rose-400 border-b-rose-500' : ''
          ]"
        >
          <!-- Teks kata / yang sudah diperbaiki -->
          <span :class="{'line-through opacity-70 text-sm block': token.isFixed && token.correct}">
            {{ token.word }}
          </span>

          <span v-if="token.isFixed && token.correct" class="font-black text-white flex items-center justify-center gap-1">
            <CheckCircle2 class="w-4 h-4 inline text-emerald-200" />
            {{ token.correct }}
          </span>

          <!-- Efek Badge saat Sukses Diperbaiki -->
          <span
            v-if="token.isFixed"
            class="absolute -top-2.5 -right-2 bg-emerald-700 text-[10px] text-white px-2 py-0.5 rounded-full font-black border border-white shadow"
          >
            TEPAT!
          </span>
        </button>
      </div>

      <!-- Hint edukasi di bawah jika ada yang sudah diperbaiki -->
      <div
        v-if="fixedErrorsCount > 0"
        class="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-amber-900 font-fredoka"
      >
        <span class="inline-flex items-center gap-1 bg-amber-200/80 px-3 py-1 rounded-xl">
          <CheckCircle2 class="w-4 h-4 text-emerald-600" />
          {{ fixedErrorsCount }} dari {{ totalErrors }} kesalahan berhasil ditemukan!
        </span>
      </div>
    </div>

    <!-- Petunjuk Ramah Siswa -->
    <div class="text-center text-xs text-slate-500 font-bold flex items-center justify-center gap-1.5 font-fredoka">
      <HelpCircle class="w-4 h-4 text-amber-500" />
      <span>Perhatikan huruf kapital pada nama orang, tempat, awal kalimat, serta tanda baca koma.</span>
    </div>
  </div>
</template>
