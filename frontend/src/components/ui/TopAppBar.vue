<script setup>
  defineProps({
    title: {
      type: String,
      required: true,
    },
    actionIcon: {
      type: Object,
      default: null,
    },
  });

  defineEmits(["action"]);
</script>

<template>
  <div
    class="flex items-center bg-background-light dark:bg-background-dark px-4 pb-2 justify-between transition-all duration-200"
    :style="{ paddingTop: 'calc(1rem + var(--safe-area-top))' }"
  >
    <div class="flex size-12 shrink-0 items-center">
      <div
        class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary/20"
        data-alt="User profile picture"
        style="
          background-image: url(&quot;https://lh3.googleusercontent.com/aida-public/AB6AXuCVDlLPN_LRNNynuJ3ezcxIi_FDg5X7bGtKPdvBeYnSm0c2CmoZzvNnoPkm638IXiB5ocXYNv4PcStiGwZl0QQzObOZ3UseTl_EPeQpm5jpGeYivjNOm6dmFMoZ2E2Gxf_LNrsXzDTqmHc290-12pipYqWDqoN9poBXv8_Acwshn7BB47dyX3vS_NjGLdyhGRD8z93MBMrwzYJQSdxYObvIMJn5u9up7gD2MtEsO6tdLCTe2iKLFsucfiWJPLo6wmVZYG6We1RZt3U&quot;);
        "
      ></div>
    </div>
    <h2
      class="text-text-main dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center"
    >
      {{ title }}
    </h2>
    <div class="flex w-12 items-center justify-end">
      <button
        v-if="actionIcon"
        class="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-transparent text-text-main dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        @click="$emit('action')"
      >
        <component :is="actionIcon" class="w-6 h-6" />
      </button>
      <slot name="action" v-else></slot>
    </div>
  </div>
</template>
