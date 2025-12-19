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
  <div class="flex flex-col gap-2 w-37 group cursor-pointer">
    <div
      class="relative w-full aspect-[1.58/1] overflow-hidden rounded-2xl shadow-xs transition-transform group-active:scale-95 border border-gray-100 dark:border-gray-800"
    >
      <div
        class="absolute inset-0 bg-cover bg-center"
        :style="{ backgroundImage: `url('${backgroundImage}')` }"
      ></div>
      <div class="absolute inset-0" :class="overlayOpacity"></div>
      <div class="absolute bottom-3 left-4 text-white">
        <p class="text-xs font-medium opacity-80 mb-0.5">{{ name }}</p>
        <p class="text-lg font-bold tracking-tight">{{ balance }}</p>
      </div>
      <div class="absolute top-3 right-4">
        <div
          v-if="excludeFromTotals"
          class="absolute top-1 right-1 p-1 bg-white/20 rounded-full backdrop-blur-xs text-white"
        >
          <EyeOff class="w-3 h-3" />
        </div>
      </div>
    </div>
  </div>
</template>
