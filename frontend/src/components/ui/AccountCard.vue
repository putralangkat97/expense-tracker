<script setup>
  import { computed } from "vue";

  const props = defineProps({
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    balance: {
      type: String,
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
      default: "bg-gray-100 dark:bg-gray-700",
    },
    backgroundImage: {
      type: String,
      default: "",
    },
    footerGradient: {
      type: String,
      default: "",
    },
  });

  const hasFooter = computed(
    () => !!props.backgroundImage || !!props.footerGradient,
  );
</script>

<template>
  <div
    class="flex flex-col items-stretch justify-between gap-0 rounded-xl bg-white dark:bg-[#1a2c20] shadow-xs overflow-hidden"
  >
    <div class="flex items-center justify-between p-4">
      <div class="flex items-center gap-3">
        <div class="p-2 rounded-lg" :class="iconBg">
          <component :is="icon" class="w-6 h-6" :class="iconColor" />
        </div>
        <div>
          <p
            class="text-text-main dark:text-white text-base font-bold leading-tight"
          >
            {{ name }}
          </p>
          <p
            class="text-text-secondary dark:text-gray-400 text-sm font-normal leading-normal"
          >
            {{ description }}
          </p>
        </div>
      </div>
      <div class="text-right">
        <p
          class="text-text-main dark:text-white text-lg font-bold leading-tight"
        >
          {{ balance }}
        </p>
      </div>
    </div>

    <!-- Card Visual Footer -->
    <div
      v-if="hasFooter"
      class="w-full"
      :class="[
        backgroundImage
          ? 'h-16 bg-center bg-no-repeat bg-cover opacity-80'
          : 'h-10',
        footerGradient,
      ]"
      :style="
        backgroundImage ? { backgroundImage: `url('${backgroundImage}')` } : {}
      "
    ></div>
  </div>
</template>
