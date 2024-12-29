<template>
  <div>
    <div class="p-2 text-center">
      <h2 class="text-xl font-light text-slate-400 px-9 pt-4">Hey, Daniel</h2>
      <h1 class="text-3xl font-bold text-black px-9 pt-2">
        What are we cooking today?
      </h1>
      <div
        class="pt-2 mx-auto text-center flex justify-center max-w-lg flex-col mx-auto"
      >
        <input
          v-model="searchQuery"
          @input="searchRecipes"
          placeholder="Search for recipes..."
          class="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <div
      id="Recipes"
      class="w-fit mx-auto grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-5 mb-5"
    >
      <RecipeCard
        v-for="recipe in filteredRecipes"
        :key="recipe.id"
        :recipe="recipe"
      />
    </div>
  </div>

  <div class="fixed bottom-4 right-4">
    <button
      @click="openModal"
      class="bg-green-600 hover:bg-green-700 text-white font-bold text-3xl py-4 px-6 rounded-full shadow-lg"
    >
      +
    </button>
  </div>

  <recipe-modal
    v-if="isModalOpen"
    @close="isModalOpen = false"
    @save="onSaveRecipe"
  />
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useCollection } from "vuefire";
import { addDoc, collection, getFirestore } from "firebase/firestore";

const db = getFirestore();
const recipesCollection = collection(db, "recipes");
const { data: recipes } = useCollection(recipesCollection);

const searchQuery = ref("");
const filteredRecipes = computed(() => {
  if (!searchQuery.value.trim()) {
    return recipes.value;
  }
  const query = searchQuery.value.trim().toLowerCase();
  return recipes.value.filter((recipe) =>
    recipe.title.toLowerCase().includes(query)
  );
});

const searchRecipes = () => {
  // This function is called on input change, but the actual filtering is done in the computed property
};
// Slug generation function
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/ä+/g, "a")
    .replace(/-+/g, "-")
    .substring(0, 200); // Optional: limit length of slug
};

// Function to handle save event from modal
const onSaveRecipe = async (recipeData: {
  id: string;
  title: string;
  link: string;
  category: string;
  duration: number;
  rating: number;
  image: string;
  description: string;
}) => {
  try {
    // Generate the slug from the title
    const slug = generateSlug(recipeData.title);

    // Create a new recipe object including the slug
    const recipeWithSlug = {
      ...recipeData,
      slug, // Include the slug in the recipe data
    };

    // Save the recipe with the slug to Firestore
    await addDoc(recipesCollection, recipeWithSlug);
    console.log("Recipe added successfully!");
  } catch (error) {
    console.error("Error adding recipe:", error);
  }
};

// Modal visibility state
const isModalOpen = ref(false);

// Method to open the modal
const openModal = () => {
  isModalOpen.value = true;
};
</script>

<style scoped>
</style>