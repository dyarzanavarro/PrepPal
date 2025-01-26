<template>
  <div class="min-h-full bg-zinc-50 flex items-center justify-center p-12">
    <!-- Main Content -->
    <div
      class="container max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-8 px-4"
    >
      <!-- Left Column: Text and CTA -->
      <div class="text-center md:text-left">
        <h1 class="text-4xl font-bold text-gray-800 mb-6">Welcome Back!</h1>
        <p class="text-lg text-gray-600 mb-8">
          Sign in to access your personalized recipe library, meal plans, and
          shopping lists. Let's make cooking fun and easy!
        </p>
        <div class="space-y-4">
          <button
            @click="loginWithGoogle"
            class="bg-green-200 hover:bg-green-700 text-white font-semibold rounded-lg py-3 px-6 flex items-center justify-center gap-2 shadow-md w-full md:w-auto"
          >
            <font-awesome-icon icon="fa-brands fa-google" class="text-lg" />
            Login with Google
          </button>

          <!-- Logout Link -->
          <p v-if="auth.currentUser" class="text-gray-600">
            Already logged in?
            <button
              @click="logout"
              class="text-green-200 font-semibold hover:underline"
            >
              Log out
            </button>
          </p>
        </div>
      </div>

      <!-- Right Column: Illustration -->
      <div class="hidden md:block">
        <img
          src="~/assets/img/login-image.webp"
          alt="Login Illustration"
          class="w-full h-auto object-cover"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { useFirebaseAuth } from "vuefire";

const auth = useFirebaseAuth()!;
const router = useRouter();

function loginWithGoogle() {
  if (auth) {
    signInWithPopup(auth, new GoogleAuthProvider())
      .then(() => {
        router.push("/");
      })
      .catch((error) => {
        console.error("Google sign-in error:", error);
      });
  } else {
    console.error("Auth is null");
  }
}

const userDisplayName = auth.currentUser?.displayName || "User";

// Redirect to /account if the user is already logged in
if (auth?.currentUser) {
  router.push("/account");
}

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
