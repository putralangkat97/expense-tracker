<script setup>
  import OnboardingStats from "@/components/molecules/OnboardingStats.vue";
  import OnboardingBudgetForm from "@/components/molecules/OnboardingBudgetForm.vue";
</script>

<template>
  <div
    class="relative flex h-full min-h-screen w-full flex-col max-w-md mx-auto bg-surface-light dark:bg-surface-dark shadow-xl overflow-y-auto pb-20"
  >
    <!-- Header & Progress -->
    <OnboardingStats status="budget" />

    <!-- Main Content -->
    <div class="flex flex-col px-6 pt-2 h-full">
      <!-- Headline Text -->
      <h2
        class="text-3xl font-extrabold tracking-tight leading-tight text-gray-900 dark:text-white pt-2"
      >
        Let's set your first goal
      </h2>
      <!-- Body Text -->
      <p
        class="text-gray-500 dark:text-gray-400 text-base font-medium leading-relaxed mt-3 mb-8"
      >
        Take control of your spending by setting a limit for a specific
        category.
      </p>

      <!-- Form Component -->
      <OnboardingBudgetForm />
    </div>
  </div>
</template>
