<template>
  <div class="section">
    <h2>General Information</h2>
    <div class="input-wrapper">
      <input
        type="text"
        :value="selectedAffiliate.name"
        @input="onInputChange('name', $event.target.value)"
        placeholder=" "
        required
      />
      <label>Name</label>
    </div>
    <div class="input-wrapper">
      <input
        type="email"
        :value="selectedAffiliate.email"
        @input="onInputChange('email', $event.target.value)"
        placeholder=" "
        required
      />
      <label>Email</label>
    </div>
    <div class="input-wrapper">
      <input
        type="text"
        :value="selectedAffiliate.phone"
        @input="onInputChange('phone', $event.target.value)"
        placeholder=" "
      />
      <label>Phone</label>
    </div>
    <div class="input-wrapper">
      <input
        type="text"
        :value="selectedAffiliate.website"
        @input="onInputChange('website', $event.target.value)"
        placeholder=" "
      />
      <label>Website</label>
    </div>
    <div class="input-wrapper">
      <input
        type="number"
        :value="selectedAffiliate.commissionPercentage"
        @input="
          onInputChange(
            'commissionPercentage',
            validatePercentage($event.target.value)
          )
        "
        placeholder=" "
        min="0"
        max="100"
        required
      />
      <label>Commission Percentage (%)</label>
    </div>
    <div class="input-wrapper">
      <input
        type="text"
        :value="selectedAffiliate.uniqueCode"
        @input="onInputChange('uniqueCode', $event.target.value)"
        placeholder=" "
        readonly
      />
      <label>Tracking Code</label>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  selectedAffiliate: Object,
});

const emit = defineEmits(["updateAffiliate"]);

function onInputChange(field, value) {
  const updatedAffiliate = { ...props.selectedAffiliate, [field]: value };
  emit("updateAffiliate", updatedAffiliate);
}

function validatePercentage(value) {
  let percentage = parseFloat(value);
  if (isNaN(percentage) || percentage < 0) percentage = 0;
  if (percentage > 100) percentage = 100;
  return percentage;
}
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

.input-wrapper input[type="text"],
.input-wrapper input[type="number"],
.input-wrapper input[type="email"] {
  display: block;
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s;
}

.input-wrapper input[type="text"]:focus,
.input-wrapper input[type="number"]:focus,
.input-wrapper input[type="email"]:focus {
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
