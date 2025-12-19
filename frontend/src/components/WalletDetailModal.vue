<script setup>
  import { computed, ref, onMounted, watch } from "vue";
  import {
    X,
    Pencil,
    ArrowUpRight,
    ArrowDownLeft,
    Calendar,
    Wallet,
    CreditCard,
    Landmark,
    Banknote,
    ShoppingCart,
    Utensils,
    Car,
    Clapperboard,
    Home,
    Plane,
    Zap,
    HeartPulse,
    GraduationCap,
    Briefcase,
    Gift,
    Smartphone,
    ShoppingBag,
    Fuel,
    ArrowLeftRight,
  } from "lucide-vue-next";
  import BaseModal from "./ui/BaseModal.vue";
  import { transactionService } from "../services/finance";

  const props = defineProps({
    isOpen: {
      type: Boolean,
      required: true,
    },
    wallet: {
      type: Object,
      default: null,
    },
  });

  const emit = defineEmits(["close", "edit"]);

  const transactions = ref([]);
  const isLoadingTransactions = ref(false);

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

  const getIconComponent = (iconName, type) => {
    if (type === "income") return Banknote;
    if (type === "transfer") return ArrowLeftRight;
    return iconMap[iconName] || ShoppingCart;
  };

  const fetchTransactions = async () => {
    if (!props.wallet?.id) return;
    isLoadingTransactions.value = true;
    try {
      const data = await transactionService.getTransactionsByWallet(
        props.wallet.id,
      );
      // Process transactions
      transactions.value = data
        .map((t) => ({
          id: t.id,
          title: t.description || "Transaction",
          date: new Date(t.transactionDate).toLocaleDateString(),
          amount: `${t.type === "income" ? "+" : "-"}${props.wallet.currency} ${t.amount}`,
          type: t.type,
          amountColor:
            t.type === "income"
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400",
          icon: getIconComponent(t.categoryName, t.type), // Note: backend needs to join category name or we mock it. For now generic.
          iconBg:
            t.type === "income"
              ? "bg-green-100 dark:bg-green-900/30"
              : "bg-red-100 dark:bg-red-900/30",
          iconColor:
            t.type === "income"
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400",
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5); // Show last 5
    } catch (error) {
      console.error("Failed to fetch wallet transactions:", error);
    } finally {
      isLoadingTransactions.value = false;
    }
  };

  watch(
    () => props.wallet,
    (newWallet) => {
      if (newWallet && props.isOpen) {
        fetchTransactions();
      }
    },
  );

  watch(
    () => props.isOpen,
    (isOpen) => {
      if (isOpen && props.wallet) {
        fetchTransactions();
      }
    },
  );

  const handleEdit = () => {
    emit("edit", props.wallet);
  };

  const walletIcon = computed(() => {
    if (!props.wallet) return Wallet;
    switch (props.wallet.type) {
      case "bank":
        return Landmark;
      case "credit":
        return CreditCard;
      case "savings":
        return Wallet; // Or PiggyBank if available
      default:
        return Wallet;
    }
  });
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 sm:p-0"
  >
    <!-- Backdrop -->
    <div
      class="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      @click="$emit('close')"
    ></div>

    <!-- Modal Content -->
    <div
      class="relative w-full max-w-md bg-background-light dark:bg-background-dark rounded-t-3xl sm:rounded-3xl shadow-2xl transform transition-all flex flex-col max-h-[90vh]"
    >
      <!-- Header with Edit Button -->
      <div
        class="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800"
      >
        <button
          @click="$emit('close')"
          class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X class="w-6 h-6 text-gray-500 dark:text-gray-400" />
        </button>
        <span class="text-lg font-bold text-text-dark dark:text-white"
          >Wallet Details</span
        >
        <button
          @click="handleEdit"
          class="p-2 rounded-full text-primary hover:bg-primary/10 transition-colors"
        >
          <Pencil class="w-5 h-5" />
        </button>
      </div>

      <!-- Scrollable Content -->
      <div class="overflow-y-auto p-6 space-y-6 flex-1 min-h-0">
        <!-- Wallet Card Info -->
        <div
          v-if="wallet"
          class="bg-primary/10 dark:bg-primary/5 rounded-2xl p-6 flex flex-col items-center gap-4"
        >
          <div
            class="w-16 h-16 rounded-full bg-white dark:bg-[#1c2e22] flex items-center justify-center shadow-sm text-primary"
          >
            <component :is="walletIcon" class="w-8 h-8" />
          </div>
          <div class="text-center">
            <h3 class="text-2xl font-extrabold text-text-dark dark:text-white">
              {{ wallet.name }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {{ wallet.type }} Account
            </p>
          </div>
          <div class="text-center">
            <p class="text-3xl font-black text-text-dark dark:text-white">
              {{ wallet.currency }} {{ wallet.balance }}
            </p>
            <p class="text-xs text-gray-400 mt-1">Current Balance</p>
          </div>
        </div>

        <!-- Quick Stats (Mocked for now or derived if possible) -->
        <div class="grid grid-cols-2 gap-4">
          <div
            class="bg-white dark:bg-[#1c2e22] p-4 rounded-xl shadow-xs flex flex-col gap-2"
          >
            <div
              class="flex items-center gap-2 text-green-600 dark:text-green-400"
            >
              <div class="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <ArrowDownLeft class="w-4 h-4" />
              </div>
              <span class="text-xs font-bold">Income</span>
            </div>
            <p class="text-lg font-bold text-text-dark dark:text-white">--</p>
          </div>
          <div
            class="bg-white dark:bg-[#1c2e22] p-4 rounded-xl shadow-xs flex flex-col gap-2"
          >
            <div class="flex items-center gap-2 text-red-600 dark:text-red-400">
              <div class="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <ArrowUpRight class="w-4 h-4" />
              </div>
              <span class="text-xs font-bold">Expense</span>
            </div>
            <p class="text-lg font-bold text-text-dark dark:text-white">--</p>
          </div>
        </div>

        <!-- Recent Transactions -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-base font-bold text-text-dark dark:text-white">
              Recent Transactions
            </h4>
            <button class="text-xs font-bold text-primary">See All</button>
          </div>

          <div v-if="isLoadingTransactions" class="flex justify-center py-4">
            <p class="text-gray-400 text-sm">Loading...</p>
          </div>

          <div
            v-else-if="transactions.length === 0"
            class="flex flex-col items-center justify-center py-8 text-gray-400"
          >
            <Calendar class="w-10 h-10 mb-2 opacity-50" />
            <p class="text-sm">No recent transactions</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="transaction in transactions"
              :key="transaction.id"
              class="flex items-center justify-between bg-white dark:bg-[#1c2e22] p-3 rounded-xl shadow-xs border border-transparent dark:border-gray-800"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  :class="transaction.iconBg"
                >
                  <component
                    :is="transaction.icon"
                    class="w-5 h-5"
                    :class="transaction.iconColor"
                  />
                </div>
                <div class="flex flex-col min-w-0">
                  <p
                    class="text-sm font-bold text-text-dark dark:text-white truncate"
                  >
                    {{ transaction.title }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ transaction.date }}
                  </p>
                </div>
              </div>
              <span
                class="text-sm font-bold whitespace-nowrap"
                :class="transaction.amountColor"
                >{{ transaction.amount }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
