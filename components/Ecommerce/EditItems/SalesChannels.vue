<template>
    <div class="section">
      <h2>Sales Channels</h2>
      <div
        v-for="(channel, index) in selectedItem.salesChannels"
        :key="index"
        class="input-wrapper"
      >
        <select
          v-model="selectedItem.salesChannels[index]"
          @change="onChannelChange"
          class="dropdown-button"
        >
          <option disabled value="">Select a sales channel</option>
          <option
            v-for="option in availableChannels(index)"
            :key="option"
            :value="option"
          >
            {{ option }}
          </option>
        </select>
        <button @click="removeChannel(index)" class="remove-button">
          Remove Channel
        </button>
      </div>
      <button @click="addChannel" class="action-button">Add Sales Channel</button>
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
  
  // Predefined list of sales channels
  const predefinedChannels = ["Online", "Retail", "Wholesale", "Marketplace"];
  
  function availableChannels(index) {
    const selectedChannels = props.selectedItem.salesChannels
      .map((channel, i) => (i !== index ? channel : null))
      .filter((channel) => channel !== null);
  
    return predefinedChannels.filter(
      (option) =>
        !selectedChannels.includes(option) ||
        option === props.selectedItem.salesChannels[index]
    );
  }
  
  // Function to handle changes in sales channels
  function onChannelChange() {
    emit("updateItem", {
      ...props.selectedItem,
      salesChannels: [...props.selectedItem.salesChannels],
    });
  }
  
  // Function to add a new sales channel
  function addChannel() {
    const updatedChannels = [...props.selectedItem.salesChannels, ""];
    emit("updateItem", {
      ...props.selectedItem,
      salesChannels: updatedChannels,
    });
  }
  
  // Function to remove a sales channel
  function removeChannel(index) {
    const updatedChannels = [...props.selectedItem.salesChannels];
    updatedChannels.splice(index, 1);
    emit("updateItem", {
      ...props.selectedItem,
      salesChannels: updatedChannels,
    });
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
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
  }
  
  .dropdown-button {
    padding: 10px 20px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: white;
    cursor: pointer;
    flex-grow: 1;
    margin-right: 10px;
    transition: background-color 0.3s, color 0.3s;
  }
  
  .dropdown-button:hover {
    background-color: #ff8210;
    color: white;
  }
  
  .remove-button {
    background-color: #e74c3c;
    color: white;
    cursor: pointer;
    padding: 5px;
    border-radius: 4px;
  }
  
  .remove-button:hover {
    background-color: #c0392b;
  }
  
  .action-button {
    padding: 10px 20px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 25px;
    background-color: white;
    cursor: pointer;
    text-align: center;
    display: inline-block;
    margin-bottom: 1rem;
    width: 100%;
    transition: background-color 0.3s, color 0.3s;
  }
  
  .action-button:hover {
    background-color: #ff8210;
    color: white;
  }
  </style>
  