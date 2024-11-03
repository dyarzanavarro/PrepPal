<script setup lang="ts">
import { ref } from "vue";

const isNavOpen = ref(false);

const toggleNav = () => {
  isNavOpen.value = !isNavOpen.value;
};
</script>

<template>
  <div>
    <header class="border-b">
      <nav class="flex items-center container mx-auto px-4">
        <nuxt-link class="flex gap-3 items-center py-2" to="/">
          <img src="~/assets/img/bento.png" alt="Bento Logo" width="60" />
        </nuxt-link>

        <!-- Hamburger Icon for Mobile -->
        <button
          class="ml-auto lg:hidden text-2xl text-green-600 top-6 right-4"
          @click="toggleNav"
          aria-label="Toggle Navigation"
        >
          <font-awesome-icon :icon="isNavOpen ? 'fa-times' : 'fa-bars'" />
        </button>

        <!-- Desktop Navigation Links -->
        <ul
          class="hidden lg:flex gap-6 ml-auto text-3xl font-bold capitalize text-green-600"
        >
          <li class="hover:text-green-900">
            <nuxt-link to="/recipes" class="hover:text-green-900"
              >Recipes</nuxt-link
            >
          </li>
          <li class="hover:text-green-900">
            <nuxt-link to="/mealprep">Meal Prep</nuxt-link>
          </li>
        </ul>
      </nav>

      <!-- Mobile Navigation Panel -->
      <transition name="slide">
        <div
          v-if="isNavOpen"
          class="lg:hidden fixed inset-0 bg-white flex flex-col justify-center items-center text-center z-50"
        >
          <!-- Close Button -->
          <button
            class="absolute top-6 right-4 text-3xl text-green-600"
            @click="isNavOpen = false"
            aria-label="Close Navigation"
          >
            <font-awesome-icon icon="fa-times" />
          </button>
          <ul
            class="flex flex-col items-center gap-6 text-6xl font-bold capitalize text-green-600"
          >
            <li>
              <nuxt-link to="/" @click="isNavOpen = false">Home</nuxt-link>
            </li>
            <li>
              <nuxt-link to="/recipes" @click="isNavOpen = false"
                >Recipes</nuxt-link
              >
            </li>
            <li>
              <nuxt-link to="/mealprep" @click="isNavOpen = false"
                >Meal Prep</nuxt-link
              >
            </li>
          </ul>
        </div>
      </transition>
    </header>
  </div>
</template>

<style>
/* Simple slide-down transition for mobile navigation */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}
</style>
