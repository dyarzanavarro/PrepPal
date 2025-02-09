<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-4xl font-bold mb-6">Welcome, {{ userDisplayName }}</h1>
      <p class="text-lg text-gray-600 mb-8">
        Manage your account and explore personalized recipes.
      </p>

      <!-- User Info -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Your Details</h2>
        <p class="text-lg">
          <strong>Email:</strong> {{ auth.currentUser?.email }}
        </p>
        <p class="text-lg">
          <strong>Display Name:</strong> {{ userDisplayName }}
        </p>
      </div>

      <!-- Logout Button -->
      <div class="mt-8">
        <button
          @click="logout"
          class="bg-rose-300 hover:bg-rose-500 font-semibold rounded-md py-3 px-6 shadow-md"
        >
          Log Out
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFirebaseAuth } from "vuefire";
import { useRouter } from "vue-router";
import { signOut } from "firebase/auth";

const auth = useFirebaseAuth()!;
const router = useRouter();

const userDisplayName = auth.currentUser?.displayName || "User";

function logout() {
  signOut(auth)
    .then(() => {
      router.push("/login");
    })
    .catch((error) => {
      console.error("Logout error:", error);
    });
}
</script>

<style scoped>
</style>
