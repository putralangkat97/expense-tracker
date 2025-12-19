<script setup>
  import {
    Search,
    Bell,
    TrendingUp,
    Send,
    FileText,
    CreditCard,
    MoreHorizontal,
    PlusCircle,
  } from "lucide-vue-next";
  import { Button } from "@/components/ui/button";
  import BottomNav from "./ui/BottomNav.vue";
  import WalletCard from "./ui/WalletCard.vue";
  import TransactionItem from "./ui/TransactionItem.vue";
  import { useDashboard } from "../hooks/use-dashboard";
  import { useAuthStore } from "../stores/auth";
  import { useRouter } from "vue-router";
  import { ref } from "vue";
  import CreateWalletModal from "./CreateWalletModal.vue";
  import EditWalletModal from "./EditWalletModal.vue";
  import WalletDetailModal from "./WalletDetailModal.vue";
  import CreateTransactionModal from "./CreateTransactionModal.vue";
  import TransactionDetailModal from "./TransactionDetailModal.vue";
  import {
    walletService,
    transactionService,
    budgetService,
  } from "../services/finance";
  import { useQueryClient } from "@tanstack/vue-query";
  import { formatCurrency } from "../helpers/currency";

  const router = useRouter();
  const authStore = useAuthStore();
  const queryClient = useQueryClient();
  const {
    totalBalance,
    monthlyBudget,
    recentTransactions,
    wallets,
    transactions,
    categories,
    budgets,
  } = useDashboard();

  const showCreateWalletModal = ref(false);
  const showEditWalletModal = ref(false);
  const showWalletDetailModal = ref(false);
  const selectedWallet = ref(null);

  const showCreateTransactionModal = ref(false); // For quick add if needed later
  const showEditTransactionModal = ref(false);
  const showTransactionDetailModal = ref(false);
  const selectedTransaction = ref(null);

  const handleCreateWallet = async (walletData) => {
    try {
      await walletService.createWallet({
        userId: authStore.user?.id,
        name: walletData.walletName,
        balance: Number(walletData.initialBalance),
        currency: walletData.currency,
        type: walletData.type.toLowerCase(),
        excludeFromTotals: walletData.excludeFromTotals,
      });
      await queryClient.invalidateQueries({ queryKey: ["wallets"] });
      showCreateWalletModal.value = false;
    } catch (error) {
      console.error("Failed to create wallet:", error);
    }
  };

  const openWalletDetailModal = (wallet) => {
    selectedWallet.value = wallet;
    showWalletDetailModal.value = true;
  };

  const handleOpenEditFromDetail = (wallet) => {
    selectedWallet.value = wallet;
    showWalletDetailModal.value = false;
    showEditWalletModal.value = true;
  };

  const handleEditWallet = async (walletData) => {
    try {
      await walletService.updateWallet(walletData.id, {
        name: walletData.walletName,
        balance: Number(walletData.initialBalance),
        currency: walletData.currency,
        type: walletData.type.toLowerCase(),
        excludeFromTotals: walletData.excludeFromTotals,
      });
      await queryClient.invalidateQueries({ queryKey: ["wallets"] });
      showEditWalletModal.value = false;
      selectedWallet.value = null;
    } catch (error) {
      console.error("Failed to update wallet:", error);
    }
  };

  // Transaction Logic
  const openTransactionDetailModal = (formattedTransaction) => {
    // Find raw transaction from the full list using ID
    const raw = transactions.value?.find(
      (t) => t.id === formattedTransaction.id,
    );
    if (raw) {
      selectedTransaction.value = raw;
      showTransactionDetailModal.value = true;
    }
  };

  const handleOpenEditTransactionFromDetail = (transaction) => {
    selectedTransaction.value = transaction;
    showTransactionDetailModal.value = false;
    showEditTransactionModal.value = true;
  };

  const handleCreateTransaction = async (data) => {
    try {
      await transactionService.createTransaction({
        userId: authStore.user.id,
        ...data,
      });
      // Budget update for expense
      if (data.type === "expense" && data.categoryId) {
        const budget = budgets.value?.find(
          (b) => b.categoryId === data.categoryId,
        );
        if (budget) {
          await budgetService.updateBudget(budget.id, {
            spentAmount: (budget.spentAmount || 0) + data.amount,
          });
        }
      }
      await queryClient.invalidateQueries({ queryKey: ["transactions"] });
      await queryClient.invalidateQueries({ queryKey: ["wallets"] });
      await queryClient.invalidateQueries({ queryKey: ["budgets"] });
      showCreateTransactionModal.value = false;
    } catch (error) {
      console.error("Failed to create transaction:", error);
    }
  };

  const handleUpdateTransaction = async (data) => {
    try {
      const { id, ...updateData } = data;
      const oldTransaction = transactions.value?.find((t) => t.id === id);

      if (oldTransaction) {
        // Revert old wallet effect
        const oldWallet = wallets.value?.find(
          (w) => w.id === oldTransaction.walletId,
        );
        if (oldWallet) {
          let reversedBalance = oldWallet.balance;
          if (oldTransaction.type === "income")
            reversedBalance -= oldTransaction.amount;
          else reversedBalance += oldTransaction.amount;
          await walletService.updateWallet(oldWallet.id, {
            balance: reversedBalance,
          });
        }
        // Revert old budget effect
        if (oldTransaction.type === "expense" && oldTransaction.categoryId) {
          const oldBudget = budgets.value?.find(
            (b) => b.categoryId === oldTransaction.categoryId,
          );
          if (oldBudget) {
            await budgetService.updateBudget(oldBudget.id, {
              spentAmount: Math.max(
                0,
                (oldBudget.spentAmount || 0) - oldTransaction.amount,
              ),
            });
          }
        }
      }

      await transactionService.updateTransaction(id, updateData);

      // Apply new wallet effect
      // We should refetch wallet to be safe but here we approximate or just invalidate
      // For immediate consistency locally:
      const newWallet = wallets.value?.find(
        (w) => w.id === updateData.walletId,
      );
      if (newWallet) {
        // Fetch fresh wallet to apply new balance
        const freshWallets = await walletService.getWallets(authStore.user.id);
        const freshWallet = freshWallets.find(
          (w) => w.id === updateData.walletId,
        );
        if (freshWallet) {
          let newBalance = freshWallet.balance;
          if (updateData.type === "income") newBalance += updateData.amount;
          else newBalance -= updateData.amount;
          await walletService.updateWallet(freshWallet.id, {
            balance: newBalance,
          });
        }
      }

      // Apply new budget effect
      if (updateData.type === "expense" && updateData.categoryId) {
        const freshBudgets = await budgetService.getBudgets(authStore.user.id);
        const budget = freshBudgets.find(
          (b) => b.categoryId === updateData.categoryId,
        );
        if (budget) {
          await budgetService.updateBudget(budget.id, {
            spentAmount: (budget.spentAmount || 0) + updateData.amount,
          });
        }
      }

      await queryClient.invalidateQueries({ queryKey: ["transactions"] });
      await queryClient.invalidateQueries({ queryKey: ["wallets"] });
      await queryClient.invalidateQueries({ queryKey: ["budgets"] });
      showEditTransactionModal.value = false;
      selectedTransaction.value = null;
    } catch (error) {
      console.error("Failed to update transaction:", error);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      const transaction = transactions.value?.find((t) => t.id === id);
      if (transaction) {
        const wallet = wallets.value?.find(
          (w) => w.id === transaction.walletId,
        );
        if (wallet) {
          let newBalance = wallet.balance;
          if (transaction.type === "income") newBalance -= transaction.amount;
          else newBalance += transaction.amount;
          await walletService.updateWallet(wallet.id, { balance: newBalance });
        }
        if (transaction.type === "expense" && transaction.categoryId) {
          const budget = budgets.value?.find(
            (b) => b.categoryId === transaction.categoryId,
          );
          if (budget) {
            await budgetService.updateBudget(budget.id, {
              spentAmount: Math.max(
                0,
                (budget.spentAmount || 0) - transaction.amount,
              ),
            });
          }
        }
      }
      await transactionService.deleteTransaction(id);
      await queryClient.invalidateQueries({ queryKey: ["transactions"] });
      await queryClient.invalidateQueries({ queryKey: ["wallets"] });
      await queryClient.invalidateQueries({ queryKey: ["budgets"] });
      showEditTransactionModal.value = false;
      showTransactionDetailModal.value = false;
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  };

  const navigateToBudgets = () => {
    router.push("/budgets");
  };
</script>

<template>
  <div
    class="relative flex min-h-screen w-full flex-col overflow-x-hidden pb-24 bg-background-light dark:bg-background-dark font-display text-text-main-light dark:text-text-main-dark"
  >
    <CreateWalletModal
      v-model:open="showCreateWalletModal"
      @create="handleCreateWallet"
    />
    <EditWalletModal
      v-model:open="showEditWalletModal"
      :wallet="selectedWallet"
      @update="handleEditWallet"
    />
    <WalletDetailModal
      v-model:open="showWalletDetailModal"
      :wallet="selectedWallet"
      @edit="handleOpenEditFromDetail"
    />
    <CreateTransactionModal
      v-model:open="showCreateTransactionModal"
      :is-edit-mode="false"
      :categories="categories || []"
      :wallets="wallets || []"
      @create="handleCreateTransaction"
    />
    <CreateTransactionModal
      v-model:open="showEditTransactionModal"
      :is-edit-mode="true"
      :transaction-to-edit="selectedTransaction"
      :categories="categories || []"
      :wallets="wallets || []"
      @update="handleUpdateTransaction"
      @delete="handleDeleteTransaction"
    />
    <TransactionDetailModal
      v-model:open="showTransactionDetailModal"
      :transaction="selectedTransaction"
      :wallets="wallets || []"
      :categories="categories || []"
      @edit="handleOpenEditTransactionFromDetail"
      @delete="handleDeleteTransaction"
    />
    <!-- Header -->
    <header
      class="flex items-center justify-between p-6 pt-8 pb-4 sticky top-0 z-30 bg-background-light/90 dark:bg-background-dark/95 backdrop-blur-md"
    >
      <div class="flex flex-col">
        <span
          class="text-xs font-semibold text-text-sub-light uppercase tracking-wider mb-1"
          >Dashboard</span
        >
        <h2 class="text-2xl font-extrabold tracking-tight">
          Hi, {{ authStore.userName }} 👋
        </h2>
      </div>
      <div class="flex items-center justify-end gap-3">
        <Button
          variant="outline"
          size="icon"
          class="h-11 w-11 rounded-full bg-surface-light dark:bg-surface-dark border-gray-100 dark:border-gray-800 shadow-xs hover:bg-gray-50"
        >
          <Search class="w-5.5 h-5.5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          class="h-11 w-11 rounded-full bg-surface-light dark:bg-surface-dark border-gray-100 dark:border-gray-800 shadow-xs hover:bg-gray-50 relative"
        >
          <Bell class="w-5.5 h-5.5" />
          <span
            class="absolute top-2.5 right-3 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-surface-dark"
          ></span>
        </Button>
      </div>
    </header>

    <!-- Monthly Budget -->
    <div class="px-6 py-2" v-if="monthlyBudget">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold">Monthly Budget</h3>
        <Button
          variant="link"
          class="text-sm font-semibold text-primary hover:text-primary-dark p-0 h-auto"
          @click="navigateToBudgets"
        >
          Details
        </Button>
      </div>
      <div
        class="w-full rounded-3xl bg-surface-light dark:bg-surface-dark p-6 shadow-soft border border-gray-100 dark:border-gray-800"
      >
        <div class="flex items-start justify-between mb-4">
          <div>
            <p class="text-sm font-medium text-text-sub-light mb-1">
              Total Budget
            </p>
            <div class="flex items-baseline gap-2">
              <h2 class="text-3xl font-extrabold">
                {{ useHelpers.formatCurrency(monthlyBudget.spent) }}
              </h2>
              <span class="text-sm font-medium text-text-sub-light"
                >/ {{ useHelpers.formatCurrency(monthlyBudget.limit) }}</span
              >
            </div>
          </div>
          <div class="flex flex-col items-end">
            <div
              class="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1"
            >
              <TrendingUp class="w-3.5 h-3.5" />
              {{ monthlyBudget.percentage }}%
            </div>
            <span class="text-[10px] text-text-sub-light mt-1"
              >Left
              {{ useHelpers.formatCurrency(monthlyBudget.remaining) }}</span
            >
          </div>
        </div>
        <div
          class="relative h-4 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden mb-6"
        >
          <div
            class="absolute left-0 top-0 h-full rounded-full bg-linear-to-r from-primary to-primary-dark shadow-[0_0_10px_rgba(25,230,94,0.4)]"
            :style="{
              width: `${Math.min(monthlyBudget.percentage, 100)}%`,
            }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Total Balance Card -->
    <div class="px-6 py-4">
      <div
        class="relative overflow-hidden rounded-xl bg-[#1a1a1a] dark:bg-black p-8 shadow-2xl shadow-black/20 text-white border border-white/5"
      >
        <!-- Background Gradients -->
        <div
          class="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"
        ></div>
        <div
          class="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/20 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4"
        ></div>

        <div class="relative z-10 flex flex-col gap-6">
          <!-- Total Balance -->
          <div>
            <p class="text-gray-400 text-sm font-medium mb-1 tracking-wide">
              Total Balance
            </p>
            <h1 class="text-[2.75rem] font-bold tracking-tight leading-tight">
              {{ formatCurrency(totalBalance) }}
            </h1>
          </div>

          <!-- Monthly Summary -->
          <div class="flex gap-4">
            <!-- Income -->
            <div
              class="flex-1 bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/5"
            >
              <div class="flex items-center gap-2 mb-2 text-green-400">
                <div class="p-1.5 bg-green-400/10 rounded-full">
                  <TrendingUp class="w-3.5 h-3.5" />
                </div>
                <span class="text-xs font-bold uppercase tracking-wider"
                  >Income</span
                >
              </div>
              <p class="text-lg font-bold text-white tracking-tight">
                {{ formatCurrency(monthlyBudget?.limit || 0) }}
              </p>
            </div>

            <!-- Expense -->
            <div
              class="flex-1 bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/5"
            >
              <div class="flex items-center gap-2 mb-2 text-red-400">
                <div class="p-1.5 bg-red-400/10 rounded-full">
                  <TrendingUp class="w-3.5 h-3.5 rotate-180" />
                </div>
                <span class="text-xs font-bold uppercase tracking-wider"
                  >Expense</span
                >
              </div>
              <p class="text-lg font-bold text-white tracking-tight">
                {{ formatCurrency(monthlyBudget?.spent || 0) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Button
        class="w-full mt-4 h-auto py-4 rounded-2xl shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-black active:scale-[0.98] transition-all gap-2 border border-white/10"
        @click="showCreateTransactionModal = true"
      >
        <PlusCircle class="font-bold w-6 h-6" />
        <span class="text-base font-bold">Quick Add Transaction</span>
      </Button>
    </div>

    <!-- My Wallets -->
    <div class="flex flex-col pt-2" v-if="wallets && wallets.length > 0">
      <div class="flex items-center justify-between px-6 pb-3">
        <h3 class="text-lg font-bold">My Wallets</h3>
        <Button
          variant="link"
          class="text-sm font-semibold text-primary hover:text-primary-dark p-0 h-auto"
          @click="router.push('/wallets')"
        >
          See All
        </Button>
      </div>
      <div class="flex w-full overflow-x-auto no-scrollbar px-6 pb-4">
        <div class="flex min-w-max flex-row gap-4">
          <WalletCard
            v-for="wallet in wallets"
            :key="wallet.id"
            :name="wallet.name"
            :balance="formatCurrency(wallet.balance)"
            :background-image="
              wallet.backgroundImage ||
              'https://lh3.googleusercontent.com/aida-public/AB6AXuCxOxOjPk-E9hLzv9Yt9nAkPDWUgqStFEumXNc0Us390eibU4vGH42SHrl9BOn-yqw86nJdivjlRvVyqtfwbpMw5Lv79sosmK3sfMf4scqXWv6vbt8TFd8Wl1yLFbpEbW3sHUi_h15KB7dbnX_wqqAI-JVDgUNor19AmQXUq-HSLnN4TagXg7ptmVFG5KaU-zmppqv0WaM9n97Q_HmJ2n2NysKA9OdVOYB8pbr9hyUi81MNhKUYKS5D5ITnRdgElDXI0DlSACKpBvk'
            "
            overlay-opacity="bg-black/40"
            :exclude-from-totals="wallet.excludeFromTotals"
            @click="openWalletDetailModal(wallet)"
          />

          <!-- Add New Wallet Button -->
          <div
            class="flex flex-col gap-2 w-15 group cursor-pointer justify-center items-center"
            @click="showCreateWalletModal = true"
          >
            <div
              class="flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-surface-dark border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-400 group-active:scale-95 hover:border-primary hover:text-primary transition-colors"
            >
              <PlusCircle class="w-6 h-6" />
            </div>
            <p class="text-[10px] font-medium text-text-sub-light">New</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="px-6 py-2 mt-2 pb-8">
      <div class="flex items-center justify-between pb-4">
        <h3 class="text-lg font-bold">Recent Activity</h3>
        <Button
          variant="link"
          class="text-sm font-semibold text-primary hover:text-primary-dark p-0 h-auto"
          @click="router.push('/transactions')"
        >
          View All
        </Button>
      </div>
      <div class="flex flex-col gap-4" v-if="recentTransactions.length > 0">
        <TransactionItem
          v-for="transaction in recentTransactions"
          :key="transaction.id"
          v-bind="transaction"
          class="cursor-pointer"
          @click="openTransactionDetailModal(transaction)"
        />
      </div>
      <div v-else class="text-center text-gray-400 py-4">
        No recent transactions
      </div>
    </div>

    <div class="h-24"></div>

    <BottomNav activeTab="dashboard" />
  </div>
</template>
