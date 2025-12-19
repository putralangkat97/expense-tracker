<script setup>
  import { ref } from "vue";
  import {
    Bell,
    TrendingUp,
    Plus,
    ArrowLeftRight,
    CreditCard,
  } from "lucide-vue-next";
  import BottomNav from "./ui/BottomNav.vue";
  import AccountCard from "./ui/AccountCard.vue";
  import CreateWalletModal from "./CreateWalletModal.vue";
  import EditWalletModal from "./EditWalletModal.vue";
  import WalletDetailModal from "./WalletDetailModal.vue";
  import TopAppBar from "./ui/TopAppBar.vue";
  import { useWallets } from "../hooks/use-wallets";

  const { wallets, totalBalance, recentActivity, createWallet, updateWallet } =
    useWallets();
  const isCreateWalletModalOpen = ref(false);
  const isEditWalletModalOpen = ref(false);
  const isWalletDetailModalOpen = ref(false);
  const selectedWallet = ref(null);

  const handleCreateWallet = (walletData) => {
    console.log("Creating wallet:", walletData);

    // Map modal data to API structure
    const typeMap = {
      wallet: "cash",
      savings: "savings",
      credit_card: "credit",
      payments: "bank", // Mapping 'payments' style to 'bank' type for now
    };

    createWallet({
      name: walletData.walletName,
      type: typeMap[walletData.style] || "cash",
      currency: walletData.currency,
      balance: parseFloat(walletData.initialBalance) || 0,
      icon: walletData.style, // Storing style as icon for now
      backgroundImage: undefined,
      excludeFromTotals: false,
    });

    isCreateWalletModalOpen.value = false;
  };

  const openWalletDetailModal = (wallet) => {
    selectedWallet.value = wallet;
    isWalletDetailModalOpen.value = true;
  };

  const handleOpenEditFromDetail = (wallet) => {
    selectedWallet.value = wallet;
    isWalletDetailModalOpen.value = false;
    isEditWalletModalOpen.value = true;
  };

  const handleEditWallet = (walletData) => {
    updateWallet({
      id: walletData.id,
      name: walletData.walletName,
      balance: Number(walletData.initialBalance),
      currency: walletData.currency,
      type: walletData.type.toLowerCase(),
      excludeFromTotals: walletData.excludeFromTotals,
    });
    isEditWalletModalOpen.value = false;
    selectedWallet.value = null;
  };
</script>

