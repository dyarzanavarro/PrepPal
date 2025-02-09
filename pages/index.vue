<template>
  <div class="bg-zinc-50 p-12">
    <!-- Greeting -->
    <h1 class="text-3xl font-bold mb-4">Hello, {{ userDisplayName }}</h1>
    <p class="text-lg text-gray-600 mb-6">What would you like to cook today?</p>

    <!-- Recipes of the Week -->
    <div>
      <div class="flex justify-between items-center mb-3">
        <h2 class="text-xl font-bold">Recipes of the Week</h2>
        <button
          @click="navigateToMealPlan"
          class="text-green-600 text-lg hover:underline font-semibold"
        >
          See all
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <template v-if="todayMeals.length > 0">
          <RecipeCard
            v-for="meal in todayMeals"
            :key="meal.id"
            :recipe="meal"
          />
        </template>
        <template v-else>
          <div
            class="flex flex-col items-center justify-center bg-gray-100 p-6 rounded-lg shadow-md"
          >
            <p class="text-gray-500 font-semibold text-lg mb-4">
              No meals planned yet.
            </p>
            <button
              @click="navigateToMealPlan"
              class="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md py-2 px-4"
            >
              Plan Your Meals
            </button>
          </div>
        </template>
      </div>
    </div>

    <!-- Search & Filter Section -->
    <div class="mb-6 mt-8">
      <h2 class="text-xl font-bold mb-3">Search or Filter Recipes</h2>
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search any recipes..."
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-green-400"
          @input="updateFilteredRecipes"
        />
        <div
          v-if="filteredRecipes.length > 0 && searchQuery"
          class="absolute bg-white border border-gray-300 mt-1 rounded-lg w-full shadow-md max-h-60 overflow-y-auto"
        >
          <ul>
            <li
              v-for="recipe in filteredRecipes"
              :key="recipe.id"
              class="p-2 hover:bg-gray-100 cursor-pointer"
              @click="goToRecipe(recipe.slug)"
            >
              {{ recipe.title }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Categories as Filters -->
    <div class="mb-6">
      <h2 class="text-xl font-bold mb-3">Categories</h2>
      <div class="flex gap-4 overflow-x-auto">
        <button
          v-for="category in categories"
          :key="category.name"
          @click="filterByCategory(category.name)"
          class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-200 transition"
        >
          <span class="text-xl">{{ category.icon }}</span>
          <span class="font-semibold">{{ category.name }}</span>
        </button>
      </div>
    </div>

    <!-- Filtered Recipes List -->
    <div v-if="searchQuery || selectedCategory" class="mb-6">
      <h2 class="text-xl font-bold mb-3">
        Showing results for:
        <span class="text-green-600">{{
          searchQuery || selectedCategory
        }}</span>
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <RecipeCard
          v-for="recipe in filteredRecipes"
          :key="recipe.id"
          :recipe="recipe"
        />
        <p v-if="filteredRecipes.length === 0" class="text-gray-500">
          No recipes found.
        </p>
      </div>
    </div>

    <!-- Recommendation Section -->
    <div class="mb-6">
      <div class="flex justify-between items-center mb-3">
        <h2 class="text-xl font-bold">Recommendation</h2>
        <button
          @click="fetchRecommendations"
          class="text-green-600 text-lg hover:underline font-semibold"
        >
          See all
        </button>
      </div>
      <div class="overflow-x-auto whitespace-nowrap flex gap-4">
        <RecipeCard
          v-for="recipe in recommendedRecipes"
          :key="recipe.id"
          :recipe="recipe"
          class="inline-block w-64"
        />
      </div>
    </div>

    <!-- Floating Add Recipe Button -->
    <div class="fixed bottom-4 right-4">
      <button
        @click="openModal"
        class="bg-green-600 hover:bg-green-700 text-white font-bold text-3xl py-4 px-6 rounded-full shadow-lg"
      >
        +
      </button>
    </div>

    <!-- Recipe Modal -->
    <recipe-modal
      v-if="isModalOpen"
      @close="isModalOpen = false"
      @save="onSaveRecipe"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useFirebaseAuth } from "vuefire";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useRouter } from "vue-router";

const db = getFirestore();
const auth = useFirebaseAuth();
const router = useRouter();

const userDisplayName = computed(() => auth.currentUser?.displayName || "User");

const searchQuery = ref("");
const selectedCategory = ref("");

const categories = [
  { name: "Breakfast", icon: "🍳" },
  { name: "Lunch", icon: "🍱" },
  { name: "Dinner", icon: "🍽️" },
  { name: "Dessert", icon: "🍰" },
  { name: "Snacks", icon: "🍿" },
];

const allRecipes = ref([]);
const recommendedRecipes = ref([]);
const todayMeals = ref([]);
const filteredRecipes = ref([]);

// Fetch all recipes
const fetchRecipes = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const userRecipesCollection = collection(db, `users/${user.uid}/recipes`);
  const recipeDocs = await getDocs(userRecipesCollection);

  allRecipes.value = recipeDocs.docs.map((doc) => ({
    id: doc.id,
    slug: doc.data().slug,
    ...doc.data(),
  }));

  fetchRecommendations();
  updateFilteredRecipes();
};

// Fetch today's planned meals
const fetchTodayMeals = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const today = new Date().toISOString().split("T")[0];
  const mealPlansCollection = collection(db, `users/${user.uid}/mealPlans`);
  const mealPlanDocs = await getDocs(mealPlansCollection);

  todayMeals.value = mealPlanDocs.docs
    .filter((doc) => doc.id === today)
    .map((doc) => doc.data())
    .flatMap((meal) => [meal.lunch, meal.dinner].filter(Boolean));
};

// Fetch recommendations
const fetchRecommendations = () => {
  recommendedRecipes.value = allRecipes.value
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);
};

// Update filtered recipes dynamically
const updateFilteredRecipes = () => {
  if (!searchQuery.value && !selectedCategory.value) {
    filteredRecipes.value = [];
    return;
  }
  filteredRecipes.value = allRecipes.value.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      recipe.category.toLowerCase() === selectedCategory.value.toLowerCase()
  );
};

// Navigate to selected recipe
const goToRecipe = (slug) => {
  router.push(`/recipe/${slug}`);
};

// Filter by category
const filterByCategory = (category) => {
  selectedCategory.value = category;
  searchQuery.value = "";
  updateFilteredRecipes();
};

// Open recipe modal
const isModalOpen = ref(false);
const openModal = () => {
  isModalOpen.value = true;
};

onMounted(() => {
  fetchRecipes();
  fetchTodayMeals();
});
</script>
