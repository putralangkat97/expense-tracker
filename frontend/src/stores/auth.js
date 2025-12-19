import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
  // State
  const user = ref(null);
  const settings = ref(null);
  const token = ref(null);

  // Getters
  const isAuthenticated = computed(() => !!token.value);
  const userName = computed(() => user.value?.fullName || "User");

  // Actions
  function setUser(userData) {
    user.value = userData;
    localStorage.setItem("user", JSON.stringify(userData));
  }

  function setToken(tokenData) {
    token.value = tokenData;
    localStorage.setItem("authToken", tokenData);
  }

  function setSettings(settingsData) {
    settings.value = settingsData;
    if (settingsData) {
      localStorage.setItem("userSettings", JSON.stringify(settingsData));
    }
  }

  function logout() {
    user.value = null;
    settings.value = null;
    token.value = null;
    localStorage.removeItem("user");
    localStorage.removeItem("userSettings");
    localStorage.removeItem("authToken");
  }

  function loadFromStorage() {
    const storedUser = localStorage.getItem("user");
    const storedSettings = localStorage.getItem("userSettings");
    const storedToken = localStorage.getItem("authToken");

    if (storedUser) {
      user.value = JSON.parse(storedUser);
    }
    if (storedSettings) {
      settings.value = JSON.parse(storedSettings);
    }
    if (storedToken) {
      token.value = storedToken;
    }
  }

  // Initialize from storage
  loadFromStorage();

  return {
    // State
    user,
    settings,
    token,
    // Getters
    isAuthenticated,
    userName,
    // Actions
    setUser,
    setToken,
    setSettings,
    logout,
    loadFromStorage,
  };
});
