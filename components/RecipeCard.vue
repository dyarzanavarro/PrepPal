<script setup lang="ts">
const props = defineProps<{
  recipe: {
    title: string;
    link: string;
    category: string;
    duration: number;
    rating: number;
    image: string;
  };
}>();
</script>

<template>
  <div
    class="w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl"
  >
    <nuxt-link
      :to="`/recipe/${recipe.title.replace(/\s+/g, '-').toLowerCase()}`"
    >
      <img
        :src="recipe.image"
        alt="Recipe Image"
        class="h-80 w-72 object-cover rounded-t-xl"
      />
      <div class="px-4 py-3 w-72">
        <span class="text-gray-400 mr-3 uppercase text-xs">{{
          recipe.category
        }}</span>
        <p class="text-lg font-bold text-black truncate block capitalize">
          {{ recipe.title }}
        </p>
        <div class="flex items-center">
          <p class="text-lg font-semibold text-black cursor-auto my-3">
            {{ recipe.duration }} minutes
          </p>
          <div class="ml-auto">{{ recipe.rating }}⭐</div>
        </div>
      </div>
    </nuxt-link>
  </div>
</template>