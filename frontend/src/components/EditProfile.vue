<script setup>
  import { ref, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { ArrowLeft, Camera, User, Mail, Phone } from "lucide-vue-next";
  import BaseButton from "./ui/BaseButton.vue";
  import { useAuthStore } from "../stores/auth";
  import { userService } from "../services/user";
  import { useMutation } from "@tanstack/vue-query";

  const router = useRouter();
  const authStore = useAuthStore();

  const fullName = ref("");
  const email = ref("");
  const phone = ref("");
  const bio = ref("");

  onMounted(() => {
    if (authStore.user) {
      fullName.value = authStore.user.fullName || "";
      email.value = authStore.user.email || "";
      phone.value = authStore.user.phone || "";
      bio.value = authStore.user.bio || "";
    }
  });

  const handleBack = () => {
    router.back();
  };

  const updateProfileMutation = useMutation({
    mutationFn: (data) => userService.updateUser(authStore.user.id, data),
    onSuccess: (data) => {
      // Merge updated fields into current user object in store
      authStore.setUser({ ...authStore.user, ...data });
      router.back();
    },
    onError: (error) => {
      console.error("Failed to update profile:", error);
      // Handle error (e.g. show toast)
      alert("Failed to update profile: " + error.message);
    },
  });

  const saveChanges = () => {
    updateProfileMutation.mutate({
      fullName: fullName.value,
      email: email.value,
      phone: phone.value,
      bio: bio.value,
    });
  };

  const cancel = () => {
    router.back();
  };
</script>

<template>
  <div
    class="relative flex min-h-screen w-full flex-col overflow-x-hidden pb-10 bg-background-light dark:bg-background-dark font-display text-text-dark dark:text-white antialiased transition-colors duration-200"
  >
    <!-- Top App Bar -->
    <div
      class="sticky top-0 z-50 flex items-center justify-between bg-background-light/95 dark:bg-background-dark/95 px-4 py-3 backdrop-blur-md border-b border-black/5 dark:border-white/5"
    >
      <button
        @click="handleBack"
        class="group flex size-10 items-center justify-center rounded-full active:bg-black/5 dark:active:bg-white/10 transition-colors"
      >
        <ArrowLeft class="w-6 h-6" />
      </button>
      <h1 class="text-xl font-bold tracking-tight">Edit Profile</h1>
      <div class="size-10"></div>
    </div>

    <div class="flex flex-col items-center px-4 py-8">
      <div class="relative group cursor-pointer">
        <div
          class="h-32 w-32 rounded-full bg-cover bg-center shadow-lg ring-4 ring-white dark:ring-surface-dark transition-opacity group-hover:opacity-90"
          :style="{
            backgroundImage: `url('${authStore.user?.avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLl2g8-6sGqjOaxtetWdCu026Rvp5Wu9ThVUqEA_llSsjoYCsvz16Yuc_ZHBjibhyFtQfanjYo1_dLk2-oZw_WDRMXyA_HoJwshrG2Osh0E3GekNiA5yUjBsrdWkKNa3Y7qP4dFTKS_7Cla-kVdKankvua2KsPpm8NsOoPdMVyOfLNjijTbESg0k8z1vU0BIN_evyezqp9werBOAHDjydmZNWMkpHnA-djAZnkrV2L56ebAmc0cKJyLch6Nn_g3pnwn2KLTdVuHNY'}`,
          }"
        ></div>
        <div
          class="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-md ring-4 ring-white dark:ring-background-dark transition-transform active:scale-95"
        >
          <Camera class="w-5 h-5" />
        </div>
      </div>
      <button
        class="mt-4 text-sm font-bold text-primary hover:text-green-600 transition-colors"
      >
        Change Photo
      </button>
    </div>

    <form
      class="mt-2 px-4 w-full max-w-3xl mx-auto flex flex-col gap-6"
      @submit.prevent="saveChanges"
    >
      <div class="space-y-2">
        <label
          class="block text-sm font-bold text-[#4e9767] uppercase tracking-wider ml-1"
          for="full-name"
          >Full Name</label
        >
        <div
          class="relative rounded-2xl bg-surface-light dark:bg-surface-dark shadow-xs ring-1 ring-black/5 dark:ring-white/10 focus-within:ring-2 focus-within:ring-primary transition-shadow"
        >
          <input
            v-model="fullName"
            class="block w-full border-0 bg-transparent py-4 px-4 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-0 sm:text-base font-semibold outline-hidden"
            id="full-name"
            type="text"
          />
          <div
            class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none"
          >
            <User class="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      <div class="space-y-2">
        <label
          class="block text-sm font-bold text-[#4e9767] uppercase tracking-wider ml-1"
          for="email"
          >Email Address</label
        >
        <div
          class="relative rounded-2xl bg-surface-light dark:bg-surface-dark shadow-xs ring-1 ring-black/5 dark:ring-white/10 focus-within:ring-2 focus-within:ring-primary transition-shadow"
        >
          <input
            v-model="email"
            class="block w-full border-0 bg-transparent py-4 px-4 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-0 sm:text-base font-semibold outline-hidden"
            id="email"
            type="email"
          />
          <div
            class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none"
          >
            <Mail class="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      <div class="space-y-2">
        <label
          class="block text-sm font-bold text-[#4e9767] uppercase tracking-wider ml-1"
          for="phone"
          >Phone Number</label
        >
        <div
          class="relative rounded-2xl bg-surface-light dark:bg-surface-dark shadow-xs ring-1 ring-black/5 dark:ring-white/10 focus-within:ring-2 focus-within:ring-primary transition-shadow"
        >
          <input
            v-model="phone"
            class="block w-full border-0 bg-transparent py-4 px-4 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-0 sm:text-base font-semibold outline-hidden"
            id="phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
          />
          <div
            class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none"
          >
            <Phone class="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      <div class="space-y-2">
        <label
          class="block text-sm font-bold text-[#4e9767] uppercase tracking-wider ml-1"
          for="bio"
          >Bio</label
        >
        <div
          class="relative rounded-2xl bg-surface-light dark:bg-surface-dark shadow-xs ring-1 ring-black/5 dark:ring-white/10 focus-within:ring-2 focus-within:ring-primary transition-shadow"
        >
          <textarea
            v-model="bio"
            class="block w-full border-0 bg-transparent py-4 px-4 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-0 sm:text-base font-medium resize-none outline-hidden"
            id="bio"
            placeholder="Tell us a little about yourself..."
            rows="3"
          ></textarea>
        </div>
      </div>
    </form>

    <div class="mt-auto px-4 w-full max-w-3xl mx-auto pt-8">
      <BaseButton
        @click="saveChanges"
        class="w-full font-bold shadow-lg shadow-green-500/20"
        size="lg"
        :disabled="updateProfileMutation.isPending.value"
      >
        {{
          updateProfileMutation.isPending.value ? "Saving..." : "Save Changes"
        }}
      </BaseButton>
      <button
        @click="cancel"
        class="mt-4 w-full flex items-center justify-center gap-2 rounded-2xl bg-transparent border border-transparent text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 py-3 px-4 text-sm font-semibold transition-colors"
      >
        Cancel
      </button>
    </div>
  </div>
</template>
