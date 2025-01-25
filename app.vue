<template>
  <div>
    <NuxtLayout>
      <NuxtPwaManifest />
      <base-navigation />
      <NuxtPage />
      <base-footer />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
provideHeadlessUseId(() => useId());
</script>

<style>
</style>