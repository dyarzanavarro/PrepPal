<template>
  <div class="flex justify-center items-center h-screen">
    <!-- Left: Image -->
    <div class="w-1/2 h-screen hidden lg:block">
      <img
        src="~/assets/img/login-image.webp"
        alt="Placeholder Image"
        class="object-cover w-full h-full"
      />
    </div>
    <!-- Right: Login Form -->
    <div class="lg:p-24 md:p-24 sm:20 p-8 w-full lg:w-1/2">
      <h1 class="text-2xl font-semibold mb-4">
        {{ isLogin ? "Login" : "Sign Up" }}
      </h1>
      <form @submit.prevent="isLogin ? login : signUp">
        <!-- Username Input -->
        <div class="mb-4">
          <label for="username" class="block text-gray-600">Email</label>
          <input
            v-if="isLogin"
            v-model="loginEmail"
            type="email"
            placeholder="Email"
            required
            class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            autocomplete="off"
          />
          <input
            v-else
            v-model="signUpEmail"
            type="email"
            placeholder="Email"
            required
            class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            autocomplete="off"
          />
        </div>
        <!-- Password Input -->
        <div class="mb-4">
          <label for="password" class="block text-gray-600">Password</label>
          <input
            v-if="isLogin"
            v-model="loginPassword"
            type="password"
            placeholder="Password"
            required
            class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            autocomplete="off"
          />
          <input
            v-else
            v-model="signUpPassword"
            type="password"
            placeholder="Password"
            required
            class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            autocomplete="off"
          />
        </div>

        <!-- Forgot Password Link -->
        <div class="mb-6 text-green-600">
          <a href="#" class="hover:underline">Forgot Password?</a>
        </div>
        <button
          class="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md py-2 px-4"
          type="submit"
        >
          {{ isLogin ? "Login" : "Sign Up" }}
        </button>

        <!-- Login Button -->

        <div class="py-6">
          <button
            @click="loginWithGoogle"
            type="submit"
            class="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md py-2 px-4 w-full"
          >
            Login in with
            <font-awesome-icon
              icon="fa-brands fa-google"
              class="bg-transparent"
            />
          </button>
        </div>
      </form>

      <button @click="toggleForm" class="mt-4">
        {{
          isLogin
            ? "Don't have an account? Sign Up"
            : "Already have an account? Login"
        }}
      </button>
      <div class="container">
        <button @click="logout" class="mt-4">Logout</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useFirebaseAuth } from "vuefire";

const auth = useFirebaseAuth()!;
const email = ref("");
const password = ref("");
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

function signUp() {
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      console.log("User signed up:", userCredential.user);
    })
    .catch((error) => {
      console.error("Sign-up error:", error);
    });
}

function login() {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      console.log("User logged in:", userCredential.user);
    })
    .catch((error) => {
      console.error("Login error:", error);
    });
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