<script setup lang="ts">
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useFirebaseAuth } from "vuefire";

const auth = useFirebaseAuth()!;
function loginWithGoogle() {
  if (auth) {
    signInWithPopup(auth, new GoogleAuthProvider());
  } else {
    console.error("Auth is null");
  }
}
</script>

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
    <div class="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
      <h1 class="text-2xl font-semibold mb-4">Login</h1>
      <form action="#" method="POST">
        <!-- Username Input -->
        <div class="mb-4">
          <label for="username" class="block text-gray-600">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            autocomplete="off"
          />
        </div>
        <!-- Password Input -->
        <div class="mb-4">
          <label for="password" class="block text-gray-600">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            autocomplete="off"
          />
        </div>
        <!-- Remember Me Checkbox -->
        <div class="mb-4 flex items-center">
          <input
            type="checkbox"
            id="remember"
            name="remember"
            class="text-green-600"
          />
          <label for="remember" class="text-gray-600 ml-2">Remember Me</label>
        </div>
        <!-- Forgot Password Link -->
        <div class="mb-6 text-green-600">
          <a href="#" class="hover:underline">Forgot Password?</a>
        </div>
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
      <!-- Sign up  Link -->
      <div class="mt-6 text-green-600 text-center">
        <a href="#" class="hover:underline">Sign up Here</a>
      </div>
    </div>
  </div>
</template>

