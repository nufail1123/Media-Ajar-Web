<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '../../stores/gameStore'
import { Hammer, Check, X, HelpCircle } from 'lucide-vue-next'

const store = useGameStore()

const q = computed(() => store.currentQuestion)
const selectedOption = ref<string | null>(null)
const isSubmitted = ref(false)

function handleSelectOption(option: string) {
  if (store.currentState !== 'PLAYING' || isSubmitted.value) return

  selectedOption.value = option
  isSubmitted.value = true

  const isCorrect = option === q.value?.correct

  setTimeout(() => {
    if (isCorrect) {
      store.handleCorrectAnswer(100)
    } else {
      store.handleWrongAnswer({
        questionTitle: `Pabrik Imbuhan: Kata "${q.value?.baseWord}"`,
        userAttempt: `${option} + ${q.value?.baseWord}`,
        correctAnswer: `${q.value?.correct} + ${q.value?.baseWord} = ${q.value?.resultWord}`,
        explanation: q.value?.explanation || 'Pilihlah imbuhan yang sesuai kaidah morfologi kalimat.',
      })
    }

    selectedOption.value = null
    isSubmitted.value = false
  }, 450)
}
</script>

<template>
  <div class="flex flex-col justify-between h-full w-full gap-4 sm:gap-6">
    <!-- Instruksi Modul Morfologi -->
    <div class="bg-purple-50 border-2 border-purple-200 rounded-3xl p-3 sm:p-4 text-purple-950 shadow-sm flex items-center gap-3">
      <div class="p-2.5 bg-purple-500 text-white rounded-2xl shadow shrink-0 hidden sm:block">
        <Hammer class="w-5 h-5" />
      </div>
      <div>
        <span class="text-xs font-black uppercase tracking-wider text-purple-700 font-fredoka">Misi Morfologi:</span>
        <p class="text-sm sm:text-base font-bold font-fredoka leading-snug">
          {{ q?.instruction || 'Pilihlah imbuhan yang tepat!' }}
        </p>
      </div>
    </div>

    <!-- Kartu Tengah: Kata Dasar & Kalimat Konteks -->
    <div class="flex-1 flex flex-col justify-center items-center py-5 sm:py-8 px-4 bg-gradient-to-b from-purple-100/50 via-purple-50/40 to-white border-4 border-purple-200 rounded-3xl shadow-sm text-center">
      <!-- Label Kata Dasar -->
      <span class="text-xs uppercase font-black tracking-widest text-purple-700 bg-purple-100 px-3.5 py-1 rounded-full mb-2 font-fredoka">
        Kata Dasar
      </span>

      <!-- Kata Dasar Raksasa Kartun -->
      <h3 class="text-3xl sm:text-5xl font-black font-fredoka text-purple-950 tracking-wide drop-shadow-sm mb-4">
        "{{ q?.baseWord }}"
      </h3>

      <!-- Kalimat Berlubang [...] -->
      <div class="bg-white px-5 py-3.5 rounded-2xl border-2 border-purple-200 shadow-sm max-w-lg">
        <p class="text-sm sm:text-lg font-bold text-slate-800 leading-relaxed font-nunito">
          <span v-if="isSubmitted && selectedOption === q?.correct" class="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-300">
            {{ q?.resultWord }}
          </span>
          <span v-else>
            {{ q?.context }}
          </span>
        </p>
      </div>
    </div>

    <!-- Tombol Pilihan Imbuhan Chunky 3D (1 kolom di HP, 2 kolom di tablet/PC) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      <button
        v-for="opt in q?.options"
        :key="opt"
        type="button"
        @click="handleSelectOption(opt)"
        class="min-h-[50px] sm:min-h-[56px] px-4 py-3 rounded-2xl font-black font-fredoka text-base sm:text-lg transition-all duration-100 flex items-center justify-between shadow-md border-2 border-b-4 active:border-b-2 active:translate-y-1 touch-manipulation select-none"
        :class="[
          isSubmitted && opt === q?.correct
            ? 'bg-emerald-500 border-emerald-600 border-b-emerald-700 text-white'
            : isSubmitted && selectedOption === opt && opt !== q?.correct
            ? 'bg-rose-500 border-rose-600 border-b-rose-700 text-white animate-shake'
            : 'bg-white hover:bg-purple-50 text-slate-800 border-purple-200 border-b-purple-300 hover:border-purple-400'
        ]"
      >
        <span class="text-purple-700 font-black text-xs sm:text-sm bg-purple-100 px-2 py-0.5 rounded-lg">
          Imbuhan
        </span>
        <span class="text-lg sm:text-xl font-black flex-1 text-center">
          + {{ opt }}
        </span>
        <span class="w-5 flex justify-end">
          <Check v-if="isSubmitted && opt === q?.correct" class="w-5 h-5 text-white stroke-[3]" />
          <X v-else-if="isSubmitted && selectedOption === opt && opt !== q?.correct" class="w-5 h-5 text-white stroke-[3]" />
        </span>
      </button>
    </div>

    <!-- Petunjuk Ramah Siswa -->
    <div class="text-center text-xs text-slate-500 font-bold flex items-center justify-center gap-1 font-fredoka">
      <HelpCircle class="w-4 h-4 text-purple-500" />
      <span>Perhatikan apakah kalimat memerlukan kata kerja aktif (me-), pasif (di-), atau kata benda (pe-).</span>
    </div>
  </div>
</template>
