<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold mb-6">Meal Planner</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Daily Meal Plan -->
      <div>
        <h2 class="text-2xl font-bold mb-4 text-gray-700">
          Plan for {{ selectedDay?.date || "Select a Day" }}
        </h2>
        <div class="flex flex-col gap-6">
          <!-- Lunch Slot -->
          <div
            class="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition"
          >
            <h3 class="text-lg font-semibold text-gray-600 mb-2">Lunch</h3>
            <div
              v-if="mealPlan[selectedDay?.date]?.lunch"
              class="flex items-center gap-4"
            >
              <img
                :src="mealPlan[selectedDay.date].lunch.image"
                alt="Recipe Image"
                class="w-16 h-16 rounded-lg object-cover border border-gray-200"
              />
              <div>
                <p class="font-semibold text-gray-700">
                  {{ mealPlan[selectedDay.date].lunch.title }}
                </p>

                <div class="flex items-center gap-4">
                  <nuxt-link
                    :to="`/recipe/${mealPlan[selectedDay.date].lunch.title
                      .replace(/\s+/g, '-')
                      .toLowerCase()}`"
                    class="text-gray-400 text-sm hover:underline"
                  >
                    Go to Recipe
                  </nuxt-link>

                  <button
                    @click="removeMeal('lunch')"
                    class="text-red-500 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
            <div v-else>
              <button
                @click="showModal('lunch')"
                class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
              >
                Add Recipe
              </button>
            </div>
          </div>

          <!-- Dinner Slot -->
          <div
            class="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition"
          >
            <h3 class="text-lg font-semibold text-gray-600 mb-2">Dinner</h3>
            <div
              v-if="mealPlan[selectedDay?.date]?.dinner"
              class="flex items-center gap-4"
            >
              <img
                :src="mealPlan[selectedDay.date].dinner.image"
                alt="Recipe Image"
                class="w-16 h-16 rounded-lg object-cover border border-gray-200"
              />
              <div>
                <p class="font-semibold text-gray-700">
                  {{ mealPlan[selectedDay.date].dinner.title }}
                </p>
                <div class="flex items-center gap-4">
                  <nuxt-link
                    :to="`/recipe/${mealPlan[selectedDay.date].dinner.title
                      .replace(/\s+/g, '-')
                      .toLowerCase()}`"
                    class="text-gray-400 text-sm hover:underline"
                  >
                    Go to Recipe
                  </nuxt-link>

                  <button
                    @click="removeMeal('dinner')"
                    class="text-red-500 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
            <div v-else>
              <button
                @click="showModal('dinner')"
                class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
              >
                Add Recipe
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Calendar Component -->
      <div>
        <h2 class="text-2xl font-bold mb-4 text-gray-700">Calendar</h2>
        <v-calendar
          is-expanded
          :attributes="calendarAttributes"
          @dayclick="selectDay"
          class="bg-white rounded-lg shadow-lg hover:shadow-xl transition"
        ></v-calendar>
      </div>
    </div>

    <!-- Recipe Selection Modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div
        class="bg-white p-6 rounded-lg shadow-lg max-w-md overflow-y-auto w-full h-[80vh]"
      >
        <h3 class="text-xl font-bold mb-4 text-gray-700">Select a Recipe</h3>

        <!-- Search Input -->
        <input
          v-model="searchTerm"
          placeholder="Search for a recipe"
          class="w-full p-2 border border-gray-300 rounded mb-4"
        />

        <!-- Recipe List -->
        <ul v-if="filteredRecipes.length > 0" class="space-y-4">
          <li
            v-for="recipe in filteredRecipes"
            :key="recipe.id"
            @click="selectRecipe(recipe)"
            class="flex items-center gap-4 p-4 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
          >
            <img
              :src="recipe.image"
              alt="Recipe Image"
              class="w-12 h-12 rounded object-cover border border-gray-200"
            />
            <span class="font-medium text-gray-700">{{ recipe.title }}</span>
          </li>
        </ul>

        <p v-else class="text-gray-500">No recipes match your search.</p>
        <button
          @click="closeModal"
          class="mt-6 text-black hover:underline text-sm"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import {
  getDocs,
  collection,
  getFirestore,
  doc,
  setDoc,
  getDoc,
  deleteField,
} from "firebase/firestore";

const db = getFirestore();
const recipes = ref<any[]>([]); // Store all recipes
const mealPlan = ref<Record<string, { lunch?: any; dinner?: any }>>({});
const selectedDay = ref<{ date: string } | null>(null);
const calendarAttributes = ref([]);
const isModalOpen = ref(false);
const selectedSlot = ref<"lunch" | "dinner" | null>(null);

// Utility function to ensure proper date formatting
const formatToFirestoreDate = (date: string | Date): string => {
  let parsedDate;

  if (typeof date === "string") {
    // Handle DD-MM-YYYY or YYYY-MM-DD formats
    if (/\d{2}-\d{2}-\d{4}/.test(date)) {
      const [day, month, year] = date.split("-");
      parsedDate = new Date(`${year}-${month}-${day}`);
    } else {
      parsedDate = new Date(date);
    }
  } else if (date instanceof Date) {
    parsedDate = date;
  } else {
    throw new RangeError(
      "Invalid date format: Date must be a string or Date object."
    );
  }

  if (isNaN(parsedDate.getTime())) {
    throw new RangeError(`Invalid date: Unable to parse ${date}`);
  }

  return parsedDate.toISOString().split("T")[0]; // Convert to YYYY-MM-DD
};

// Fetch all recipes from Firestore
const fetchRecipes = async () => {
  try {
    const recipesCollection = collection(db, "recipes");
    const recipeDocs = await getDocs(recipesCollection);

    recipes.value = recipeDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Fetched recipes:", recipes.value);
  } catch (error) {
    console.error("Error fetching recipes:", error);
  }
};

// Fetch the meal plan for a specific date
const fetchMealPlanByDate = async (date: string | Date) => {
  const formattedDate = formatToFirestoreDate(date); // Format date consistently
  const mealPlanDoc = doc(db, "mealPlans", formattedDate);

  try {
    const docSnapshot = await getDoc(mealPlanDoc);
    mealPlan.value[formattedDate] = docSnapshot.exists()
      ? docSnapshot.data()
      : {};
  } catch (error) {
    console.error("Error fetching meal plan by date:", error);
  }
};

// Save a recipe to the meal plan for a specific slot and date
const saveMealPlan = async (
  date: string | Date,
  slot: "lunch" | "dinner",
  recipe: any
) => {
  const formattedDate = formatToFirestoreDate(date); // Format date correctly
  const mealPlanDoc = doc(db, "mealPlans", formattedDate);

  try {
    // Save to Firestore
    await setDoc(mealPlanDoc, { [slot]: recipe }, { merge: true });

    // Ensure reactivity in the local meal plan
    if (!mealPlan.value[formattedDate]) {
      mealPlan.value[formattedDate] = {};
    }
    // Use Vue's `Object.assign` or spread to trigger reactivity
    mealPlan.value[formattedDate] = {
      ...mealPlan.value[formattedDate],
      [slot]: recipe,
    };
  } catch (error) {
    console.error("Error saving meal plan:", error);
  }
};

// Remove a recipe from a specific slot
const removeMeal = async (slot: "lunch" | "dinner") => {
  if (!selectedDay.value) return;

  const formattedDate = formatToFirestoreDate(selectedDay.value.date);
  const mealPlanDoc = doc(db, "mealPlans", formattedDate);

  try {
    await setDoc(mealPlanDoc, { [slot]: deleteField() }, { merge: true });

    // Update the local meal plan
    delete mealPlan.value[formattedDate][slot];

    if (Object.keys(mealPlan.value[formattedDate]).length === 0) {
      delete mealPlan.value[formattedDate];
    }

    updateCalendarAttributes();
  } catch (error) {
    console.error("Error removing meal:", error);
  }
};

// Select a day from the calendar
const selectDay = async ({ date }: { date: string | Date }) => {
  // Ensure the date is treated as local time
  const localDate = typeof date === "string" ? new Date(date) : date;

  // Format the local date as YYYY-MM-DD
  const formattedDate = [
    localDate.getFullYear(),
    String(localDate.getMonth() + 1).padStart(2, "0"),
    String(localDate.getDate()).padStart(2, "0"),
  ].join("-"); // Ensures YYYY-MM-DD format without timezone shifts

  if (isNaN(localDate.getTime())) {
    console.error("Invalid date selected:", date);
    selectedDay.value = null;
    return;
  }

  selectedDay.value = { date: formattedDate };
  console.log("Selected day (formatted):", selectedDay.value);

  await fetchMealPlanByDate(selectedDay.value.date);
};

// Highlight planned dates in the calendar
const updateCalendarAttributes = async () => {
  const mealPlansCollection = collection(db, "mealPlans");

  try {
    const mealPlanDocs = await getDocs(mealPlansCollection);

    // Highlight only days with planned meals
    const plannedDates = mealPlanDocs.docs
      .filter((doc) => doc.data().lunch || doc.data().dinner)
      .map((doc) => doc.id);

    // Update calendar attributes for planned dates
    calendarAttributes.value = plannedDates.map((date) => ({
      key: date,
      highlight: true,
      dates: new Date(date + "T00:00:00"), // Ensure local time without timezone shifts
      class: "bg-green-200 text-green-800 rounded-full",
    }));

    console.log("Updated calendar attributes:", calendarAttributes.value);
  } catch (error) {
    console.error("Error updating calendar attributes:", error);
  }
};
// Open the modal to select a recipe
const showModal = (slot: "lunch" | "dinner") => {
  selectedSlot.value = slot;
  isModalOpen.value = true;
};

// Close the modal
const closeModal = () => {
  selectedSlot.value = null;
  isModalOpen.value = false;
};

// Select a recipe from the modal
const selectRecipe = async (recipe) => {
  if (!selectedDay.value || !selectedSlot.value) return;

  const date = selectedDay.value.date;
  await saveMealPlan(date, selectedSlot.value, recipe);

  closeModal();
};

// Search term bound to the input field
const searchTerm = ref("");

// Ensure `recipes` is reactive and contains your recipe data
// Computed property to dynamically filter recipes based on the search term
const filteredRecipes = computed(() => {
  if (!searchTerm.value) return recipes.value;

  // Filter recipes by search term
  return recipes.value.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});
// Initialize data on mount
onMounted(async () => {
  const today = new Date();

  // Format today's date as YYYY-MM-DD in local Swiss time
  const swissToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  console.log("Setting selectedDay to:", swissToday);
  selectedDay.value = { date: swissToday };

  await fetchRecipes();
  await fetchMealPlanByDate(selectedDay.value.date);
  await updateCalendarAttributes();
});
</script>

<style scoped>
.v-calendar .bg-blue-200 {
  background-color: #bfdbfe !important;
  border-radius: 50%;
}
.v-calendar .text-blue-700 {
  color: green !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>