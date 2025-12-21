<script setup>
  import { Plus } from "lucide-vue-next";

  defineEmits(["click"]);
</script>

<template>
  <button
    class="fixed right-5 h-14 w-14 bg-primary rounded-full shadow-[0_4px_14px_rgba(25,230,94,0.4)] flex items-center justify-center text-text-dark z-40 hover:scale-105 active:scale-95 transition-all"
    :style="{ bottom: 'calc(6rem + var(--safe-area-bottom))' }"
    @click="$emit('click')"
  >
    <Plus class="w-8 h-8" />
  </button>
</template>
