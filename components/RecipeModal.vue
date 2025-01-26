<template>
  <div
    class="fixed px-6 inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    @click.self="closeModal"
  >
    <!-- Modal Container -->
    <div class="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg relative">
      <!-- Close Button -->
      <button
        @click="closeModal"
        class="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-3xl"
      >
        &times;
      </button>

      <h2 class="text-2xl font-semibold mb-4">Add New Recipe</h2>

      <!-- Form Fields -->
      <form @submit.prevent="saveRecipe">
        <div class="mb-4">
          <label class="block font-medium mb-1">Recipe Title</label>
          <input
            v-model="recipeData.title"
            type="text"
            class="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter recipe title"
          />
        </div>

        <div class="mb-4">
          <label class="block font-medium mb-1">Recipe Link</label>
          <input
            v-model="recipeData.link"
            type="text"
            class="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter recipe link"
          />
        </div>

        <!-- Image Upload -->
        <div class="mb-4">
          <label class="block font-medium mb-1">Recipe Image</label>
          <input
            v-model="recipeData.image"
            type="url"
            class="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter image URL"
          />
        </div>

        <div class="mb-4">
          <label class="block font-medium mb-1">Category</label>
          <select
            v-model="recipeData.category"
            class="w-full p-2 border border-gray-300 rounded"
          >
            <option value="" disabled>Select category</option>
            <option>Lunch</option>
            <option>Dinner</option>
            <option>Breakfast</option>
            <option>Snack</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block font-medium mb-1">Duration (minutes)</label>
          <input
            v-model="recipeData.duration"
            type="number"
            min="0"
            class="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter duration"
          />
        </div>

        <div class="mb-4">
          <label class="block font-medium mb-1">Rating (stars)</label>
          <input
            v-model="recipeData.rating"
            type="number"
            min="1"
            max="5"
            class="w-full p-2 border border-gray-300 rounded"
            placeholder="Rate 1 to 5"
          />
        </div>

        <div class="mb-4">
          <label class="block font-medium mb-1">Description</label>
          <input
            v-model="recipeData.description"
            type="text"
            class="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter recipe description"
          />
        </div>

        <button
          type="submit"
          class="w-full text-white py-2 rounded bg-green-200 hover:bg-green-700 transition"
        >
          Save Recipe
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import slugify from "slugify";
const emit = defineEmits(["close", "save"]);

const recipeData = ref({
  title: "",
  link: "",
  category: "",
  duration: 0,
  rating: 1,
  image: "",
  description: "",
  slug: "",
});

// Prevent negative duration
watch(
  () => recipeData.value.duration,
  (newVal) => {
    if (newVal < 0) {
      recipeData.value.duration = 0;
    }
  }
);

// Utility to generate a slug
const generateSlug = (title: string) => {
  return slugify(title, {
    lower: true, // Convert to lowercase
    strict: true, // Remove special characters
  });
};

const closeModal = () => {
  emit("close");
};

const saveRecipe = () => {
  if (!recipeData.value.title || !recipeData.value.category) {
    alert("Please fill in all required fields.");
    return;
  }
  recipeData.value.slug = generateSlug(recipeData.value.title);

  emit("save", { ...recipeData.value }); // Emit data
};
</script>
