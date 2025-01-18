<script setup lang="ts">
const props = defineProps<{
  recipe: {
    id: string;
    title: string;
    link: string;
    category: string;
    duration: number;
    rating: number;
    image: string;
  };
}>();

const emit = defineEmits(["plan"]);
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

    <!-- CTA for planning -->
    <div class="flex justify-center px-4 py-3">
      <button
        @click="$emit('plan', recipe)"
        class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
      >
        Plan
      </button>
    </div>
  </div>
</template>