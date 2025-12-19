<script setup>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import { ArrowLeft, Settings, TrendingUp, Utensils } from "lucide-vue-next";
  import BottomNav from "./ui/BottomNav.vue";

  const router = useRouter();
  const timePeriod = ref("month");
</script>

<template>
  <div
    class="relative flex min-h-screen w-full flex-col overflow-x-hidden pb-10 bg-background-light dark:bg-background-dark font-display text-background-dark dark:text-white antialiased transition-colors duration-200"
  >
    <!-- Top App Bar -->
    <header
      class="flex items-center justify-between px-4 py-3 bg-background-light dark:bg-background-dark sticky top-0 z-50 backdrop-blur-md bg-opacity-95 dark:bg-opacity-95"
    >
      <button
        @click="router.back()"
        class="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
      >
        <ArrowLeft class="w-6 h-6" />
      </button>
      <h2 class="text-xl font-bold tracking-tight">Analytics</h2>
      <button
        class="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
      >
        <Settings class="w-6 h-6" />
      </button>
    </header>

    <!-- Main Content Scroll Area -->
    <main class="flex-1 overflow-y-auto no-scrollbar pb-24">
      <!-- Time Period Selector -->
      <div class="px-4 py-2">
        <div
          class="flex p-1 bg-white dark:bg-[#1c2e22] rounded-xl shadow-xs border border-gray-100 dark:border-gray-800"
        >
          <label class="flex-1 cursor-pointer">
            <input
              type="radio"
              v-model="timePeriod"
              value="day"
              class="peer sr-only"
            />
            <div
              class="text-center py-2 text-sm font-medium text-gray-500 dark:text-gray-400 rounded-lg peer-checked:bg-primary peer-checked:text-text-dark transition-all"
            >
              Day
            </div>
          </label>
          <label class="flex-1 cursor-pointer">
            <input
              type="radio"
              v-model="timePeriod"
              value="week"
              class="peer sr-only"
            />
            <div
              class="text-center py-2 text-sm font-medium text-gray-500 dark:text-gray-400 rounded-lg peer-checked:bg-primary peer-checked:text-text-dark transition-all"
            >
              Week
            </div>
          </label>
          <label class="flex-1 cursor-pointer">
            <input
              type="radio"
              v-model="timePeriod"
              value="month"
              class="peer sr-only"
            />
            <div
              class="text-center py-2 text-sm font-medium text-gray-500 dark:text-gray-400 rounded-lg peer-checked:bg-primary peer-checked:text-text-dark transition-all"
            >
              Month
            </div>
          </label>
          <label class="flex-1 cursor-pointer">
            <input
              type="radio"
              v-model="timePeriod"
              value="year"
              class="peer sr-only"
            />
            <div
              class="text-center py-2 text-sm font-medium text-gray-500 dark:text-gray-400 rounded-lg peer-checked:bg-primary peer-checked:text-text-dark transition-all"
            >
              Year
            </div>
          </label>
        </div>
      </div>

      <!-- Hero Stat: Total Spent -->
      <div class="flex flex-col items-center py-8">
        <span class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
          >Total spent this month</span
        >
        <h1
          class="text-4xl font-extrabold text-background-dark dark:text-white tracking-tight"
        >
          $1,240.50
        </h1>
        <div
          class="flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold"
        >
          <TrendingUp class="w-4 h-4" />
          <span>12% vs last month</span>
        </div>
      </div>

      <!-- Chart Section: Expense Breakdown (Donut) -->
      <div class="px-4 mb-6">
        <div
          class="bg-white dark:bg-[#1c2e22] rounded-2xl p-5 shadow-xs border border-gray-100 dark:border-gray-800"
        >
          <div class="flex items-center justify-between mb-6">
            <h3 class="font-bold text-lg">Spending by Category</h3>
            <button class="text-xs font-bold text-primary hover:opacity-80">
              See All
            </button>
          </div>
          <div
            class="flex flex-col items-center justify-center relative h-64 w-full"
          >
            <!-- Abstract representation of a donut chart using CSS gradients/shapes for visual fidelity -->
            <div
              class="relative w-48 h-48 rounded-full"
              style="
                background: conic-gradient(
                  #19e65e 0% 35%,
                  #6366f1 35% 60%,
                  #f59e0b 60% 80%,
                  #ef4444 80% 100%
                );
              "
            >
              <div
                class="absolute inset-0 m-auto w-32 h-32 bg-white dark:bg-[#1c2e22] rounded-full flex flex-col items-center justify-center"
              >
                <span class="text-xs text-gray-500 dark:text-gray-400"
                  >Top</span
                >
                <span class="font-bold text-lg">Rent</span>
                <span class="text-xs font-bold text-primary">35%</span>
              </div>
            </div>
          </div>
          <!-- Legend -->
          <div class="grid grid-cols-2 gap-4 mt-6">
            <div class="flex items-center gap-3">
              <div
                class="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(25,230,94,0.4)]"
              ></div>
              <div class="flex flex-col">
                <span class="text-xs text-gray-500 dark:text-gray-400"
                  >Rent</span
                >
                <span class="text-sm font-bold">$434.17</span>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-3 h-3 rounded-full bg-indigo-500"></div>
              <div class="flex flex-col">
                <span class="text-xs text-gray-500 dark:text-gray-400"
                  >Shopping</span
                >
                <span class="text-sm font-bold">$310.12</span>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-3 h-3 rounded-full bg-amber-500"></div>
              <div class="flex flex-col">
                <span class="text-xs text-gray-500 dark:text-gray-400"
                  >Food</span
                >
                <span class="text-sm font-bold">$248.10</span>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-3 h-3 rounded-full bg-red-500"></div>
              <div class="flex flex-col">
                <span class="text-xs text-gray-500 dark:text-gray-400"
                  >Transport</span
                >
                <span class="text-sm font-bold">$248.10</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chart Section: Income vs Expense (Bar) -->
      <div class="px-4 mb-6">
        <div
          class="bg-white dark:bg-[#1c2e22] rounded-2xl p-5 shadow-xs border border-gray-100 dark:border-gray-800"
        >
          <div class="flex items-start justify-between mb-6">
            <div>
              <h3 class="font-bold text-lg">Income vs Expense</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Last 6 months
              </p>
            </div>
            <div class="flex gap-2 text-xs font-medium">
              <div class="flex items-center gap-1">
                <div class="w-2 h-2 rounded-full bg-primary"></div>
                <span>Income</span>
              </div>
              <div class="flex items-center gap-1">
                <div
                  class="w-2 h-2 rounded-full bg-black dark:bg-gray-500"
                ></div>
                <span>Expense</span>
              </div>
            </div>
          </div>
          <!-- Bar Chart Visual -->
          <div class="flex justify-between items-end h-40 gap-2 pb-2">
            <!-- Jan -->
            <div class="flex flex-col items-center gap-1 flex-1 group">
              <div class="w-full flex gap-1 h-full items-end justify-center">
                <div
                  class="w-2 bg-primary/30 dark:bg-primary/20 rounded-t-sm h-[40%] group-hover:bg-primary transition-colors"
                ></div>
                <div
                  class="w-2 bg-gray-200 dark:bg-gray-700 rounded-t-sm h-[60%]"
                ></div>
              </div>
              <span class="text-[10px] font-medium text-gray-400">Jan</span>
            </div>
            <!-- Feb -->
            <div class="flex flex-col items-center gap-1 flex-1 group">
              <div class="w-full flex gap-1 h-full items-end justify-center">
                <div
                  class="w-2 bg-primary/30 dark:bg-primary/20 rounded-t-sm h-[50%] group-hover:bg-primary transition-colors"
                ></div>
                <div
                  class="w-2 bg-gray-200 dark:bg-gray-700 rounded-t-sm h-[45%]"
                ></div>
              </div>
              <span class="text-[10px] font-medium text-gray-400">Feb</span>
            </div>
            <!-- Mar -->
            <div class="flex flex-col items-center gap-1 flex-1 group">
              <div class="w-full flex gap-1 h-full items-end justify-center">
                <div
                  class="w-2 bg-primary/30 dark:bg-primary/20 rounded-t-sm h-[65%] group-hover:bg-primary transition-colors"
                ></div>
                <div
                  class="w-2 bg-gray-200 dark:bg-gray-700 rounded-t-sm h-[55%]"
                ></div>
              </div>
              <span class="text-[10px] font-medium text-gray-400">Mar</span>
            </div>
            <!-- Apr -->
            <div class="flex flex-col items-center gap-1 flex-1 group">
              <div class="w-full flex gap-1 h-full items-end justify-center">
                <div
                  class="w-2 bg-primary/30 dark:bg-primary/20 rounded-t-sm h-[40%] group-hover:bg-primary transition-colors"
                ></div>
                <div
                  class="w-2 bg-gray-200 dark:bg-gray-700 rounded-t-sm h-[70%]"
                ></div>
              </div>
              <span class="text-[10px] font-medium text-gray-400">Apr</span>
            </div>
            <!-- May -->
            <div class="flex flex-col items-center gap-1 flex-1 group">
              <div class="w-full flex gap-1 h-full items-end justify-center">
                <div
                  class="w-2 bg-primary/30 dark:bg-primary/20 rounded-t-sm h-[80%] group-hover:bg-primary transition-colors"
                ></div>
                <div
                  class="w-2 bg-gray-200 dark:bg-gray-700 rounded-t-sm h-[50%]"
                ></div>
              </div>
              <span class="text-[10px] font-medium text-gray-400">May</span>
            </div>
            <!-- Jun -->
            <div class="flex flex-col items-center gap-1 flex-1 group">
              <div class="w-full flex gap-1 h-full items-end justify-center">
                <div
                  class="w-2 bg-primary rounded-t-sm h-[90%] shadow-[0_0_10px_rgba(25,230,94,0.3)]"
                ></div>
                <div
                  class="w-2 bg-black dark:bg-gray-500 rounded-t-sm h-[65%]"
                ></div>
              </div>
              <span class="text-[10px] font-bold text-black dark:text-white"
                >Jun</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Budget Health Section -->
      <div class="px-4 mb-6">
        <div
          class="bg-white dark:bg-[#1c2e22] rounded-2xl p-5 shadow-xs border border-gray-100 dark:border-gray-800"
        >
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-bold text-lg">Monthly Budget</h3>
            <span class="text-sm font-bold text-primary">80% used</span>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            You have
            <span class="font-bold text-background-dark dark:text-white"
              >$340 left</span
            >
            to spend.
          </p>
          <div
            class="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 mb-2"
          >
            <div
              class="bg-primary h-3 rounded-full relative"
              style="width: 80%"
            >
              <div
                class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow-xs"
              ></div>
            </div>
          </div>
          <div class="flex justify-between text-xs text-gray-400 mt-2">
            <span>$0</span>
            <span>Target: $1,580</span>
          </div>
        </div>
      </div>

      <!-- Recent Insights (Anomalies) -->
      <div class="px-4 mb-8">
        <h3 class="font-bold text-lg mb-3 px-1">Insights</h3>
        <div class="space-y-3">
          <div
            class="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-800/30"
          >
            <div
              class="bg-orange-100 dark:bg-orange-800/30 text-orange-600 dark:text-orange-400 p-2 rounded-lg shrink-0"
            >
              <Utensils class="w-5 h-5" />
            </div>
            <div>
              <p
                class="text-sm font-bold text-background-dark dark:text-white mb-0.5"
              >
                High Dining Spend
              </p>
              <p
                class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed"
              >
                You spent
                <span class="font-bold text-orange-600 dark:text-orange-400"
                  >20% more</span
                >
                on dining this week compared to last week.
              </p>
            </div>
          </div>
          <div
            class="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-800/30"
          >
            <div
              class="bg-green-100 dark:bg-green-800/30 text-green-600 dark:text-green-400 p-2 rounded-lg shrink-0"
            >
              <PiggyBank class="w-5 h-5" />
            </div>
            <div>
              <p
                class="text-sm font-bold text-background-dark dark:text-white mb-0.5"
              >
                On Track!
              </p>
              <p
                class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed"
              >
                Great job! Your grocery spending is
                <span class="font-bold text-green-600 dark:text-green-400"
                  >15% lower</span
                >
                than your monthly average.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <BottomNav activeTab="Analytics" @navigate="handleNavigate" />
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
