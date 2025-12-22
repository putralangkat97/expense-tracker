<script setup>
  import OnboardingStats from "@/components/molecules/OnboardingStats.vue";
  import OnboardingSummaryContent from "@/components/molecules/OnboardingSummaryContent.vue";
</script>

<template>
  <div
    class="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden font-display text-text-dark dark:text-white max-w-md mx-auto shadow-2xl bg-background-light dark:bg-background-dark transition-colors duration-200"
  >
    <!-- Header / Progress -->
    <OnboardingStats status="summary" />

    <!-- Content Component -->
    <OnboardingSummaryContent />
  </div>
</template>
