import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import questionsData from '../data/questions.json'
import { audioService } from '../services/audio.ts'

export type GameState = 'MENU' | 'COUNTDOWN' | 'PLAYING' | 'ROUND_FEEDBACK' | 'STAGE_CLEAR' | 'GAME_OVER'

export type StageId = 'ejaan' | 'imbuhan' | 'semantik' | 'spok' | 'pantun'

export interface StageInfo {
  id: StageId
  title: string
  subtitle: string
  description: string
  color: string
  badgeColor: string
  icon: string
  gradient: string
  cardBg: string
  badgeBg: string
  titleColor: string
  subtitleColor: string
  descColor: string
  buttonColor: string
  lockedBtnColor: string
  lockedText: string
}

export const STAGES: StageInfo[] = [
  {
    id: 'ejaan',
    title: 'Detektif Typo',
    subtitle: 'MODUL 1: EJAAN & KAPITAL',
    description: 'Temukan dan perbaiki kesalahan huruf kapital serta tanda baca pada kalimat.',
    color: 'amber',
    badgeColor: 'bg-amber-400',
    icon: 'Search',
    gradient: 'from-amber-400 to-orange-500',
    cardBg: 'bg-[#fef3c7] border-[#fcd34d]',
    badgeBg: 'bg-[#fed7aa] text-[#9a3412] border-amber-300',
    titleColor: 'text-amber-950',
    subtitleColor: 'text-[#9a3412]',
    descColor: 'text-[#78350f]',
    buttonColor: 'bg-orange-500 hover:bg-orange-400 border-orange-700 text-white',
    lockedBtnColor: 'bg-amber-200/80 border-amber-300 text-amber-800',
    lockedText: '',
  },
  {
    id: 'imbuhan',
    title: 'Pabrik Imbuhan',
    subtitle: 'MODUL 2: MORFOLOGI KATA',
    description: 'Pilih imbuhan (me-, di-, pe-, ke-an) yang sesuai konteks makna kalimat.',
    color: 'purple',
    badgeColor: 'bg-purple-400',
    icon: 'Hammer',
    gradient: 'from-purple-400 to-indigo-600',
    cardBg: 'bg-[#ede9fe] border-[#c4b5fd]',
    badgeBg: 'bg-[#ddd6fe] text-[#6b21a8] border-purple-300',
    titleColor: 'text-purple-950',
    subtitleColor: 'text-[#6b21a8]',
    descColor: 'text-[#581c87]',
    buttonColor: 'bg-purple-600 hover:bg-purple-500 border-purple-800 text-white',
    lockedBtnColor: 'bg-[#c4b5fd]/80 border-[#a78bfa] text-purple-900',
    lockedText: 'Selesaikan Modul 1 Dahulu',
  },
  {
    id: 'semantik',
    title: 'Pilah Cepat Makna',
    subtitle: 'MODUL 3: SEMANTIK & MAJAS',
    description: 'Klasifikasikan makna Denotatif vs Konotatif dan gaya bahasa (Personifikasi, Hiperbola, Metafora).',
    color: 'sky',
    badgeColor: 'bg-sky-400',
    icon: 'Layers',
    gradient: 'from-sky-400 to-blue-600',
    cardBg: 'bg-[#e0f2fe] border-[#7dd3fc]',
    badgeBg: 'bg-[#bae6fd] text-[#0369a1] border-sky-300',
    titleColor: 'text-sky-950',
    subtitleColor: 'text-[#0369a1]',
    descColor: 'text-[#0c4a6e]',
    buttonColor: 'bg-sky-500 hover:bg-sky-400 border-sky-700 text-white',
    lockedBtnColor: 'bg-[#7dd3fc]/80 border-[#38bdf8] text-sky-900',
    lockedText: 'Selesaikan Modul 2 Dahulu',
  },
  {
    id: 'spok',
    title: 'Susun Balok SPOK',
    subtitle: 'MODUL 4: KALIMAT EFEKTIF',
    description: 'Rangkai balok kata menjadi pola Subjek-Predikat-Objek-Keterangan yang utuh.',
    color: 'rose',
    badgeColor: 'bg-rose-400',
    icon: 'Blocks',
    gradient: 'from-rose-400 to-pink-600',
    cardBg: 'bg-[#fce7f3] border-[#f9a8d4]',
    badgeBg: 'bg-[#fbcfe8] text-[#be185d] border-rose-300',
    titleColor: 'text-rose-950',
    subtitleColor: 'text-[#be185d]',
    descColor: 'text-[#831843]',
    buttonColor: 'bg-rose-500 hover:bg-rose-400 border-rose-700 text-white',
    lockedBtnColor: 'bg-[#f472b6]/80 border-[#db2777] text-rose-900',
    lockedText: 'Selesaikan Modul 3 Dahulu',
  },
  {
    id: 'pantun',
    title: 'Rima Runtun',
    subtitle: 'MODUL 5: SASTRA PANTUN',
    description: 'Cocokkan sampiran dengan baris isi berima a-b-a-b yang penuh nasihat mulia.',
    color: 'emerald',
    badgeColor: 'bg-emerald-400',
    icon: 'Scroll',
    gradient: 'from-emerald-400 to-teal-600',
    cardBg: 'bg-[#d1fae5] border-[#6ee7b7]',
    badgeBg: 'bg-[#a7f3d0] text-[#047857] border-emerald-300',
    titleColor: 'text-emerald-950',
    subtitleColor: 'text-[#047857]',
    descColor: 'text-[#064e3b]',
    buttonColor: 'bg-emerald-500 hover:bg-emerald-400 border-emerald-700 text-white',
    lockedBtnColor: 'bg-[#6ee7b7]/80 border-[#10b981] text-emerald-900',
    lockedText: 'Selesaikan Modul 4 Dahulu',
  },
]

