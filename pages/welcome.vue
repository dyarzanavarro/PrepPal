<template>
  <div>
    <!-- Hero Section -->
    <div class="min-h-full bg-zinc-50 flex items-center justify-center p-12">
      <!-- Content Container -->
      <div
        class="px-6 max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
      >
        <!-- Left Column -->
        <div>
          <h1 class="text-6xl font-bold text-gray-800 leading-tight mb-6">
            Organize, Plan, and
            <span class="text-green-300">Simplify Your Cooking</span>
          </h1>
          <p class="text-xl text-gray-600 mb-8">
            PrepPal makes meal planning stress-free. Save recipes, plan meals,
            and create shopping lists effortlessly.
          </p>

          <nuxt-link :to="`/login`">
            <button
              class="bg-green-200 text-slate-800 font-semibold rounded-md py-3 px-6 shadow hover:bg-green-100 transition"
            >
              Get Started Today
            </button>
          </nuxt-link>
        </div>

        <!-- Right Column -->
        <div class="flex justify-center">
          <div
            class="w-full max-w-sm h-120 rounded-lg flex items-center justify-center text-gray-500"
          >
            <img
              src="~/assets/img/background_1.png"
              alt="Background Image"
              class="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <section class="p-12 bg-zinc-50">
      <div class="max-w-6xl px-6 mx-auto text-center">
        <h2 class="text-3xl font-bold text-gray-800 mb-8">
          Why You’ll Love PrepPal
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg">
            <h3 class="text-xl font-bold text-slate-800 mb-4">Save Recipes</h3>
            <p class="text-gray-600">
              Build your personal collection of favorite recipes. Store them for
              easy access whenever you need.
            </p>
          </div>
          <!-- Feature 2 -->
          <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg">
            <h3 class="text-xl font-bold text-slate-800 mb-4">Plan Meals</h3>
            <p class="text-gray-600">
              Simplify your week with custom meal planning tools, perfect for
              busy schedules.
            </p>
          </div>
          <!-- Feature 3 -->
          <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg">
            <h3 class="text-xl font-bold text-slate-800 mb-4">
              Auto Shopping Lists
            </h3>
            <p class="text-gray-600">
              Automatically generate shopping lists based on your planned meals.
              Easy, fast, and reliable.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Recipes Section -->
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
/* Add any necessary styles here for better alignment and spacing */
</style>
