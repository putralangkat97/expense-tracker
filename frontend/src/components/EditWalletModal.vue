<script setup>
import { ref, watch } from "vue";
import { Wallet, Pencil, ChevronDown, EyeOff, Check } from "lucide-vue-next";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "./ui/drawer";

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

const emit = defineEmits(["update:open", "update"]);

const initialBalance = ref("");
const walletName = ref("");
const currency = ref("USD");
const type = ref("Cash");
const excludeFromTotals = ref(false);

watch(
  () => props.wallet,
  (newWallet) => {
    if (newWallet) {
      // Remove currency symbol and formatting if balance is a string
      let balance = newWallet.balance;
      if (typeof balance === "string") {
        balance = balance.replace(/[^0-9.-]+/g, "");
      }
      initialBalance.value = balance || "";
      walletName.value = newWallet.name || "";
      currency.value = newWallet.currency || "USD";
      type.value = newWallet.type
        ? newWallet.type.charAt(0).toUpperCase() + newWallet.type.slice(1)
        : "Cash";
      excludeFromTotals.value = newWallet.excludeFromTotals || false;
    }
  },
  { immediate: true },
);

const handleUpdate = () => {
  emit("update", {
    id: props.wallet?.id,
    initialBalance: initialBalance.value,
    walletName: walletName.value,
    currency: currency.value,
    type: type.value,
    excludeFromTotals: excludeFromTotals.value,
  });
};
</script>

<template>
  <Drawer :open="open" @update:open="$emit('update:open', $event)">
    <DrawerContent class="!max-h-[96vh] !mt-4">
      <div class="mx-auto w-full max-w-sm overflow-y-auto pb-6">
        <DrawerHeader>
          <DrawerTitle class="text-center">Edit Wallet</DrawerTitle>
          <DrawerDescription class="text-center">
            Update your wallet details.
          </DrawerDescription>
        </DrawerHeader>

        <!-- Wallet Icon Selector -->
        <div class="flex flex-col items-center justify-center py-6">
          <div class="relative group cursor-pointer">
            <div
              class="size-20 rounded-full bg-primary/20 dark:bg-primary/10 flex items-center justify-center border-2 border-primary text-primary transition-transform active:scale-95"
            >
              <Wallet class="w-10 h-10" />
            </div>
            <div
              class="absolute bottom-0 right-0 bg-white dark:bg-[#1c2e22] rounded-full p-1.5 shadow-md border border-gray-100 dark:border-gray-700"
            >
              <Pencil class="w-3.5 h-3.5 text-primary" />
            </div>
          </div>
          <p class="mt-3 text-sm font-medium text-primary">Change Icon</p>
        </div>

        <!-- Form Fields -->
        <div class="p-4 space-y-6">
          <!-- Initial Balance -->
          <div class="flex flex-col gap-2">
            <label
              class="text-text-dark dark:text-white text-sm font-semibold ml-1"
              for="balance"
              >Balance</label
            >
            <div class="relative">
              <span
                class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 font-medium text-2xl"
                >$</span
              >
              <input
                v-model="initialBalance"
                class="w-full bg-white dark:bg-[#1c2e22] border border-gray-200 dark:border-gray-700 rounded-2xl py-4 pl-10 pr-4 text-3xl font-bold text-text-dark dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-hidden focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-xs"
                id="balance"
                placeholder="0.00"
                type="number"
              />
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 ml-1">
              Current wallet balance.
            </p>
          </div>

          <!-- Wallet Name -->
          <div class="flex flex-col gap-2">
            <label
              class="text-text-dark dark:text-white text-sm font-semibold ml-1"
              for="name"
              >Wallet Name</label
            >
            <input
              v-model="walletName"
              class="w-full bg-white dark:bg-[#1c2e22] border border-gray-200 dark:border-gray-700 rounded-xl py-3.5 px-4 text-base font-medium text-text-dark dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-hidden focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-xs"
              id="name"
              placeholder="e.g., Chase Checking"
              type="text"
            />
          </div>

          <!-- Currency & Type Row -->
          <div class="flex gap-4">
            <div class="flex flex-col gap-2 flex-1">
              <label
                class="text-text-dark dark:text-white text-sm font-semibold ml-1"
                for="currency"
                >Currency</label
              >
              <div class="relative">
                <select
                  v-model="currency"
                  class="w-full appearance-none bg-white dark:bg-[#1c2e22] border border-gray-200 dark:border-gray-700 rounded-xl py-3.5 px-4 text-base font-medium text-text-dark dark:text-white focus:outline-hidden focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-xs"
                  id="currency"
                >
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                  <option>JPY</option>
                </select>
                <span
                  class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
                >
                  <ChevronDown class="w-5 h-5" />
                </span>
              </div>
            </div>
            <div class="flex flex-col gap-2 flex-1">
              <label
                class="text-text-dark dark:text-white text-sm font-semibold ml-1"
                for="type"
                >Type</label
              >
              <div class="relative">
                <select
                  v-model="type"
                  class="w-full appearance-none bg-white dark:bg-[#1c2e22] border border-gray-200 dark:border-gray-700 rounded-xl py-3.5 px-4 text-base font-medium text-text-dark dark:text-white focus:outline-hidden focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-xs"
                  id="type"
                >
                  <option>Cash</option>
                  <option>Bank</option>
                  <option>Credit</option>
                  <option>Savings</option>
                </select>
                <span
                  class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
                >
                  <ChevronDown class="w-5 h-5" />
                </span>
              </div>
            </div>
          </div>

          <!-- Exclude from Total Toggle -->
          <div
            class="bg-white dark:bg-[#1c2e22] border border-gray-200 dark:border-gray-700 rounded-2xl p-4 flex items-center justify-between shadow-xs mt-4"
          >
            <div class="flex items-center gap-3">
              <div
                class="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300"
              >
                <EyeOff class="w-5 h-5" />
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-bold text-text-dark dark:text-white"
                  >Exclude from totals</span
                >
                <span class="text-xs text-gray-500 dark:text-gray-400"
                  >Don't include in global balance</span
                >
              </div>
            </div>
            <label class="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                v-model="excludeFromTotals"
                class="sr-only peer"
              />
              <div
                class="relative w-11 h-6 bg-gray-200 peer-focus:outline-hidden peer-focus:ring-2 peer-focus:ring-primary/30 dark:peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:rtl:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"
              ></div>
            </label>
          </div>
        </div>

        <DrawerFooter>
          <button
            class="w-full bg-primary hover:bg-green-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            @click="handleUpdate"
          >
            <span>Save Changes</span>
            <Check class="w-5 h-5" />
          </button>
          <DrawerClose as-child>
            <button
              class="w-full py-3 text-sm font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Cancel
            </button>
          </DrawerClose>
        </DrawerFooter>
      </div>
    </DrawerContent>
  </Drawer>
</template>