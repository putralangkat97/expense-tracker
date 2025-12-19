<script setup>
  // import { computed } from "vue";
  import { useRouter } from "vue-router";
  import BaseButton from "./ui/BaseButton.vue";
  import { CheckCircle, Wallet, PieChart, Lightbulb } from "lucide-vue-next";
  import { useOnboarding, useOnboardingSummary } from "../hooks/use-onboarding";

  const router = useRouter();
  const { submitOnboardingMutation } = useOnboarding();
  const { walletData, budgetData, walletBalance, budgetLimit } =
    useOnboardingSummary();

  // const isLoading = computed(() => submitOnboardingMutation.isPending.value);

  const navigateToDashboard = () => {
    submitOnboardingMutation.mutate();
  };

  const editSetup = () => {
    router.push("/initial-wallet-setup");
  };
</script>

<template>
  <div
    class="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden font-display text-text-dark dark:text-white max-w-md mx-auto shadow-2xl bg-background-light dark:bg-background-dark transition-colors duration-200"
  >
    <!-- Header / Progress -->
    <div class="w-full flex flex-col items-center pt-8 pb-4">
      <div class="flex flex-row items-center justify-center gap-2">
        <div class="h-2 w-2 rounded-full bg-[#d0e7d7] dark:bg-white/20"></div>
        <div class="h-2 w-2 rounded-full bg-[#d0e7d7] dark:bg-white/20"></div>
        <div class="h-2 w-8 rounded-full bg-primary"></div>
      </div>
    </div>

    <!-- Scrollable Content Area -->
    <div
      class="flex-1 flex flex-col items-center w-full px-6 pt-6 pb-48 overflow-y-auto no-scrollbar"
    >
      <!-- Success Hero Illustration -->
      <div
        class="flex flex-col items-center justify-center gap-6 py-8 w-full animate-in fade-in zoom-in duration-500"
      >
        <div class="relative">
          <!-- Decorative blurred background for the icon -->
          <div
            class="absolute inset-0 bg-primary/30 blur-2xl rounded-full scale-150"
          ></div>
          <div
            class="relative flex items-center justify-center size-24 rounded-full bg-primary/10 border border-primary/20"
          >
            <CheckCircle class="w-12 h-12 text-primary" />
          </div>
        </div>
        <div class="text-center space-y-3 max-w-70">
          <h1
            class="text-3xl font-extrabold leading-tight tracking-tight text-text-dark dark:text-white"
          >
            Setup Complete!
          </h1>
          <p
            class="text-base font-medium text-gray-500 dark:text-gray-400 leading-relaxed"
          >
            Your financial journey begins now. Here is a snapshot of your
            starting point:
          </p>
        </div>
      </div>

      <!-- Summary Card -->
      <div
        class="w-full mt-4 bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden"
      >
        <!-- Header of card -->
        <div
          class="px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5"
        >
          <h3
            class="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400"
          >
            Current Configuration
          </h3>
        </div>

        <!-- Wallet Item -->
        <div
          class="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
        >
          <div
            class="flex items-center justify-center rounded-xl bg-[#e7f3eb] dark:bg-primary/20 shrink-0 size-12 text-primary"
          >
            <Wallet class="w-6 h-6" />
          </div>
          <div class="flex flex-1 flex-col justify-center gap-0.5">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Primary Wallet
            </p>
            <p class="text-base font-bold text-text-dark dark:text-white">
              {{ walletData?.name || "No wallet created" }}
            </p>
          </div>
          <div class="shrink-0 text-right">
            <p class="text-lg font-bold text-primary font-display tabular-nums">
              {{ walletBalance }}
            </p>
          </div>
        </div>

        <!-- Divider -->
        <div class="h-px w-full bg-gray-100 dark:bg-gray-800 mx-auto"></div>

        <!-- Budget Item -->
        <div
          class="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
        >
          <div
            class="flex items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-900/20 shrink-0 size-12 text-orange-500"
          >
            <PieChart class="w-6 h-6" />
          </div>
          <div class="flex flex-1 flex-col justify-center gap-0.5">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
              {{ budgetData?.frequency || "Monthly" }} Budget
            </p>
            <p class="text-base font-bold text-text-dark dark:text-white">
              {{ budgetData?.name || "No budget created" }}
            </p>
          </div>
          <div class="shrink-0 text-right">
            <p
              class="text-lg font-bold text-text-dark dark:text-white font-display tabular-nums"
            >
              {{ budgetLimit }}
            </p>
          </div>
        </div>
      </div>

      <!-- Optional: Small visual filler or tip -->
      <div
        v-if="!walletData?.name || !budgetData?.name"
        class="w-full mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-3"
      >
        <Lightbulb class="w-5 h-5 text-primary mt-0.5" />
        <p class="text-sm text-gray-600 dark:text-gray-300">
          <span class="font-bold text-text-dark dark:text-white">Tip:</span>
          You can always add more wallets or adjust your budget later in
          settings.
        </p>
      </div>
    </div>

    <!-- Fixed Bottom Action Area -->
    <div
      class="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto p-4 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-t border-transparent z-50"
    >
      <div class="flex flex-col gap-3">
        <BaseButton
          @click="navigateToDashboard"
          class="w-full h-14 text-lg font-bold shadow-lg shadow-primary/20"
        >
          Launch Dashboard
        </BaseButton>
        <button
          @click="editSetup"
          class="flex items-center justify-center w-full h-10 text-gray-500 dark:text-gray-400 hover:text-text-dark dark:hover:text-white text-sm font-semibold rounded-lg transition-colors"
        >
          Edit Setup
        </button>
      </div>
      <!-- iOS Home Indicator Spacing -->
      <div class="h-4 w-full"></div>
    </div>
  </div>
</template>

<style scoped>
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