<template>
  <div
    class="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto shadow-2xl bg-background-light dark:bg-background-dark pb-24 font-display"
  >
    <!-- Top App Bar -->
    <TopAppBar title="My Wallets" :action-icon="Bell" />

    <!-- Total Balance Card -->
    <div class="px-4 py-2 @container">
      <div
        class="flex flex-col items-stretch justify-start rounded-2xl shadow-xs bg-white dark:bg-[#1a2c20] overflow-hidden"
      >
        <div
          class="flex w-full flex-col items-stretch justify-center gap-1 p-6 relative"
        >
          <!-- Background decoration -->
          <div
            class="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl"
          ></div>
          <p
            class="text-text-secondary dark:text-gray-400 text-sm font-medium leading-tight tracking-wide uppercase"
          >
            Total Balance
          </p>
          <div class="flex flex-col gap-2 mt-1 z-0">
            <h1
              class="text-text-main dark:text-white text-4xl font-extrabold leading-tight tracking-tight"
            >
              {{ totalBalance }}
            </h1>
            <div class="flex items-center gap-2">
              <span
                class="flex items-center justify-center bg-primary/20 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-0.5 rounded-full"
              >
                <TrendingUp class="w-3.5 h-3.5 mr-1" />
                +5%
              </span>
              <p
                class="text-text-secondary dark:text-gray-400 text-sm font-normal"
              >
                vs last month
              </p>
            </div>
          </div>
        </div>
        <!-- Visual footer for the card -->
        <div class="h-2 w-full bg-linear-to-r from-primary to-green-300"></div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="flex justify-stretch mt-2">
      <div class="flex flex-1 gap-3 px-4 py-3 justify-between">
        <button
          class="flex-1 flex flex-col gap-2 cursor-pointer items-center justify-center rounded-xl py-3 bg-white dark:bg-[#1a2c20] text-text-main dark:text-white shadow-xs hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
          @click="isCreateWalletModalOpen = true"
        >
          <div
            class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-green-700 dark:text-primary group-hover:scale-110 transition-transform"
          >
            <Plus class="w-6 h-6" />
          </div>
          <span class="text-xs font-bold leading-normal tracking-[0.015em]"
            >Add Wallet</span
          >
        </button>
        <button
          class="flex-1 flex flex-col gap-2 cursor-pointer items-center justify-center rounded-xl py-3 bg-white dark:bg-[#1a2c20] text-text-main dark:text-white shadow-xs hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
        >
          <div
            class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-green-700 dark:text-primary group-hover:scale-110 transition-transform"
          >
            <ArrowLeftRight class="w-6 h-6" />
          </div>
          <span class="text-xs font-bold leading-normal tracking-[0.015em]"
            >Transfer</span
          >
        </button>
        <button
          class="flex-1 flex flex-col gap-2 cursor-pointer items-center justify-center rounded-xl py-3 bg-white dark:bg-[#1a2c20] text-text-main dark:text-white shadow-xs hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
        >
          <div
            class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-green-700 dark:text-primary group-hover:scale-110 transition-transform"
          >
            <CreditCard class="w-6 h-6" />
          </div>
          <span class="text-xs font-bold leading-normal tracking-[0.015em]"
            >Top Up</span
          >
        </button>
      </div>
    </div>

    <!-- Wallet List Headline -->
    <div class="flex items-center justify-between px-4 pt-4 pb-2">
      <h2
        class="text-text-main dark:text-white text-xl font-bold leading-tight"
      >
        Your Accounts
      </h2>
      <button class="text-primary text-sm font-semibold">See All</button>
    </div>

    <!-- Wallet List -->
    <div class="flex flex-col gap-4 px-4 pb-4">
      <AccountCard
        v-for="account in wallets"
        :key="account.id"
        v-bind="account"
        @click="openWalletDetailModal(account)"
      />
    </div>

    <!-- Recent Transactions Mini-List -->
    <div class="px-4 pt-2">
      <h2
        class="text-text-main dark:text-white text-lg font-bold leading-tight mb-3"
      >
        Recent Activity
      </h2>
      <div class="flex flex-col gap-3">
        <div
          v-for="activity in recentActivity"
          :key="activity.id"
          class="flex items-center justify-between bg-white dark:bg-[#1a2c20] p-3 rounded-lg shadow-xs"
        >
          <div class="flex items-center gap-3">
            <div
              class="rounded-full p-2 flex items-center justify-center"
              :class="activity.iconBg"
            >
              <component
                :is="activity.icon"
                class="w-5 h-5"
                :class="activity.iconColor"
              />
            </div>
            <div class="flex flex-col">
              <span class="text-text-main dark:text-white font-bold text-sm">{{
                activity.title
              }}</span>
              <span class="text-text-secondary dark:text-gray-400 text-xs">{{
                activity.date
              }}</span>
            </div>
          </div>
          <span class="font-bold text-sm" :class="activity.amountColor">{{
            activity.amount
          }}</span>
        </div>
      </div>
      <div class="h-6"></div>
    </div>

    <CreateWalletModal
      :is-open="isCreateWalletModalOpen"
      @close="isCreateWalletModalOpen = false"
      @create="handleCreateWallet"
    />

    <WalletDetailModal
      :is-open="isWalletDetailModalOpen"
      :wallet="selectedWallet"
      @close="isWalletDetailModalOpen = false"
      @edit="handleOpenEditFromDetail"
    />

    <EditWalletModal
      :is-open="isEditWalletModalOpen"
      :wallet="selectedWallet"
      @close="isEditWalletModalOpen = false"
      @update="handleEditWallet"
    />

    <BottomNav activeTab="wallets" @navigate="handleNavigate" />
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
