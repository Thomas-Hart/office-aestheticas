<template>
  <div class="section">
    <h2>Address Information</h2>
    <div class="input-wrapper">
      <input
        type="text"
        :value="localAddress.street"
        @input="onInputChange('street', $event.target.value)"
        placeholder=" "
      />
      <label>Street Address</label>
    </div>
    <div class="input-wrapper">
      <input
        type="text"
        :value="localAddress.city"
        @input="onInputChange('city', $event.target.value)"
        placeholder=" "
      />
      <label>City</label>
    </div>
    <div class="input-wrapper">
      <input
        type="text"
        :value="localAddress.state"
        @input="onInputChange('state', $event.target.value)"
        placeholder=" "
      />
      <label>State</label>
    </div>
    <div class="input-wrapper">
      <input
        type="text"
        :value="localAddress.postalCode"
        @input="onInputChange('postalCode', $event.target.value)"
        placeholder=" "
      />
      <label>Postal Code</label>
    </div>
    <div class="input-wrapper">
      <input
        type="text"
        :value="localAddress.country"
        @input="onInputChange('country', $event.target.value)"
        placeholder=" "
      />
      <label>Country</label>
    </div>
  </div>
</template>
  
  <script setup>
const props = defineProps({
  address: Object,
});

const emit = defineEmits(["updateAddress"]);

const localAddress = ref({ ...props.address });

function onInputChange(field, value) {
  localAddress.value[field] = value;
  emit("updateAddress", { ...localAddress.value });
}

// Watch for changes in props.address and sync them with localAddress
watch(
  () => props.address,
  (newVal) => {
    localAddress.value = { ...newVal };
  },
  { deep: true }
);
</script>
  
  <style scoped>
.section {
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

h2 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: #333;
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
  left: 5px;
  font-size: 0.85rem;
  color: #4caf50;
}
</style>
  