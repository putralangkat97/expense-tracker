<script setup>
import { computed } from "vue";
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
  TrendingUp,
  AlertTriangle,
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
  budget: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["update:open", "edit", "delete"]);

const budgetDetails = computed(() => {
  if (!props.budget) return null;

  const b = props.budget;
  const spent = b.spentAmount || 0;
  const limit = b.limitAmount || 0;
  const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
  const remaining = Math.max(0, limit - spent);

  return {
    ...b,
    formattedSpent: formatCurrency(spent),
    formattedLimit: formatCurrency(limit),
    formattedRemaining: formatCurrency(remaining),
    percentage: Math.round(percentage),
    isOverBudget: spent > limit,
    icon: b.icon || ShoppingCart, // AppBudgets passes icon component in the object
    iconBg: b.iconBg || "bg-gray-100 dark:bg-gray-800",
    iconColor: b.iconColor || "text-gray-500",
    barColor: b.barColor || "bg-primary",
  };
});

const handleEdit = () => {
  emit("edit", props.budget);
};

const handleDelete = () => {
  emit("delete", props.budget.id);
};
</script>

<template>
  <Drawer :open="open" @update:open="$emit('update:open', $event)">
    <DrawerContent class="!max-h-[96vh] !mt-4">
      <div class="mx-auto w-full max-w-sm overflow-y-auto pb-6">
        <DrawerHeader class="flex flex-row items-center justify-between pb-2">
          <div class="flex flex-col gap-1 text-left">
            <DrawerTitle>Budget Details</DrawerTitle>
            <DrawerDescription>Track your spending against limits.</DrawerDescription>
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
        <div class="px-4 py-4 space-y-6 flex-1 min-h-0" v-if="budgetDetails">
          <!-- Main Info -->
          <div class="flex flex-col items-center gap-4 py-4">
            <div
              class="w-20 h-20 rounded-full flex items-center justify-center shadow-sm"
              :class="budgetDetails.iconBg"
            >
              <component
                :is="budgetDetails.icon"
                class="w-10 h-10"
                :class="budgetDetails.iconColor"
              />
            </div>
            <div class="text-center">
              <h2 class="text-2xl font-bold text-text-dark dark:text-white">
                {{ budgetDetails.name }}
              </h2>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">
                {{ budgetDetails.categoryName }} • {{ budgetDetails.frequency }}
              </p>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="space-y-2">
            <div class="flex justify-between items-end">
              <span class="text-sm font-bold text-text-dark dark:text-white">
                {{ budgetDetails.formattedSpent }}
                <span class="text-gray-400 font-normal">/ {{ budgetDetails.formattedLimit }}</span>
              </span>
              <span class="text-xs font-bold" :class="budgetDetails.isOverBudget ? 'text-red-500' : 'text-primary'">
                {{ budgetDetails.percentage }}%
              </span>
            </div>
            <div class="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-500"
                :class="budgetDetails.isOverBudget ? 'bg-red-500' : 'bg-primary'"
                :style="{ width: `${budgetDetails.percentage}%` }"
              ></div>
            </div>
            <p v-if="budgetDetails.isOverBudget" class="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
              <AlertTriangle class="w-3 h-3" />
              Over budget by {{ formatCurrency(budgetDetails.spentAmount - budgetDetails.limitAmount) }}
            </p>
            <p v-else class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ budgetDetails.formattedRemaining }} remaining
            </p>
          </div>

          <!-- Additional Details -->
          <div class="space-y-4">
             <div class="flex items-center justify-between p-4 bg-white dark:bg-[#1c2e22] rounded-xl shadow-xs border border-transparent dark:border-gray-800">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400">
                  <TrendingUp class="w-5 h-5" />
                </div>
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Status</span>
              </div>
              <span class="text-sm font-bold text-text-dark dark:text-white">
                {{ budgetDetails.isOverBudget ? "Exceeded" : "On Track" }}
              </span>
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
