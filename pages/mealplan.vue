<template>
  <div>
    <div class="p-6 bg-gray-50">
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
                      class="text-rose-300 text-sm hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
              <div v-else>
                <button
                  @click="showModal('lunch')"
                  class="green-200 px-4 py-2 rounded-md hover:bg-green-200 transition"
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
                      class="text-rose-300 text-sm hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
              <div v-else>
                <button
                  @click="showModal('dinner')"
                  class="green-200 px-4 py-2 rounded-md hover:bg-green-200 transition"
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
            :color="selectedColor"
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
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import {
  getDocs,
  collection,
  doc,
  setDoc,
  getDoc,
  deleteField,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { useFirebaseAuth } from "vuefire";

const db = getFirestore();
const auth = useFirebaseAuth();

const selectedColor = ref("green");

const recipes = ref<any[]>([]); // Store all recipes
const mealPlan = ref<Record<string, { lunch?: any; dinner?: any }>>({});
const selectedDay = ref<{ date: string } | null>(null);
const calendarAttributes = ref([]);
const isModalOpen = ref(false);
const selectedSlot = ref<"lunch" | "dinner" | null>(null);
const searchTerm = ref("");

// Ensure authenticated user
const userId = computed(() => auth.currentUser?.uid);
if (!userId.value) {
  console.error("User not logged in");
}

// Format date to Firestore format
const formatToFirestoreDate = (date: string | Date): string => {
  const localDate = typeof date === "string" ? new Date(date) : date;

  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, "0"); // Add leading zero
  const day = String(localDate.getDate()).padStart(2, "0"); // Add leading zero

  return `${year}-${month}-${day}`; // Return local date as YYYY-MM-DD
};

// Fetch user-specific recipes
const fetchRecipes = async () => {
  if (!userId.value) return;

  try {
    const userRecipesCollection = collection(
      db,
      `users/${userId.value}/recipes`
    );
    const recipeDocs = await getDocs(userRecipesCollection);

    recipes.value = recipeDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Fetched user-specific recipes:", recipes.value);
  } catch (error) {
    console.error("Error fetching recipes:", error);
  }
};

// Fetch meal plans for the selected date
const fetchMealPlanByDate = async (date: string | Date) => {
  if (!userId.value) return;

  const formattedDate = formatToFirestoreDate(date);
  const mealPlanDoc = doc(db, `users/${userId.value}/mealPlans`, formattedDate);

  try {
    const docSnapshot = await getDoc(mealPlanDoc);
    mealPlan.value[formattedDate] = docSnapshot.exists()
      ? docSnapshot.data()
      : {};
  } catch (error) {
    console.error("Error fetching meal plan:", error);
  }
};

// Save a meal to the user's meal plan
const saveMealPlan = async (
  date: string | Date,
  slot: "lunch" | "dinner",
  recipe: any
) => {
  if (!userId.value) return;

  const formattedDate = formatToFirestoreDate(date);
  const mealPlanDoc = doc(db, `users/${userId.value}/mealPlans`, formattedDate);

  try {
    await setDoc(mealPlanDoc, { [slot]: recipe }, { merge: true });

    if (!mealPlan.value[formattedDate]) {
      mealPlan.value[formattedDate] = {};
    }
    mealPlan.value[formattedDate] = {
      ...mealPlan.value[formattedDate],
      [slot]: recipe,
    };
    updateCalendarAttributes();
  } catch (error) {
    console.error("Error saving meal plan:", error);
  }
};

// Remove a meal from the user's meal plan
const removeMeal = async (slot: "lunch" | "dinner") => {
  if (!selectedDay.value || !userId.value) return;

  const formattedDate = formatToFirestoreDate(selectedDay.value.date);
  const mealPlanDoc = doc(db, `users/${userId.value}/mealPlans`, formattedDate);

  try {
    await setDoc(mealPlanDoc, { [slot]: deleteField() }, { merge: true });

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
  const formattedDate = formatToFirestoreDate(date);
  selectedDay.value = { date: formattedDate };
  await fetchMealPlanByDate(selectedDay.value.date);
};

// Update calendar attributes to highlight planned dates
const updateCalendarAttributes = async () => {
  if (!userId.value) return;

  const mealPlansCollection = collection(db, `users/${userId.value}/mealPlans`);

  try {
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
  } catch (error) {
    console.error("Error updating calendar attributes:", error);
  }
};

// Filter recipes based on the search term
const filteredRecipes = computed(() => {
  if (!searchTerm.value) return recipes.value;

  return recipes.value.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

// Show modal to select a recipe
const showModal = (slot: "lunch" | "dinner") => {
  selectedSlot.value = slot;
  isModalOpen.value = true;
};

// Close the modal
const closeModal = () => {
  selectedSlot.value = null;
  isModalOpen.value = false;
};

// Select a recipe and save it to the meal plan
const selectRecipe = async (recipe) => {
  if (!selectedDay.value || !selectedSlot.value) return;

  const date = selectedDay.value.date;
  await saveMealPlan(date, selectedSlot.value, recipe);

  closeModal();
};

// Fetch data on mounted
onMounted(async () => {
  const today = new Date();
  const formattedToday = formatToFirestoreDate(today);

  selectedDay.value = { date: formattedToday };

  await fetchRecipes();
  await fetchMealPlanByDate(selectedDay.value.date);
  await updateCalendarAttributes();
});
</script>

