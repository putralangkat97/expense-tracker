import { defineStore } from "pinia";
import { ref } from "vue";

export const useOnboardingStore = defineStore("onboarding", () => {
  const walletData = ref({
    name: "",
    currency: "USD",
    balance: "",
    style: "wallet",
  });

  const budgetData = ref({
    name: "",
    limitAmount: "",
    categoryId: "",
    categoryName: "Groceries",
    frequency: "Monthly",
  });

  function setWalletData(data) {
    walletData.value = { ...walletData.value, ...data };
  }

  function setBudgetData(data) {
    budgetData.value = { ...budgetData.value, ...data };
  }

  function reset() {
    walletData.value = {
      name: "",
      currency: "USD",
      balance: "",
      style: "wallet",
    };
    budgetData.value = {
      name: "",
      limitAmount: "",
      categoryId: "",
      categoryName: "Groceries",
      frequency: "Monthly",
    };
  }

  return {
    walletData,
    budgetData,
    setWalletData,
    setBudgetData,
    reset,
  };
});
