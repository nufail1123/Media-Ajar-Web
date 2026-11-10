<script setup lang="ts">
import heroImage from '../../assets/hero.png'

defineProps<{
  showHero?: boolean
}>()
</script>

<template>
  <div class="fixed inset-0 pointer-events-none select-none overflow-hidden z-0">
    <!-- 1. Dinding Ruang Kelas Pastel Mint -->
    <div class="absolute inset-0 bg-gradient-to-b from-[#a4ddd1] via-[#92d4c5] to-[#7dbfad]">
      <!-- Garis Halus Tekstur Dinding Kayu/Panel Kelas -->
      <div
        class="absolute inset-0 opacity-15"
        style="background-image: repeating-linear-gradient(90deg, rgba(255,255,255,0.4) 0px, rgba(255,255,255,0.4) 1px, transparent 1px, transparent 80px);"
      />
    </div>

    <!-- 2. Jendela Kelas Kiri (Pemandangan Langit & Awan) -->
    <div class="absolute left-2 sm:left-6 md:left-10 top-12 sm:top-16 w-28 sm:w-44 md:w-56 h-64 sm:h-80 md:h-96 rounded-xl border-4 sm:border-8 border-[#854d27] bg-[#bae6fd] shadow-lg overflow-hidden flex flex-col justify-between">
      <!-- Garis Kusen Jendela Silang -->
      <div class="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 sm:h-3 bg-[#854d27] z-10" />
      <div class="absolute inset-y-0 left-1/2 -translate-x-1/2 w-2 sm:w-3 bg-[#854d27] z-10" />

      <!-- Langit & Awan Luar Jendela -->
      <div class="relative w-full h-full bg-gradient-to-b from-sky-300 to-sky-100">
        <!-- Awan Pixel Luar 1 -->
        <div class="absolute top-4 left-2 w-12 sm:w-20 h-5 sm:h-8 bg-white/90 rounded-full blur-[0.5px] animate-float" />
        <div class="absolute top-7 left-7 w-8 sm:w-14 h-4 sm:h-6 bg-white/80 rounded-full" />
        <!-- Awan Pixel Luar 2 -->
        <div class="absolute bottom-10 right-2 w-16 sm:w-24 h-6 sm:h-9 bg-white/85 rounded-full" />
      </div>
      <!-- Ambang Jendela Bawah (Window Sill) -->
      <div class="absolute -bottom-1 -left-2 -right-2 h-4 sm:h-5 bg-[#6d3b19] rounded-sm shadow-md z-20" />
    </div>

    <!-- 3. Jendela Kelas Kanan / Pintu Kelas Kanan -->
    <div class="absolute right-2 sm:right-6 md:right-10 top-12 sm:top-16 w-24 sm:w-36 md:w-48 h-56 sm:h-72 md:h-88 rounded-xl border-4 sm:border-8 border-[#854d27] bg-[#bae6fd] shadow-lg overflow-hidden hidden sm:flex flex-col">
      <div class="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 sm:h-3 bg-[#854d27] z-10" />
      <div class="absolute inset-y-0 left-1/2 -translate-x-1/2 w-2 sm:w-3 bg-[#854d27] z-10" />
      <div class="relative w-full h-full bg-gradient-to-b from-sky-300 to-sky-100">
        <div class="absolute top-6 right-3 w-14 h-6 bg-white/90 rounded-full animate-float" />
      </div>
      <div class="absolute -bottom-1 -left-2 -right-2 h-4 bg-[#6d3b19] rounded-sm shadow z-20" />
    </div>

    <!-- Pintu Kelas Kayu Kanan Belakang -->
    <div class="absolute -right-2 top-28 w-16 sm:w-24 md:w-32 h-96 border-l-4 sm:border-l-8 border-[#6d3b19] bg-[#a0683e] shadow-md hidden lg:block opacity-90">
      <div class="w-full h-32 border-4 border-[#854d27] bg-[#bae6fd]/60 m-2 rounded" />
      <div class="w-full h-40 border-4 border-[#854d27] bg-[#854d27]/40 m-2 rounded" />
    </div>

    <!-- 4. Rak Buku Kelas Kiri & Kanan -->
    <!-- Rak Buku Kiri Belakang -->
    <div class="absolute left-0 bottom-24 sm:bottom-32 w-16 sm:w-28 md:w-36 h-48 sm:h-64 bg-[#8b5329] border-r-4 border-t-4 border-[#6a3c19] rounded-tr-2xl shadow-xl hidden md:flex flex-col justify-around p-2">
      <!-- Rak Atas -->
      <div class="border-b-4 border-[#6a3c19] pb-1 flex items-end gap-1 overflow-hidden h-14">
        <div class="w-3 h-10 bg-rose-500 rounded-t" />
        <div class="w-4 h-12 bg-amber-400 rounded-t" />
        <div class="w-3 h-9 bg-emerald-500 rounded-t" />
        <div class="w-4 h-11 bg-sky-500 rounded-t" />
        <div class="w-3 h-8 bg-purple-500 rounded-t" />
      </div>
      <!-- Rak Bawah -->
      <div class="border-b-4 border-[#6a3c19] pb-1 flex items-end gap-1 overflow-hidden h-14">
        <div class="w-4 h-11 bg-emerald-400 rounded-t" />
        <div class="w-3 h-8 bg-rose-400 rounded-t" />
        <div class="w-4 h-12 bg-indigo-500 rounded-t" />
        <div class="w-3 h-10 bg-amber-500 rounded-t" />
      </div>
    </div>

    <!-- Rak Buku Kanan Belakang -->
    <div class="absolute right-12 sm:right-28 bottom-28 w-20 sm:w-28 h-44 bg-[#8b5329] border-4 border-[#6a3c19] rounded-t-xl shadow-lg hidden xl:flex flex-col justify-around p-1.5 opacity-85">
      <div class="border-b-2 border-[#6a3c19] flex items-end gap-1 h-12">
        <div class="w-3 h-9 bg-sky-400 rounded-t" />
        <div class="w-4 h-11 bg-rose-400 rounded-t" />
        <div class="w-3 h-8 bg-amber-400 rounded-t" />
        <div class="w-3 h-10 bg-emerald-400 rounded-t" />
      </div>
      <div class="border-b-2 border-[#6a3c19] flex items-end gap-1 h-12">
        <div class="w-4 h-10 bg-purple-400 rounded-t" />
        <div class="w-3 h-8 bg-teal-400 rounded-t" />
        <div class="w-4 h-11 bg-rose-500 rounded-t" />
      </div>
    </div>

    <!-- 5. Meja dan Kursi Siswa (Desks & Chairs Background) -->
    <!-- Meja Belajar Kiri Bawah -->
    <div class="absolute left-6 sm:left-14 bottom-16 sm:bottom-20 w-36 sm:w-56 h-28 hidden sm:block opacity-90">
      <!-- Papan Meja Kayu -->
      <div class="w-full h-8 sm:h-10 bg-gradient-to-r from-[#d59a60] to-[#c1864e] border-2 sm:border-4 border-[#854d27] rounded-lg shadow-md transform -skew-x-12" />
      <!-- Kaki Meja Logam -->
      <div class="flex justify-between px-3 sm:px-6 -mt-1">
        <div class="w-1.5 sm:w-2 h-16 sm:h-20 bg-[#5c3719] rounded-b" />
        <div class="w-1.5 sm:w-2 h-16 sm:h-20 bg-[#5c3719] rounded-b" />
        <div class="w-1.5 sm:w-2 h-16 sm:h-20 bg-[#5c3719] rounded-b" />
      </div>
      <!-- Kursi Kayu Belakang Meja -->
      <div class="absolute -top-6 left-8 sm:left-16 w-12 sm:w-16 h-8 bg-[#b87c47] border-2 border-[#6a3c19] rounded-t" />
    </div>

    <!-- Meja Belajar Kanan Bawah -->
    <div class="absolute right-16 sm:right-36 md:right-56 bottom-14 sm:bottom-18 w-36 sm:w-52 h-28 hidden md:block opacity-90">
      <div class="w-full h-8 sm:h-10 bg-gradient-to-r from-[#d59a60] to-[#c1864e] border-2 sm:border-4 border-[#854d27] rounded-lg shadow-md transform skew-x-12" />
      <div class="flex justify-between px-4 sm:px-6 -mt-1">
        <div class="w-1.5 sm:w-2 h-16 sm:h-20 bg-[#5c3719] rounded-b" />
        <div class="w-1.5 sm:w-2 h-16 sm:h-20 bg-[#5c3719] rounded-b" />
        <div class="w-1.5 sm:w-2 h-16 sm:h-20 bg-[#5c3719] rounded-b" />
      </div>
      <div class="absolute -top-6 right-8 sm:right-16 w-12 sm:w-16 h-8 bg-[#b87c47] border-2 border-[#6a3c19] rounded-t" />
    </div>

    <!-- 6. Lantai Kayu Ruang Kelas (Parquet Floor) -->
    <div class="absolute inset-x-0 bottom-0 h-16 sm:h-24 md:h-28 bg-[#c89464] border-t-4 sm:border-t-6 border-[#8c5529] shadow-inner">
      <!-- Garis Papan Lantai Kayu -->
      <div
        class="w-full h-full opacity-20"
        style="background-image: repeating-linear-gradient(90deg, rgba(74,38,13,0.6) 0px, rgba(74,38,13,0.6) 2px, transparent 2px, transparent 120px);"
      />
    </div>

    <!-- 7. Awan Kartun Mengambang (Stylized Fluffy Floating Clouds) -->
    <!-- Awan Kiri Atas -->
    <div class="absolute -top-4 -left-6 sm:left-2 flex items-center opacity-95 animate-floatSlow">
      <div class="w-24 sm:w-36 h-14 sm:h-20 bg-white rounded-full shadow-md" />
      <div class="w-16 sm:w-24 h-12 sm:h-16 bg-white rounded-full -ml-8 -mt-4" />
      <div class="w-20 sm:w-28 h-12 sm:h-16 bg-white rounded-full -ml-8 mt-2" />
    </div>

    <!-- Awan Kanan Atas -->
    <div class="absolute top-1 -right-6 sm:right-2 flex items-center opacity-95 animate-floatSlow" style="animation-delay: -1.5s;">
      <div class="w-20 sm:w-32 h-12 sm:h-18 bg-white rounded-full shadow-md" />
      <div class="w-16 sm:w-24 h-10 sm:h-14 bg-white rounded-full -ml-6 -mt-4" />
      <div class="w-18 sm:w-24 h-10 sm:h-14 bg-white rounded-full -ml-6 mt-2" />
    </div>

    <!-- Awan Kiri Bawah -->
    <div class="absolute bottom-2 -left-6 sm:left-0 flex items-center opacity-95 animate-float" style="animation-delay: -0.8s;">
      <div class="w-28 sm:w-44 h-14 sm:h-20 bg-white rounded-full shadow-lg" />
      <div class="w-20 sm:w-32 h-14 sm:h-20 bg-white rounded-full -ml-10 -mt-6" />
      <div class="w-24 sm:w-36 h-12 sm:h-16 bg-white rounded-full -ml-8 mt-2" />
    </div>

    <!-- Awan Kanan Bawah (Di Belakang Maskot) -->
    <div class="absolute -bottom-2 -right-8 sm:right-2 flex items-center opacity-95 animate-float" style="animation-delay: -2s;">
      <div class="w-32 sm:w-48 h-16 sm:h-24 bg-white rounded-full shadow-lg" />
      <div class="w-24 sm:w-36 h-16 sm:h-22 bg-white rounded-full -ml-12 -mt-6" />
      <div class="w-28 sm:w-40 h-14 sm:h-18 bg-white rounded-full -ml-10 mt-2" />
    </div>

    <!-- 8. Partikel Dekoratif Mengambang: Bintang Emas & Hati Pastel -->
    <!-- Bintang Arcade Kuning Emas -->
    <div class="absolute left-8 top-32 text-amber-400 text-2xl sm:text-3xl animate-float">✦</div>
    <div class="absolute left-1/4 top-16 text-amber-400 text-xl sm:text-2xl animate-float" style="animation-delay: -1s;">★</div>
    <div class="absolute left-16 bottom-36 text-amber-400 text-3xl sm:text-4xl animate-floatSlow">✦</div>
    <div class="absolute right-1/4 top-12 text-amber-300 text-xl sm:text-2xl animate-float" style="animation-delay: -2.5s;">★</div>
    <div class="absolute right-12 top-28 text-amber-400 text-2xl sm:text-3xl animate-floatSlow">✦</div>
    <div class="absolute right-1/3 bottom-20 text-amber-300 text-2xl animate-float">✦</div>

    <!-- Hati Pastel Cantik -->
    <div class="absolute right-8 top-64 text-rose-400 text-2xl sm:text-3xl animate-float" style="animation-delay: -1.2s;">♥</div>
    <div class="absolute right-16 bottom-60 text-pink-500 text-3xl sm:text-4xl animate-floatSlow">♥</div>
    <div class="absolute right-10 bottom-44 text-purple-400 text-2xl sm:text-3xl animate-float" style="animation-delay: -0.5s;">♥</div>
    <div class="absolute left-10 top-72 text-sky-400 text-2xl sm:text-3xl animate-float" style="animation-delay: -2s;">★</div>

    <!-- 9. Maskot Murid SD Ceria (hero.png) di Pojok Kanan Bawah -->
    <div
      v-if="showHero"
      class="absolute right-2 sm:right-6 md:right-10 bottom-2 sm:bottom-4 z-10 flex flex-col items-center animate-cheer"
    >
      <img
        :src="heroImage"
        alt="Murid Berprestasi Petualang Kata"
        class="w-24 sm:w-32 md:w-40 lg:w-44 h-auto drop-shadow-[0_8px_16px_rgba(0,0,0,0.3)] filter"
      />
    </div>
  </div>
</template>
