import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import {
  walletService,
  transactionService,
  categoryService,
} from "../services/finance";
import { useAuthStore } from "../stores/auth";
import { computed } from "vue";
import {
  CreditCard,
  Banknote,
  PiggyBank,
  ShoppingBag,
  Clapperboard,
  ArrowDown,
  Landmark,
} from "lucide-vue-next";
import { formatCurrency } from "../helpers/currency";

export const useWallets = () => {
  const authStore = useAuthStore();
  const userId = computed(() => authStore.user?.id);
  const queryClient = useQueryClient();

  const { data: walletsData, isLoading: isWalletsLoading } = useQuery({
    queryKey: ["wallets", userId],
    queryFn: () => walletService.getWallets(userId.value),
    enabled: () => !!userId.value,
  });

  const { data: transactionsData, isLoading: isTransactionsLoading } = useQuery(
    {
      queryKey: ["transactions", userId],
      queryFn: () => transactionService.getTransactions(userId.value),
      enabled: () => !!userId.value,
    },
  );

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getCategories(),
  });

  const wallets = computed(() => {
    if (!walletsData.value) return [];

    return walletsData.value.map((w) => {
      let icon = Banknote;
      let iconColor = "text-green-600 dark:text-green-400";
      let iconBg = "bg-gray-100 dark:bg-gray-700";

      if (w.type === "bank") {
        icon = Landmark;
        iconColor = "text-blue-600 dark:text-blue-400";
      } else if (w.type === "credit") {
        icon = CreditCard;
        iconColor = "text-purple-600 dark:text-purple-400";
      } else if (w.type === "savings") {
        icon = PiggyBank;
        iconColor = "text-orange-600 dark:text-orange-400";
      }

      return {
        id: w.id,
        name: w.name,
        type: w.type,
        currency: w.currency,
        excludeFromTotals: w.excludeFromTotals,
        description: w.type
          ? w.type.charAt(0).toUpperCase() + w.type.slice(1)
          : "Cash",
        balance: formatCurrency(w.balance || 0, w.currency || "USD"),
        icon,
        iconColor,
        iconBg,
        backgroundImage: w.backgroundImage || null,
      };
    });
  });

  const totalBalance = computed(() => {
    if (!walletsData.value) return 0;
    const total = walletsData.value.reduce(
      (sum, wallet) =>
        sum + (wallet.excludeFromTotals ? 0 : wallet.balance || 0),
      0,
    );
    return formatCurrency(total);
  });

  const recentActivity = computed(() => {
    if (!transactionsData.value) return [];

    // Sort by date desc
    const sorted = [...transactionsData.value]
      .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))
      .slice(0, 5); // Take top 5

    return sorted.map((t) => {
      const category = categories.value?.find((c) => c.id === t.categoryId);
      let icon = ShoppingBag;
      let iconBg = "bg-[#f8fcf9] dark:bg-gray-800";
      let iconColor = "text-text-main dark:text-white";

      // Simple icon mapping logic (same as dashboard)
      if (t.type === "income") {
        icon = ArrowDown;
        iconBg = "bg-primary/10";
        iconColor = "text-green-700 dark:text-green-400";
      } else if (
        category &&
        category.name.toLowerCase().includes("entertainment")
      ) {
        icon = Clapperboard;
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
            ? "text-green-600 dark:text-green-400"
            : "text-text-main dark:text-white",
        icon,
        iconBg,
        iconColor,
      };
    });
  });

  const createWalletMutation = useMutation({
    mutationFn: (data) =>
      walletService.createWallet({ ...data, userId: userId.value }),
    onSuccess: () => {
      queryClient.invalidateQueries(["wallets", userId]);
    },
  });

  const updateWalletMutation = useMutation({
    mutationFn: (data) => walletService.updateWallet(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["wallets", userId]);
    },
  });

  return {
    wallets,
    totalBalance,
    recentActivity,
    isLoading: computed(
      () => isWalletsLoading.value || isTransactionsLoading.value,
    ),
    createWallet: createWalletMutation.mutate,
    updateWallet: updateWalletMutation.mutate,
  };
};
