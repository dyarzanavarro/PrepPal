<script setup lang="ts">
const props = defineProps<{
  recipe: {
    title: string;
    link?: string; // Optional, since not all recipes may have a link
    category?: string; // Optional, provide a fallback if missing
    duration?: number; // Optional
    rating?: number; // Optional
    image?: string; // Optional
  };
}>();
</script>

<template>
  <div
    class="w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl"
  >
    <nuxt-link
      :to="`/recipe/${recipe.title.replace(/\s+/g, '-').toLowerCase()}`"
      class="block"
    >
      <!-- Use a fallback image if recipe.image is undefined -->
      <img
        :src="
          recipe.image || 'https://via.placeholder.com/300x400?text=No+Image'
        "
        alt="Recipe Image"
        class="h-80 w-72 object-cover rounded-t-xl"
      />
    </nuxt-link>
    <div class="px-4 py-3 w-72">
      <!-- Fallback for category -->
      <span class="text-gray-400 mr-3 uppercase text-xs">{{
        recipe.category || "Uncategorized"
      }}</span>

      <!-- Title -->
      <p class="text-lg font-bold text-black truncate block capitalize">
        {{ recipe.title }}
      </p>

      <div class="flex items-center">
        <!-- Fallback for duration -->
        <p class="text-lg font-semibold text-black cursor-auto my-3">
          {{ recipe.duration ? `${recipe.duration} minutes` : "Duration N/A" }}
        </p>

        <!-- Fallback for rating -->
        <div class="ml-auto">
          {{ recipe.rating ? `${recipe.rating}⭐` : "No Rating" }}
        </div>
      </div>
    </div>
  </div>
</template>
