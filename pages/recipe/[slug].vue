<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const route = useRoute();
const slug = route.params.slug;

const db = getFirestore();
const auth = getAuth();

const recipe = ref(null);
const isEditMode = ref(false);
const userId = ref(null); // Store the current user's ID

// Fetch the logged-in user's ID
onMounted(async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    console.error("No user is logged in.");
    return;
  }
  userId.value = currentUser.uid;

  const userRecipesCollection = collection(db, `users/${userId.value}/recipes`);
  const q = query(userRecipesCollection, where("slug", "==", slug));

  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        recipe.value = { id: doc.id, ...doc.data() };
      });
    } else {
      console.log("No such recipe found!");
    }
  } catch (error) {
    console.error("Error loading recipe:", error);
  }
});

// Save updated recipe to Firestore
const saveChanges = async () => {
  if (recipe.value) {
    try {
      const recipeDoc = doc(
        db,
        `users/${userId.value}/recipes`,
        recipe.value.id
      );

      // Ensure `ingredients` is always an array
      if (!recipe.value.ingredients) {
        recipe.value.ingredients = [];
      }

      // Update Firestore with validated recipe data
      await updateDoc(recipeDoc, {
        title: recipe.value.title,
        image: recipe.value.image,
        description: recipe.value.description,
        ingredients: recipe.value.ingredients,
        link: recipe.value.link,
      });

      isEditMode.value = false;
      console.log("Recipe updated successfully!");
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  }
};

// Add a new ingredient
const addIngredient = () => {
  if (!recipe.value.ingredients) recipe.value.ingredients = [];
  recipe.value.ingredients.push({ name: "", quantity: "" });
};

// Remove an ingredient
const removeIngredient = (index) => {
  recipe.value.ingredients.splice(index, 1);
};
</script>

<template>
  <div v-if="recipe">
    <!-- Background Image Section -->
    <section class="relative h-screen w-full max-h-[20rem]">
      <div class="absolute inset-0 z-10">
        <img
          v-if="recipe.image"
          class="h-full w-full object-cover object-center"
          :src="recipe.image"
          :alt="recipe.title"
        />
        <div
          v-else
          class="h-full w-full flex items-center justify-center bg-gray-200 text-gray-500"
        >
          No Image Available
        </div>
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
          <div class="overflow-y-auto h-[72vh] p-6 space-y-6">
            <!-- Recipe Information -->
            <div class="relative">
              <span class="font-light text-sm text-accent-500 text-gray-500">
                {{ recipe.category }}
              </span>
              <div class="flex items-center justify-between">
                <h1 class="text-3xl font-medium text-gray-900">
                  <span v-if="!isEditMode">{{ recipe.title }}</span>
                  <input
                    v-else
                    v-model="recipe.title"
                    class="border border-gray-300 p-2 rounded w-full"
                  />
                </h1>
                <button
                  v-if="!isEditMode"
                  @click="isEditMode = true"
                  class="bg-green-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-4"
                >
                  Edit
                </button>
                <div v-else class="flex items-center gap-2 ml-4">
                  <button
                    @click="saveChanges"
                    class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    @click="isEditMode = false"
                    class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              <p class="text-sm font-light text-gray-600">
                {{ recipe.duration }} minutes
              </p>
              <p class="text-sm font-light text-gray-600">
                {{ recipe.rating }} ⭐
              </p>
            </div>

            <!-- Recipe Link (CTA) -->
            <div>
              <button
                v-if="recipe.link"
                type="button"
                class="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md py-2 px-4 w-full mt-4"
              >
                <a
                  :href="recipe.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="block text-center"
                >
                  View Original Recipe
                </a>
              </button>
            </div>

            <!-- Edit Image URL -->
            <div v-if="isEditMode">
              <h2 class="text-lg font-semibold text-gray-800">Image URL</h2>
              <input
                v-model="recipe.image"
                placeholder="Enter image URL"
                class="w-full border border-gray-300 p-2 rounded mt-2"
              />
            </div>

            <!-- Description -->
            <div>
              <h2 class="text-lg font-semibold text-gray-800">Description</h2>
              <p v-if="!isEditMode" class="text-gray-600 mt-2">
                {{ recipe.description || "No description provided." }}
              </p>
              <textarea
                v-else
                v-model="recipe.description"
                class="w-full border border-gray-300 p-2 rounded mt-2"
                rows="3"
              ></textarea>
            </div>

            <!-- Ingredients -->
            <div>
              <h2 class="text-lg font-semibold text-gray-800">Ingredients</h2>
              <ul class="mt-2 space-y-2">
                <li
                  v-for="(ingredient, index) in recipe.ingredients || []"
                  :key="index"
                  class="flex items-center gap-4"
                >
                  <span v-if="!isEditMode">
                    {{ ingredient.name }} - {{ ingredient.quantity }}
                  </span>
                  <div v-else class="flex gap-2">
                    <input
                      v-model="ingredient.name"
                      placeholder="Ingredient"
                      class="border border-gray-300 p-1 rounded w-full"
                    />
                    <input
                      v-model="ingredient.quantity"
                      placeholder="Quantity"
                      class="border border-gray-300 p-1 rounded w-1/3"
                    />
                    <button
                      @click="removeIngredient(index)"
                      class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              </ul>
              <button
                v-if="isEditMode"
                @click="addIngredient"
                class="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Ingredient
              </button>
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
