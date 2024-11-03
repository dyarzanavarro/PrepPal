<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const route = useRoute();
const slug = route.params.slug; // Retrieve the slug from the route

const db = getFirestore();
const recipesCollection = collection(db, "recipes");

const recipe = ref(null);

onMounted(async () => {
  const q = query(recipesCollection, where("slug", "==", slug));

  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        recipe.value = { id: doc.id, ...doc.data() }; // Get the document data
      });
    } else {
      console.log("No such recipe found!");
    }
  } catch (error) {
    console.error("Error loading recipe:", error);
  }
});

// Bottom sheet open state
const isOpen = ref(false);

// Toggle function for the bottom sheet
const toggleSheet = () => {
  isOpen.value = !isOpen.value;
};
</script>

<style scoped>
/* Transition styling for the bottom sheet */
.translate-y-full {
  transform: translateY(100%);
}
.translate-y-20 {
  transform: translateY(40vh);
}
</style>

<template>
  <div v-if="recipe">
    <!-- Background Image Section -->
    <section class="relative h-screen w-full max-h-[20rem]">
      <div class="absolute inset-0 z-10">
        <img
          class="h-full w-full object-cover object-center"
          :src="recipe.image"
          :alt="recipe.title"
        />
      </div>

      <!-- Bottom Sheet Overlay -->
      <div class="absolute inset-0 z-20 flex items-end bg-black/30">
        <!-- Bottom Sheet Container -->
        <div
          class="w-full bg-white rounded-t-3xl shadow-lg transition-transform transform"
          :class="{ 'translate-y-full': !isOpen, 'translate-y-20': isOpen }"
          style="height: 80vh"
          @click.self="isOpen = !isOpen"
        >
          <!-- Pull Handle for Toggling -->
          <div class="pt-4 text-center">
            <span
              class="block w-12 h-1 bg-gray-300 rounded-full mx-auto my-2 cursor-pointer"
              @click="toggleSheet"
            ></span>
          </div>

          <!-- Scrollable Content Section -->
          <div class="overflow-y-auto h-[72vh] p-6 space-y-4">
            <!-- Recipe Information -->
            <div>
              <span class="font-light text-sm text-accent-500 text-gray-500">
                {{ recipe.category }}
              </span>
              <h1 class="text-3xl font-medium text-gray-900">
                {{ recipe.title }}
              </h1>
              <p class="text-sm font-light text-gray-600">
                {{ recipe.duration }} minutes
              </p>
              <p class="text-sm font-light text-gray-600">
                {{ recipe.rating }} ⭐
              </p>
              <button
                type="submit"
                class="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md py-2 px-4 w-full"
              >
                <a :href="recipe.link" target="_blank" rel="noopener noreferrer"
                  >Recipe Link</a
                >
              </button>
            </div>

            <!-- Recipe Directions -->
            <div class="text-gray-700">
              <p></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- Loading State -->
  <div v-else>
    <p>Loading...</p>
  </div>
</template>
