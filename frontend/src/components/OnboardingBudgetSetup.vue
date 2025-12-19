<script setup>
  import { ref, onMounted, watch } from "vue";
  import { useRouter } from "vue-router";
  import BaseButton from "./ui/BaseButton.vue";
  import { useOnboardingStore } from "../stores/onboarding";
  import { useCategories } from "../hooks/use-onboarding";

  const router = useRouter();
  const onboardingStore = useOnboardingStore();
  const { categories, isLoading: isCategoriesLoading } = useCategories();

  const budgetName = ref("");
  const amountLimit = ref("");
  const selectedCategoryId = ref("");
  const frequency = ref("Monthly");

  const frequencies = ["Weekly", "Monthly", "Yearly"];

  // Watch for categories to load and set default if needed
  watch(categories, (newCategories) => {
    if (newCategories?.length > 0 && !selectedCategoryId.value) {
      // Try to find Groceries or default to first
      const defaultCat =
        newCategories.find((c) => c.name === "Groceries") || newCategories[0];
      selectedCategoryId.value = defaultCat.id;
    }
  });

  onMounted(() => {
    const {
      name,
      limitAmount,
      categoryId,
      frequency: freq,
    } = onboardingStore.budgetData;

    if (name) budgetName.value = name;
    if (limitAmount) amountLimit.value = limitAmount;
    if (categoryId) selectedCategoryId.value = categoryId;
    if (freq) frequency.value = freq;
  });

  const createBudget = () => {
    const selectedCategory = categories.value?.find(
      (c) => c.id === selectedCategoryId.value,
    );

    onboardingStore.setBudgetData({
      name: budgetName.value,
      limitAmount: amountLimit.value,
      categoryId: selectedCategoryId.value,
      categoryName: selectedCategory?.name || "Groceries",
      frequency: frequency.value,
    });
    router.push("/onboarding-summary");
  };

  const skipSetup = () => {
    router.push("/onboarding-summary");
  };
</script>

<template>
  <div
    class="relative flex h-full min-h-screen w-full flex-col max-w-md mx-auto bg-surface-light dark:bg-surface-dark shadow-xl overflow-y-auto pb-20"
  >
    <!-- Header & Progress -->
    <div
      class="sticky top-0 z-10 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-xs pt-4 pb-2 px-4 transition-colors"
    >
      <!-- Progress Indicators -->
      <div class="flex w-full flex-row items-center justify-center gap-3 py-4">
        <div
          class="h-1.5 w-1.5 rounded-full bg-[#d0e7d7] dark:bg-white/20"
        ></div>
        <div class="h-1.5 w-8 rounded-full bg-primary"></div>
        <div
          class="h-1.5 w-1.5 rounded-full bg-[#d0e7d7] dark:bg-white/20"
        ></div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex flex-col px-6 pt-2">
      <!-- Headline Text -->
      <h2
        class="text-3xl font-extrabold tracking-tight leading-tight text-gray-900 dark:text-white pt-2"
      >
        Let's set your first goal
      </h2>
      <!-- Body Text -->
      <p
        class="text-gray-500 dark:text-gray-400 text-base font-medium leading-relaxed mt-3 mb-8"
      >
        Take control of your spending by setting a limit for a specific
        category.
      </p>

      <!-- Form Section -->
      <form class="flex flex-col gap-6" @submit.prevent>
        <!-- Budget Name Input -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-semibold text-gray-700 dark:text-gray-300"
            >Budget Name</label
          >
          <div class="relative">
            <input
              v-model="budgetName"
              class="w-full rounded-xl bg-background-light dark:bg-background-dark border-0 ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-primary p-4 text-lg font-medium placeholder:text-gray-400 dark:text-white transition-all shadow-xs outline-hidden"
              placeholder="e.g., Monthly Groceries"
              type="text"
            />
            <span
              class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            >
              edit
            </span>
          </div>
        </div>

        <!-- Amount Input -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-semibold text-gray-700 dark:text-gray-300"
            >Amount Limit</label
          >
          <div class="relative group">
            <div
              class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
            >
              <span class="text-gray-500 dark:text-gray-400 text-xl font-bold"
                >$</span
              >
            </div>
            <input
              v-model="amountLimit"
              class="w-full rounded-xl bg-background-light dark:bg-background-dark border-0 ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-primary pl-10 pr-4 py-5 text-3xl font-bold placeholder:text-gray-300 dark:placeholder:text-gray-600 dark:text-white transition-all shadow-xs outline-hidden"
              placeholder="0.00"
              type="number"
            />
          </div>
        </div>

        <!-- Category Picker -->
        <div class="flex flex-col gap-3">
          <label class="text-sm font-semibold text-gray-700 dark:text-gray-300"
            >Category</label
          >

          <div
            v-if="isCategoriesLoading"
            class="flex gap-3 overflow-x-auto pb-2"
          >
            <div
              v-for="i in 3"
              :key="i"
              class="w-24 h-28 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse shrink-0"
            ></div>
          </div>

          <div
            v-else
            class="flex gap-3 overflow-x-auto no-scrollbar pb-2 snap-x"
          >
            <button
              v-for="category in categories"
              :key="category.id"
              type="button"
              @click="selectedCategoryId = category.id"
              :class="[
                'snap-start flex-none flex flex-col items-center justify-center gap-2 w-24 h-28 rounded-2xl border-2 transition-all',
                selectedCategoryId === category.id
                  ? 'bg-primary shadow-lg shadow-primary/30 border-transparent'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50',
              ]"
            >
              <div
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  selectedCategoryId === category.id
                    ? 'bg-white/20'
                    : 'bg-gray-100 dark:bg-gray-700',
                ]"
              >
                <span
                  class="material-symbols-outlined text-xl"
                  :class="
                    selectedCategoryId === category.id
                      ? 'text-white'
                      : 'text-gray-600 dark:text-gray-300'
                  "
                >
                  {{ category.icon }}
                </span>
              </div>
              <span
                class="text-sm font-medium"
                :class="
                  selectedCategoryId === category.id
                    ? 'text-white font-bold'
                    : 'text-gray-600 dark:text-gray-300'
                "
              >
                {{ category.name }}
              </span>
            </button>
          </div>
        </div>

        <!-- Frequency Segmented Control -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-semibold text-gray-700 dark:text-gray-300"
            >Frequency</label
          >
          <div class="flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-xl">
            <button
              v-for="freq in frequencies"
              :key="freq"
              type="button"
              @click="frequency = freq"
              :class="[
                'flex-1 py-2 text-sm rounded-lg transition-all',
                frequency === freq
                  ? 'font-bold text-gray-900 dark:text-white bg-white dark:bg-gray-700 shadow-xs ring-1 ring-gray-900/5 dark:ring-white/10'
                  : 'font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
              ]"
            >
              {{ freq }}
            </button>
          </div>
        </div>
        <div class="h-6"></div>
      </form>
    </div>

    <!-- Sticky Footer Action -->
    <div
      class="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-6 py-4 bg-surface-light dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800 backdrop-blur-xl"
    >
      <div class="flex flex-col gap-4 items-center">
        <BaseButton
          @click="createBudget"
          class="w-full font-bold text-lg h-14 rounded-full shadow-lg shadow-primary/25"
        >
          Create Budget
          <span class="material-symbols-outlined text-xl ml-2"
            >arrow_forward</span
          >
        </BaseButton>
        <button
          @click="skipSetup"
          class="text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
          type="button"
        >
          Skip for now
        </button>
      </div>
    </div>
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
