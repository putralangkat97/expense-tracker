import { useQuery } from "@tanstack/vue-query";
import {
  walletService,
  budgetService,
  transactionService,
  categoryService,
} from "../services/finance";
import { useAuthStore } from "../stores/auth";
import { computed } from "vue";
import {
  ShoppingBag,
  Clapperboard,
  Banknote,
  Utensils,
  Zap,
  Home,
  Bus,
  ShoppingCart,
} from "lucide-vue-next";
import { formatCurrency } from "../helpers/currency";

export const useDashboard = () => {
  const authStore = useAuthStore();
  const userId = computed(() => authStore.user?.id);

  const { data: wallets, isLoading: isWalletsLoading } = useQuery({
    queryKey: ["wallets", userId],
    queryFn: () => walletService.getWallets(userId.value),
    enabled: () => !!userId.value,
  });

  const { data: budgets, isLoading: isBudgetsLoading } = useQuery({
    queryKey: ["budgets", userId],
    queryFn: () => budgetService.getBudgets(userId.value),
    enabled: () => !!userId.value,
  });

  const { data: transactions, isLoading: isTransactionsLoading } = useQuery({
    queryKey: ["transactions", userId],
    queryFn: () => transactionService.getTransactions(userId.value),
    enabled: () => !!userId.value,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getCategories(),
  });

  const totalBalance = computed(() => {
    if (!wallets.value) return 0;
    return wallets.value.reduce(
      (sum, wallet) =>
        sum + (wallet.excludeFromTotals ? 0 : wallet.balance || 0),
      0,
    );
  });

  const monthlyBudget = computed(() => {
    if (!budgets.value || budgets.value.length === 0) return null;
    // For simplicity, take the first budget or calculate total.
    // Let's take the first one for now as per design or aggregate.
    // The design shows "Monthly Budget" with a total.
    // Let's aggregate all monthly budgets.

    const monthlyBudgets = budgets.value.filter(
      (b) => b.frequency === "Monthly" || b.frequency === "monthly",
    );
    if (monthlyBudgets.length === 0) return null;

    const limit = monthlyBudgets.reduce((sum, b) => sum + b.limitAmount, 0);
    const spent = monthlyBudgets.reduce(
      (sum, b) => sum + (b.spentAmount || 0),
      0,
    );

    return {
      limit,
      spent,
      percentage: limit > 0 ? Math.round((spent / limit) * 100) : 0,
      remaining: limit - spent,
    };
  });

  const recentTransactions = computed(() => {
    if (!transactions.value) return [];

    // Sort by date desc
    const sorted = [...transactions.value]
      .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))
      .slice(0, 5); // Take top 5

    return sorted.map((t) => {
      const category = categories.value?.find((c) => c.id === t.categoryId);
      let icon = ShoppingBag;
      let iconBg = "bg-gray-100 dark:bg-surface-dark";
      let iconColor = "text-text-main-light dark:text-text-main-dark";

      // Simple icon mapping based on category name (could be better)
      if (category) {
        if (category.name.toLowerCase().includes("food")) icon = Utensils;
        else if (category.name.toLowerCase().includes("entertainment"))
          icon = Clapperboard;
        else if (
          category.name.toLowerCase().includes("salary") ||
          t.type === "income"
        ) {
          icon = Banknote;
          iconBg = "bg-primary/10";
          iconColor = "text-primary-dark dark:text-primary";
        } else if (category.name.toLowerCase().includes("shopping"))
          icon = ShoppingCart;
        else if (category.name.toLowerCase().includes("transport")) icon = Bus;
        else if (category.name.toLowerCase().includes("housing")) icon = Home;
        else if (category.name.toLowerCase().includes("utilities")) icon = Zap;
      }

      return {
        id: t.id,
        title: t.description || category?.name || "Transaction",
        date: new Date(t.transactionDate).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        }),
        amount:
          (t.type === "expense" ? "-" : "+") +
          formatCurrency(t.amount, t.currency || "USD"),
        amountColor:
          t.type === "income"
            ? "text-primary-dark dark:text-primary"
            : "text-text-main-light dark:text-text-main-dark",
        icon,
        iconBg,
        iconColor,
      };
    });
  });

  return {
    wallets,
    budgets,
    transactions,
    totalBalance,
    monthlyBudget,
    recentTransactions,
    isLoading: computed(
      () =>
        isWalletsLoading.value ||
        isBudgetsLoading.value ||
        isTransactionsLoading.value,
    ),
  };
};
