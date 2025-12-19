<script setup>
  defineProps({
    title: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    icon: {
      type: Object,
      required: true,
    },
    iconBg: {
      type: String,
      default: "bg-gray-100 dark:bg-surface-dark",
    },
    iconColor: {
      type: String,
      default: "text-text-main-light dark:text-text-main-dark",
    },
    amountColor: {
      type: String,
      default: "text-text-main-light dark:text-text-main-dark",
    },
  });
</script>

<template>
  <div class="flex items-center justify-between group cursor-pointer">
    <div class="flex items-center gap-4">
      <div
        class="flex h-12 w-12 items-center justify-center rounded-2xl transition-colors group-hover:bg-primary/10"
        :class="iconBg"
      >
        <component
          :is="icon"
          class="w-6 h-6 transition-colors group-hover:text-primary"
          :class="iconColor"
        />
      </div>
      <div>
        <p
          class="text-base font-bold text-text-main-light dark:text-text-main-dark leading-tight"
        >
          {{ title }}
        </p>
        <p class="text-xs font-medium text-text-sub-light mt-1">{{ date }}</p>
      </div>
    </div>
    <span class="text-base font-bold" :class="amountColor">{{ amount }}</span>
  </div>
</template>
