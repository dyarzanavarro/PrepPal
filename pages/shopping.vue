<template>
  <div class="pt-10 mx-auto text-center flex justify-center max-w-lg flex-col">
    <h1 class="text-3xl font-bold mb-6">Shopping List</h1>
    <div class="flex mb-4">
      <input
        v-model="newShoppingItem"
        @keyup.enter="addShoppingItem"
        placeholder="New Shopping List item"
        class="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        @click="addShoppintItem"
        class="p-2 bg-green-600 text-white rounded-r-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Add
      </button>
    </div>
    <ul class="space-y-2">
      <li
        v-for="newShoppingListItem in shoppingList"
        :key="newShoppingListItem.id"
        class="flex justify-between items-center p-2 border border-gray-300 rounded-md"
      >
        <span>{{ newShoppingListItem.title }}</span>
        <button
          @click="deleteShoppingItem(newShoppingListItem.id)"
          class="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Delete
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useFirestore, useCollection } from "vuefire";
import { collection, addDoc, deleteDoc, doc } from "firebase/firestore";

const firestore = useFirestore();
const shoppingList = useCollection(collection(firestore, "shoppingList"));

const newShoppingItem = ref("");

const addShoppintItem = async () => {
  if (newShoppingItem.value.trim()) {
    await addDoc(collection(firestore, "shoppingList"), {
      title: newShoppingItem.value.trim(),
      completed: false,
    });
    newShoppingItem.value = "";
  }
};

const deleteShoppingItem = async (id) => {
  await deleteDoc(doc(firestore, "shoppingList", id));
};
</script>