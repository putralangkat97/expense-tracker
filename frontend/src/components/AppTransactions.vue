<script setup>
  import { ref, computed, onMounted } from "vue";
  import {
    Utensils,
    Banknote,
    ShoppingCart,
    Clapperboard,
    Fuel,
    FilterIcon,
    Search,
    Plus,
    Home,
    Car,
    Plane,
    Zap,
    HeartPulse,
    GraduationCap,
    Briefcase,
    Gift,
    Smartphone,
    ShoppingBag,
  } from "lucide-vue-next";
  import BottomNav from "./ui/BottomNav.vue";
  import TransactionItem from "./ui/TransactionItem.vue";
  import FloatingActionButton from "./ui/FloatingActionButton.vue";
  import CreateTransactionModal from "./CreateTransactionModal.vue";
  import TopAppBar from "./ui/TopAppBar.vue";
  import { useAuthStore } from "../stores/auth";
  import {
    transactionService,
    categoryService,
    walletService,
    budgetService,
  } from "../services/finance";

  const authStore = useAuthStore();
  const isCreateTransactionModalOpen = ref(false);
  const isEditMode = ref(false);
  const transactionToEdit = ref(null);
  const isLoading = ref(false);

  const filters = ["All", "Income", "Expense", "Transfer"];
  const activeFilter = ref("All");
  const searchQuery = ref("");

  const transactions = ref([]);
  const categories = ref([]);
  const wallets = ref([]);
  const budgets = ref([]);

  // Icon mapping
  const iconMap = {
    Shopping: ShoppingCart,
    Transport: Car,
    Entertainment: Clapperboard,
    Housing: Home,
    Food: Utensils,
    Travel: Plane,
    Utilities: Zap,
    Health: HeartPulse,
    Education: GraduationCap,
    Work: Briefcase,
    Gift: Gift,
    Electronics: Smartphone,
    "Shopping Bag": ShoppingBag,
    Salary: Banknote,
    Fuel: Fuel,
  };

  const getIconComponent = (iconName) => {
    return iconMap[iconName] || ShoppingCart;
  };

  const fetchData = async () => {
    if (!authStore.user?.id) return;
    isLoading.value = true;
    try {
      const [trans, cats, userWallets, userBudgets] = await Promise.all([
        transactionService.getTransactions(authStore.user.id),
        categoryService.getCategories(),
        walletService.getWallets(authStore.user.id),
        budgetService.getBudgets(authStore.user.id),
      ]);

      categories.value = cats.map((cat) => ({
        ...cat,
        icon: getIconComponent(cat.icon),
      }));
      wallets.value = userWallets;
      budgets.value = userBudgets;

      // Process transactions with category info
      transactions.value = trans
        .map((t) => {
          const cat = categories.value.find((c) => c.id === t.categoryId);
          return {
            ...t,
            categoryName: cat ? cat.name : "Uncategorized",
            icon: cat
              ? cat.icon
              : t.type === "income"
                ? Banknote
                : ShoppingCart,
            iconBg:
              t.type === "income"
                ? "bg-green-50 dark:bg-green-900/20"
                : "bg-gray-100 dark:bg-gray-800",
            iconColor:
              t.type === "income"
                ? "text-green-600 dark:text-green-400"
                : "text-gray-600 dark:text-gray-400",
            amountColor:
              t.type === "income"
                ? "text-green-600 dark:text-green-400"
                : "text-red-500 dark:text-red-400",
            formattedAmount:
              t.type === "income" ? `+$${t.amount}` : `-$${t.amount}`,
            dateObject: new Date(t.transactionDate),
          };
        })
        .sort((a, b) => b.dateObject - a.dateObject);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(() => {
    fetchData();
  });

  const totalBalance = computed(() => {
    return wallets.value.reduce((sum, w) => sum + (w.balance || 0), 0);
  });

  const filteredTransactions = computed(() => {
    let result = transactions.value;

    // Filter by type
    if (activeFilter.value !== "All") {
      result = result.filter(
        (t) => t.type.toLowerCase() === activeFilter.value.toLowerCase(),
      );
    }

    // Filter by search query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(
        (t) =>
          t.description?.toLowerCase().includes(query) ||
          t.categoryName.toLowerCase().includes(query),
      );
    }

    return result;
  });

  const transactionGroups = computed(() => {
    const groups = {};
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    filteredTransactions.value.forEach((t) => {
      let dateKey = t.dateObject.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      });

      if (t.dateObject.toDateString() === today.toDateString()) {
        dateKey = "Today";
      } else if (t.dateObject.toDateString() === yesterday.toDateString()) {
        dateKey = "Yesterday";
      }

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push({
        id: t.id,
        title: t.description || t.categoryName,
        date: t.categoryName, // Subtitle in item
        amount: t.formattedAmount,
        icon: t.icon,
        iconBg: t.iconBg,
        iconColor: t.iconColor,
        amountColor: t.amountColor,
        raw: t, // Keep raw data for editing
      });
    });

    // Convert to array and sort? They are already pushed in sorted order if transactions is sorted.
    // Just need to maintain group order? Object keys iteration order isn't guaranteed, but usually follows insertion for strings.
    // Better to map to array.
    return Object.keys(groups).map((date) => ({
      title: date,
      items: groups[date],
    }));
  });

  const handleAddTransaction = () => {
    isEditMode.value = false;
    transactionToEdit.value = null;
    isCreateTransactionModalOpen.value = true;
  };

  const openEditModal = (transactionItem) => {
    isEditMode.value = true;
    transactionToEdit.value = transactionItem.raw;
    isCreateTransactionModalOpen.value = true;
  };

  const handleCreateTransaction = async (data) => {
    try {
      await transactionService.createTransaction({
        userId: authStore.user.id,
        ...data,
      });
      // Handle budget update locally or fetch
      if (data.type === "expense" && data.categoryId) {
        // Find budget for this category
        const budget = budgets.value.find(
          (b) => b.categoryId === data.categoryId,
        );
        if (budget) {
          await budgetService.updateBudget(budget.id, {
            spentAmount: (budget.spentAmount || 0) + data.amount,
          });
        }
      }

      await fetchData(); // Refresh all data to sync wallets/budgets
      isCreateTransactionModalOpen.value = false;
    } catch (error) {
      console.error("Failed to create transaction:", error);
    }
  };

  const handleUpdateTransaction = async (data) => {
    try {
      const { id, ...updateData } = data;
      const oldTransaction = transactions.value.find((t) => t.id === id);

      // 1. Revert old transaction effect on Wallet
      // (This logic is complex to do purely frontend if we want to be safe,
      // but strictly following 'ensure' from prompt, we try our best or rely on fetch)
      // Since backend doesn't handle update logic for wallet/budget automatically (as we saw),
      // we must do it manually here or add endpoints.
      // Updating wallet manually:

      if (oldTransaction) {
        const oldWallet = wallets.value.find(
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
          const oldBudget = budgets.value.find(
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

      // 2. Update Transaction
      await transactionService.updateTransaction(id, updateData);

      // 3. Apply new transaction effect on Wallet
      // Fetch fresh wallets to get reversed state? Or just calculate.
      // Safer to fetch or just apply on the potentially stale object if we are fast.
      // But we need the ID.
      const newWallet = wallets.value.find((w) => w.id === updateData.walletId);
      if (newWallet) {
        // We need to fetch the wallet again to be sure of its balance after reversion?
        // Or just trust the sequence.
        // To be safe, let's fetch specific wallet.
        const freshWallet = await walletService
          .getWallets(authStore.user.id)
          .then((ws) => ws.find((w) => w.id === updateData.walletId));
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
        // We need fresh budgets
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

      await fetchData();
      isCreateTransactionModalOpen.value = false;
    } catch (error) {
      console.error("Failed to update transaction:", error);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      const transaction = transactions.value.find((t) => t.id === id);

      // Revert wallet balance
      if (transaction) {
        const wallet = wallets.value.find((w) => w.id === transaction.walletId);
        if (wallet) {
          let newBalance = wallet.balance;
          if (transaction.type === "income") newBalance -= transaction.amount;
          else newBalance += transaction.amount; // expense/transfer reverted adds money back

          await walletService.updateWallet(wallet.id, { balance: newBalance });
        }

        // Revert budget spent
        if (transaction.type === "expense" && transaction.categoryId) {
          const budget = budgets.value.find(
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
      await fetchData();
      isCreateTransactionModalOpen.value = false;
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  };
</script>

<template>
  <div
    class="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-background-light dark:bg-background-dark font-display text-text-dark dark:text-[#e0eadd]"
  >
    <!-- Top Sticky Header Area -->
    <header
      class="sticky top-0 z-30 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors duration-300"
    >
      <TopAppBar title="Transactions" :action-icon="FilterIcon" />
      <!-- Search Bar Integrated in Header -->
      <div class="px-4 pb-3">
        <div class="relative group">
          <div
            class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
          >
            <Search
              class="w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors"
            />
          </div>
          <input
            v-model="searchQuery"
            class="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-200 rounded-xl bg-white focus:ring-primary focus:border-primary dark:bg-card-dark dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary shadow-xs outline-hidden"
            placeholder="Search transactions..."
            type="text"
          />
        </div>
      </div>
    </header>

    <!-- Scrollable Main Content -->
    <main class="flex-1 pb-32">
      <!-- Total Balance Section -->
      <div class="px-4 py-6">
        <p class="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
          Total Balance
        </p>
        <h1
          class="text-4xl font-extrabold tracking-tight text-text-dark dark:text-white"
        >
          {{ isLoading ? "..." : `$${totalBalance.toLocaleString()}` }}
        </h1>
      </div>

      <!-- Filter Chips (Horizontal Scroll) -->
      <div
        class="flex gap-3 px-4 pb-6 overflow-x-auto no-scrollbar items-center"
      >
        <button
          v-for="filter in filters"
          :key="filter"
          class="flex h-9 shrink-0 items-center justify-center px-5 rounded-lg font-medium text-sm transition-all active:scale-95"
          :class="
            activeFilter === filter
              ? 'bg-primary text-text-dark font-bold shadow-md shadow-primary/20'
              : 'bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary/50'
          "
          @click="activeFilter = filter"
        >
          {{ filter }}
        </button>
      </div>

      <!-- Transactions List -->
      <div class="flex flex-col gap-2">
        <div
          v-if="isLoading && transactions.length === 0"
          class="text-center py-4 text-gray-500"
        >
          Loading transactions...
        </div>
        <div
          v-else-if="transactionGroups.length === 0"
          class="text-center py-10 text-gray-500"
        >
          No transactions found.
        </div>
        <div v-for="group in transactionGroups" :key="group.title">
          <div
            class="sticky top-32 z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-xs px-4 py-2 border-y border-transparent transition-colors"
          >
            <h3
              class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide"
            >
              {{ group.title }}
            </h3>
          </div>
          <div class="px-4 flex flex-col gap-3">
            <div
              v-for="transaction in group.items"
              :key="transaction.id"
              class="cursor-pointer"
              @click="openEditModal(transaction)"
            >
              <TransactionItem
                :title="transaction.title"
                :date="transaction.date"
                :amount="transaction.amount"
                :icon="transaction.icon"
                :iconBg="transaction.iconBg"
                :iconColor="transaction.iconColor"
                :amountColor="transaction.amountColor"
              />
            </div>
          </div>
        </div>
      </div>
    </main>

    <CreateTransactionModal
      :is-open="isCreateTransactionModalOpen"
      :is-edit-mode="isEditMode"
      :transaction-to-edit="transactionToEdit"
      :categories="categories"
      :wallets="wallets"
      @close="isCreateTransactionModalOpen = false"
      @create="handleCreateTransaction"
      @update="handleUpdateTransaction"
      @delete="handleDeleteTransaction"
    />

    <FloatingActionButton @click="handleAddTransaction" />
    <BottomNav activeTab="transactions" />
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
