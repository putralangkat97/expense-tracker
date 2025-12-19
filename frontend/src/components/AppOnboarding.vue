<script setup>
  import { ref, onMounted, onUnmounted } from "vue";
  import { ArrowRight } from "lucide-vue-next";
  import BaseButton from "./ui/BaseButton.vue";
  import { useRouter } from "vue-router";

  const router = useRouter();

  const currentSlide = ref(0);
  let intervalId = null;

  const slides = [
    {
      title: "All your money <br/>in one place",
      description: "Connect multiple wallets and track balances in real-time.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBHcbaL9SNlOwegzBuUAvRkFDD5iQ6UsrRBCIc35bA-HA3sUa92AVfxYPi6f4gRiOnH895VcZLL8SSj7AtfMhQ7AavA0mkQDFYHCHV38FiEHDezKjxMFgOKCRLtP6fex9t8vjmraum9O_BffvyYnb3RkE-5REau6y7FZVBC6quLwVQRsbTe9ZOxcXYNPK8_WxFXEaDcpB5PcJomnZT5HESHFmxk06LX6an8P3RldZd32dKlgAKM0SZaGL8Y_OhiPjbBjlIpGRpxl20",
    },
    {
      title: "Track your <br/>daily expenses",
      description: "Keep track of every penny and see where your money goes.",
      image:
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000&auto=format&fit=crop",
    },
    {
      title: "Reach your <br/>financial goals",
      description: "Set budgets, save money, and achieve your dreams.",
      image:
        "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=1000&auto=format&fit=crop",
    },
  ];

  const nextSlide = () => {
    if (currentSlide.value < slides.length - 1) {
      currentSlide.value++;
      resetInterval();
    } else {
      router.push("/login");
    }
  };

  const skip = () => {
    router.push("/login");
  };

  const startInterval = () => {
    intervalId = setInterval(() => {
      if (currentSlide.value < slides.length - 1) {
        currentSlide.value = (currentSlide.value + 1) % slides.length;
      } else {
        router.push("/login");
      }
    }, 3000); // Change slide every 3 seconds
  };

  const resetInterval = () => {
    clearInterval(intervalId);
    startInterval();
  };

  onMounted(() => {
    startInterval();
  });

  onUnmounted(() => {
    clearInterval(intervalId);
  });
</script>

<template>
  <!-- Top Bar -->
  <header class="flex-none flex items-center justify-end px-6 pt-12 pb-2 z-10">
    <button
      @click="skip"
      class="group flex items-center justify-center p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
    >
      <span
        class="text-neutral-500 dark:text-neutral-400 text-sm font-bold tracking-wide group-hover:text-primary transition-colors"
        >Skip</span
      >
    </button>
  </header>

  <!-- Main Content Area -->
  <main
    class="flex-1 flex flex-col items-center justify-center px-6 relative w-full max-w-md mx-auto"
  >
    <!-- Illustration Area -->
    <div
      class="w-full flex-1 flex flex-col justify-center items-center relative min-h-0 fade-in-up"
      :key="currentSlide"
    >
      <!-- Decorative Background Blob -->
      <div
        class="absolute inset-0 bg-linear-to-tr from-primary/20 to-transparent rounded-full blur-3xl opacity-60 scale-75"
      ></div>
      <!-- Main Illustration -->
      <div
        class="relative w-full aspect-4/5 max-h-[40vh] bg-contain bg-center bg-no-repeat z-0 transform transition-transform duration-500 hover:scale-105"
        :style="{ backgroundImage: `url('${slides[currentSlide].image}')` }"
      ></div>
    </div>

    <!-- Text Content -->
    <div
      class="w-full text-center space-y-4 mb-4 sm:mb-8 z-10 fade-in-up"
      style="animation-delay: 0.1s"
      :key="'text-' + currentSlide"
    >
      <h1
        class="text-3xl sm:text-4xl font-extrabold text-text-dark dark:text-white leading-[1.15] tracking-tight"
        v-html="slides[currentSlide].title"
      ></h1>
      <p
        class="text-neutral-500 dark:text-neutral-400 text-base font-medium leading-relaxed max-w-[320px] mx-auto"
      >
        {{ slides[currentSlide].description }}
      </p>
    </div>
  </main>

  <!-- Bottom Action Area -->
  <footer
    class="flex-none w-full max-w-md mx-auto px-6 pb-8 pt-4 flex flex-col items-center gap-6 z-10"
  >
    <!-- Page Indicators -->
    <div class="flex flex-row items-center justify-center gap-2 mb-2">
      <div
        v-for="(slide, index) in slides"
        :key="index"
        class="h-2 rounded-full transition-all duration-300"
        :class="
          currentSlide === index
            ? 'w-8 bg-primary'
            : 'w-2 bg-neutral-200 dark:bg-neutral-700'
        "
      ></div>
    </div>

    <!-- Buttons -->
    <div class="w-full flex flex-col gap-3">
      <!-- Primary Action -->
      <BaseButton @click="nextSlide" size="lg" block>
        Next
        <template #icon-right>
          <ArrowRight
            class="w-5 h-5 font-bold group-hover:translate-x-1 transition-transform ml-2"
          />
        </template>
      </BaseButton>

      <!-- Secondary Action -->
      <BaseButton @click="skip" variant="ghost" size="default" block>
        Log In
      </BaseButton>
    </div>

    <!-- Home Indicator Spacer for iOS -->
    <div class="h-1 w-1/3 bg-transparent"></div>
  </footer>
</template>
