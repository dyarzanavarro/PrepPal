<template>
  <div class="p-10 mx-auto text-center flex flex-col max-w-lg">
    <h1 class="text-3xl font-bold mb-6">Shopping List</h1>

    <!-- Add New Shopping Item -->
    <div class="flex mb-4">
      <input
        v-model="newShoppingItem"
        @keyup.enter="addShoppingItem"
        placeholder="New Shopping List item"
        class="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        @click="addShoppingItem"
        class="p-2 bg-green-600 text-white rounded-r-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Add
      </button>
    </div>

    <div class="pb-6">
      <!-- Uncategorized Items -->
      <div class="p-4 bg-gray-100 rounded-lg shadow">
        <h2 class="text-xl font-bold mb-2">Uncategorized</h2>
        <div
          class="min-h-[4rem] bg-gray-200 rounded-lg p-4 space-y-2"
          @dragover.prevent
          @drop="onDrop(null)"
        >
          <div
            v-for="item in shoppingListByCategory['Uncategorized']"
            :key="item.id"
            draggable="true"
            @dragstart="onDragStart(item)"
            class="p-2 bg-white border border-gray-300 rounded-md flex justify-between items-center"
          >
            <span>{{ item.title }}</span>
            <button
              @click="deleteShoppingItem(item.id)"
              class="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Shopping Categories -->
    <div class="space-y-6">
      <div
        v-for="category in categories"
        :key="category"
        class="p-4 bg-gray-100 rounded-lg shadow"
      >
        <h2 class="text-xl font-bold mb-2">{{ category }}</h2>

        <!-- Droppable Area for the Category -->
        <div
          class="min-h-[4rem] bg-gray-200 rounded-lg p-4 space-y-2"
          @dragover.prevent
          @drop="onDrop(category)"
        >
          <div
            v-for="item in shoppingListByCategory[category]"
            :key="item.id"
            draggable="true"
            @dragstart="onDragStart(item)"
            class="p-2 bg-white border border-gray-300 rounded-md flex justify-between items-center"
          >
            <span>{{ item.title }}</span>
            <button
              @click="deleteShoppingItem(item.id)"
              class="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useFirestore, useCollection } from "vuefire";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

const firestore = useFirestore();
const shoppingList = useCollection(collection(firestore, "shoppingList"));

const newShoppingItem = ref("");
const draggedItem = ref(null);

// Hardcoded categories
const categories = [
  "Dairy",
  "Meat & Seafood",
  "Vegetables & Fruits",
  "Canned & Packaged Food",
  "Bakery",
  "Frozen Food",
  "Snacks",
  "Beverages",
  "Household Supplies",
  "Others",
];

// Add a new shopping list item
const addShoppingItem = async () => {
  if (newShoppingItem.value.trim()) {
    await addDoc(collection(firestore, "shoppingList"), {
      title: newShoppingItem.value.trim(),
      completed: false,
      category: null, // Start as uncategorized
    });
    newShoppingItem.value = "";
  }
};

// Delete a shopping list item
const deleteShoppingItem = async (id) => {
  await deleteDoc(doc(firestore, "shoppingList", id));
};

// Group shopping list items by category
const shoppingListByCategory = computed(() => {
  const grouped = {};

  // Initialize categories
  categories.forEach((category) => {
    grouped[category] = [];
  });
  grouped["Uncategorized"] = [];

  // Categorize items
  shoppingList.value.forEach((item) => {
    const category = item.category || "Uncategorized";
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(item);
  });

  return grouped;
});

// Drag and Drop Handlers
const onDragStart = (item) => {
  draggedItem.value = item;
};

const onDrop = async (category) => {
  if (!draggedItem.value) return;

  // Update the category in Firestore
  await updateDoc(doc(firestore, "shoppingList", draggedItem.value.id), {
    category,
  });

  draggedItem.value = null;
};
</script>



<style scoped>
/* Import required styles for vue-draggable-resizable */
/* @import "vue-draggable-resizable/dist/VueDraggableResizable.css";

/* Optional custom styles */
</style>