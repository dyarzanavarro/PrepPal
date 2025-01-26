<template>
  <div v-if="recipe" class="p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      <!-- Left Column: Image -->
      <div>
        <img
          :src="recipe.image || 'https://via.placeholder.com/400x300'"
          :alt="recipe.title"
          class="rounded-lg shadow-md w-full object-cover"
        />
      </div>

      <!-- Right Column: Recipe Details -->
      <div>
        <div class="mb-4">
          <span
            class="text-sm font-semibold uppercase tracking-wide text-green-500"
            >{{ recipe.category }}</span
          >
          <h1 class="text-3xl font-bold text-gray-900 mt-2">
            {{ recipe.title }}
          </h1>
          <p class="text-gray-600 mt-1">
            {{ recipe.duration }} minutes | {{ recipe.rating }} ⭐
          </p>
        </div>

        <!-- Buttons -->
        <div class="flex gap-2 mb-4">
          <button
            v-if="!isEditMode"
            @click="isEditMode = true"
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-200"
          >
            Edit
          </button>
          <button
            v-else
            @click="saveChanges"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
            class="inline-block bg-green-500 hover:bg-green-200 text-white font-semibold py-2 px-4 rounded"
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

    <!-- Ingredients and Method -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      <!-- Ingredients -->
      <div>
        <h2 class="text-xl font-semibold mb-4 text-gray-800">Ingredients</h2>
        <ul class="space-y-2">
          <li
            v-for="(ingredient, index) in recipe.ingredients || []"
            :key="index"
            class="flex justify-between"
          >
            <span>{{ ingredient }}</span>
            <button
              v-if="isEditMode"
              @click="removeIngredient(index)"
              class="text-red-500 hover:underline"
            >
              Remove
            </button>
          </li>
        </ul>
        <div v-if="isEditMode" class="mt-4">
          <button
            @click="addIngredient"
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-200"
          >
            Add Ingredient
          </button>
        </div>
      </div>

      <!-- Method -->
      <div>
        <h2 class="text-xl font-semibold mb-4 text-gray-800">Method</h2>
        <ol class="list-decimal space-y-2 pl-6">
          <li
            v-for="(step, index) in recipe.method || []"
            :key="index"
            class="flex justify-between"
          >
            <span>{{ step }}</span>
            <button
              v-if="isEditMode"
              @click="removeMethodStep(index)"
              class="text-red-500 hover:underline"
            >
              Remove
            </button>
          </li>
        </ol>
        <div v-if="isEditMode" class="mt-4">
          <button
            @click="addMethodStep"
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-200"
          >
            Add Step
          </button>
        </div>
      </div>
    </div>
  </div>
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
      image: recipe.value.image || "",
      description: recipe.value.description || "",
      ingredients: recipe.value.ingredients || [],
      method: recipe.value.method || [],
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

const addIngredient = () => {
  if (!recipe.value.ingredients) recipe.value.ingredients = [];
  recipe.value.ingredients.push("");
};

const removeIngredient = (index) => {
  recipe.value.ingredients.splice(index, 1);
};

const addMethodStep = () => {
  if (!recipe.value.method) recipe.value.method = [];
  recipe.value.method.push("");
};

const removeMethodStep = (index) => {
  recipe.value.method.splice(index, 1);
};

const deleteRecipe = async () => {
  if (confirm("Are you sure you want to delete this recipe?")) {
    const recipeDoc = doc(db, `users/${userId.value}/recipes`, recipe.value.id);
    await deleteDoc(recipeDoc);
    router.push("/recipes");
  }
};
</script>
