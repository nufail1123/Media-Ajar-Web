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
    <div class="flex flex-col sm:flex-row items-center justify-between gap-2 bg-emerald-50 border border-emerald-200 rounded-2xl p-3 sm:p-4 text-emerald-900 shadow-sm">
      <div class="flex items-center gap-2 text-center sm:text-left">
        <Sparkles class="w-5 h-5 text-emerald-600 shrink-0 hidden sm:block" />
        <div>
          <h2 class="text-xs sm:text-sm font-black uppercase tracking-wider text-emerald-700">Misi Detektif:</h2>
          <p class="text-sm sm:text-base font-bold font-fredoka leading-tight">
            {{ store.currentQuestion?.instruction || 'Ketuk kata yang salah ejaannya!' }}
          </p>
        </div>
      </div>

      <div class="inline-flex items-center gap-1.5 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-extrabold shadow font-fredoka shrink-0">
        <span>Kesalahan:</span>
        <span class="bg-emerald-800 px-2 py-0.5 rounded-full text-amber-300">
          {{ remainingErrors }} tersisa
        </span>
      </div>
    </div>

    <!-- Area Kalimat & Token Interaktif -->
    <div class="flex-1 flex flex-col justify-center items-center py-4 sm:py-8 px-2 sm:px-4 bg-slate-50 border-2 border-dashed border-emerald-300/80 rounded-2xl sm:rounded-3xl shadow-inner min-h-[180px] sm:min-h-[220px]">
      <div class="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-2xl">
        <button
          v-for="(token, idx) in currentTokens"
          :key="idx"
          type="button"
          @click="handleTokenClick(idx)"
          class="relative px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-base sm:text-xl md:text-2xl font-bold font-nunito transition-all duration-200 min-h-[48px] touch-manipulation select-none"
          :class="[
            token.isFixed
              ? 'bg-emerald-500 text-white shadow-md ring-2 ring-emerald-300 scale-105'
              : 'bg-white hover:bg-emerald-100/70 text-slate-800 shadow-sm hover:shadow border border-slate-200 hover:border-emerald-400 active:scale-95',
            token.shaking ? 'animate-shake bg-rose-100 text-rose-700 border-rose-400' : ''
          ]"
        >
          <!-- Teks kata / yang sudah diperbaiki -->
          <span :class="{'line-through opacity-70 text-sm block': token.isFixed && token.correct}">
            {{ token.isFixed && token.correct ? token.word : token.word }}
          </span>

          <span v-if="token.isFixed && token.correct" class="font-extrabold text-white flex items-center justify-center gap-1">
            <CheckCircle2 class="w-4 h-4 inline text-emerald-200" />
            {{ token.correct }}
          </span>

          <!-- Efek Badge saat Sukses Diperbaiki -->
          <span
            v-if="token.isFixed"
            class="absolute -top-2 -right-2 bg-emerald-600 text-[10px] text-white px-1.5 py-0.2 rounded-full font-black border border-white shadow"
          >
            FIXED
          </span>
        </button>
      </div>

      <!-- Hint edukasi di bawah jika ada yang sudah diperbaiki -->
      <div
        v-if="fixedErrorsCount > 0"
        class="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-emerald-800"
      >
        <span class="inline-flex items-center gap-1 bg-emerald-100/80 px-2.5 py-1 rounded-lg">
          <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600" />
          {{ fixedErrorsCount }} dari {{ totalErrors }} kesalahan berhasil kamu temukan!
        </span>
      </div>
    </div>

    <!-- Petunjuk Ramah Siswa -->
    <div class="text-center text-xs text-slate-400 font-medium flex items-center justify-center gap-1.5">
      <HelpCircle class="w-4 h-4 text-emerald-500" />
      <span>Perhatikan huruf kapital pada nama orang, kota, awal kalimat, serta tanda baca perincian.</span>
    </div>
  </div>
</template>
