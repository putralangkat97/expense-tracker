<script setup>
  import { ref, onMounted, nextTick } from "vue";
  import { useRouter } from "vue-router";
  import BaseButton from "./ui/BaseButton.vue";

  const router = useRouter();
  const otp = ref(["", "", "", ""]);
  const inputs = ref([]);
  const timer = ref(30);
  const canResend = ref(false);

  const focusInput = (index) => {
    if (inputs.value[index]) {
      inputs.value[index].focus();
    }
  };

  const handleInput = (index, event) => {
    const value = event.target.value;
    if (!/^\d*$/.test(value)) {
      otp.value[index] = "";
      return;
    }

    if (value.length > 1) {
      otp.value[index] = value.slice(-1);
    }

    if (value && index < 3) {
      focusInput(index + 1);
    }
  };

  const handleKeydown = (index, event) => {
    if (event.key === "Backspace" && !otp.value[index] && index > 0) {
      focusInput(index - 1);
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData("text").slice(0, 4);
    if (/^\d+$/.test(pastedData)) {
      pastedData.split("").forEach((char, i) => {
        if (i < 4) otp.value[i] = char;
      });
      focusInput(Math.min(pastedData.length, 3));
    }
  };

  const startTimer = () => {
    canResend.value = false;
    timer.value = 30;
    const interval = setInterval(() => {
      timer.value--;
      if (timer.value <= 0) {
        clearInterval(interval);
        canResend.value = true;
      }
    }, 1000);
  };

  const resendCode = () => {
    if (canResend.value) {
      startTimer();
      // Logic to resend code would go here
      console.log("Resending code...");
    }
  };

  const verifyAccount = () => {
    const code = otp.value.join("");
    if (code === "0000") {
      console.log("Verifying code:", code);
      router.push("/initial-wallet-setup");
    } else {
      alert("Invalid code. Please enter 0000.");
      otp.value = ["", "", "", ""];
      inputs.value[0].focus();
    }
  };

  onMounted(() => {
    startTimer();
    // Set initial value as per design mock
    otp.value[0] = "5";
    nextTick(() => {
      // Focus the second input since first is filled, or first if empty.
      // Design has 5 filled, so maybe focus second?
      // User request design has '5' in first box.
      focusInput(1);
    });
  });
</script>

<template>
  <div
    class="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-background-light dark:bg-background-dark"
  >
    <!-- TopAppBar -->
    <div class="flex items-center p-4 justify-between">
      <button
        @click="router.back()"
        class="group flex items-center justify-center size-10 rounded-full hover:bg-gray-200/50 dark:hover:bg-white/10 transition-colors focus:outline-hidden focus:ring-2 focus:ring-primary/50"
      >
        <span
          class="material-symbols-outlined text-[24px] text-text-dark dark:text-white"
          >arrow_back_ios_new</span
        >
      </button>
      <div class="h-5"></div>
    </div>

    <!-- Main Content Container -->
    <main class="flex-1 flex flex-col items-center px-6 pt-6 pb-8 w-full">
      <!-- Hero Icon -->
      <div class="mb-8 animate-fade-in">
        <div
          class="flex items-center justify-center size-20 rounded-full bg-primary/20 dark:bg-primary/10 shadow-soft backdrop-blur-xs"
        >
          <span
            class="material-symbols-outlined text-[40px] text-primary-content dark:text-primary font-bold"
            >lock_person</span
          >
        </div>
      </div>

      <!-- HeadlineText -->
      <h1
        class="text-text-dark dark:text-white tracking-tight text-[32px] font-extrabold leading-tight text-center mb-3"
      >
        Verification
      </h1>

      <!-- BodyText -->
      <p
        class="text-gray-500 dark:text-gray-400 text-base font-medium leading-relaxed text-center mb-10 max-w-70]"
      >
        We’ve sent a 4-digit code to <br />
        <span class="font-bold text-text-dark dark:text-white">+1 555-0192</span
        >. Please enter it below.
      </p>

      <!-- ConfirmationCode -->
      <div class="w-full mb-8">
        <form class="flex justify-center gap-4" @submit.prevent>
          <input
            v-for="(digit, index) in 4"
            :key="index"
            :ref="(el) => (inputs[index] = el)"
            v-model="otp[index]"
            type="text"
            inputmode="numeric"
            maxlength="1"
            :aria-label="`Digit ${index + 1}`"
            class="flex h-16 w-14 rounded-lg text-center bg-white dark:bg-surface-dark border-2 border-gray-200 dark:border-gray-700 text-2xl font-bold text-text-dark dark:text-white focus:outline-hidden focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all caret-primary shadow-xs"
            @input="handleInput(index, $event)"
            @keydown="handleKeydown(index, $event)"
            @paste="handlePaste"
          />
        </form>
      </div>

      <!-- Timer / Resend Action -->
      <div class="text-center mb-auto">
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
          Didn't receive code?
          <button
            @click="resendCode"
            :disabled="!canResend"
            class="ml-1 font-bold text-primary hover:text-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Resend
            {{ canResend ? "" : `in 00:${timer.toString().padStart(2, "0")}` }}
          </button>
        </p>
      </div>

      <!-- Primary Action Button -->
      <div class="w-full mt-8">
        <BaseButton
          @click="verifyAccount"
          class="w-full font-bold text-lg h-14 shadow-lg shadow-primary/20 hover:shadow-primary/30"
        >
          Verify Account
          <span class="material-symbols-outlined text-[20px] font-bold ml-2"
            >arrow_forward</span
          >
        </BaseButton>
      </div>
    </main>
  </div>
</template>
