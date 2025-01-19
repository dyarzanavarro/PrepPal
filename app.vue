<template>
  <div>
    <NuxtLayout>
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