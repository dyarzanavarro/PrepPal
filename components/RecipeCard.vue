<script setup lang="ts">
import { ref } from "vue";
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";
import { useFirebaseAuth } from "vuefire";

const props = defineProps<{
  recipe: {
    id: string;
    title: string;
    link: string;
    category: string;
    duration: number;
    rating: number;
    image: string;
  };
}>();

// Firebase setup
const db = getFirestore();
const auth = useFirebaseAuth();

// Modal state
const isModalOpen = ref(false);
const selectedSlot = ref<"lunch" | "dinner" | null>(null);

// Open the modal
const openModal = () => {
  selectedSlot.value = null; // Reset selection
  isModalOpen.value = true;
};

// Close the modal
const closeModal = () => {
  selectedSlot.value = null;
  isModalOpen.value = false;
};

// Save the recipe to a specific date and slot
const saveRecipeToMealPlan = async (selectedDate: string) => {
  const currentUser = auth.currentUser;
  if (!currentUser || !selectedSlot.value) {
    console.error("No user or meal slot selected.");
    return;
  }

  try {
    const formattedDate = selectedDate.split("T")[0]; // Get date in YYYY-MM-DD format
    const mealPlanDoc = doc(
      db,
      `users/${currentUser.uid}/mealPlans`,
      formattedDate
    );

    await setDoc(
      mealPlanDoc,
      {
        [selectedSlot.value]: {
          id: props.recipe.id,
          title: props.recipe.title,
          image: props.recipe.image,
          category: props.recipe.category,
          duration: props.recipe.duration,
          link: props.recipe.link,
          rating: props.recipe.rating,
        },
      },
      { merge: true } // Merge with existing data to allow multiple slots
    );

    console.log(
      `Recipe "${props.recipe.title}" saved for ${selectedSlot.value} on ${formattedDate}.`
    );
    closeModal();
  } catch (error) {
    console.error("Error saving meal plan:", error);
  }
};
</script>

<template>
  <div
    class="w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl"
  >
    <nuxt-link
      :to="`/recipe/${recipe.title.replace(/\s+/g, '-').toLowerCase()}`"
    >
      <img
        :src="recipe.image"
        alt="Recipe Image"
        class="h-80 w-72 object-cover rounded-t-xl"
      />
      <div class="px-4 py-3 w-72">
        <span class="text-gray-400 mr-3 uppercase text-xs">{{
          recipe.category
        }}</span>
        <p class="text-lg font-bold text-black truncate block capitalize">
          {{ recipe.title }}
        </p>
        <div class="flex items-center">
          <p class="text-lg font-semibold text-black cursor-auto my-3">
            {{ recipe.duration }} minutes
          </p>
          <div class="ml-auto">{{ recipe.rating }}⭐</div>
        </div>
      </div>
    </nuxt-link>

    <!-- CTAs -->
    <div class="flex justify-center px-4 py-3">
      <!-- Secondary CTA -->
      <button
        @click="openModal"
        class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
      >
        Plan
      </button>
    </div>

    <!-- Planning Modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div
        class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full h-[70vh] relative flex flex-col justify-between"
      >
        <h3 class="text-xl font-bold mb-4 text-gray-700 text-center">
          Plan "{{ recipe.title }}"
        </h3>

        <!-- Meal Slot Selection -->
        <div class="flex justify-around mb-6">
          <button
            @click="selectedSlot = 'lunch'"
            :class="[
              'px-4 py-2 rounded-md',
              selectedSlot === 'lunch'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700',
            ]"
          >
            Lunch
          </button>
          <button
            @click="selectedSlot = 'dinner'"
            :class="[
              'px-4 py-2 rounded-md',
              selectedSlot === 'dinner'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700',
            ]"
          >
            Dinner
          </button>
        </div>

        <!-- VCalendar -->
        <v-calendar
          is-expanded
          @dayclick="saveRecipeToMealPlan"
          class="bg-white rounded-lg shadow-lg hover:shadow-xl transition flex-grow"
        ></v-calendar>

        <!-- Close Button -->
        <button
          @click="closeModal"
          class="text-black hover:underline text-sm mt-4 self-center"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>
