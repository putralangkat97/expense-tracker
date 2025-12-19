<script setup>
  import { defineProps, defineEmits } from "vue";

  defineProps({
    isOpen: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
  });

  defineEmits(["close"]);
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-60 flex items-end justify-center sm:items-center"
        role="dialog"
        aria-modal="true"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          @click="$emit('close')"
        ></div>

        <!-- Modal Content -->
        <Transition name="modal-slide">
          <div
            v-if="isOpen"
            class="relative w-full max-w-md overflow-hidden rounded-t-3xl sm:rounded-3xl bg-background-light dark:bg-background-dark shadow-2xl transition-all max-h-[90vh] flex flex-col"
          >
            <!-- Handle for mobile -->
            <div class="pt-3 pb-1 flex justify-center w-full shrink-0">
              <div
                class="h-1.5 w-12 rounded-full bg-gray-300 dark:bg-gray-600"
              ></div>
            </div>

            <!-- Header -->
            <div class="flex items-center justify-between px-4 py-3 shrink-0">
              <button
                class="text-gray-500 dark:text-gray-400 text-base font-medium hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                @click="$emit('close')"
              >
                Cancel
              </button>
              <h2
                class="text-text-dark dark:text-white text-lg font-bold leading-tight"
              >
                {{ title }}
              </h2>
              <!-- Spacer to balance the 'Cancel' button -->
              <div class="w-[50px]"></div>
            </div>

            <!-- Scrollable Body -->
            <div class="flex-1 overflow-y-auto no-scrollbar px-5 pb-8">
              <slot></slot>
            </div>

            <!-- Footer -->
            <div
              v-if="$slots.footer"
              class="p-5 pt-2 bg-background-light dark:bg-background-dark"
            >
              <slot name="footer"></slot>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .modal-fade-enter-from,
  .modal-fade-leave-to {
    opacity: 0;
  }

  .modal-slide-enter-active,
  .modal-slide-leave-active {
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .modal-slide-enter-from,
  .modal-slide-leave-to {
    transform: translateY(100%);
  }

  @media (min-width: 640px) {
    .modal-slide-enter-from,
    .modal-slide-leave-to {
      transform: translateY(20px);
      opacity: 0;
    }
  }

  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
