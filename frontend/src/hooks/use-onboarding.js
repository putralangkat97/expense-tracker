import { computed } from "vue";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import {
  walletService,
  budgetService,
  categoryService,
} from "../services/finance";
import { useAuthStore } from "../stores/auth";
import { useOnboardingStore } from "../stores/onboarding";
import { useRouter } from "vue-router";

export const useOnboarding = () => {
  const router = useRouter();
  const authStore = useAuthStore();
  const onboardingStore = useOnboardingStore();
  const queryClient = useQueryClient();

  const submitOnboardingMutation = useMutation({
    mutationFn: async () => {
      const user = authStore.user;
      if (!user) throw new Error("User not authenticated");

      const walletData = onboardingStore.walletData;
      const budgetData = onboardingStore.budgetData;

      // Create Wallet
      const wallet = await walletService.createWallet({
        name: walletData.name || "My Wallet",
        currency: walletData.currency,
        balance: parseFloat(walletData.balance) || 0,
        icon: walletData.style,
        type:
          walletData.style === "credit_card"
            ? "credit"
            : walletData.style === "savings"
              ? "savings"
              : "cash",
        userId: user.id,
      });

      // Create Budget
      const budget = await budgetService.createBudget({
        name: budgetData.name || `${budgetData.categoryName} Budget`,
        limitAmount: parseFloat(budgetData.limitAmount) || 0,
        categoryId: budgetData.categoryId,
        frequency: budgetData.frequency.toLowerCase(),
        userId: user.id,
      });

      return { wallet, budget };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      onboardingStore.reset();
      router.push("/dashboard");
    },
  });

  return {
    submitOnboardingMutation,
  };
};

export const useOnboardingSummary = () => {
  const onboardingStore = useOnboardingStore();

  const walletData = computed(() => onboardingStore.walletData);
  const budgetData = computed(() => onboardingStore.budgetData);

  const walletBalance = computed(() => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: walletData.value.currency || "USD",
    }).format(parseFloat(walletData.value.balance) || 0);
  });

  const budgetLimit = computed(() => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(parseFloat(budgetData.value.limitAmount) || 0);
  });

  return {
    walletData,
    budgetData,
    walletBalance,
    budgetLimit,
  };
};

export const useCategories = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getCategories(),
  });

  return {
    categories,
    isLoading,
  };
};
