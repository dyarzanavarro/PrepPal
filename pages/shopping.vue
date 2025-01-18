<template>
  <div class="p-10 mx-auto text-center flex flex-col max-w-lg">
    <h1 class="text-3xl font-bold mb-6">Shopping List</h1>

    <!-- Add New Shopping Item -->
    <div class="flex mb-4">
      <input
        v-model="newShoppingItem"
        @keyup.enter="addShoppingItem"
        placeholder="New Shopping List item"
        class="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <button
        @click="addShoppingItem"
        class="p-2 bg-green-600 text-white rounded-r-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Add
      </button>
    </div>

    <div class="pb-10">
      <!-- Uncategorized Items -->
      <div
        class="p-4 bg-gray-100 rounded-lg shadow"
        @dragenter="onDragEnter(null)"
        @dragleave="onDragLeave(null)"
        @dragover.prevent
        @drop="onDrop(null)"
        :class="highlightedCategory === null ? 'bg-green-200' : ''"
      >
        <h2 class="text-xl font-bold mb-2">Uncategorized</h2>
        <div class="min-h-[4rem] bg-gray-200 rounded-lg p-4 space-y-2">
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
        @dragenter="onDragEnter(category)"
        @dragleave="onDragLeave(category)"
        @dragover.prevent
        @drop="onDrop(category)"
        :class="highlightedCategory === category ? 'bg-green-200' : ''"
      >
        <h2 class="text-xl font-bold mb-2">{{ category }}</h2>

        <!-- Droppable Area for the Category -->
        <div class="min-h-[4rem] bg-gray-200 rounded-lg p-4 space-y-2">
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
  query,
  where,
} from "firebase/firestore";
import { useFirebaseAuth } from "vuefire";

const firestore = useFirestore();
const auth = useFirebaseAuth();

// Ensure authenticated user
const userId = computed(() => auth.currentUser?.uid);
if (!userId.value) {
  console.error("User not logged in");
}

// User-specific shopping list collection
const shoppingListCollection = computed(() =>
  collection(firestore, `users/${userId.value}/shoppingList`)
);

// Fetch the user's shopping list
const shoppingList = useCollection(
  query(shoppingListCollection.value, where("userId", "==", userId.value))
);

// Reactive variables for managing state
const newShoppingItem = ref("");
const draggedItem = ref(null);
const highlightedCategory = ref(null);

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
    await addDoc(shoppingListCollection.value, {
      title: newShoppingItem.value.trim(),
      completed: false,
      category: null, // Start as uncategorized
      userId: userId.value, // Associate with the logged-in user
    });
    newShoppingItem.value = "";
  }
};

// Delete a shopping list item
const deleteShoppingItem = async (id) => {
  await deleteDoc(doc(shoppingListCollection.value, id));
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

const onDragEnter = (category) => {
  highlightedCategory.value = category;
};

const onDragLeave = (category) => {
  if (highlightedCategory.value === category) {
    highlightedCategory.value = null;
  }
};

const onDrop = async (category) => {
  if (!draggedItem.value) return;

  // Update the category in Firestore
  await updateDoc(doc(shoppingListCollection.value, draggedItem.value.id), {
    category,
  });

  draggedItem.value = null;
  highlightedCategory.value = null; // Clear highlight after dropping
};
</script>
