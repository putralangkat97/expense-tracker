import { useMutation } from "@tanstack/vue-query";
import { authService } from "../services/auth";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

export const useAuth = () => {
  const router = useRouter();
  const authStore = useAuthStore();

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (data) => authService.register(data),
    onSuccess: (data) => {
      authStore.setUser(data.user);
      authStore.setToken(data.token);
      router.push("/initial-wallet-setup");
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (data) => authService.login(data),
    onSuccess: (data) => {
      authStore.setUser(data.user);
      authStore.setToken(data.token);
      if (data.settings) {
        authStore.setSettings(data.settings);
      }
      router.push("/dashboard");
    },
  });

  return {
    registerMutation,
    loginMutation,
  };
};
