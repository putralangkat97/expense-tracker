<script setup>
  import { computed } from "vue";
  import { Loader2 } from "lucide-vue-next";

  const {
    variant,
    size,
    disabled,
    loading,
    type: buttonType,
    block,
  } = defineProps({
    variant: {
      type: String,
      default: "primary",
      validator: (value) =>
        ["primary", "secondary", "outline-solid", "ghost", "icon"].includes(
          value,
        ),
    },
    size: {
      type: String,
      default: "default",
      validator: (value) => ["default", "sm", "lg", "icon"].includes(value),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    buttonType: {
      type: String,
      default: "submit",
    },
    block: {
      type: Boolean,
      default: false,
    },
  });

  const baseClasses =
    "inline-flex items-center justify-center rounded-xl font-bold transition-all duration-200 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

  const variantClasses = computed(() => {
    switch (variant) {
      case "primary":
        return "bg-primary hover:bg-[#16cc53] text-text-dark shadow-lg shadow-primary/25";
      case "secondary":
        return "bg-neutral-100 dark:bg-neutral-800 text-text-dark dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700";
      case "outline-solid":
        return "border border-[#d0e7d7] dark:border-gray-700 bg-white dark:bg-surface-dark text-text-muted hover:text-primary hover:border-primary";
      case "ghost":
        return "bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-text-dark dark:text-white";
      case "icon":
        return "bg-white dark:bg-surface-dark border border-[#d0e7d7] dark:border-gray-700 text-text-muted hover:text-primary hover:border-primary";
      default:
        return "bg-primary text-text-dark";
    }
  });

  const sizeClasses = computed(() => {
    switch (size) {
      case "sm":
        return "h-9 px-3 text-sm";
      case "lg":
        return "h-14 px-8 text-lg";
      case "icon":
        return "h-14 w-14 p-0";
      default:
        return "h-12 px-4 text-base";
    }
  });

  const classes = computed(() => {
    return [
      baseClasses,
      variantClasses.value,
      sizeClasses.value,
      block ? "w-full" : "",
    ].join(" ");
  });
</script>

<template>
  <button :type="buttonType" :class="classes" :disabled="disabled || loading">
    <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
    <slot name="icon-left" v-if="!loading"></slot>
    <slot></slot>
    <slot name="icon-right" v-if="!loading"></slot>
  </button>
</template>
