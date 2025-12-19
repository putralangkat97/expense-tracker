import { createRouter, createWebHistory } from "vue-router";
import AppOnboarding from "../components/AppOnboarding.vue";
import AuthLogin from "../components/AuthLogin.vue";
import AuthOtpVerification from "../components/AuthOtpVerification.vue";
import OnboardingWalletSetup from "../components/OnboardingWalletSetup.vue";
import OnboardingBudgetSetup from "../components/OnboardingBudgetSetup.vue";
import OnboardingSummaryPage from "../components/OnboardingSummaryPage.vue";
import AppDashboard from "../components/AppDashboard.vue";
import AppWallets from "../components/AppWallets.vue";
import UserProfile from "../components/UserProfile.vue"; // Added UserProfile to direct imports
import AppAnalytics from "../components/AppAnalytics.vue"; // Added AppAnalytics to direct imports
import AppBudgets from "../components/AppBudgets.vue"; // Added AppBudgets to direct imports
import AppTransactions from "../components/AppTransactions.vue"; // Added AppTransactions to direct imports
import EditProfile from "../components/EditProfile.vue";

const routes = [
  {
    path: "/",
    name: "Onboarding",
    component: AppOnboarding,
  },
  {
    path: "/login",
    name: "Login",
    component: AuthLogin,
  },
  {
    path: "/otp-verification",
    name: "OtpVerification",
    component: AuthOtpVerification,
  },
  {
    path: "/initial-wallet-setup",
    name: "InitialWalletSetup",
    component: OnboardingWalletSetup,
  },
  {
    path: "/initial-budget-setup",
    name: "InitialBudgetSetup",
    component: OnboardingBudgetSetup,
  },
  {
    path: "/onboarding-summary",
    name: "OnboardingSummary",
    component: OnboardingSummaryPage,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: AppDashboard,
  },
  {
    path: "/wallets",
    name: "Wallets",
    component: AppWallets,
  },
  {
    path: "/budgets",
    name: "Budgets",
    component: AppBudgets,
  },
  {
    path: "/transactions",
    name: "Transactions",
    component: AppTransactions,
  },
  {
    path: "/profile",
    name: "Profile",
    component: UserProfile,
  },
  {
    path: "/edit-profile",
    name: "EditProfile",
    component: EditProfile,
  },
  {
    path: "/analytics",
    name: "Analytics",
    component: AppAnalytics,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ["/login", "/"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem("authToken");

  if (authRequired && !loggedIn) {
    return next("/login");
  }

  if ((to.path === "/login" || to.path === "/") && loggedIn) {
    return next("/dashboard");
  }

  next();
});

export default router;