export interface LastMistake {
  questionTitle: string
  userAttempt?: string
  correctAnswer: string
  explanation: string
}

export const useGameStore = defineStore(
  'game',
  () => {
    // State
    const currentState = ref<GameState>('MENU')
    const activeStageId = ref<StageId>('ejaan')
    const countdownValue = ref<number>(3)

    const hp = ref<number>(3)
    const maxHp = ref<number>(3)
    const score = ref<number>(0)
    const displayedScore = ref<number>(0)
    const streak = ref<number>(0)
    const maxStreak = ref<number>(0)
    const currentQuestionIndex = ref<number>(0)
    const totalQuestions = ref<number>(0)
    const timeRemaining = ref<number>(60)
    const maxTime = ref<number>(60)
    const isShaking = ref<boolean>(false)
    const feedbackType = ref<'correct' | 'wrong' | null>(null)
    const lastMistake = ref<LastMistake | null>(null)
    const earnedStars = ref<number>(0)
    const timeBonus = ref<number>(0)

    // Progres Tersimpan
    const unlockedStages = ref<Record<string, number>>({ ejaan: 1 })
    const stageStars = ref<Record<string, number>>({})
    const highScores = ref<Record<string, number>>({})
    const soundEnabled = ref<boolean>(true)

    // Getters
    const multiplier = computed<number>(() => {
      if (streak.value >= 9) return 3.0
      if (streak.value >= 6) return 2.0
      if (streak.value >= 3) return 1.5
      return 1.0
    })

    const totalStars = computed<number>(() => {
      return Object.values(stageStars.value).reduce((sum, s) => sum + (s || 0), 0)
    })

    const currentQuestions = computed<any[]>(() => {
      const data = questionsData as Record<string, any[]>
      return data[activeStageId.value] || []
    })

    const currentQuestion = computed<any>(() => {
      const list = currentQuestions.value
      return list[currentQuestionIndex.value] || null
    })

    const isStageUnlocked = (stageId: StageId): boolean => {
      if (stageId === 'ejaan') return true
      return !!unlockedStages.value[stageId]
    }

    const activeStageInfo = computed<StageInfo>(() => {
      return STAGES.find((s) => s.id === activeStageId.value) || STAGES[0]
    })

    // Actions
    function toggleSound() {
      soundEnabled.value = !soundEnabled.value
      audioService.setSoundEnabled(soundEnabled.value)
      if (soundEnabled.value) {
        audioService.playTap()
      }
    }

    function setSound(val: boolean) {
      soundEnabled.value = val
      audioService.setSoundEnabled(val)
    }

    function goToMenu() {
      currentState.value = 'MENU'
      feedbackType.value = null
      lastMistake.value = null
    }

    function startStage(stageId: StageId) {
      activeStageId.value = stageId
      const list = (questionsData as Record<string, any[]>)[stageId] || []
      totalQuestions.value = list.length
      currentQuestionIndex.value = 0
      hp.value = maxHp.value
      score.value = 0
      displayedScore.value = 0
      streak.value = 0
      maxStreak.value = 0
      maxTime.value = 60 + Math.max(0, (totalQuestions.value - 4) * 10)
      timeRemaining.value = maxTime.value
      feedbackType.value = null
      lastMistake.value = null
      earnedStars.value = 0
      timeBonus.value = 0

      countdownValue.value = 3
      currentState.value = 'COUNTDOWN'
      audioService.playTap()
    }

    function tickCountdown() {
      if (countdownValue.value > 1) {
        countdownValue.value--
        audioService.playTap()
      } else {
        currentState.value = 'PLAYING'
        audioService.playTap()
      }
    }

    function tickTimer() {
      if (currentState.value !== 'PLAYING') return
      if (timeRemaining.value > 0) {
        timeRemaining.value--
        if (timeRemaining.value <= 0) {
          handleTimeout()
        }
      }
    }

    function triggerShake() {
      isShaking.value = true
      setTimeout(() => {
        isShaking.value = false
      }, 400)
    }

    function animateScoreTo(target: number) {
      const step = () => {
        if (displayedScore.value < target) {
          const diff = target - displayedScore.value
          const inc = Math.max(1, Math.ceil(diff / 6))
          displayedScore.value += inc
          requestAnimationFrame(step)
        } else {
          displayedScore.value = target
        }
      }
      requestAnimationFrame(step)
    }

    function advanceQuestion() {
      feedbackType.value = null
      if (currentQuestionIndex.value + 1 < totalQuestions.value) {
        currentQuestionIndex.value++
        currentState.value = 'PLAYING'
      } else {
        completeStage()
      }
    }

    function completeStage() {
      const maxPossibleBase = totalQuestions.value * 100 * 2.0
      const scoreRatio = score.value / (maxPossibleBase || 1)

      if (hp.value === 3 || scoreRatio >= 0.85) {
        earnedStars.value = 3
      } else if (hp.value === 2 || scoreRatio >= 0.6) {
        earnedStars.value = 2
      } else {
        earnedStars.value = 1
      }

      timeBonus.value = timeRemaining.value * 10
      score.value += timeBonus.value
      animateScoreTo(score.value)

      const currentBestStars = stageStars.value[activeStageId.value] || 0
      if (earnedStars.value > currentBestStars) {
        stageStars.value[activeStageId.value] = earnedStars.value
      }

      const currentBestScore = highScores.value[activeStageId.value] || 0
      if (score.value > currentBestScore) {
        highScores.value[activeStageId.value] = score.value
      }

      const currentIndex = STAGES.findIndex((s) => s.id === activeStageId.value)
      if (currentIndex !== -1 && currentIndex + 1 < STAGES.length) {
        const nextStage = STAGES[currentIndex + 1]
        unlockedStages.value[nextStage.id] = 1
      }

      currentState.value = 'STAGE_CLEAR'
      audioService.playVictory()
    }

    function handleCorrectAnswer(customPoints = 100) {
      streak.value++
      if (streak.value > maxStreak.value) {
        maxStreak.value = streak.value
      }

      const pointsEarned = Math.round(customPoints * multiplier.value)
      score.value += pointsEarned
      animateScoreTo(score.value)

      feedbackType.value = 'correct'

      if (streak.value >= 3 && streak.value % 3 === 0) {
        const tier = Math.min(Math.floor(streak.value / 3), 4)
        audioService.playCombo(tier)
      } else {
        audioService.playCorrect()
      }

      currentState.value = 'ROUND_FEEDBACK'
      setTimeout(() => {
        if (currentState.value === 'ROUND_FEEDBACK') {
          advanceQuestion()
        }
      }, 500)
    }

    function handleWrongAnswer(mistakeInfo?: Partial<LastMistake>) {
      streak.value = 0
      hp.value = Math.max(0, hp.value - 1)
      triggerShake()
      feedbackType.value = 'wrong'
      audioService.playWrong()

      if (mistakeInfo) {
        const q = currentQuestion.value
        lastMistake.value = {
          questionTitle: mistakeInfo.questionTitle || q?.instruction || 'Soal Saat Ini',
          userAttempt: mistakeInfo.userAttempt || 'Jawaban kurang tepat',
          correctAnswer: mistakeInfo.correctAnswer || q?.correct || 'Perhatikan instruksi soal',
          explanation: mistakeInfo.explanation || q?.explanation || q?.note || 'Pelajari kembali konsep materi ini.',
        }
      }

      if (hp.value <= 0) {
        currentState.value = 'GAME_OVER'
      } else {
        currentState.value = 'ROUND_FEEDBACK'
        setTimeout(() => {
          if (currentState.value === 'ROUND_FEEDBACK') {
            currentState.value = 'PLAYING'
            feedbackType.value = null
          }
        }, 500)
      }
    }

    function handleTimeout() {
      audioService.playWrong()
      const q = currentQuestion.value
      lastMistake.value = {
        questionTitle: 'Waktu Habis!',
        userAttempt: 'Tidak sempat menyelesaikan sebelum waktu berakhir',
        correctAnswer: q?.correct || 'Selesaikan soal lebih cepat',
        explanation: 'Konsentrasi dan gerakkan jemari lebih gesit untuk mengalahkan waktu!',
      }
      currentState.value = 'GAME_OVER'
    }

    function retryCurrentStage() {
      startStage(activeStageId.value)
    }

    function nextStage() {
      const currentIndex = STAGES.findIndex((s) => s.id === activeStageId.value)
      if (currentIndex !== -1 && currentIndex + 1 < STAGES.length) {
        const nextStage = STAGES[currentIndex + 1]
        startStage(nextStage.id)
      } else {
        goToMenu()
      }
    }

    function resetAllProgress() {
      unlockedStages.value = { ejaan: 1 }
      stageStars.value = {}
      highScores.value = {}
      goToMenu()
    }

    return {
      currentState,
      activeStageId,
      countdownValue,
      hp,
      maxHp,
      score,
      displayedScore,
      streak,
      maxStreak,
      currentQuestionIndex,
      totalQuestions,
      timeRemaining,
      maxTime,
      isShaking,
      feedbackType,
      lastMistake,
      earnedStars,
      timeBonus,
      unlockedStages,
      stageStars,
      highScores,
      soundEnabled,
      multiplier,
      totalStars,
      currentQuestions,
      currentQuestion,
      isStageUnlocked,
      activeStageInfo,
      toggleSound,
      setSound,
      goToMenu,
      startStage,
      tickCountdown,
      tickTimer,
      triggerShake,
      animateScoreTo,
      advanceQuestion,
      completeStage,
      handleCorrectAnswer,
      handleWrongAnswer,
      handleTimeout,
      retryCurrentStage,
      nextStage,
      resetAllProgress,
    }
  },
  {
    persist: {
      pick: ['unlockedStages', 'stageStars', 'highScores', 'soundEnabled'],
      afterHydrate: (ctx: any) => {
        audioService.setSoundEnabled(ctx.store.soundEnabled)
      },
    },
  }
)
