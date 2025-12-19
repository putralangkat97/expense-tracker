<script setup>
  import { EyeOff } from "lucide-vue-next";

  defineProps({
    name: {
      type: String,
      required: true,
    },
    balance: {
      type: String,
      required: true,
    },
    backgroundImage: {
      type: String,
      required: true,
    },
    overlayOpacity: {
      type: String,
      default: "bg-black/40",
    },
    excludeFromTotals: {
      type: Boolean,
      default: false,
    },
  });
</script>

<template>
  <div class="flex flex-col gap-2 w-44 group cursor-pointer shrink-0">
    <div
      class="relative w-full h-48 overflow-hidden rounded-xl shadow-xl transition-all duration-300 group-active:scale-95 border border-white/10 dark:border-gray-800"
    >
      <!-- Background Image with zoom effect -->
      <div
        class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        :style="{ backgroundImage: `url('${backgroundImage}')` }"
      ></div>

      <!-- Overlay Gradients for Readability and Depth -->
      <div
        class="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/80"
      ></div>
      <div
        class="absolute inset-0 bg-linear-to-tr from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      ></div>

      <!-- Card Content -->
      <div class="relative h-full p-6 flex flex-col justify-between text-white">
        <!-- Top Section: Name and Visibility Icon -->
        <div class="flex justify-between items-start">
          <div
            class="bg-white/20 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/20"
          >
            <p
              class="text-[10px] font-extrabold uppercase tracking-widest truncate max-w-20"
            >
              {{ name }}
            </p>
          </div>
          <div
            v-if="excludeFromTotals"
            class="p-2 bg-black/20 rounded-full backdrop-blur-md border border-white/10"
            title="Excluded from totals"
          >
            <EyeOff class="w-3.5 h-3.5 opacity-90" />
          </div>
        </div>

        <!-- Bottom Section: Balance -->
        <div
          class="space-y-1 transform transition-transform duration-300 group-hover:-translate-y-1"
        >
          <p class="text-[10px] font-bold opacity-60 tracking-wider uppercase">
            Balance
          </p>
          <p class="text-2xl font-black tracking-tighter leading-none truncate">
            {{ balance }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
