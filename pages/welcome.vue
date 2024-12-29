<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-green-600 text-white py-16 px-8 text-center">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Welcome to PrepPal</h1>
        <p class="text-lg md:text-xl font-light mb-8">
          Your personal recipe organizer, meal planner, and shopping list
          companion.
        </p>
        <div class="flex justify-center gap-4">
          <nuxt-link :to="`/login`">
            <button
              class="bg-white text-green-600 font-semibold rounded-md py-2 px-6 shadow hover:bg-gray-100"
            >
              Sign Up / Login
            </button>
          </nuxt-link>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 px-8">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl font-bold mb-8 text-gray-800">What You Can Do</h2>
        <div class="grid gap-8 md:grid-cols-3 text-left">
          <!-- Feature 1 -->
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-xl font-bold text-green-600 mb-4">
              Add Your Own Recipes
            </h3>
            <p class="text-gray-600">
              Create and manage your own personalized recipe collection. Save
              your favorite dishes and access them anytime.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-xl font-bold text-green-600 mb-4">
              Plan Your Meals
            </h3>
            <p class="text-gray-600">
              Plan meals for the week and take the stress out of deciding what
              to cook. Perfect for meal prepping!
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-xl font-bold text-green-600 mb-4">
              Generate a Shopping List
            </h3>
            <p class="text-gray-600">
              Automatically create a shopping list based on your planned meals.
              Save time and never miss an ingredient again.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Call-to-Action Section -->
    <section class="bg-gray-100 py-16 px-8 text-center">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold text-gray-800 mb-4">Get Started Today</h2>
        <p class="text-lg text-gray-600 mb-8">
          Sign up or log in with your Google account to create your own recipe
          library, plan meals, and simplify shopping.
        </p>
        <nuxt-link :to="`/login`">
          <button
            class="bg-green-600 text-white font-semibold rounded-md py-2 px-6 shadow hover:bg-green-700"
          >
            Sign Up / Login
          </button>
        </nuxt-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
/* Custom styles for better visuals */
</style>
