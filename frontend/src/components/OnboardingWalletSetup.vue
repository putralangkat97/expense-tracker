<script setup>
  import { ref, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import BaseButton from "./ui/BaseButton.vue";
  import { useOnboardingStore } from "../stores/onboarding";

  const router = useRouter();
  const onboardingStore = useOnboardingStore();

  const walletName = ref("");
  const currency = ref("USD");
  const balance = ref("");
  const selectedStyle = ref("wallet");

  const styles = [
    { id: "wallet", icon: "wallet" },
    { id: "savings", icon: "savings" },
    { id: "credit_card", icon: "credit_card" },
    { id: "payments", icon: "payments" },
  ];

  onMounted(() => {
    const {
      name,
      currency: curr,
      balance: bal,
      style,
    } = onboardingStore.walletData;
    if (name) walletName.value = name;
    if (curr) currency.value = curr;
    if (bal) balance.value = bal;
    if (style) selectedStyle.value = style;
  });

  const startTracking = () => {
    onboardingStore.setWalletData({
      name: walletName.value,
      currency: currency.value,
      balance: balance.value,
      style: selectedStyle.value,
    });
    router.push("/initial-budget-setup");
  };
</script>

<template>
  <div
    class="relative flex h-full min-h-screen w-full flex-col overflow-hidden max-w-md mx-auto shadow-xs bg-background-light dark:bg-background-dark"
  >
    <!-- Header / Progress -->
    <div class="w-full flex flex-col items-center pt-8 pb-4">
      <div class="flex flex-row items-center justify-center gap-2">
        <div class="h-2 w-8 rounded-full bg-primary"></div>
        <div class="h-2 w-2 rounded-full bg-[#d0e7d7] dark:bg-white/20"></div>
        <div class="h-2 w-2 rounded-full bg-[#d0e7d7] dark:bg-white/20"></div>
      </div>
    </div>

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

      <!-- Form -->
      <div class="space-y-6">
        <!-- Wallet Name -->
        <div class="flex flex-col gap-2 px-2">
          <label class="text-text-dark dark:text-white text-base font-semibold"
            >Wallet Name</label
          >
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
            >
              <span class="material-symbols-outlined text-gray-400">edit</span>
            </div>
            <input
              v-model="walletName"
              class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2e22] text-text-dark dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary h-14 pl-12 pr-4 text-lg font-medium placeholder:text-gray-400 transition-all duration-200 outline-hidden"
              placeholder="e.g. Personal or Cash"
              type="text"
            />
          </div>
        </div>

        <!-- Balance & Currency Row -->
        <div class="grid grid-cols-5 gap-4 px-2">
          <!-- Currency Selector -->
          <div class="col-span-2 flex flex-col gap-2">
            <label
              class="text-text-dark dark:text-white text-base font-semibold"
              >Currency</label
            >
            <div class="relative">
              <select
                v-model="currency"
                class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2e22] text-text-dark dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary h-14 pl-4 pr-10 text-lg font-bold appearance-none cursor-pointer outline-hidden"
              >
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
                <option>JPY</option>
              </select>
              <div
                class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
              >
                <span class="material-symbols-outlined text-gray-500"
                  >expand_more</span
                >
              </div>
            </div>
          </div>

          <!-- Initial Balance -->
          <div class="col-span-3 flex flex-col gap-2">
            <label
              class="text-text-dark dark:text-white text-base font-semibold"
              >Balance</label
            >
            <input
              v-model="balance"
              class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2e22] text-text-dark dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary h-14 px-4 text-lg font-bold placeholder:text-gray-400 placeholder:font-medium text-right outline-hidden"
              inputmode="decimal"
              placeholder="0.00"
              type="number"
            />
          </div>
        </div>

        <!-- Wallet Type / Icon Selection -->
        <div class="flex flex-col gap-3">
          <label
            class="text-text-dark dark:text-white px-2 text-sm font-semibold uppercase tracking-wider opacity-70"
            >Style</label
          >
          <div class="flex gap-4 overflow-x-auto py-2 px-2 no-scrollbar">
            <button
              v-for="style in styles"
              :key="style.id"
              @click="selectedStyle = style.id"
              :class="[
                'h-12 w-12 rounded-full flex items-center justify-center shrink-0 transition-all',
                selectedStyle === style.id
                  ? 'bg-primary text-white ring-4 ring-primary/20'
                  : 'bg-gray-100 dark:bg-[#1a2e22] text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-[#253f2f]',
              ]"
            >
              <span class="material-symbols-outlined">{{ style.icon }}</span>
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Fixed Footer Action -->
    <div class="p-6 bg-background-light dark:bg-background-dark pb-8">
      <BaseButton
        @click="startTracking"
        class="w-full font-bold text-lg h-14 shadow-lg shadow-primary/20 hover:shadow-primary/30"
      >
        <span>Start Tracking</span>
        <span class="material-symbols-outlined text-[20px] font-bold ml-2"
          >arrow_forward</span
        >
      </BaseButton>
    </div>
  </div>
</template>
