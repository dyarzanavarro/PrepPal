<template>
  <div>
    <div class="p-2 text-center">
      <h2 class="text-xl font-light text-slate-400 px-9 pt-4">
        Hey, {{ userDisplayName }}
      </h2>
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
import { ref, computed, onMounted } from "vue";
import { useFirebaseAuth } from "vuefire";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  getFirestore,
} from "firebase/firestore";

// Firebase setup
const db = getFirestore();
const auth = useFirebaseAuth();

// Recipe state
const recipes = ref([]); // User-specific recipes
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

// Modal state
const isModalOpen = ref(false);

// Get user's display name for greeting
const userDisplayName = computed(() => auth.currentUser?.displayName || "User");

// Fetch user-specific recipes
const fetchUserRecipes = async () => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const userRecipesCollection = collection(db, `users/${user.uid}/recipes`);
    const userRecipesSnapshot = await getDocs(userRecipesCollection);

    recipes.value = userRecipesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Fetched user recipes:", recipes.value);
  } catch (error) {
    console.error("Error fetching user recipes:", error);
  }
};

// Save a recipe
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
  const user = auth.currentUser;
  if (!user) return;

  try {
    const userRecipesCollection = collection(db, `users/${user.uid}/recipes`);

    // Generate slug
    const slug = recipeData.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/ä+/g, "a")
      .replace(/-+/g, "-")
      .substring(0, 200);

    // Save to Firestore
    await addDoc(userRecipesCollection, {
      ...recipeData,
      slug,
    });

    console.log("Recipe added successfully!");
    fetchUserRecipes(); // Refresh recipes after saving
  } catch (error) {
    console.error("Error adding recipe:", error);
  }
};

// Open the modal
const openModal = () => {
  isModalOpen.value = true;
};

// Fetch recipes on mount
onMounted(() => {
  fetchUserRecipes();
});
</script>

<style scoped>
</style>
