<script setup>
  import { computed, ref } from "vue";
  import {
    Pencil,
    Trash2,
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
    Repeat,
    FileText,
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
  import { formatCurrency } from "../helpers/currency";

  const props = defineProps({
    open: {
      type: Boolean,
      required: true,
    },
    transaction: {
      type: Object,
      default: null,
    },
    wallets: {
      type: Array,
      default: () => [],
    },
    categories: {
      type: Array,
      default: () => [],
    },
  });

  const emit = defineEmits(["update:open", "edit", "delete"]);

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

  const transactionDetails = computed(() => {
    if (!props.transaction) return null;

    const t = props.transaction;
    const category = props.categories.find((c) => c.id === t.categoryId);
    const wallet = props.wallets.find((w) => w.id === t.walletId);
    const destWallet = props.wallets.find(
      (w) => w.id === t.destinationWalletId,
    );

    const isIncoming = t.type === "income";
    const amountPrefix = isIncoming ? "+" : "-";
    const amountColor = isIncoming
      ? "text-green-600 dark:text-green-400"
      : "text-red-600 dark:text-red-400";

    return {
      ...t,
      formattedAmount: `${amountPrefix}${formatCurrency(t.amount, wallet?.currency || "USD")}`,
      amountColor,
      categoryName:
        category?.name ||
        (t.type === "transfer" ? "Transfer" : "Uncategorized"),
      walletName: wallet?.name || "Unknown Wallet",
      destinationWalletName: destWallet?.name,
      dateFormatted: new Date(t.transactionDate).toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      icon: getIconComponent(category?.name, t.type),
      iconBg: isIncoming
        ? "bg-green-100 dark:bg-green-900/30"
        : "bg-red-100 dark:bg-red-900/30",
      iconColor: isIncoming
        ? "text-green-600 dark:text-green-400"
        : "text-red-600 dark:text-red-400",
    };
  });

  const handleEdit = () => {
    emit("edit", props.transaction);
  };

  const handleDelete = () => {
    emit("delete", props.transaction.id);
  };
</script>

<template>
  <Drawer :open="open" @update:open="$emit('update:open', $event)">
    <DrawerContent class="!max-h-[96vh] !mt-4">
      <div class="mx-auto w-full max-w-sm overflow-y-auto pb-6">
        <DrawerHeader class="flex flex-row items-center justify-between pb-2">
          <div class="flex flex-col gap-1 text-left">
            <DrawerTitle>Transaction Details</DrawerTitle>
            <DrawerDescription
              >View details of this transaction.</DrawerDescription
            >
          </div>
          <div class="flex gap-2">
            <button
              @click="handleEdit"
              class="p-2 rounded-full text-primary hover:bg-primary/10 transition-colors"
            >
              <Pencil class="w-5 h-5" />
            </button>
            <button
              @click="handleDelete"
              class="p-2 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 class="w-5 h-5" />
            </button>
          </div>
        </DrawerHeader>

        <!-- Scrollable Content -->
        <div
          class="px-4 py-4 space-y-6 flex-1 min-h-0"
          v-if="transactionDetails"
        >
          <!-- Main Amount & Icon -->
          <div class="flex flex-col items-center gap-4 py-4">
            <div
              class="w-20 h-20 rounded-full flex items-center justify-center shadow-sm"
              :class="transactionDetails.iconBg"
            >
              <component
                :is="transactionDetails.icon"
                class="w-10 h-10"
                :class="transactionDetails.iconColor"
              />
            </div>
            <div class="text-center">
              <h2
                class="text-3xl font-black"
                :class="transactionDetails.amountColor"
              >
                {{ transactionDetails.formattedAmount }}
              </h2>
              <p
                class="text-lg font-semibold text-text-dark dark:text-white mt-1"
              >
                {{
                  transactionDetails.title || transactionDetails.categoryName
                }}
              </p>
            </div>
          </div>

          <!-- Details Grid -->
          <div class="space-y-4">
            <!-- Date -->
            <div
              class="flex items-center justify-between p-4 bg-white dark:bg-[#1c2e22] rounded-xl shadow-xs border border-transparent dark:border-gray-800"
            >
              <div class="flex items-center gap-3">
                <div
                  class="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400"
                >
                  <Calendar class="w-5 h-5" />
                </div>
                <span
                  class="text-sm font-medium text-gray-500 dark:text-gray-400"
                  >Date</span
                >
              </div>
              <span class="text-sm font-bold text-text-dark dark:text-white">{{
                transactionDetails.dateFormatted
              }}</span>
            </div>

            <!-- Wallet -->
            <div
              class="flex items-center justify-between p-4 bg-white dark:bg-[#1c2e22] rounded-xl shadow-xs border border-transparent dark:border-gray-800"
            >
              <div class="flex items-center gap-3">
                <div
                  class="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400"
                >
                  <Wallet class="w-5 h-5" />
                </div>
                <span
                  class="text-sm font-medium text-gray-500 dark:text-gray-400"
                  >Wallet</span
                >
              </div>
              <span class="text-sm font-bold text-text-dark dark:text-white">{{
                transactionDetails.walletName
              }}</span>
            </div>

            <!-- Destination Wallet (Transfer only) -->
            <div
              v-if="transactionDetails.type === 'transfer'"
              class="flex items-center justify-between p-4 bg-white dark:bg-[#1c2e22] rounded-xl shadow-xs border border-transparent dark:border-gray-800"
            >
              <div class="flex items-center gap-3">
                <div
                  class="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400"
                >
                  <ArrowLeftRight class="w-5 h-5" />
                </div>
                <span
                  class="text-sm font-medium text-gray-500 dark:text-gray-400"
                  >To Wallet</span
                >
              </div>
              <span class="text-sm font-bold text-text-dark dark:text-white">{{
                transactionDetails.destinationWalletName
              }}</span>
            </div>

            <!-- Recurring -->
            <div
              v-if="transactionDetails.isRecurring"
              class="flex items-center justify-between p-4 bg-white dark:bg-[#1c2e22] rounded-xl shadow-xs border border-transparent dark:border-gray-800"
            >
              <div class="flex items-center gap-3">
                <div
                  class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400"
                >
                  <Repeat class="w-5 h-5" />
                </div>
                <span
                  class="text-sm font-medium text-gray-500 dark:text-gray-400"
                  >Recurring</span
                >
              </div>
              <span
                class="text-sm font-bold text-text-dark dark:text-white capitalize"
                >{{ transactionDetails.recurrenceInterval }}</span
              >
            </div>

            <!-- Description/Notes -->
            <div
              v-if="transactionDetails.description"
              class="flex flex-col gap-2 p-4 bg-white dark:bg-[#1c2e22] rounded-xl shadow-xs border border-transparent dark:border-gray-800"
            >
              <div class="flex items-center gap-3 mb-1">
                <div
                  class="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400"
                >
                  <FileText class="w-5 h-5" />
                </div>
                <span
                  class="text-sm font-medium text-gray-500 dark:text-gray-400"
                  >Note</span
                >
              </div>
              <p
                class="text-sm text-text-dark dark:text-white leading-relaxed pl-1"
              >
                {{ transactionDetails.description }}
              </p>
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
