<script setup>
  defineProps({
    totalSpent: {
      type: String,
      required: true,
    },
    limit: {
      type: String,
      required: true,
    },
    remaining: {
      type: String,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    period: {
      type: String,
      default: "Monthly",
    },
  });
</script>

<template>
  <div
    class="relative flex flex-col gap-4 rounded-2xl bg-white dark:bg-[#1c2e22] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden"
  >
    <!-- Decorative Background Blob -->
    <div
      class="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl"
    ></div>
    <div
      class="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl"
    ></div>

    <div class="relative z-10 flex justify-between items-start">
      <div class="flex flex-col gap-1">
        <p
          class="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wide"
        >
          Total Spent
        </p>
        <h3
          class="text-text-dark dark:text-white text-3xl font-bold leading-tight"
        >
          {{ totalSpent }}
        </h3>
      </div>
      <div class="bg-primary/10 rounded-lg px-3 py-1 flex items-center gap-1">
        <span class="text-primary text-xs font-bold uppercase">{{
          period
        }}</span>
      </div>
    </div>

    <div class="relative z-10 flex flex-col gap-2 mt-2">
      <div class="flex justify-between items-end">
        <p class="text-[#4e9767] dark:text-green-400 text-sm font-semibold">
          {{ remaining }} remaining
        </p>
        <p class="text-gray-400 dark:text-gray-500 text-xs font-medium">
          Limit: {{ limit }}
        </p>
      </div>
      <div
        class="h-3 w-full rounded-full bg-[#f0f4f1] dark:bg-gray-700 overflow-hidden"
      >
        <div
          class="h-full rounded-full bg-primary"
          :style="{ width: `${percentage}%` }"
        ></div>
      </div>
      <div class="text-right">
        <p class="text-gray-400 dark:text-gray-500 text-xs mt-1">
          {{ percentage }}% used
        </p>
      </div>
    </div>
  </div>
</template>
