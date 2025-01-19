<template>
  <div>
    <NuxtLayout>
      <NuxtPwaManifest />
      <base-navigation />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
provideHeadlessUseId(() => useId());
</script>

<style>
</style>