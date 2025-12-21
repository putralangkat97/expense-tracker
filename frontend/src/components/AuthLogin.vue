<script setup>
  import { ref, computed } from "vue";
  import {
    Wallet,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Fingerprint,
    User,
  } from "lucide-vue-next";
  import { Input } from "@/components/ui/input";
  import { Button } from "@/components/ui/button";
  import { useAuth } from "../hooks/use-auth";

  // Form state
  const authMode = ref("login");
  const showPassword = ref(false);
  const email = ref("");
  const password = ref("");
  const fullName = ref("");

  // Toggle password visibility
  const togglePassword = () => {
    showPassword.value = !showPassword.value;
  };

  // Auth mutations
  const { registerMutation, loginMutation } = useAuth();

  // Computed properties
  const isLoading = computed(() => {
    return registerMutation.isPending.value || loginMutation.isPending.value;
  });

  const errorMessage = computed(() => {
    if (authMode.value === "signup" && registerMutation.error.value) {
      return registerMutation.error.value.message;
    }
    if (authMode.value === "login" && loginMutation.error.value) {
      return loginMutation.error.value.message;
    }
    return "";
  });

  // Submit handler
  const handleSubmit = () => {
    if (authMode.value === "signup") {
      registerMutation.mutate({
        email: email.value,
        password: password.value,
        fullName: fullName.value || "User",
      });
    } else {
      loginMutation.mutate({
        email: email.value,
        password: password.value,
      });
    }
  };
</script>

