<script setup>
  import { computed, ref, watch } from "vue";
  import {
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
  import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerClose,
  } from "./ui/drawer";
  import { transactionService } from "../services/finance";
  import { formatCurrency } from "../helpers/currency";

  const props = defineProps({
    open: {
      type: Boolean,
      required: true,
    },
    wallet: {
      type: Object,
      default: null,
    },
  });

  const emit = defineEmits(["update:open", "edit"]);

  const transactions = ref([]);
  const isLoadingTransactions = ref(false);
  const totalIncome = ref(0);
  const totalExpense = ref(0);

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

      let income = 0;
      let expense = 0;

      // Process transactions
      const processedTransactions = data.map((t) => {
        // Determine direction relative to this wallet
        // It is incoming if type is income OR it's a transfer where we are the destination
        const isIncoming =
          t.type === "income" ||
          (t.type === "transfer" && t.destinationWalletId === props.wallet.id);

        if (isIncoming) {
          income += t.amount;
        } else {
          expense += t.amount;
        }

        return {
          id: t.id,
          title: t.description || "Transaction",
          date: new Date(t.transactionDate).toLocaleDateString(),
          amount: `${isIncoming ? "+" : "-"}${t.amount}`,
          type: t.type,
          amountColor: isIncoming
            ? "text-green-600 dark:text-green-400"
            : "text-red-600 dark:text-red-400",
          icon: getIconComponent(t.categoryName, t.type), // Note: backend needs to join category name or we mock it. For now generic.
          iconBg: isIncoming
            ? "bg-green-100 dark:bg-green-900/30"
            : "bg-red-100 dark:bg-red-900/30",
          iconColor: isIncoming
            ? "text-green-600 dark:text-green-400"
            : "text-red-600 dark:text-red-400",
        };
      });

      totalIncome.value = income;
      totalExpense.value = expense;

      transactions.value = processedTransactions
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
      if (newWallet && props.open) {
        fetchTransactions();
      }
    },
  );

  watch(
    () => props.open,
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
  <Drawer :open="open" @update:open="$emit('update:open', $event)">
    <DrawerContent class="max-h-[96vh]! mt-4!">
      <div class="mx-auto w-full max-w-sm overflow-y-auto pb-6">
        <DrawerHeader class="flex flex-row items-center justify-between pb-2">
          <div class="flex flex-col gap-1 text-left">
            <DrawerTitle>Wallet Details</DrawerTitle>
            <DrawerDescription
              >View transaction history and stats.</DrawerDescription
            >
          </div>
          <button
            @click="handleEdit"
            class="p-2 rounded-full text-primary hover:bg-primary/10 transition-colors"
          >
            <Pencil class="w-5 h-5" />
          </button>
        </DrawerHeader>

        <!-- Scrollable Content -->
        <div class="px-4 py-4 space-y-6 flex-1 min-h-0">
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
              <h3
                class="text-2xl font-extrabold text-text-dark dark:text-white"
              >
                {{ wallet.name }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {{ wallet.type }} Account
              </p>
            </div>
            <div class="text-center">
              <p class="text-3xl font-black text-text-dark dark:text-white">
                {{ wallet.balance }}
              </p>
              <p class="text-xs text-gray-400 mt-1">Current Balance</p>
            </div>
          </div>

          <!-- Quick Stats -->
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
              <p class="text-lg font-bold text-text-dark dark:text-white">
                {{ formatCurrency(totalIncome, wallet?.currency) }}
              </p>
            </div>
            <div
              class="bg-white dark:bg-[#1c2e22] p-4 rounded-xl shadow-xs flex flex-col gap-2"
            >
              <div
                class="flex items-center gap-2 text-red-600 dark:text-red-400"
              >
                <div class="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <ArrowUpRight class="w-4 h-4" />
                </div>
                <span class="text-xs font-bold">Expense</span>
              </div>
              <p class="text-lg font-bold text-text-dark dark:text-white">
                {{ formatCurrency(totalExpense, wallet?.currency) }}
              </p>
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
        <DrawerFooter>
          <DrawerClose as-child>
            <button
              class="w-full py-3 text-sm font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Close
            </button>
          </DrawerClose>
        </DrawerFooter>
      </div>
    </DrawerContent>
  </Drawer>
</template>
