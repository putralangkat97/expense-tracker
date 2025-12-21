<script setup>
  import { useRouter } from "vue-router";
  import {
    ArrowLeft,
    BadgeCheck,
    Wallet,
    ChevronRight,
    Gem,
    Banknote,
    Palette,
    Bell,
    ScanFace,
    Lock,
    Shield,
    LogOut,
    PieChart,
  } from "lucide-vue-next";
  import BottomNav from "./ui/BottomNav.vue";
  import { useAuthStore } from "../stores/auth";
  import { computed } from "vue";

  const router = useRouter();
  const authStore = useAuthStore();

  const user = computed(() => authStore.user);

  const handleBack = () => {
    router.back();
  };

  const handleLogout = () => {
    authStore.logout();
    router.push("/login");
  };

  const navigateToAnalytics = () => {
    router.push("/analytics");
  };

  const navigateToEditProfile = () => {
    router.push("/edit-profile");
  };
</script>

<template>
  <div
    class="relative flex min-h-screen w-full flex-col overflow-x-hidden pb-10 bg-background-light dark:bg-background-dark font-display text-text-dark dark:text-white antialiased transition-colors duration-200"
  >
    <!-- Top App Bar -->
    <div
      class="flex items-center justify-center bg-background-light/95 dark:bg-background-dark/95 px-4 py-3 backdrop-blur-md"
    >
      <!-- <button
        class="group flex size-10 items-center justify-center rounded-full active:bg-black/5 dark:active:bg-white/10 transition-colors"
        @click="handleBack"
      >
        <ArrowLeft class="w-6 h-6" />
      </button> -->
      <h1 class="text-xl font-bold tracking-tight">Settings</h1>
      <!-- <div class="size-10"></div> -->
      <!-- Spacer for visual balance -->
    </div>

    <!-- Profile Header Section -->
    <div class="flex flex-col items-center px-4 py-6">
      <div class="relative mb-4">
        <div
          class="h-28 w-28 rounded-full bg-cover bg-center shadow-lg ring-4 ring-white dark:ring-[#1c3224]"
          :style="{
            backgroundImage: `url('${user?.avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLl2g8-6sGqjOaxtetWdCu026Rvp5Wu9ThVUqEA_llSsjoYCsvz16Yuc_ZHBjibhyFtQfanjYo1_dLk2-oZw_WDRMXyA_HoJwshrG2Osh0E3GekNiA5yUjBsrdWkKNa3Y7qP4dFTKS_7Cla-kVdKankvua2KsPpm8NsOoPdMVyOfLNjijTbESg0k8z1vU0BIN_evyezqp9werBOAHDjydmZNWMkpHnA-djAZnkrV2L56ebAmc0cKJyLch6Nn_g3pnwn2KLTdVuHNY'}`,
          }"
        ></div>
        <!-- Badge -->
        <div
          class="absolute -bottom-1 -right-1 flex h-8 min-w-8 items-center justify-center rounded-full bg-primary px-2 text-white shadow-md ring-2 ring-white dark:ring-[#1c3224]"
        >
          <BadgeCheck class="w-4.5 h-4.5" />
        </div>
      </div>
      <h2 class="text-2xl font-bold leading-tight">
        {{ user?.fullName || "User" }}
      </h2>
      <p class="text-[#4e9767] font-medium">
        {{ user?.email || "email@example.com" }}
      </p>
      <button
        @click="navigateToEditProfile"
        class="mt-5 w-full max-w-50 rounded-xl bg-[#e7f3eb] dark:bg-white/10 px-6 py-2.5 text-sm font-bold text-text-dark dark:text-white transition-transform active:scale-95 hover:bg-[#d5eadd] dark:hover:bg-white/20"
      >
        Edit Profile
      </button>
    </div>

    <!-- Settings Group: Account -->
    <div class="mt-4 px-4 w-full max-w-3xl mx-auto">
      <p
        class="ml-2 mb-2 text-xs font-bold uppercase tracking-wider text-[#4e9767]"
      >
        Account
      </p>
      <div
        class="overflow-hidden rounded-2xl bg-white dark:bg-[#1c3224] shadow-xs ring-1 ring-black/5 dark:ring-white/10"
      >
        <!-- Wallets -->
        <div
          class="group flex items-center justify-between p-4 transition-colors active:bg-gray-50 dark:active:bg-white/5 cursor-pointer"
        >
          <div class="flex items-center gap-4">
            <div
              class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-green-800 dark:text-primary"
            >
              <Wallet class="w-6 h-6" />
            </div>
            <span class="text-base font-semibold">Wallets</span>
          </div>
          <ChevronRight class="w-6 h-6 text-gray-400" />
        </div>
        <div class="ml-18 h-px bg-gray-100 dark:bg-white/5"></div>
        <!-- Analytics -->
        <div
          class="group flex items-center justify-between p-4 transition-colors active:bg-gray-50 dark:active:bg-white/5 cursor-pointer"
          @click="navigateToAnalytics"
        >
          <div class="flex items-center gap-4">
            <div
              class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-green-800 dark:text-primary"
            >
              <PieChart class="w-6 h-6" />
            </div>
            <span class="text-base font-semibold">Analytics</span>
          </div>
          <ChevronRight class="w-6 h-6 text-gray-400" />
        </div>
        <div class="ml-18 h-px bg-gray-100 dark:bg-white/5"></div>
        <!-- Subscription -->
        <div
          class="group flex items-center justify-between p-4 transition-colors active:bg-gray-50 dark:active:bg-white/5 cursor-pointer"
        >
          <div class="flex items-center gap-4">
            <div
              class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-green-800 dark:text-primary"
            >
              <Gem class="w-6 h-6" />
            </div>
            <span class="text-base font-semibold">Subscription</span>
          </div>
          <div class="flex items-center gap-2">
            <span
              class="rounded-md bg-primary/10 px-2 py-1 text-xs font-bold text-green-700 dark:text-green-400"
              >PRO</span
            >
            <ChevronRight class="w-6 h-6 text-gray-400" />
          </div>
        </div>
      </div>
    </div>

    <!-- Settings Group: Preferences -->
    <div class="mt-8 px-4 w-full max-w-3xl mx-auto">
      <p
        class="ml-2 mb-2 text-xs font-bold uppercase tracking-wider text-[#4e9767]"
      >
        Preferences
      </p>
      <div
        class="overflow-hidden rounded-2xl bg-white dark:bg-[#1c3224] shadow-xs ring-1 ring-black/5 dark:ring-white/10"
      >
        <!-- Currency -->
        <div
          class="group flex items-center justify-between p-4 transition-colors active:bg-gray-50 dark:active:bg-white/5 cursor-pointer"
        >
          <div class="flex items-center gap-4">
            <div
              class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-green-800 dark:text-primary"
            >
              <Banknote class="w-6 h-6" />
            </div>
            <span class="text-base font-semibold">Currency</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400"
              >USD ($)</span
            >
            <ChevronRight class="w-6 h-6 text-gray-400" />
          </div>
        </div>
        <div class="ml-18 h-px bg-gray-100 dark:bg-white/5"></div>
        <!-- Appearance -->
        <div class="flex items-center justify-between p-4">
          <div class="flex items-center gap-4">
            <div
              class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-green-800 dark:text-primary"
            >
              <Palette class="w-6 h-6" />
            </div>
            <span class="text-base font-semibold">Dark Mode</span>
          </div>
          <!-- Toggle Inactive -->
          <div
            class="relative h-7 w-12 cursor-pointer rounded-full bg-gray-200 dark:bg-gray-700 transition-colors hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            <div
              class="absolute left-1 top-1 size-5 rounded-full bg-white shadow-xs transition-all"
            ></div>
          </div>
        </div>
        <div class="ml-18 h-px bg-gray-100 dark:bg-white/5"></div>
        <!-- Notifications -->
        <div class="flex items-center justify-between p-4">
          <div class="flex items-center gap-4">
            <div
              class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-green-800 dark:text-primary"
            >
              <Bell class="w-6 h-6" />
            </div>
            <span class="text-base font-semibold">Push Notifications</span>
          </div>
          <!-- Toggle Active -->
          <div
            class="relative h-7 w-12 cursor-pointer rounded-full bg-primary transition-colors hover:bg-green-400"
          >
            <div
              class="absolute right-1 top-1 size-5 rounded-full bg-white shadow-xs transition-all"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Settings Group: Security -->
    <div class="mt-8 px-4 w-full max-w-3xl mx-auto">
      <p
        class="ml-2 mb-2 text-xs font-bold uppercase tracking-wider text-[#4e9767]"
      >
        Security
      </p>
      <div
        class="overflow-hidden rounded-2xl bg-white dark:bg-[#1c3224] shadow-xs ring-1 ring-black/5 dark:ring-white/10"
      >
        <!-- Face ID -->
        <div class="flex items-center justify-between p-4">
          <div class="flex items-center gap-4">
            <div
              class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-green-800 dark:text-primary"
            >
              <ScanFace class="w-6 h-6" />
            </div>
            <span class="text-base font-semibold">Face ID</span>
          </div>
          <!-- Toggle Active -->
          <div
            class="relative h-7 w-12 cursor-pointer rounded-full bg-primary transition-colors hover:bg-green-400"
          >
            <div
              class="absolute right-1 top-1 size-5 rounded-full bg-white shadow-xs transition-all"
            ></div>
          </div>
        </div>
        <div class="ml-18 h-px bg-gray-100 dark:bg-white/5"></div>
        <!-- Change Password -->
        <div
          class="group flex items-center justify-between p-4 transition-colors active:bg-gray-50 dark:active:bg-white/5 cursor-pointer"
        >
          <div class="flex items-center gap-4">
            <div
              class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-green-800 dark:text-primary"
            >
              <Lock class="w-6 h-6" />
            </div>
            <span class="text-base font-semibold">Change Password</span>
          </div>
          <ChevronRight class="w-6 h-6 text-gray-400" />
        </div>
        <div class="ml-18 h-px bg-gray-100 dark:bg-white/5"></div>
        <!-- Privacy Policy -->
        <div
          class="group flex items-center justify-between p-4 transition-colors active:bg-gray-50 dark:active:bg-white/5 cursor-pointer"
        >
          <div class="flex items-center gap-4">
            <div
              class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-green-800 dark:text-primary"
            >
              <Shield class="w-6 h-6" />
            </div>
            <span class="text-base font-semibold">Privacy Policy</span>
          </div>
          <ChevronRight class="w-6 h-6 text-gray-400" />
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-10 mb-24 px-4 w-full max-w-3xl mx-auto">
      <button
        class="flex w-full items-center justify-center rounded-2xl bg-white dark:bg-[#1c3224] border border-red-100 dark:border-red-900/30 p-4 text-red-600 dark:text-red-400 transition-colors active:bg-red-50 dark:active:bg-red-900/10 shadow-xs"
        @click="handleLogout"
      >
        <LogOut class="w-6 h-6 mr-2" />
        <span class="font-bold">Log Out</span>
      </button>
      <div class="mt-6 flex flex-col items-center justify-center gap-1">
        <p class="text-xs font-medium text-gray-400 dark:text-gray-500">
          Expensify App
        </p>
        <p class="text-xs text-gray-400 dark:text-gray-600">
          Version 1.0.0 (Build 4)
        </p>
      </div>
    </div>

    <BottomNav activeTab="profile" @navigate="handleNavigate" />
  </div>
</template>
