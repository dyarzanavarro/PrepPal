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
          class="text-green-200 text-lg hover:underline font-semibold"
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
          <!-- Placeholder Card -->
          <div
            class="flex flex-col items-center justify-center bg-gray-100 p-6 rounded-lg shadow-md"
          >
            <p class="text-gray-500 font-semibold text-lg mb-4">
              No meals planned yet.
            </p>
            <button
              @click="navigateToMealPlan"
              class="bg-green-200 hover:bg-green-700 text-white font-semibold rounded-md py-2 px-4"
            >
              Plan Your Meals
            </button>
          </div>
        </template>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="mb-6 mt-8">
      <h2 class="text-xl font-bold mb-3">Search all recipes</h2>
      <input
        v-model="searchQuery"
        @input="filterRecipes"
        type="text"
        placeholder="Search any recipes..."
        class="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-green-400"
      />
    </div>

    <!-- Categories -->
    <div class="mb-6">
      <h2 class="text-xl font-bold mb-3">Categories</h2>
      <div class="flex gap-4 overflow-x-auto">
        <CategoryCard
          v-for="(category, index) in categories"
          :key="index"
          :category="category"
          @click="filterByCategory(category)"
        />
      </div>
    </div>

    <!-- Recommendation Section (Slider) -->
    <div class="mb-6">
      <div class="flex justify-between items-center mb-3">
        <h2 class="text-xl font-bold">Recommendation</h2>
        <button
          @click="fetchRecommendations"
          class="text-green-200 text-lg hover:underline font-semibold"
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

    <!-- Action Button -->
    <div class="fixed bottom-4 right-4">
      <button
        class="bg-blue-400 hover:bg-blue-200 text-white font-bold text-3xl p-5 rounded-full shadow-lg"
        @click="onActionClick"
      >
        +
      </button>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from "vue";
import { useFirebaseAuth } from "vuefire";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useRouter } from "vue-router";

// Firebase and Router
const db = getFirestore();
const auth = useFirebaseAuth();
const router = useRouter();

// User display name
const userDisplayName = computed(() => auth.currentUser?.displayName || "User");

// Search state
const searchQuery = ref("");

// Categories
const categories = [
  { name: "Breakfast", icon: "🍳" },
  { name: "Lunch", icon: "🍱" },
  { name: "Dinner", icon: "🍽️" },
  { name: "Dessert", icon: "🍰" },
  { name: "Snacks", icon: "🍿" },
];

// Recipe data
const allRecipes = ref([]);
const recommendedRecipes = ref([]);
const todayMeals = ref([]);

// Fetch all recipes
const fetchRecipes = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const userRecipesCollection = collection(db, `users/${user.uid}/recipes`);
  const recipeDocs = await getDocs(userRecipesCollection);

  allRecipes.value = recipeDocs.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  fetchRecommendations();
};

// Fetch today's planned meals
const fetchTodayMeals = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const mealPlansCollection = collection(db, `users/${user.uid}/mealPlans`);
  const mealPlanQuery = query(
    mealPlansCollection,
    where("__name__", "==", today)
  );
  const mealPlanDocs = await getDocs(mealPlanQuery);

  if (!mealPlanDocs.empty) {
    const mealPlan = mealPlanDocs.docs[0].data();
    todayMeals.value = [mealPlan.lunch, mealPlan.dinner].filter(Boolean);
  }
};

// Fetch recommendations
const fetchRecommendations = () => {
  // Randomly select 4 recipes
  recommendedRecipes.value = allRecipes.value
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);
};

// Search and category filtering
const filterRecipes = () => {
  // This feature can filter recipes globally, or trigger a different logic
};

const filterByCategory = (category) => {
  searchQuery.value = category.name;
};

// Navigate to meal plan page
const navigateToMealPlan = () => {
  router.push("/mealplan");
};

// Action button handler
const onActionClick = () => {
  console.log("Central Action Button Clicked!");
  // Logic for the action button can go here
};

// Initial fetch on mount
onMounted(() => {
  fetchRecipes();
  fetchTodayMeals();
});
</script>
