<template>
  <div class="p-4">
    <h1 class="text-3xl font-bold mb-6">Meal Planning</h1>

    <!-- Calendar Component -->
    <v-calendar
      is-expanded
      :attributes="calendarAttributes"
      @dayclick="selectDay"
    ></v-calendar>

    <!-- Recipe Slot Management -->
    <div v-if="selectedDay" class="mt-8">
      <h2 class="text-2xl font-semibold">Plan for {{ selectedDay.date }}</h2>

      <div class="mt-4">
        <!-- Lunch Slot -->
        <div class="mb-6">
          <h3 class="text-xl font-medium">Lunch</h3>
          <div
            v-if="mealPlan[selectedDay.date]?.lunch"
            class="flex items-center gap-2"
          >
            <p>{{ mealPlan[selectedDay.date].lunch.title }}</p>
            <button @click="removeMeal('lunch')" class="text-red-500">
              Remove
            </button>
          </div>
          <div v-else>
            <button
              @click="addMeal('lunch')"
              class="bg-green-500 text-white px-4 py-2 rounded"
            >
              Add Recipe
            </button>
          </div>
        </div>

        <!-- Dinner Slot -->
        <div>
          <h3 class="text-xl font-medium">Dinner</h3>
          <div
            v-if="mealPlan[selectedDay.date]?.dinner"
            class="flex items-center gap-2"
          >
            <p>{{ mealPlan[selectedDay.date].dinner.title }}</p>
            <button @click="removeMeal('dinner')" class="text-red-500">
              Remove
            </button>
          </div>
          <div v-else>
            <button
              @click="addMeal('dinner')"
              class="bg-green-500 text-white px-4 py-2 rounded"
            >
              Add Recipe
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getDocs, collection, getFirestore } from "firebase/firestore";

const db = getFirestore();
const recipes = ref<any[]>([]); // Store fetched recipes

// Fetch recipes from Firestore
const fetchRecipes = async () => {
  const recipesCollection = collection(db, "recipes");
  const recipeDocs = await getDocs(recipesCollection);

  recipes.value = recipeDocs.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  console.log("Fetched recipes:", recipes.value);
};

onMounted(() => {
  fetchRecipes();
});

// Calendar and meal-planning logic
const calendarAttributes = ref([]);
const selectedDay = ref<{ date: string } | null>(null);
const mealPlan = ref<Record<string, { lunch?: any; dinner?: any }>>({});

const selectDay = ({ date }: { date: string }) => {
  selectedDay.value = { date };
};

const addMeal = (slot: "lunch" | "dinner") => {
  if (!selectedDay.value) return;

  // Open a modal to select a recipe (mocked with first recipe for now)
  const selectedRecipe = recipes.value[0]; // Replace this with a modal or dropdown logic

  const dayPlan = mealPlan.value[selectedDay.value.date] || {};
  dayPlan[slot] = selectedRecipe;
  mealPlan.value[selectedDay.value.date] = dayPlan;

  updateCalendarAttributes();
};

const removeMeal = (slot: "lunch" | "dinner") => {
  if (!selectedDay.value) return;

  const dayPlan = mealPlan.value[selectedDay.value.date] || {};
  delete dayPlan[slot];

  if (Object.keys(dayPlan).length === 0) {
    delete mealPlan.value[selectedDay.value.date];
  } else {
    mealPlan.value[selectedDay.value.date] = dayPlan;
  }

  updateCalendarAttributes();
};

const updateCalendarAttributes = () => {
  calendarAttributes.value = Object.keys(mealPlan.value).map((date) => ({
    key: date,
    highlight: true,
    dates: new Date(date),
  }));
};
</script>


<style scoped>
/* Optional styles */
</style>
