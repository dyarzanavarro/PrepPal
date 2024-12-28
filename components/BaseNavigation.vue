<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useFirebaseAuth } from "vuefire";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();
const userPhotoURL = ref<string | null>(null);
const isMobileMenuOpen = ref(false);

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userPhotoURL.value = user.photoURL;
    } else {
      userPhotoURL.value = null;
    }
  });
});

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
}
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
          @click="toggleMobileMenu"
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
          <li class="hover:text-green-900">
            <nuxt-link to="/shopping">Shopping</nuxt-link>
          </li>

          <li>
            <!-- Display user profile image if logged in -->
            <div v-if="userPhotoURL" class="ml-4">
              <img
                :src="userPhotoURL"
                alt="User img"
                class="w-10 h-10 rounded-full"
              />
            </div>
          </li>
        </ul>
      </nav>

      <!-- Mobile Navigation Panel -->
      <transition name="slide">
        <div
          v-if="isMobileMenuOpen"
          class="lg:hidden fixed inset-0 flex flex-col justify-center items-center text-center z-50 bg-slate-50"
        >
          <!-- Close Button -->
          <button
            class="absolute top-6 right-4 text-3xl text-green-600"
            @click="isMobileMenuOpen = false"
            aria-label="Close Navigation"
          >
            <font-awesome-icon icon="fa-times" />
          </button>
          <ul
            class="flex flex-col items-center gap-6 text-6xl font-bold capitalize text-green-600"
          >
            <li>
              <nuxt-link to="/" @click="isMobileMenuOpen = false"
                >Home</nuxt-link
              >
            </li>
            <li>
              <nuxt-link to="/recipes" @click="isMobileMenuOpen = false"
                >Recipes</nuxt-link
              >
            </li>
            <li>
              <nuxt-link to="/mealprep" @click="isMobileMenuOpen = false"
                >Meal Prep</nuxt-link
              >
            </li>
            <li>
              <nuxt-link to="/shopping" @click="isMobileMenuOpen = false"
                >Shopping</nuxt-link
              >
            </li>
            <li>
              <div class="flex items-center">
                <!-- Display user profile image if logged in -->
                <div v-if="userPhotoURL" class="ml-4">
                  <img
                    :src="userPhotoURL"
                    alt="User Profile"
                    class="w-10 h-10 rounded-full"
                  />
                </div>
              </div>
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
