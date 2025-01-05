<template>
  <div
    class="flex flex-col items-center justify-center bg-gray-100 p-4 rounded-lg shadow hover:bg-green-100 cursor-pointer"
  >
    <div class="text-2xl">{{ category.icon }}</div>
    <p class="mt-2 text-sm font-semibold text-gray-700">{{ category.name }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  category: {
    type: Object,
    required: true,
  },
});
</script>
