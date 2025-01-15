<template>
  <div v-if="references.length">
    <h2>References</h2>
    <div v-for="(reference, index) in references" :key="index">
      <p class="references">{{ reference }}</p>
    </div>
  </div>
</template>
  
  <script setup>
const props = defineProps({
  references: Array,
});
</script>
  
  <style scoped>
.references {
  font-size: 1.2rem;
  word-break: break-all;
  color: #888;
}
</style>
  