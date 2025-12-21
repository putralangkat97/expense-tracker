<script setup>
  import {
    Wallet,
    User,
    PieChart,
    LayoutGrid,
    ScanLine,
  } from "lucide-vue-next";
  import { useRouter } from "vue-router";

  const router = useRouter();

  const emit = defineEmits(["navigate"]);

  const navItems = [
    { name: "dashboard", label: "Home", icon: LayoutGrid, path: "/dashboard" },
    { name: "wallets", label: "Wallets", icon: Wallet, path: "/wallets" },
    {
      name: "transactions",
      label: "Trans.",
      icon: ScanLine,
      path: "/transactions",
    },
    { name: "budgets", label: "Budgets", icon: PieChart, path: "/budgets" },
    { name: "profile", label: "Profile", icon: User, path: "/profile" },
  ];

  const navigate = (item) => {
    if (item.path) {
      router.push(item.path);
    }
    emit("navigate", item.name);
  };
</script>

<template>
  <nav
    class="fixed bottom-0 w-full bg-white/70 dark:bg-[#1c2e22]/70 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 flex justify-around items-start pt-3 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.03)]"
    :style="{
      paddingBottom: 'calc(1rem + var(--safe-area-bottom))',
      height: 'calc(4rem + var(--safe-area-bottom))',
    }"
  >
    <button
      v-for="item in navItems"
      :key="item.name"
      class="flex flex-col items-center gap-1 w-16 group transition-colors"
      :class="
        activeTab === item.name
          ? 'text-primary'
          : 'text-gray-400 dark:text-gray-500 hover:text-text-main-light dark:hover:text-text-main-dark'
      "
      @click="navigate(item)"
    >
      <component
        :is="item.icon"
        class="w-6 h-6 transition-transform group-active:scale-95"
        :class="activeTab === item.name ? 'fill-current' : ''"
      />
      <span
        class="text-[10px] font-medium"
        :class="activeTab === item.name ? 'font-bold' : ''"
        >{{ item.label }}</span
      >
    </button>
  </nav>
</template>
