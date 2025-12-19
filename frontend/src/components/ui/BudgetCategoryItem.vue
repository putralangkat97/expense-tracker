<script setup>
  defineProps({
    name: {
      type: String,
      required: true,
    },
    spent: {
      type: String,
      required: true,
    },
    limit: {
      type: String,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    icon: {
      type: Object,
      required: true,
    },
    iconColor: {
      type: String,
      default: "text-primary",
    },
    iconBg: {
      type: String,
      default: "bg-[#e7f3eb] dark:bg-primary/20",
    },
    barColor: {
      type: String,
      default: "bg-primary",
    },
  });
</script>

<template>
  <div
    class="flex items-center gap-4 bg-white dark:bg-[#1c2e22] p-4 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] justify-between transition-transform active:scale-[0.98]"
  >
    <div class="flex items-center gap-4 flex-1">
      <div
        class="flex items-center justify-center rounded-xl shrink-0 size-12"
        :class="iconBg"
      >
        <component :is="icon" class="w-6 h-6" :class="iconColor" />
      </div>
      <div class="flex flex-col gap-1 flex-1 min-w-0">
        <div class="flex justify-between items-center w-full">
          <p
            class="text-text-dark dark:text-white text-base font-bold truncate"
          >
            {{ name }}
          </p>
          <p class="text-text-dark dark:text-white text-sm font-bold">
            {{ spent }}
            <span class="text-gray-400 font-normal">/ {{ limit }}</span>
          </p>
        </div>
        <div
          class="w-full h-1.5 rounded-full bg-[#f0f4f1] dark:bg-gray-700 overflow-hidden"
        >
          <div
            class="h-full rounded-full"
            :class="barColor"
            :style="{ width: `${percentage}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
