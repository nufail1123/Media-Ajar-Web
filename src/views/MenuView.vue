<script setup lang="ts">
import { ref } from "vue";
import { useGameStore, STAGES, type StageId } from "../stores/gameStore";
import {
  Search,
  Hammer,
  Layers,
  Blocks,
  Scroll,
  Star,
  Lock,
  Trophy,
  Play,
  Volume2,
  VolumeX,
  RotateCcw,
} from "lucide-vue-next";

const store = useGameStore();
const showResetConfirm = ref(false);

const iconMap: Record<string, any> = {
  ejaan: Search,
  imbuhan: Hammer,
  semantik: Layers,
  spok: Blocks,
  pantun: Scroll,
};

function handleStartStage(id: StageId) {
  if (!store.isStageUnlocked(id)) return;
  store.startStage(id);
}

function confirmReset() {
  store.resetAllProgress();
  showResetConfirm.value = false;
}
</script>

<template>
  <div class="w-full flex flex-col justify-between items-center py-1 z-10">
    <!-- 1. Header Papan Tulis Berbingkai Kayu (Wooden Chalkboard Arcade Header) -->
    <header
      class="w-full max-w-4xl text-center mb-6 sm:mb-8 animate-pop relative z-20"
    >
      <div
        class="relative wood-frame rounded-2xl sm:rounded-3xl border-[6px] sm:border-[8px] md:border-[10px] border-[#854d27] bg-[#1a382b] px-3 py-3 sm:px-6 sm:py-4 shadow-board overflow-visible text-center"
      >
        <!-- Coretan Kapur Dekoratif (Chalk Doodles) -->
        <div
          class="absolute top-2 left-4 text-emerald-200/60 text-base sm:text-xl font-bold select-none pointer-events-none chalk-glow"
        >
          ★ ✦
        </div>
        <div
          class="absolute top-7 left-3 w-6 sm:w-10 h-3 border-t-2 border-l-2 border-emerald-100/40 rounded-tl-full select-none pointer-events-none"
        />

        <div
          class="absolute top-2 right-4 text-emerald-200/60 text-base sm:text-xl font-bold select-none pointer-events-none chalk-glow"
        >
          ✦ ★
        </div>
        <div
          class="absolute top-7 right-3 w-6 sm:w-10 h-3 border-t-2 border-r-2 border-emerald-100/40 rounded-tr-full select-none pointer-events-none"
        />

        <!-- Tag Lencana Kurikulum Papan Tulis (Cyan Pill) -->
        <div
          class="inline-flex items-center gap-1.5 bg-[#12382b] border-2 border-cyan-400/90 px-3 py-0.5 rounded-full text-[11px] sm:text-xs font-black text-cyan-200 shadow-md mb-1 font-fredoka"
        >
          <span class="text-amber-300">⭐</span>
          <span>Game Edukasi Arcade SD (Fase B/C)</span>
          <span class="text-amber-300">⭐</span>
        </div>

        <!-- Judul Raksasa Arcade 3D Pure CSS ("PETUALANG KATA") -->
        <h1
          class="text-3xl sm:text-5xl md:text-6xl font-black font-fredoka tracking-wide uppercase select-none leading-tight py-0.5 arcade-title-glow"
        >
          Petualang Kata
        </h1>

        <!-- Subjudul Keterangan Materi Bahasa Indonesia -->
        <p
          class="text-[11px] sm:text-xs md:text-sm font-bold text-emerald-100/90 max-w-xl mx-auto font-nunito tracking-wide mb-2 sm:mb-3"
        >
          Tantang ketangkasan bahasa: Ejaan, Morfologi, Semantik, SPOK, dan
          Pantun!
        </p>

        <!-- Bilah Status Bintang & Kontrol Cepat (Menempel di Bagian Bawah Papan) -->
        <div
          class="mt-2 sm:mt-3 -mb-6 sm:-mb-7 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 px-2 relative z-30"
        >
          <!-- Badge Total Bintang dengan Bintang Emas 3D -->
          <div
            class="inline-flex items-center gap-1.5 bg-slate-900/95 border-2 border-amber-400 px-3 sm:px-3.5 py-1 rounded-full shadow-lg"
          >
            <Star
              class="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-amber-400 animate-pulse drop-shadow"
            />
            <span
              class="text-[11px] sm:text-xs font-black text-slate-100 font-fredoka"
            >
              Total Bintang:
              <span class="text-amber-400 text-xs sm:text-sm ml-0.5">
                {{ store.totalStars }} / 15
              </span>
            </span>
          </div>

          <!-- Tombol Audio Toggle (Chunky Green) -->
          <button
            type="button"
            @click="store.toggleSound()"
            class="inline-flex items-center gap-1 bg-[#22c55e] hover:bg-[#16a34a] border-b-4 border-[#15803d] active:border-b-0 active:translate-y-1 px-3 sm:px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-black text-white transition-all shadow-md touch-manipulation font-fredoka"
            :title="
              store.soundEnabled ? 'Matikan Efek Suara' : 'Nyalakan Efek Suara'
            "
          >
            <Volume2 v-if="store.soundEnabled" class="w-3.5 h-3.5 text-white" />
            <VolumeX v-else class="w-3.5 h-3.5 text-white/80" />
            <span>{{ store.soundEnabled ? "Suara Aktif" : "Mute" }}</span>
          </button>

          <!-- Tombol Reset Data (Chunky Light) -->
          <button
            type="button"
            @click="showResetConfirm = true"
            class="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 border-b-4 border-slate-300 active:border-b-0 active:translate-y-1 px-3 sm:px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-black text-slate-700 hover:text-rose-600 transition-all shadow-md touch-manipulation font-fredoka"
            title="Reset Progres Belajar"
          >
            <RotateCcw class="w-3 h-3 text-slate-600" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </header>

    <!-- 2. Grid 5 Modul Pembelajaran (Format Simetris 3 Modul di Atas + 2 Modul di Bawah) -->
    <main class="w-full flex flex-col items-center mb-2">
      <!-- Baris Atas: Modul 1, Modul 2, Modul 3 -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5 w-full max-w-5xl"
      >
        <div
          v-for="stage in STAGES.slice(0, 3)"
          :key="stage.id"
          class="relative rounded-3xl p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-200 shadow-xl select-none min-h-[185px] group hover:-translate-y-1"
          :class="[stage.cardBg]"
        >
          <!-- Baris Atas Kartu: Ikon Bulat & 3 Bintang -->
          <div class="flex items-start justify-between mb-1.5">
            <!-- Ikon Badge Bulat Ceria -->
            <div
              class="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm"
              :class="stage.badgeBg"
            >
              <component :is="iconMap[stage.id]" class="w-5 h-5" />
            </div>

            <!-- Bintang Nilai (3 Bintang) -->
            <div
              class="flex items-center gap-1 bg-black/10 px-2 py-0.5 rounded-xl"
            >
              <Star
                v-for="s in 3"
                :key="s"
                class="w-3.5 h-3.5 transition-transform"
                :class="[
                  s <= (store.stageStars[stage.id] || 0)
                    ? 'text-amber-500 fill-amber-400 drop-shadow'
                    : 'text-slate-400/50',
                ]"
              />
            </div>
          </div>

          <!-- Bagian Tengah Kartu: Subtitle, Judul & Deskripsi -->
          <div class="mb-2.5">
            <span
              class="text-[10px] font-black uppercase tracking-wider block font-fredoka"
              :class="stage.subtitleColor"
            >
              {{ stage.subtitle }}
            </span>
            <h2
              class="text-lg sm:text-xl font-black font-fredoka leading-snug"
              :class="stage.titleColor"
            >
              {{ stage.title }}
            </h2>
            <p
              class="text-xs font-medium leading-relaxed mt-0.5 line-clamp-2"
              :class="stage.descColor"
            >
              {{ stage.description }}
            </p>

            <!-- Skor Terbaik jika ada -->
            <div
              v-if="store.highScores[stage.id]"
              class="mt-1 flex items-center gap-1 text-[10px] font-black text-amber-900 bg-amber-300/60 px-2 py-0.5 rounded-lg w-fit font-fredoka"
            >
              <Trophy class="w-3 h-3" />
              <span>Skor Terbaik: {{ store.highScores[stage.id] }}</span>
            </div>
          </div>

          <!-- Tombol Aksi Chunky 3D / Tombol Terkunci -->
          <div>
            <button
              v-if="store.isStageUnlocked(stage.id)"
              type="button"
              @click="handleStartStage(stage.id)"
              class="w-full min-h-[40px] py-1.5 px-3 rounded-2xl active:border-b-0 active:translate-y-1 font-fredoka font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md transition-all touch-manipulation"
              :class="stage.buttonColor"
            >
              <Play class="w-3.5 h-3.5 fill-white text-white" />
              <span>{{
                store.stageStars[stage.id] ? "MAIN LAGI" : "MULAI MAIN"
              }}</span>
            </button>

            <div
              v-else
              class="w-full min-h-[40px] py-1.5 px-3 rounded-2xl font-fredoka font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-not-allowed select-none"
              :class="stage.lockedBtnColor"
            >
              <Lock class="w-3.5 h-3.5 shrink-0" />
              <span>{{ stage.lockedText || "Modul Terkunci" }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Baris Bawah: Modul 4 & Modul 5 (Diposisikan di Tengah) -->
      <div
        class="flex flex-col sm:flex-row justify-center gap-3 sm:gap-3.5 w-full max-w-5xl mt-3"
      >
        <div
          v-for="stage in STAGES.slice(3, 5)"
          :key="stage.id"
          class="w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-12px)] relative rounded-3xl p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-200 shadow-xl select-none min-h-[185px] group hover:-translate-y-1"
          :class="[stage.cardBg]"
        >
          <!-- Baris Atas Kartu: Ikon Bulat & 3 Bintang -->
          <div class="flex items-start justify-between mb-1.5">
            <div
              class="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm"
              :class="stage.badgeBg"
            >
              <component :is="iconMap[stage.id]" class="w-5 h-5" />
            </div>

            <div
              class="flex items-center gap-1 bg-black/10 px-2 py-0.5 rounded-xl"
            >
              <Star
                v-for="s in 3"
                :key="s"
                class="w-3.5 h-3.5 transition-transform"
                :class="[
                  s <= (store.stageStars[stage.id] || 0)
                    ? 'text-amber-500 fill-amber-400 drop-shadow'
                    : 'text-slate-400/50',
                ]"
              />
            </div>
          </div>

          <!-- Bagian Tengah Kartu: Subtitle, Judul & Deskripsi -->
          <div class="mb-2.5">
            <span
              class="text-[10px] font-black uppercase tracking-wider block font-fredoka"
              :class="stage.subtitleColor"
            >
              {{ stage.subtitle }}
            </span>
            <h2
              class="text-lg sm:text-xl font-black font-fredoka leading-snug"
              :class="stage.titleColor"
            >
              {{ stage.title }}
            </h2>
            <p
              class="text-xs font-medium leading-relaxed mt-0.5 line-clamp-2"
              :class="stage.descColor"
            >
              {{ stage.description }}
            </p>

            <div
              v-if="store.highScores[stage.id]"
              class="mt-1 flex items-center gap-1 text-[10px] font-black text-amber-900 bg-amber-300/60 px-2 py-0.5 rounded-lg w-fit font-fredoka"
            >
              <Trophy class="w-3 h-3" />
              <span>Skor Terbaik: {{ store.highScores[stage.id] }}</span>
            </div>
          </div>

          <!-- Tombol Aksi Chunky 3D / Tombol Terkunci -->
          <div>
            <button
              v-if="store.isStageUnlocked(stage.id)"
              type="button"
              @click="handleStartStage(stage.id)"
              class="w-full min-h-[40px] py-1.5 px-3 rounded-2xl active:border-b-0 active:translate-y-1 font-fredoka font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md transition-all touch-manipulation"
              :class="stage.buttonColor"
            >
              <Play class="w-3.5 h-3.5 fill-white text-white" />
              <span>{{
                store.stageStars[stage.id] ? "MAIN LAGI" : "MULAI MAIN"
              }}</span>
            </button>

            <div
              v-else
              class="w-full min-h-[40px] py-1.5 px-3 rounded-2xl font-fredoka font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-not-allowed select-none"
              :class="stage.lockedBtnColor"
            >
              <Lock class="w-3.5 h-3.5 shrink-0" />
              <span>{{ stage.lockedText || "Modul Terkunci" }}</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 3. Footer Ramah Edukasi -->
    <footer
      class="text-center text-[11px] font-semibold text-slate-800 pb-1 space-y-0.5 z-10"
    >
      <p class="font-extrabold text-slate-900">
        Disusun sesuai Capaian Pembelajaran Kurikulum Merdeka Bahasa Indonesia
        SD Kelas 4 & 6
      </p>
    </footer>

    <!-- 4. Modal Konfirmasi Reset Progres -->
    <Teleport to="body">
      <div
        v-if="showResetConfirm"
        class="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <div
          class="bg-white border-4 border-amber-300 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl animate-pop text-slate-800"
        >
          <div
            class="w-12 h-12 mx-auto mb-3 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-500"
          >
            <RotateCcw
              class="w-6 h-6 animate-spin"
              style="animation-duration: 3s"
            />
          </div>
          <h3 class="text-xl font-black font-fredoka text-slate-900 mb-2">
            Reset Seluruh Progres?
          </h3>
          <p class="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
            Seluruh perolehan bintang, skor tertinggi, dan modul yang terbuka
            akan dikembalikan ke kondisi awal.
          </p>
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              @click="showResetConfirm = false"
              class="min-h-[44px] py-2 px-3 rounded-2xl bg-slate-200 hover:bg-slate-300 border-b-4 border-slate-300 active:border-b-0 active:translate-y-1 text-slate-700 font-bold text-sm transition-all"
            >
              Batal
            </button>
            <button
              type="button"
              @click="confirmReset"
              class="min-h-[44px] py-2 px-3 rounded-2xl bg-rose-500 hover:bg-rose-400 border-b-4 border-rose-700 active:border-b-0 active:translate-y-1 text-white font-black text-sm transition-all shadow-md font-fredoka"
            >
              Ya, Reset
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
