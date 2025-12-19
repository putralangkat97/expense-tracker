<script setup>
import { ref, watch, computed } from "vue";
import {
  Utensils,
  Calendar,
  Wallet,
  ChevronDown,
  Repeat,
  Camera,
  Check,
  Trash2,
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

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  isEditMode: {
    type: Boolean,
    default: false,
  },
  transactionToEdit: {
    type: Object,
    default: null,
  },
  categories: {
    type: Array,
    default: () => [],
  },
  wallets: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:open", "create", "update", "delete"]);

const transactionType = ref("expense");
const amount = ref("0.00");
const categoryId = ref(null);
const date = ref(new Date().toISOString().split("T")[0]);
const walletId = ref(null);
const destinationWalletId = ref(null);
const isRecurring = ref(false);
const description = ref("");

const selectedCategory = computed(() =>
  props.categories.find((c) => c.id === categoryId.value),
);

const selectedWallet = computed(() =>
  props.wallets.find((w) => w.id === walletId.value),
);

const availableDestinationWallets = computed(() =>
  props.wallets.filter((w) => w.id !== walletId.value),
);

watch(
  () => props.open,
  (newVal) => {
    if (newVal) {
      if (props.isEditMode && props.transactionToEdit) {
        transactionType.value = props.transactionToEdit.type;
        amount.value = props.transactionToEdit.amount.toString();
        categoryId.value = props.transactionToEdit.categoryId;
        date.value = props.transactionToEdit.transactionDate
          ? new Date(props.transactionToEdit.transactionDate)
              .toISOString()
              .split("T")[0]
          : new Date().toISOString().split("T")[0];
        walletId.value = props.transactionToEdit.walletId;
        destinationWalletId.value =
          props.transactionToEdit.destinationWalletId || null;
        isRecurring.value = props.transactionToEdit.isRecurring;
        description.value = props.transactionToEdit.description || "";
      } else {
        // Reset form
        transactionType.value = "expense";
        amount.value = "0.00";
        categoryId.value = props.categories[0]?.id || null;
        date.value = new Date().toISOString().split("T")[0];
        walletId.value = props.wallets[0]?.id || null;
        destinationWalletId.value =
          props.wallets.length > 1 ? props.wallets[1].id : null;
        isRecurring.value = false;
        description.value = "";
      }
    }
  },
);

const handleSubmit = () => {
  const data = {
    type: transactionType.value,
    amount: parseFloat(amount.value),
    categoryId: categoryId.value,
    transactionDate: date.value,
    walletId: walletId.value,
    destinationWalletId:
      transactionType.value === "transfer" ? destinationWalletId.value : null,
    isRecurring: isRecurring.value,
    description: description.value,
  };

  if (props.isEditMode) {
    emit("update", { id: props.transactionToEdit.id, ...data });
  } else {
    emit("create", data);
  }
};

const handleDelete = () => {
  if (props.transactionToEdit) {
    emit("delete", props.transactionToEdit.id);
  }
};
</script>

<template>
  <Drawer :open="open" @update:open="$emit('update:open', $event)">
    <DrawerContent class="!max-h-[96vh] !mt-4">
      <div class="mx-auto w-full max-w-sm overflow-y-auto pb-6">
        <DrawerHeader>
          <DrawerTitle class="text-center">
            {{ isEditMode ? "Edit Transaction" : "Add Transaction" }}
          </DrawerTitle>
          <DrawerDescription class="text-center">
            Record your income or expenses.
          </DrawerDescription>
        </DrawerHeader>

        <!-- Segmented Control -->
        <div class="mt-2 mb-8 px-4">
          <div class="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
            <label class="flex-1 relative cursor-pointer">
              <input
                type="radio"
                v-model="transactionType"
                value="expense"
                class="peer sr-only"
              />
              <div
                class="h-9 flex items-center justify-center text-sm font-semibold rounded-lg text-gray-500 dark:text-gray-400 transition-all duration-200 peer-checked:bg-primary peer-checked:text-text-dark peer-checked:shadow-xs"
              >
                Expense
              </div>
            </label>
            <label class="flex-1 relative cursor-pointer">
              <input
                type="radio"
                v-model="transactionType"
                value="income"
                class="peer sr-only"
              />
              <div
                class="h-9 flex items-center justify-center text-sm font-semibold rounded-lg text-gray-500 dark:text-gray-400 transition-all duration-200 peer-checked:bg-primary peer-checked:text-text-dark peer-checked:shadow-xs"
              >
                Income
              </div>
            </label>
            <label class="flex-1 relative cursor-pointer">
              <input
                type="radio"
                v-model="transactionType"
                value="transfer"
                class="peer sr-only"
              />
              <div
                class="h-9 flex items-center justify-center text-sm font-semibold rounded-lg text-gray-500 dark:text-gray-400 transition-all duration-200 peer-checked:bg-primary peer-checked:text-text-dark peer-checked:shadow-xs"
              >
                Transfer
              </div>
            </label>
          </div>
        </div>

        <!-- Amount Input -->
        <div class="mb-8 text-center px-4">
          <div class="flex items-center justify-center">
            <span class="text-3xl font-bold text-gray-400 dark:text-gray-600 mr-1"
              >$</span
            >
            <input
              v-model="amount"
              class="bg-transparent border-none text-center text-5xl font-extrabold text-text-dark dark:text-white focus:ring-0 placeholder-gray-300 outline-hidden w-48"
              inputmode="decimal"
              placeholder="0.00"
              type="number"
            />
          </div>
          <p class="mt-2 text-sm font-medium text-gray-400 dark:text-gray-500">
            Enter amount
          </p>
        </div>

        <!-- Form Fields Container -->
        <div class="flex flex-col gap-4 px-4">
          <!-- Category & Date Row -->
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <label
                class="text-xs font-semibold text-gray-500 dark:text-gray-400 ml-1"
                >Category</label
              >
              <div class="relative">
                <select
                  v-model="categoryId"
                  class="appearance-none w-full h-14 pl-12 pr-10 bg-white dark:bg-[#1c2e22] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xs text-sm font-medium text-text-dark dark:text-white focus:border-primary focus:ring-0 transition-colors outline-hidden"
                >
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                    {{ cat.name }}
                  </option>
                </select>
                <div
                  class="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center text-gray-500 dark:text-gray-400"
                >
                  <component
                    :is="selectedCategory?.icon || Utensils"
                    class="w-5 h-5"
                  />
                </div>
                <div
                  class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 flex items-center"
                >
                  <ChevronDown class="w-5 h-5" />
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-1.5">
              <label
                class="text-xs font-semibold text-gray-500 dark:text-gray-400 ml-1"
                >Date</label
              >
              <div class="relative">
                <input
                  type="date"
                  v-model="date"
                  class="w-full h-14 pl-12 pr-4 bg-white dark:bg-[#1c2e22] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xs text-sm font-medium text-text-dark dark:text-white focus:border-primary focus:ring-0 transition-colors outline-hidden"
                />
                <div
                  class="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400 flex items-center"
                >
                  <Calendar class="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          <!-- Wallet Selection -->
          <div class="flex flex-col gap-1.5">
            <label
              class="text-xs font-semibold text-gray-500 dark:text-gray-400 ml-1"
              >{{
                transactionType === "transfer" ? "From Wallet" : "Wallet"
              }}</label
            >
            <div class="relative">
              <select
                v-model="walletId"
                class="appearance-none w-full h-14 pl-12 pr-10 bg-white dark:bg-[#1c2e22] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xs text-sm font-medium text-text-dark dark:text-white focus:border-primary focus:ring-0 transition-colors outline-hidden"
              >
                <option v-for="w in wallets" :key="w.id" :value="w.id">
                  {{ w.name }} ({{ w.currency }} {{ w.balance }})
                </option>
              </select>
              <div
                class="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400 flex items-center"
              >
                <Wallet class="w-5 h-5" />
              </div>
              <div
                class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 flex items-center"
              >
                <ChevronDown class="w-5 h-5" />
              </div>
            </div>
          </div>

          <!-- Destination Wallet Selection (Only for Transfer) -->
          <div v-if="transactionType === 'transfer'" class="flex flex-col gap-1.5">
            <label
              class="text-xs font-semibold text-gray-500 dark:text-gray-400 ml-1"
              >To Wallet</label
            >
            <div class="relative">
              <select
                v-model="destinationWalletId"
                class="appearance-none w-full h-14 pl-12 pr-10 bg-white dark:bg-[#1c2e22] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xs text-sm font-medium text-text-dark dark:text-white focus:border-primary focus:ring-0 transition-colors outline-hidden"
              >
                <option
                  v-for="w in availableDestinationWallets"
                  :key="w.id"
                  :value="w.id"
                >
                  {{ w.name }} ({{ w.currency }} {{ w.balance }})
                </option>
              </select>
              <div
                class="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400 flex items-center"
              >
                <Wallet class="w-5 h-5" />
              </div>
              <div
                class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 flex items-center"
              >
                <ChevronDown class="w-5 h-5" />
              </div>
            </div>
          </div>

          <!-- Recurring Toggle -->
          <div
            class="flex items-center justify-between p-4 bg-white dark:bg-[#1c2e22] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xs mt-1"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400"
              >
                <Repeat class="w-5 h-5" />
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-semibold text-text-dark dark:text-white"
                  >Repeat Transaction</span
                >
                <span class="text-xs text-gray-500 dark:text-gray-400"
                  >Set recurring schedule</span
                >
              </div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="isRecurring" class="sr-only peer" />
              <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-hidden rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:rtl:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"
              ></div>
            </label>
          </div>

          <!-- Note -->
          <div class="flex flex-col gap-1.5 mt-1">
            <label
              class="text-xs font-semibold text-gray-500 dark:text-gray-400 ml-1"
              >Description</label
            >
            <div class="relative">
              <textarea
                v-model="description"
                class="w-full min-h-25 pl-4 pr-4 py-3 bg-white dark:bg-[#1c2e22] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xs text-sm font-medium text-text-dark dark:text-white focus:border-primary focus:ring-0 transition-colors resize-none placeholder-gray-400 outline-hidden"
                placeholder="Write a note..."
              ></textarea>
            </div>
          </div>

          <!-- Image Upload / Attachment -->
          <div class="mt-2">
            <label
              class="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl cursor-pointer bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <Camera class="w-6 h-6 text-gray-400 mb-1" />
                <p class="text-xs text-gray-500 dark:text-gray-400">Add Receipt</p>
              </div>
              <input class="hidden" type="file" />
            </label>
          </div>
        </div>

        <DrawerFooter>
          <div class="flex gap-3">
            <button
              v-if="isEditMode"
              class="flex-1 h-14 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 active:scale-[0.98] transition-all rounded-xl flex items-center justify-center gap-2 text-red-600 dark:text-red-400 font-bold text-lg"
              @click="handleDelete"
            >
              <Trash2 class="w-6 h-6" />
            </button>
            <button
              class="h-14 flex items-center justify-center bg-primary hover:bg-primary/90 text-text-dark font-bold text-base rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] gap-2"
              :class="isEditMode ? 'flex-3' : 'w-full'"
              @click="handleSubmit"
            >
              <span>{{
                isEditMode ? "Update Transaction" : "Save Transaction"
              }}</span>
              <Check class="w-5 h-5" />
            </button>
          </div>
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