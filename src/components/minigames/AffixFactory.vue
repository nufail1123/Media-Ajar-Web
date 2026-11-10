<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '../../stores/gameStore'
import { Hammer, Check, X } from 'lucide-vue-next'

const store = useGameStore()
const selectedOption = ref<string | null>(null)
const isSubmitted = ref(false)

const q = computed(() => store.currentQuestion)

function handleSelectOption(opt: string) {
  if (store.currentState !== 'PLAYING' || isSubmitted.value) return
  selectedOption.value = opt
  isSubmitted.value = true

  if (opt === q.value.correct) {
    store.handleCorrectAnswer(100)
  } else {
    store.handleWrongAnswer({
      questionTitle: 'Pabrik Imbuhan: Imbuhan Belum Tepat',
      userAttempt: `Kamu memilih imbuhan "${opt}"`,
      correctAnswer: `Imbuhan yang tepat: "${q.value.correct}" (membentuk kata "${q.value.resultWord}")`,
      explanation: q.value.note || 'Perhatikan fungsi awalan, akhiran, atau konfiks dalam membentuk makna kata baru.',
    })
  }

  // Reset local state after transition
  setTimeout(() => {
    selectedOption.value = null
    isSubmitted.value = false
  }, 500)
}
</script>

<template>
  <div class="flex flex-col justify-between h-full w-full gap-4 sm:gap-6">
    <!-- Header Instruksi Pabrik Imbuhan -->
    <div class="bg-amber-50 border border-amber-200 rounded-2xl p-3 sm:p-4 text-amber-900 shadow-sm flex items-center gap-3">
      <div class="p-2.5 bg-amber-500 text-white rounded-xl shadow shrink-0 hidden sm:block">
        <Hammer class="w-5 h-5" />
      </div>
      <div>
        <span class="text-xs font-black uppercase tracking-wider text-amber-700">Misi Morfologi:</span>
        <p class="text-sm sm:text-base font-bold font-fredoka leading-snug">
          {{ q?.instruction || 'Pilihlah imbuhan yang tepat!' }}
        </p>
      </div>
    </div>

    <!-- Kartu Tengah: Kata Dasar & Kalimat Konteks -->
    <div class="flex-1 flex flex-col justify-center items-center py-5 sm:py-8 px-4 bg-gradient-to-b from-amber-500/10 via-amber-50/50 to-white border-2 border-amber-300 rounded-2xl sm:rounded-3xl shadow-sm text-center">
      <!-- Label Kata Dasar -->
      <span class="text-xs uppercase font-extrabold tracking-widest text-amber-700 bg-amber-100 px-3 py-1 rounded-full mb-2">
        Kata Dasar
      </span>

      <!-- Kata Dasar Raksasa Kartun -->
      <h3 class="text-3xl sm:text-5xl font-black font-fredoka text-amber-600 tracking-wide drop-shadow-sm mb-4">
        "{{ q?.baseWord }}"
      </h3>

      <!-- Kalimat Berlubang [...] -->
      <div class="bg-white px-4 py-3 rounded-2xl border border-amber-200/90 shadow-sm max-w-lg">
        <p class="text-sm sm:text-lg font-semibold text-slate-700 leading-relaxed">
          <span v-if="isSubmitted && selectedOption === q?.correct" class="font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-300">
            {{ q?.resultWord }}
          </span>
          <span v-else>
            {{ q?.context }}
          </span>
        </p>
      </div>
    </div>

    <!-- Tombol Pilihan Imbuhan (Ergonomis, 1 kolom di HP, 2 kolom di tablet/PC) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
      <button
        v-for="opt in q?.options"
        :key="opt"
        type="button"
        @click="handleSelectOption(opt)"
        class="min-h-[48px] sm:min-h-[56px] px-4 py-3 rounded-2xl font-bold font-fredoka text-base sm:text-lg transition-all duration-150 flex items-center justify-between shadow-sm active:scale-95 touch-manipulation select-none"
        :class="[
          isSubmitted && opt === q?.correct
            ? 'bg-emerald-500 text-white ring-4 ring-emerald-300 shadow-md scale-102'
            : isSubmitted && selectedOption === opt && opt !== q?.correct
            ? 'bg-rose-500 text-white ring-4 ring-rose-300 animate-shake'
            : 'bg-white hover:bg-amber-50 text-slate-800 border-2 border-slate-200 hover:border-amber-400 hover:shadow-md'
        ]"
      >
        <span class="text-amber-600 font-black text-xs sm:text-sm bg-amber-100 px-2 py-0.5 rounded-md">
          Imbuhan
        </span>
        <span class="text-lg sm:text-xl font-extrabold flex-1 text-center">
          + {{ opt }}
        </span>
        <span class="w-5 flex justify-end">
          <Check v-if="isSubmitted && opt === q?.correct" class="w-5 h-5 text-white" />
          <X v-else-if="isSubmitted && selectedOption === opt && opt !== q?.correct" class="w-5 h-5 text-white" />
        </span>
      </button>
    </div>
  </div>
</template>
