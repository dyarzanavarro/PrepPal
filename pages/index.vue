<script setup lang="ts">
import { ref, computed } from "vue";
import { useCollection } from "vuefire";
import { addDoc, collection, getFirestore } from "firebase/firestore";

// Define the recipes variable
const db = getFirestore();
const recipesCollection = collection(db, "recipes");
const { data: recipes } = useCollection(recipesCollection);

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

// Track the selected tag
const selectedTag = ref<string | null>(null);

// Filter recipes based on the selected tag
const filteredRecipes = computed(() => {
  if (!selectedTag.value) return recipes.value;
  return recipes.value.filter(
    (recipe) => recipe.category === selectedTag.value
  );
});

// Handle the tag selection event
const handleTagSelected = (tag: string) => {
  selectedTag.value = selectedTag.value === tag ? null : tag;
};
</script>

<template>
  <div class="p-2 text-center">
    <h2 class="text-xl font-light text-slate-400 px-9 pt-4">Hey, Daniel</h2>
    <h1 class="text-3xl font-bold text-black px-9 pt-2">
      What are we cooking today?
    </h1>

    <!-- Pass unique tags and the currently selected tag -->
    <RecipeFilterTags
      :tags="
        recipes
          .map((recipe) => recipe.category)
          .filter((v, i, a) => a.indexOf(v) === i)
      "
      :selectedTag="selectedTag"
      @tagSelected="handleTagSelected"
    />
  </div>

  <div
    id="Recipes"
    class="w-fit mx-auto grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-5 mb-5"
  >
    <RecipeCard
      v-for="recipe in filteredRecipes"
      :key="recipe.title"
      :recipe="recipe"
    />
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
