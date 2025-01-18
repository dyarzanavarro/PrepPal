<template>
  <div>
    <NuxtLayout>
      <base-navigation />
      <NuxtPage />
    </NuxtLayout>
    <button
      v-if="showInstallButton"
      @click="installApp"
      class="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg"
    >
      Install App
    </button>
  </div>
</template>

<script setup lang="ts">
import { usePwaInstall } from "./composables/usePwaInstall";

const { showInstallButton, installApp } = usePwaInstall();
provideHeadlessUseId(() => useId());
</script>

<style>
</style>