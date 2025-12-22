<script setup>
  import OnboardingStats from "@/components/molecules/OnboardingStats.vue";
  import OnboardingWalletForm from "@/components/molecules/OnboardingWalletForm.vue";
</script>

<template>
  <div
    class="relative flex h-full min-h-screen w-full flex-col overflow-hidden max-w-md mx-auto shadow-xs bg-background-light dark:bg-background-dark"
  >
    <!-- Header / Progress -->
    <OnboardingStats status="wallet" />

    <!-- Main Content -->
    <main class="flex-1 flex flex-col px-4 pb-6 overflow-y-auto">
      <!-- Illustration Area -->
      <div class="flex justify-center py-2">
        <div
          class="relative h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center mb-2"
        >
          <span class="material-symbols-outlined text-primary text-5xl"
            >account_balance_wallet</span
          >
        </div>
      </div>

      <!-- Headline -->
      <div class="text-center mb-8 px-2">
        <h1
          class="text-text-dark dark:text-white tracking-tight text-[32px] font-bold leading-tight mb-3"
        >
          Create your first wallet
        </h1>
        <p
          class="text-[#4e9767] dark:text-[#8dbf9e] text-base font-medium leading-relaxed max-w-70 mx-auto"
        >
          To start tracking, tell us where your money lives. You can add more
          wallets later.
        </p>
      </div>

      <!-- Form Component -->
      <OnboardingWalletForm />
    </main>
  </div>
</template>
