<template>
  <div class="flex flex-wrap justify-center gap-2 px-9 pt-4 text-center">
    <a
      v-for="tag in tags"
      :key="tag"
      href="#"
      @click.prevent="selectTag(tag)"
      class="py-1 px-2 rounded-lg text-sm cursor-pointer"
      :class="{
        'bg-green-700  ': tag === selectedTag,
        'bg-green-200 hover:bg-green-300': tag !== selectedTag,
      }"
    >
      {{ tag }}
    </a>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  tags: string[];
  selectedTag: string | null; // Current selected tag from parent component
}>();

const emit = defineEmits<{
  (e: "tagSelected", tag: string): void;
}>();

const selectTag = (tag: string) => {
  emit("tagSelected", tag);
};
</script>
