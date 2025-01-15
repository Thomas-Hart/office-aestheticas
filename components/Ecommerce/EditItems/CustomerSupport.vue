<template>
  <div class="section">
    <h2>Customer Support</h2>
    <div class="input-wrapper">
      <input
        type="text"
        v-model="selectedItem.customerSupport.supportEmail"
        @input="emitUpdate"
        placeholder=" "
      />
      <label>Support Email</label>
    </div>
    <div class="input-wrapper">
      <input
        type="text"
        v-model="selectedItem.customerSupport.supportPhone"
        @input="emitUpdate"
        placeholder=" "
      />
      <label>Support Phone</label>
    </div>
    <div class="input-wrapper">
      <input
        type="text"
        v-model="selectedItem.customerSupport.supportHours"
        @input="emitUpdate"
        placeholder=" "
      />
      <label>Support Hours</label>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  selectedItem: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["updateItem"]);

function emitUpdate() {
  emit("updateItem", { ...props.selectedItem });
}
</script>

<style scoped>
.section {
  margin-bottom: 2rem;
}

h2 {
  margin-bottom: 1rem;
}

.input-wrapper {
  position: relative;
  margin-bottom: 1.5rem;
}

.input-wrapper input[type="text"] {
  display: block;
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s;
  margin-bottom: 0.5rem;
}

.input-wrapper input[type="text"]:focus {
  border-color: #4caf50;
  outline: none;
}

.input-wrapper label {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  transition: all 0.3s ease;
  background: #fff;
  padding: 0 5px;
  color: #999;
  pointer-events: none;
}

.input-wrapper input:focus + label,
.input-wrapper input:not(:placeholder-shown) + label {
  top: -10px;
  left: 10px;
  font-size: 0.85rem;
  color: #4caf50;
}
</style>
