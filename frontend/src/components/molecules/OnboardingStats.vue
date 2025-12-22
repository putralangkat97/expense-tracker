<script setup>
  import { computed } from "vue";

  const props = defineProps({
    stats: {
      type: String,
      required: true,
    },
  });

  const statsClasses = computed(() => {
    return {
      "bg-primary": props.stats === "wallet",
      "bg-[#d0e7d7] dark:bg-white/20": props.stats !== "wallet",
    };
  });
</script>

<template>
  <div class="w-full flex flex-col items-center pt-8 pb-4">
    <div class="flex flex-row items-center justify-center gap-2">
      <div class="h-2 w-8 rounded-full" :class="statsClasses"></div>
      <div class="h-2 w-2 rounded-full" :class="statsClasses"></div>
      <div class="h-2 w-2 rounded-full" :class="statsClasses"></div>
    </div>
  </div>
</template>
