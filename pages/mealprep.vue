<script setup lang="ts">
import { ref } from "vue";
const date = ref(new Date());

const attrs = ref([
  {
    key: "today",
    highlight: {
      color: "green",
      fillMode: "solid",
    },
    dates: new Date(),
  },
]);
</script>

<template>
  <div>
    <client-only>
      <VCalendar expanded :first-day-of-week="2" show-iso-weeknumbers />
    </client-only>
  </div>
</template>
