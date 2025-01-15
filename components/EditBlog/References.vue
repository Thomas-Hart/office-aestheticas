<template>
  <div>
    <h2>References</h2>
    <div v-for="(reference, index) in editableReferences" :key="index">
      <input
        type="text"
        v-model="editableReferences[index]"
        @input="updateReference"
        class="reference-input"
      />
      <button @click="removeReference(index)" class="remove-button">
        Remove
      </button>
    </div>
    <button @click="addReference" class="add-button">Add Reference</button>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  references: Array,
});

const emit = defineEmits(["updateReferences"]);

const editableReferences = ref([...props.references]);

const updateReference = () => {
  emit("updateReferences", editableReferences.value);
};

const addReference = () => {
  editableReferences.value.push("New Reference");
  updateReference(); // Emit the updated references
};

const removeReference = (index) => {
  editableReferences.value.splice(index, 1);
  updateReference(); // Emit the updated references
};

watch(
  () => props.references,
  (newVal) => {
    editableReferences.value = [...newVal];
  }
);
</script>

<style scoped>
.references {
  font-size: 1.2rem;
  word-break: break-all;
  color: #888;
  margin-bottom: 1rem;
}

.reference-input {
  width: 100%;
  padding: 8px;
  font-size: 1.2rem;
  margin-bottom: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.add-button,
.remove-button {
  margin-top: 10px;
  padding: 8px 12px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.remove-button {
  background-color: #dc3545;
  margin-left: 10px;
}
</style>
