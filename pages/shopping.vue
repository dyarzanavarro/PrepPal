<template>
  <div
    class="pt-2 mx-auto text-center flex justify-center max-w-lg flex-col mx-auto"
  >
    <input v-model="newShoppingItem" placeholder="New Shopping List item" />
    <button @click="addShoppintItem">Add Shopping Item</button>
    <ul>
      <li
        v-for="newShoppingListItem in shoppingList"
        :key="newShoppingListItem.id"
      >
        {{ newShoppingListItem.title }}
        <button @click="deleteShoppingItem(newShoppingListItem.id)">
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