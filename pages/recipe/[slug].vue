<template>
  <div v-if="recipe" class="p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      <!-- Left Column: Image -->
      <div class="relative">
        <img
          :src="recipe.image || 'https://via.placeholder.com/400x300'"
          :alt="recipe.title"
          class="rounded-lg shadow-md w-full object-cover"
        />
        <div v-if="isEditMode" class="mt-2">
          <label class="block text-gray-600">Image URL:</label>
          <input
            v-model="recipe.image"
            type="text"
            class="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter image URL"
          />
        </div>
      </div>

      <!-- Right Column: Recipe Details -->
      <div>
        <div class="mb-4">
          <span
            class="text-sm font-semibold uppercase tracking-wide text-green-500"
          >
            {{ recipe.category }}
          </span>
          <h1 class="text-3xl font-bold text-gray-900 mt-2">
            <span v-if="!isEditMode">{{ recipe.title }}</span>
            <input
              v-else
              v-model="recipe.title"
              class="border border-gray-300 p-2 rounded w-full"
            />
          </h1>

          <div class="text-gray-600 mt-1">
            <span v-if="!isEditMode">
              {{ recipe.duration }} minutes | {{ recipe.rating }} ⭐</span
            >
            <div v-else class="flex gap-2">
              <input
                v-model="recipe.duration"
                type="number"
                class="border border-gray-300 p-2 rounded w-24"
                placeholder="Duration"
              />
              <input
                v-model="recipe.rating"
                type="number"
                min="1"
                max="5"
                class="border border-gray-300 p-2 rounded w-16"
                placeholder="Rating"
              />
            </div>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex gap-2 mb-4">
          <button
            v-if="!isEditMode"
            @click="isEditMode = true"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Edit
          </button>
          <button
            v-else
            @click="saveChanges"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save
          </button>
          <button
            v-if="isEditMode"
            @click="isEditMode = false"
            class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            @click="deleteRecipe"
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>

        <!-- Recipe Link -->
        <div v-if="recipe.link" class="mt-4">
          <a
            :href="recipe.link"
            target="_blank"
            class="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
          >
            View Original Recipe
          </a>
        </div>

        <!-- Description -->
        <div class="mt-8">
          <h2 class="text-xl font-semibold mb-4 text-gray-800">Description</h2>
          <p v-if="!isEditMode" class="text-gray-600">
            {{ recipe.description || "No description provided." }}
          </p>
          <textarea
            v-else
            v-model="recipe.description"
            class="w-full border border-gray-300 p-2 rounded mt-2"
            rows="3"
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Ingredients -->
    <div class="mt-8">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">Ingredients</h2>
      <p v-if="!isEditMode" class="text-gray-600 whitespace-pre-line">
        {{ recipe.ingredients || "No ingredients provided." }}
      </p>
      <textarea
        v-else
        v-model="recipe.ingredients"
        class="w-full border border-gray-300 p-2 rounded mt-2"
        rows="5"
        placeholder="Add ingredients (each on a new line)"
      ></textarea>
    </div>

    <!-- Method -->
    <div class="mt-8">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">Method</h2>
      <p v-if="!isEditMode" class="text-gray-600 whitespace-pre-line">
        {{ recipe.method || "No method steps provided." }}
      </p>
      <textarea
        v-else
        v-model="recipe.method"
        class="w-full border border-gray-300 p-2 rounded mt-2"
        rows="5"
        placeholder="Add method steps (each on a new line)"
      ></textarea>
    </div>
  </div>

  <!-- Loading State -->
  <div v-else>
    <p class="text-center text-gray-500">Loading...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const route = useRoute();
const slug = route.params.slug;
const router = useRouter();
const db = getFirestore();
const auth = getAuth();

const recipe = ref(null);
const isEditMode = ref(false);
const userId = ref(null);

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
    router.push("/recipes");
  }
});

const saveChanges = async () => {
  if (recipe.value) {
    const updatedRecipe = {
      title: recipe.value.title || "",
      image: recipe.value.image || "https://via.placeholder.com/400x300",
      description: recipe.value.description || "",
      ingredients: recipe.value.ingredients || "",
      method: recipe.value.method || "",
      link: recipe.value.link || "",
      category: recipe.value.category || "",
      duration: recipe.value.duration || 0,
      rating: recipe.value.rating || 0,
    };

    const recipeDoc = doc(db, `users/${userId.value}/recipes`, recipe.value.id);
    await updateDoc(recipeDoc, updatedRecipe);
    isEditMode.value = false;
  }
};

const deleteRecipe = async () => {
  if (confirm("Are you sure you want to delete this recipe?")) {
    const recipeDoc = doc(db, `users/${userId.value}/recipes`, recipe.value.id);
    await deleteDoc(recipeDoc);
    router.push("/recipes");
  }
};
</script>