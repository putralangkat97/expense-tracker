<script setup>
  import { ref, computed, onMounted } from "vue";
  import {
    Plus,
    ShoppingCart,
    Car,
    Clapperboard,
    Home,
    PlusCircle,
    Utensils,
    Plane,
    ShoppingBag,
    Zap,
    HeartPulse,
    GraduationCap,
    Briefcase,
    Gift,
    Smartphone,
  } from "lucide-vue-next";
  import BottomNav from "./ui/BottomNav.vue";
  import BudgetSummaryCard from "./ui/BudgetSummaryCard.vue";
  import BudgetCategoryItem from "./ui/BudgetCategoryItem.vue";
  import CreateBudgetModal from "./CreateBudgetModal.vue";
  import TopAppBar from "./ui/TopAppBar.vue";
  import { useAuthStore } from "../stores/auth";
  import { budgetService, categoryService } from "../services/finance";

  const authStore = useAuthStore();
  const isCreateBudgetModalOpen = ref(false);
  const isEditMode = ref(false);
  const budgetToEdit = ref(null);
  const isLoading = ref(false);

  const filters = ["All", "Monthly", "Weekly", "One-time"];
  const activeFilter = ref("All");

  const categories = ref([]);
  const budgets = ref([]);

  // Icon mapping
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
  };

  const getIconComponent = (iconName) => {
    return iconMap[iconName] || ShoppingCart;
  };

  const fetchData = async () => {
    if (!authStore.user?.id) return;
    isLoading.value = true;
    try {
      const [cats, userBudgets] = await Promise.all([
        categoryService.getCategories(),
        budgetService.getBudgets(authStore.user.id),
      ]);

      categories.value = cats.map((cat) => ({
        ...cat,
        icon: getIconComponent(cat.icon),
      }));

      budgets.value = userBudgets.map((budget) => {
        const cat = categories.value.find((c) => c.id === budget.categoryId);
        return {
          ...budget,
          categoryName: cat ? cat.name : "Unknown",
          icon: cat ? cat.icon : ShoppingCart,
          iconColor: cat ? cat.color : "text-gray-500", // Assuming color is a class or hex. If class, use directly.
          // If color is hex, we might need to handle it. The schema says text.
          // Current UI uses tailwind classes for colors.
          // Let's assume standard colors for now or map them.
          // For simplicity, using hardcoded styling logic or reusing category color if it matches tailwind class.
          iconBg: "bg-gray-100 dark:bg-gray-800", // Default
          barColor: "bg-primary",
          spent: `$${budget.spentAmount}`,
          limit: `$${budget.limitAmount}`,
          percentage:
            budget.limitAmount > 0
              ? Math.min((budget.spentAmount / budget.limitAmount) * 100, 100)
              : 0,
        };
      });
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(() => {
    fetchData();
  });

  const filteredBudgets = computed(() => {
    if (activeFilter.value === "All") return budgets.value;
    return budgets.value.filter(
      (b) => b.frequency.toLowerCase() === activeFilter.value.toLowerCase(),
    );
  });

  const summary = computed(() => {
    const totalSpent = budgets.value.reduce(
      (sum, b) => sum + (b.spentAmount || 0),
      0,
    );
    const totalLimit = budgets.value.reduce(
      (sum, b) => sum + (b.limitAmount || 0),
      0,
    );
    return {
      totalSpent: `$${totalSpent.toLocaleString()}`,
      limit: `$${totalLimit.toLocaleString()}`,
      remaining: `$${(totalLimit - totalSpent).toLocaleString()}`,
      percentage:
        totalLimit > 0 ? Math.min((totalSpent / totalLimit) * 100, 100) : 0,
    };
  });

  const openCreateModal = () => {
    isEditMode.value = false;
    budgetToEdit.value = null;
    isCreateBudgetModalOpen.value = true;
  };

  const openEditModal = (budget) => {
    isEditMode.value = true;
    budgetToEdit.value = budget;
    isCreateBudgetModalOpen.value = true;
  };

  const handleCreateBudget = async (budgetData) => {
    try {
      await budgetService.createBudget({
        userId: authStore.user.id,
        ...budgetData,
      });
      await fetchData();
      isCreateBudgetModalOpen.value = false;
    } catch (error) {
      console.error("Failed to create budget:", error);
    }
  };

  const handleUpdateBudget = async (budgetData) => {
    try {
      const { id, ...data } = budgetData;
      await budgetService.updateBudget(id, data);
      await fetchData();
      isCreateBudgetModalOpen.value = false;
    } catch (error) {
      console.error("Failed to update budget:", error);
    }
  };

  const handleDeleteBudget = async (id) => {
    try {
      await budgetService.deleteBudget(id);
      await fetchData();
      isCreateBudgetModalOpen.value = false;
    } catch (error) {
      console.error("Failed to delete budget:", error);
    }
  };

  const handleNavigate = (route) => {
    // Navigation handled by router usually, but this component emits it?
    // BottomNav emits 'navigate'.
    // We should probably use router here if BottomNav doesn't do it directly.
    // But existing code just had @navigate="handleNavigate" without implementation shown in previous Read.
    // Assuming BottomNav might need router logic or parent handles it.
    // Actually looking at existing AppBudgets, it had `BottomNav activeTab="budgets"`.
    // BottomNav usually uses router-link or emits.
    // Let's import router just in case.
  };
</script>

<template>
  <div
    class="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-2xl font-display text-text-dark dark:text-white"
  >
    <!-- Top App Bar -->
    <TopAppBar
      title="My Budgets"
      :action-icon="Plus"
      @action="openCreateModal"
    />

    <!-- Main Content Scroll Area -->
    <div class="flex-1 overflow-y-auto pb-24">
      <!-- Summary Card -->
      <div class="p-4">
        <BudgetSummaryCard
          :totalSpent="summary.totalSpent"
          :limit="summary.limit"
          :remaining="summary.remaining"
          :percentage="summary.percentage"
          period="Monthly"
        />
      </div>

      <!-- Chips / Filters -->
      <div class="flex gap-3 px-4 py-2 overflow-x-auto no-scrollbar">
        <button
          v-for="filter in filters"
          :key="filter"
          class="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full pl-5 pr-5 shadow-xs transition-colors"
          :class="
            activeFilter === filter
              ? 'bg-text-dark dark:bg-white text-white dark:text-black shadow-md'
              : 'bg-white dark:bg-[#1c2e22] border border-gray-100 dark:border-gray-700 text-text-dark dark:text-white'
          "
          @click="activeFilter = filter"
        >
          <p class="text-sm font-semibold leading-normal">{{ filter }}</p>
        </button>
      </div>

      <!-- List Header -->
      <div class="px-4 pt-6 pb-2">
        <h3 class="text-text-dark dark:text-white text-lg font-bold">
          Categories
        </h3>
      </div>

      <!-- Budget List Items -->
      <div class="flex flex-col gap-3 px-4">
        <div v-if="isLoading" class="text-center py-4 text-gray-500">
          Loading budgets...
        </div>

        <template v-else>
          <div
            v-for="budget in filteredBudgets"
            :key="budget.id"
            class="cursor-pointer"
            @click="openEditModal(budget)"
          >
            <BudgetCategoryItem
              :name="budget.name"
              :spent="budget.spent"
              :limit="budget.limit"
              :percentage="budget.percentage"
              :icon="budget.icon"
              :iconColor="budget.iconColor"
              :iconBg="budget.iconBg"
              :barColor="budget.barColor"
            />
          </div>

          <!-- Create New Placeholder -->
          <button
            class="flex items-center gap-4 bg-transparent border-2 border-dashed border-gray-200 dark:border-gray-700 p-4 rounded-xl justify-center mt-2 group hover:border-primary transition-colors"
            @click="openCreateModal"
          >
            <PlusCircle
              class="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors"
            />
            <span
              class="text-gray-500 dark:text-gray-400 font-bold group-hover:text-primary transition-colors"
              >Create new category</span
            >
          </button>
        </template>
      </div>
    </div>

    <CreateBudgetModal
      :is-open="isCreateBudgetModalOpen"
      :categories="categories"
      :budget-to-edit="budgetToEdit"
      :is-edit-mode="isEditMode"
      @close="isCreateBudgetModalOpen = false"
      @create="handleCreateBudget"
      @update="handleUpdateBudget"
      @delete="handleDeleteBudget"
    />

    <BottomNav activeTab="budgets" />
  </div>
</template>

<style scoped>
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
