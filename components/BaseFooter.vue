<template>
  <footer class="bg-zinc-50 text-slate-800 py-8">
    <div class="container mx-auto px-4">
      <!-- Footer Top -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Logo & Description -->
        <div>
          <h3 class="text-2xl font-bold mb-2">PrepPal</h3>
          <p class="text-gray-400">
            Your personal recipe organizer, meal planner, and shopping list
            companion.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-lg font-semibold mb-2">Quick Links</h4>
          <ul class="space-y-2">
            <li>
              <nuxt-link to="/" class="hover:text-green-200">Home</nuxt-link>
            </li>
            <li>
              <nuxt-link to="/recipes" class="hover:text-green-200"
                >Recipes</nuxt-link
              >
            </li>
            <li>
              <nuxt-link to="/mealplans" class="hover:text-green-200"
                >Meal Plans</nuxt-link
              >
            </li>
            <li>
              <nuxt-link to="/about" class="hover:text-green-200"
                >About Us</nuxt-link
              >
            </li>
            <li>
              <nuxt-link to="/contact" class="hover:text-green-200"
                >Contact</nuxt-link
              >
            </li>
          </ul>
        </div>

        <!-- Social Media Links -->
        <div>
          <h4 class="text-lg font-semibold mb-2">Follow Us</h4>
          <div class="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              class="hover:text-green-200"
            >
              <font-awesome-icon
                icon="fa-brands fa-facebook"
                class="text-2xl"
              />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              class="hover:text-green-200"
            >
              <font-awesome-icon icon="fa-brands fa-twitter" class="text-2xl" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              class="hover:text-green-200"
            >
              <font-awesome-icon
                icon="fa-brands fa-instagram"
                class="text-2xl"
              />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              class="hover:text-green-200"
            >
              <font-awesome-icon
                icon="fa-brands fa-linkedin"
                class="text-2xl"
              />
            </a>
          </div>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="border-t border-gray-700 mt-6 pt-6 text-center">
        <p class="text-gray-500 text-sm">
          &copy; {{ new Date().getFullYear() }} PrepPal. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
i {
  transition: color 0.3s ease;
}
</style>
