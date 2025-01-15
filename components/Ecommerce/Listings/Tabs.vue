<template>
  <div class="tabs">
    <span
      v-for="(tab, index) in tabs"
      :key="index"
      :class="{ active: activeTab === index }"
      @click="activeTab = index"
    >
      {{ tab }}
    </span>
  </div>
</template>
  
  <script setup>
const props = defineProps({
  tabs: Array,
  activeTab: Number,
});

const emits = defineEmits(["update:activeTab"]);
</script>
  
  <style scoped>
.tabs {
  display: flex;
  gap: 20px;
  font-size: 1.2rem;
}

.tabs span {
  cursor: pointer;
  padding-bottom: 5px;
}

.tabs .active {
  border-bottom: 3px solid #ff8000;
}
</style>
  