<template>
  <div
    class="w-full max-w-105 mx-auto flex flex-col pt-10 gap-6 px-6 pb-6 overflow-y-auto"
  >
    <!-- Header Section -->
    <div class="flex flex-col items-center text-center space-y-4 pt-4">
      <div
        class="w-16 h-16 rounded-2xl bg-primary/20 dark:bg-primary/10 flex items-center justify-center text-primary mb-2"
      >
        <Wallet class="w-9 h-9" />
      </div>
      <div class="space-y-2">
        <h1
          class="text-text-main dark:text-white tracking-tight text-[32px] font-bold leading-tight"
        >
          Take control of your finances.
        </h1>
        <p
          class="text-text-muted dark:text-gray-400 text-sm font-medium leading-normal"
        >
          Track expenses, manage budgets, and save more.
        </p>
      </div>
    </div>

    <!-- Authentication Toggle -->
    <div class="w-full">
      <div class="flex p-1 bg-[#e7f3eb] dark:bg-surface-dark rounded-xl">
        <label class="flex-1 cursor-pointer">
          <input
            type="radio"
            name="auth_mode"
            value="login"
            v-model="authMode"
            class="peer sr-only"
          />
          <div
            class="flex items-center justify-center py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 text-text-muted dark:text-gray-400 peer-checked:bg-white dark:peer-checked:bg-[#2a4034] peer-checked:text-text-main dark:peer-checked:text-white peer-checked:shadow-xs"
          >
            Log In
          </div>
        </label>
        <label class="flex-1 cursor-pointer">
          <input
            type="radio"
            name="auth_mode"
            value="signup"
            v-model="authMode"
            class="peer sr-only"
          />
          <div
            class="flex items-center justify-center py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 text-text-muted dark:text-gray-400 peer-checked:bg-white dark:peer-checked:bg-[#2a4034] peer-checked:text-text-main dark:peer-checked:text-white peer-checked:shadow-xs"
          >
            Sign Up
          </div>
        </label>
      </div>
    </div>

    <!-- Form Section -->
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4 w-full">
      <!-- Error Message -->
      <div
        v-if="errorMessage"
        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3"
      >
        <p
          class="text-sm text-red-600 dark:text-red-400 text-center font-medium"
        >
          {{ errorMessage }}
        </p>
      </div>

      <!-- Full Name Field (Signup only) -->
      <div v-if="authMode === 'signup'" class="space-y-1.5">
        <label
          for="fullName"
          class="text-text-main dark:text-gray-200 text-sm font-semibold ml-1"
          >Full Name</label
        >
        <div class="relative group">
          <div
            class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted"
          >
            <User class="w-5 h-5" />
          </div>
          <Input
            id="fullName"
            v-model="fullName"
            type="text"
            placeholder="Enter your full name"
            class="w-full h-14 pl-11 pr-4 transition-all"
          />
        </div>
      </div>

      <!-- Email Field -->
      <div class="space-y-1.5">
        <label
          for="email"
          class="text-text-main dark:text-gray-200 text-sm font-semibold ml-1"
          >Email</label
        >
        <div class="relative group">
          <div
            class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted"
          >
            <Mail class="w-5 h-5" />
          </div>
          <Input
            id="email"
            v-model="email"
            type="email"
            placeholder="Enter your email"
            class="w-full h-14 pl-11 pr-4 transition-all"
          />
        </div>
      </div>

      <!-- Password Field -->
      <div class="space-y-1.5">
        <label
          for="password"
          class="text-text-main dark:text-gray-200 text-sm font-semibold ml-1"
          >Password</label
        >
        <div class="relative group">
          <div
            class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted"
          >
            <Lock class="w-5 h-5" />
          </div>
          <Input
            id="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Enter your password"
            class="w-full h-14 pl-11 pr-4 transition-all"
          />
          <button
            type="button"
            @click="togglePassword"
            class="absolute inset-y-0 right-0 pr-4 flex items-center text-text-muted hover:text-primary transition-colors cursor-pointer"
          >
            <EyeOff v-if="showPassword" class="w-5 h-5" />
            <Eye v-else class="w-5 h-5" />
          </button>
        </div>
        <div class="flex justify-end pt-1">
          <a
            href="#"
            class="text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
            >Forgot Password?</a
          >
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 pt-2">
        <Button
          size="lg"
          class="flex-1 h-14 text-lg font-bold shadow-lg shadow-primary/25 active:scale-[0.98] transition-all"
          :disabled="isLoading"
        >
          {{
            isLoading
              ? "Please wait..."
              : authMode === "login"
                ? "Log In"
                : "Sign Up"
          }}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          class="h-14 w-14 rounded-xl border-[#d0e7d7] dark:border-gray-700 bg-white dark:bg-surface-dark text-text-muted hover:text-primary hover:border-primary"
          aria-label="Login with FaceID"
        >
          <Fingerprint class="w-7 h-7" />
        </Button>
      </div>
    </form>

    <!-- Divider -->
    <div class="relative flex items-center py-1">
      <div class="grow border-t border-[#d0e7d7] dark:border-gray-700"></div>
      <span
        class="shrink-0 mx-4 text-xs font-medium text-gray-400 uppercase tracking-wider"
        >Or continue with</span
      >
      <div class="grow border-t border-[#d0e7d7] dark:border-gray-700"></div>
    </div>

    <!-- Social Login -->
    <div class="grid grid-cols-2 gap-4">
      <Button
        variant="outline"
        size="default"
        class="h-12 bg-white dark:bg-surface-dark border-[#d0e7d7] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl"
      >
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6pPtuGjf8hYadGXQKEoTvgD4cQGGDyjqSR2T8e8RM_omM0otL5zcOFGnMXRqhYxlIJ0IqtIyWLFqEsxS9XD5T8gvvC_oV8cIpq-EsoHaO3XSp5HxqVaAIrk1T8XQ9gSzJdObFY0UTR1hOPCIY5w0w2eQLGI6YPCBtYs7QE98e1Mg09cgdEJ21MCq894a3rcS_gOwzTalbB-PKzsg2OAj0OPNSuVMTJd1vkf1Fd6Zhi8m3yMm6OmyJv17-nUTmm4lPnFANNzlQhFg"
          alt="Google Logo"
          class="w-5 h-5 mr-2"
        />
        <span class="text-sm font-semibold text-text-main dark:text-white"
          >Google</span
        >
      </Button>
      <Button
        variant="outline"
        size="default"
        class="h-12 bg-white dark:bg-surface-dark border-[#d0e7d7] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl"
      >
        <!-- Apple icon -->
        <svg
          class="w-5 h-5 mr-2 text-black dark:text-white"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.21-.93 3.8-.74 2.5.19 3.48 1.34 3.48 1.34s-1.9 1.16-1.9 4.02c0 3.2 2.84 4.3 2.84 4.3s-1 2.4-2.3 3.31zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.16 2.39-2.11 4.21-3.74 4.25z"
          />
        </svg>
        <span class="text-sm font-semibold text-text-main dark:text-white"
          >Apple</span
        >
      </Button>
    </div>

    <!-- Footer -->
    <div class="text-center pb-4">
      <p class="text-xs text-gray-500 dark:text-gray-400">
        <span class="flex items-center justify-center gap-1 pb-2 opacity-80">
          <span class="material-symbols-outlined text-[14px]"
            >verified_user</span
          >
          Secure & Private
        </span>
        By continuing, you agree to our
        <a
          href="#"
          class="text-text-main dark:text-gray-300 hover:text-primary underline decoration-primary/50 underline-offset-2"
          >Terms of Service</a
        >
        and
        <a
          href="#"
          class="text-text-main dark:text-gray-300 hover:text-primary underline decoration-primary/50 underline-offset-2"
          >Privacy Policy</a
        >.
      </p>
    </div>
  </div>
</template>
