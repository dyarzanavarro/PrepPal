<template>
  <div>
    <div class="p-2 text-center">
      <h2 class="text-xl font-light text-slate-400 px-9 pt-4">Hey, Daniel</h2>
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
          class="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
    <div
      class="pt-4 mx-auto text-center flex justify-center max-w-lg flex-col mx-auto"
    >
      <ul class="space-y-2">
        <li
          v-for="recipe in filteredRecipes"
          :key="recipe.id"
          class="flex justify-between items-center p-2 border border-gray-300 rounded-md"
        >
          <span>{{ recipe.title }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useCollection } from "vuefire";
import { collection, getFirestore } from "firebase/firestore";

const db = getFirestore();
const recipesCollection = collection(db, "recipes");
const { data: recipes } = useCollection(recipesCollection);

const searchQuery = ref("");
const filteredRecipes = computed(() => {
  if (!searchQuery.value.trim()) {
    return recipes.value;
  }
  const query = searchQuery.value.trim().toLowerCase();
  return recipes.value.filter((recipe) =>
    recipe.title.toLowerCase().includes(query)
  );
});

const searchRecipes = () => {
  // This function is called on input change, but the actual filtering is done in the computed property
};
</script>

<style scoped>
</style>