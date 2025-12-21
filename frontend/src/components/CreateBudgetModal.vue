<script setup>
  import { ref, watch } from "vue";
  import { Pencil, Bell, Check, Trash2 } from "lucide-vue-next";
  import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerClose,
  } from "./ui/drawer";

  const props = defineProps({
    open: {
      type: Boolean,
      required: true,
    },
    categories: {
      type: Array,
      default: () => [],
    },
    budgetToEdit: {
      type: Object,
      default: null,
    },
    isEditMode: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(["update:open", "create", "update", "delete"]);

  const amount = ref("0");
  const budgetName = ref("");
  const frequency = ref("Monthly");
  const selectedCategoryId = ref(null);
  const alertEnabled = ref(true);

  const frequencies = ["Weekly", "Monthly", "One-time"];

  watch(
    () => props.open,
    (newVal) => {
      if (newVal) {
        if (props.isEditMode && props.budgetToEdit) {
          amount.value = props.budgetToEdit.limitAmount.toString();
          budgetName.value = props.budgetToEdit.name;
          frequency.value =
            props.budgetToEdit.frequency.charAt(0).toUpperCase() +
            props.budgetToEdit.frequency.slice(1);
          selectedCategoryId.value = props.budgetToEdit.categoryId;
          alertEnabled.value = props.budgetToEdit.alertEnabled;
        } else {
          // Reset form for create mode
          amount.value = "0";
          budgetName.value = "";
          frequency.value = "Monthly";
          selectedCategoryId.value =
            props.categories.length > 0 ? props.categories[0].id : null;
          alertEnabled.value = true;
        }
      }
    },
  );

  const handleSubmit = () => {
    const budgetData = {
      limitAmount: Number(amount.value.replace(/,/g, "")),
      name: budgetName.value,
      frequency: frequency.value.toLowerCase(),
      categoryId: selectedCategoryId.value,
      alertEnabled: alertEnabled.value,
    };

    if (props.isEditMode) {
      emit("update", { id: props.budgetToEdit.id, ...budgetData });
    } else {
      emit("create", budgetData);
    }
  };

  const handleDelete = () => {
    if (props.budgetToEdit) {
      emit("delete", props.budgetToEdit.id);
    }
  };
</script>

<template>
  <Drawer :open="open" @update:open="$emit('update:open', $event)">
    <DrawerContent class="!max-h-[96vh] !mt-4">
      <div class="mx-auto w-full max-w-sm overflow-y-auto pb-6">
        <DrawerHeader>
          <DrawerTitle class="text-center">
            {{ isEditMode ? "Edit Budget" : "Create Budget" }}
          </DrawerTitle>
          <DrawerDescription class="text-center">
            Set your budget limits to stay on track.
          </DrawerDescription>
        </DrawerHeader>

        <!-- Amount Input -->
        <div class="flex flex-col items-center justify-center py-8">
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Set Amount
          </p>
          <div class="relative flex items-center justify-center">
            <span
              class="text-4xl font-bold text-gray-400 dark:text-gray-500 mr-1"
              >$</span
            >
            <input
              v-model="amount"
              class="bg-transparent border-none text-center text-5xl font-extrabold text-text-dark dark:text-white placeholder-gray-300 dark:placeholder-gray-700 focus:ring-0 p-0 w-48 outline-hidden"
              placeholder="0"
              type="text"
            />
          </div>
        </div>

        <!-- Form Fields -->
        <div class="p-4 space-y-6">
          <!-- Budget Name -->
          <div class="space-y-3">
            <label
              class="block text-sm font-bold text-text-dark dark:text-white"
              >Budget Name</label
            >
            <div class="relative">
              <input
                v-model="budgetName"
                class="w-full bg-white dark:bg-[#1c2e22] border border-gray-200 dark:border-gray-700 rounded-xl py-4 px-4 text-text-dark dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-primary/50 focus:border-primary shadow-xs"
                placeholder="e.g. Summer Vacation"
                type="text"
              />
              <Pencil
                class="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          <!-- Frequency Selector -->
          <div class="space-y-3">
            <label
              class="block text-sm font-bold text-text-dark dark:text-white"
              >Frequency</label
            >
            <div class="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex">
              <button
                v-for="freq in frequencies"
                :key="freq"
                class="flex-1 py-2.5 rounded-lg text-sm transition-all duration-200"
                :class="
                  frequency === freq
                    ? 'bg-primary text-black font-bold shadow-xs'
                    : 'text-gray-500 dark:text-gray-400 font-semibold hover:text-text-dark dark:hover:text-white'
                "
                @click="frequency = freq"
              >
                {{ freq }}
              </button>
            </div>
          </div>

          <!-- Categories -->
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <label
                class="block text-sm font-bold text-text-dark dark:text-white"
                >Category</label
              >
              <button
                class="text-primary text-xs font-bold uppercase tracking-wider"
              >
                See All
              </button>
            </div>
            <div class="grid grid-cols-4 gap-3">
              <div
                v-for="cat in categories"
                :key="cat.id"
                class="flex flex-col items-center gap-2 group cursor-pointer"
                @click="selectedCategoryId = cat.id"
              >
                <div
                  class="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200"
                  :class="
                    selectedCategoryId === cat.id
                      ? 'bg-primary shadow-lg shadow-primary/30 scale-105'
                      : 'bg-white dark:bg-[#1c2e22] border border-gray-200 dark:border-gray-700 group-hover:bg-gray-50 dark:group-hover:bg-gray-700'
                  "
                >
                  <component
                    :is="cat.icon"
                    class="w-6 h-6"
                    :class="
                      selectedCategoryId === cat.id
                        ? 'text-black fill-current'
                        : 'text-gray-500 dark:text-gray-400'
                    "
                  />
                </div>
                <span
                  class="text-xs text-center truncate w-full"
                  :class="
                    selectedCategoryId === cat.id
                      ? 'font-bold text-text-dark dark:text-white'
                      : 'font-medium text-gray-500 dark:text-gray-400'
                  "
                >
                  {{ cat.name }}
                </span>
              </div>
            </div>
          </div>

          <!-- Alert Toggle -->
          <div class="pt-2">
            <div
              class="flex items-center justify-between p-4 bg-white dark:bg-[#1c2e22] rounded-xl border border-gray-200 dark:border-gray-700 shadow-xs"
            >
              <div class="flex items-center gap-3">
                <div
                  class="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-500"
                >
                  <Bell class="w-5 h-5" />
                </div>
                <div class="flex flex-col">
                  <span class="text-sm font-bold text-text-dark dark:text-white"
                    >Alert me</span
                  >
                  <span class="text-xs text-gray-500 dark:text-gray-400"
                    >When budget reaches 80%</span
                  >
                </div>
              </div>
              <!-- Toggle Switch -->
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  v-model="alertEnabled"
                  class="sr-only peer"
                />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-hidden rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"
                ></div>
              </label>
            </div>
          </div>
        </div>

        <DrawerFooter>
          <div class="flex gap-3">
            <button
              v-if="isEditMode"
              class="flex-1 h-14 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 active:scale-[0.98] transition-all rounded-xl flex items-center justify-center gap-2 text-red-600 dark:text-red-400 font-bold text-lg"
              @click="handleDelete"
            >
              <Trash2 class="w-6 h-6" />
            </button>
            <button
              class="h-14 bg-primary hover:bg-[#15cc53] active:scale-[0.98] transition-all rounded-xl flex items-center justify-center gap-2 text-black font-bold text-lg shadow-lg shadow-primary/25"
              :class="isEditMode ? 'flex-3' : 'w-full'"
              @click="handleSubmit"
            >
              <span>{{ isEditMode ? "Update Budget" : "Save Budget" }}</span>
              <Check class="w-6 h-6" />
            </button>
          </div>
          <DrawerClose as-child>
            <button
              class="w-full py-3 text-sm font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Cancel
            </button>
          </DrawerClose>
        </DrawerFooter>
      </div>
    </DrawerContent>
  </Drawer>
</template>
