<template>
  <div>
    <!-- Greeting Section -->
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
          class="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
    </div>

    <!-- Recipe Grid -->
    <div
      id="Recipes"
      class="w-fit mx-auto grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-5 mb-5"
    >
      <RecipeCard
        v-for="recipe in filteredRecipes"
        :key="recipe.id"
        :recipe="recipe"
        @plan="openDrawer"
      />
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
    <!-- Bottom Drawer -->
    <div
      v-if="isDrawerOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
      @click.self="closeDrawer"
    >
      <div
        class="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg p-6 transition-transform"
        style="min-height: 30vh"
      >
        <!-- Drawer Content -->
        <div class="text-center">
          <h3 class="text-xl font-bold mb-4 text-gray-700">
            Plan "{{ selectedRecipe?.title }}"
          </h3>
          <div class="flex flex-col md:flex-row gap-6">
            <!-- Slot Selection -->
            <div class="flex flex-col gap-4 md:w-1/3">
              <button
                @click="selectedSlot = 'lunch'"
                :class="[
                  'w-full px-4 py-2 rounded-lg text-center text-lg font-medium',
                  selectedSlot === 'lunch'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700',
                ]"
              >
                Lunch
              </button>
              <button
                @click="selectedSlot = 'dinner'"
                :class="[
                  'w-full px-4 py-2 rounded-lg text-center text-lg font-medium',
                  selectedSlot === 'dinner'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700',
                ]"
              >
                Dinner
              </button>
            </div>

            <!-- Calendar -->
            <div class="flex-grow">
              <v-calendar
                is-expanded
                :attributes="calendarAttributes"
                @dayclick="selectDay"
                :color="selectedColor"
                class="bg-white rounded-lg shadow-lg hover:shadow-xl transition"
              ></v-calendar>
            </div>
          </div>
          <!-- Close Button -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useFirebaseAuth } from "vuefire";
import {
  addDoc,
  collection,
  getDocs,
  setDoc,
  doc,
  getFirestore,
} from "firebase/firestore";

const db = getFirestore();
const auth = useFirebaseAuth();
const selectedColor = ref("green");
// Recipe state
const recipes = ref([]);
const mealPlan = ref({});
const selectedDay = ref<{ date: string } | null>(null);
const calendarAttributes = ref([]);
const searchQuery = ref("");
const filteredRecipes = computed(() => {
  if (!searchQuery.value.trim()) {
    return recipes.value;
  }
  return recipes.value.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Format date to Firestore format
const formatToFirestoreDate = (date: string | Date): string => {
  const localDate = typeof date === "string" ? new Date(date) : date;

  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, "0"); // Add leading zero
  const day = String(localDate.getDate()).padStart(2, "0"); // Add leading zero

  return `${year}-${month}-${day}`; // Return local date as YYYY-MM-DD
};

// Modal state for adding recipes
const isModalOpen = ref(false);

// Drawer state for planning recipes
const isDrawerOpen = ref(false);
const selectedRecipe = ref(null);
const selectedSlot = ref<"lunch" | "dinner" | null>(null);
const calendarDate = ref<{ date: string } | null>(null); // Initialize to current date

// Get user's display name
const userDisplayName = computed(() => auth.currentUser?.displayName || "User");

// Fetch recipes for the logged-in user
const fetchUserRecipes = async () => {
  const user = auth?.currentUser;
  if (!user) return;

  try {
    const userRecipesCollection = collection(db, `users/${user.uid}/recipes`);
    const userRecipesSnapshot = await getDocs(userRecipesCollection);

    recipes.value = userRecipesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching user recipes:", error);
  }
};

// Fetch user's meal plan to highlight planned days in the calendar
const fetchMealPlans = async () => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const mealPlansCollection = collection(db, `users/${user.uid}/mealPlans`);
    const mealPlanDocs = await getDocs(mealPlansCollection);

    const plannedDates = mealPlanDocs.docs
      .filter((doc) => doc.data().lunch || doc.data().dinner)
      .map((doc) => doc.id);

    calendarAttributes.value = plannedDates.map((date) => ({
      key: date,
      highlight: true,
      dates: new Date(date),
      class: "bg-green-200 text-green-800 rounded-full",
    }));
    console.log("Calendar Attributes:", calendarAttributes.value);
  } catch (error) {
    console.error("Error fetching meal plans:", error);
  }
};

// Save a recipe
const onSaveRecipe = async (recipeData) => {
  const user = auth.currentUser;
  if (!user) {
    alert("You must be logged in to save recipes.");
    return;
  }

  try {
    const userRecipesCollection = collection(db, `users/${user.uid}/recipes`);
    await addDoc(userRecipesCollection, recipeData);

    alert("Recipe saved successfully!");
    fetchUserRecipes(); // Refresh recipes
    isModalOpen.value = false; // Close modal
  } catch (error) {
    console.error("Error saving recipe:", error);
    alert("Failed to save recipe.");
  }
};

// Open the drawer for planning
const openDrawer = (recipe) => {
  selectedRecipe.value = recipe;
  isDrawerOpen.value = true;
  calendarDate.value = new Date(); // Reset calendar to today
};

// Close the drawer
const closeDrawer = () => {
  isDrawerOpen.value = false;
  selectedRecipe.value = null;
  selectedSlot.value = null;
};

// Select a day from the calendar
const selectDay = (day) => {
  saveRecipeToMealPlan(day.date);
};

const saveRecipeToMealPlan = async (selectedDate) => {
  const user = auth.currentUser;
  if (!user || !selectedSlot.value || !selectedRecipe.value) {
    console.error("No user, meal slot, or recipe selected.");
    return;
  }

  try {
    const formattedDate = formatToFirestoreDate(selectedDate); // Use the helper function
    const mealPlanDoc = doc(db, `users/${user.uid}/mealPlans`, formattedDate);

    await setDoc(
      mealPlanDoc,
      {
        [selectedSlot.value]: {
          ...selectedRecipe.value,
        },
      },
      { merge: true }
    );

    await fetchMealPlans(); // Refresh highlights
    //closeDrawer();
  } catch (error) {
    console.error("Error saving meal plan:", error);
  }
};
// Open modal for adding recipes
const openModal = () => {
  isModalOpen.value = true;
};
// Fetch data on mount
onMounted(async () => {
  calendarDate.value = new Date(); // Start with today's date
  await fetchUserRecipes();
  await fetchMealPlans(); // Ensure planned meals are highlighted
});
</script>