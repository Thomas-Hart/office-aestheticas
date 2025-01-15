<template>
  <div class="section">
    <div class="section-header" @click="toggleCollapse" @mousedown.prevent>
      <h2>Item List</h2>
      <span :class="['collapse-icon', isCollapsed ? 'collapsed' : 'expanded']">
        ▼
      </span>
    </div>

    <div
      ref="content"
      :style="{ maxHeight: isCollapsed ? '0px' : contentHeight }"
      class="content"
      v-if="selectedOrder"
    >
      <div v-if="selectedOrder.itemizedList.length > 0" class="input-grid">
        <div
          v-for="(orderItem, index) in selectedOrder.itemizedList"
          :key="index"
          class="item-list-entry"
        >
          <!-- Item Image -->
          <div class="item-image">
            <img
              :src="
                `/ItemPics/${getItem(orderItem)?.image}` ||
                '/Graphics/Placeholder.webp'
              "
              alt="Item Image"
            />
          </div>

          <!-- Item Dropdown -->
          <div class="input-group">
            <label>Item</label>
            <select
              v-model="selectedOrder.itemizedList[index].itemId"
              @change="onItemChange(index)"
              class="dropdown-button"
              :disabled="selectedOrder.status !== 'Pending'"
            >
              <option disabled value="">Select Item</option>
              <option
                v-for="item in availableItems(index)"
                :key="item._id"
                :value="item._id"
              >
                {{ item.name }}
              </option>
            </select>
          </div>

          <!-- Variant Dropdown -->
          <div
            v-if="getItem(orderItem)?.variants?.length > 0"
            class="input-group"
          >
            <label>Variant</label>
            <select
              v-model="selectedOrder.itemizedList[index].variantId"
              @change="onVariantChange(index)"
              class="dropdown-button"
              :disabled="selectedOrder.status !== 'Pending'"
            >
              <option disabled value="">Select Variant</option>
              <option
                v-for="variant in availableVariants(index)"
                :key="variant._id"
                :value="variant._id"
              >
                {{ getVariantDisplayName(variant) }}
              </option>
            </select>
          </div>

          <!-- Quantity -->
          <div class="input-group">
            <label>Quantity</label>
            <input
              type="number"
              @change="onVariantChange(index)"
              v-model="selectedOrder.itemizedList[index].quantity"
              min="1"
              class="quantity-input"
              :disabled="selectedOrder.status !== 'Pending'"
            />
          </div>

          <div class="input-group">
            <label>Price</label>
            <input
              type="number"
              readonly
              v-model="selectedOrder.itemizedList[index].price"
              class="quantity-input"
            />
          </div>

          <!-- Delete Button -->
          <button
            @click="removeItem(index)"
            class="delete-button"
            :disabled="selectedOrder.status !== 'Pending'"
          >
            <img src="/Graphics/TrashBlue.svg" alt="Delete" />
          </button>
        </div>
      </div>
      <button
        @click="addNewItem"
        class="add-button"
        :disabled="selectedOrder.status !== 'Pending'"
      >
        Add New Item
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";

const props = defineProps({
  selectedOrder: Object,
  items: Array, // All items from the database
});

const emit = defineEmits(["updateOrder"]);

const isCollapsed = ref(true);
const contentHeight = ref("0px");
const content = ref(null);

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value;
  adjustContentHeight();
}

function adjustContentHeight() {
  nextTick(() => {
    contentHeight.value = isCollapsed.value
      ? "0px"
      : `${content.value.scrollHeight}px`;
  });
}

function getItem(orderItem) {
  return props.items.find((item) => item._id === orderItem.itemId);
}

function availableItems(index) {
  const selectedIds = props.selectedOrder.itemizedList
    .map((orderItem, i) => (i !== index ? orderItem.itemId : null))
    .filter((id) => id !== null);

  return props.items.filter(
    (item) =>
      !selectedIds.includes(item._id) ||
      item._id === props.selectedOrder.itemizedList[index].itemId
  );
}

function availableVariants(index) {
  const itemId = props.selectedOrder.itemizedList[index].itemId;
  const item = props.items.find((item) => item._id === itemId);
  if (!item?.variants?.length) return [];
  const selectedVariantIds = props.selectedOrder.itemizedList
    .filter((orderItem, i) => i !== index && orderItem.itemId === itemId)
    .map((orderItem) => orderItem.variantId);

  return item.variants.filter(
    (variant) =>
      !selectedVariantIds.includes(variant._id) ||
      variant._id === props.selectedOrder.itemizedList[index].variantId
  );
}

function getVariantDisplayName(variant) {
  const uniqueAttributes = {
    color: variant.color?.name || null,
    size: variant.size || null,
    material: variant.material || null,
    style: variant.style || null,
  };

  return Object.entries(uniqueAttributes)
    .filter(([key, value]) => value)
    .map(([key, value]) => `${value}`)
    .join(" - ");
}

function onItemChange(index) {
  const updatedItemList = [...props.selectedOrder.itemizedList];
  const newItemId = updatedItemList[index].itemId;

  const newItem = props.items.find((item) => item._id === newItemId);
  if (!newItem) {
    return;
  }

  const defaultVariant = newItem?.variants?.[0] || {};

  updatedItemList[index] = {
    itemId: newItemId,
    variantId: defaultVariant._id || "",
    variantDetails: defaultVariant
      ? {
          color: defaultVariant.color || null,
          size: defaultVariant.size || null,
          material: defaultVariant.material || null,
          style: defaultVariant.style || null,
        }
      : {},
    image: newItem.image || defaultVariant.image || "",
    name: newItem.name || "",
    price: defaultVariant.price || newItem.price || 0,
    quantity: 1,
  };

  emit("updateOrder", {
    ...props.selectedOrder,
    itemizedList: updatedItemList,
  });
  adjustContentHeight();
}

function onVariantChange(index) {
  const updatedItemList = [...props.selectedOrder.itemizedList];
  const orderItem = updatedItemList[index];

  const item = props.items.find((item) => item._id === orderItem.itemId);
  if (!item) {
    return;
  }
  const variant = item?.variants?.find(
    (variant) => variant._id === orderItem.variantId
  );

  updatedItemList[index] = {
    ...orderItem,
    variantId: variant?._id || "",
    variantDetails: variant
      ? {
          color:
            typeof variant.color === "object"
              ? variant.color
              : { name: variant.color || null, hex: null },
          size: variant.size || null,
          material: variant.material || null,
          style: variant.style || null,
        }
      : {},
    price: variant?.price || item?.price || 0,
  };

  emit("updateOrder", {
    ...props.selectedOrder,
    itemizedList: updatedItemList,
  });
  adjustContentHeight();
}

function removeItem(index) {
  const updatedItemList = [...props.selectedOrder.itemizedList];
  updatedItemList.splice(index, 1);
  emit("updateOrder", {
    ...props.selectedOrder,
    itemizedList: updatedItemList,
  });
  adjustContentHeight();
}

function addNewItem() {
  let newItem = null;

  for (const item of props.items) {
    // Check if the item is fully used (all variants or base item are in the order)
    const isItemFullyUsed =
      item.variants?.length > 0
        ? item.variants.every((variant) =>
            props.selectedOrder.itemizedList.some(
              (orderItem) =>
                orderItem.itemId === item._id &&
                orderItem.variantId === variant._id
            )
          )
        : props.selectedOrder.itemizedList.some(
            (orderItem) => orderItem.itemId === item._id && !orderItem.variantId
          );

    // Handle items with variants
    if (item.variants?.length) {
      for (const variant of item.variants) {
        const isVariantInOrder = props.selectedOrder.itemizedList.some(
          (orderItem) =>
            orderItem.itemId === item._id && orderItem.variantId === variant._id
        );

        if (!isVariantInOrder) {
          newItem = {
            itemId: item._id,
            variantId: variant._id,
            variantDetails: {
              color: variant.color || null,
              size: variant.size || null,
              material: variant.material || null,
              style: variant.style || null,
            },
            image: variant.image || item.image || "",
            name: item.name || "Unnamed Item",
            price: variant.price || item.price || 0,
            quantity: 1,
          };
          break; // Break out of the variant loop to add this variant
        }
      }
    } else {
      // Handle items without variants
      const isBaseItemInOrder = props.selectedOrder.itemizedList.some(
        (orderItem) => orderItem.itemId === item._id && !orderItem.variantId
      );

      if (!isBaseItemInOrder) {
        newItem = {
          itemId: item._id,
          image: item.image || "",
          name: item.name || "Unnamed Item",
          price: item.price || 0,
          quantity: 1,
        };
      }
    }

    if (newItem) {
      break; // Break out of the item loop to add this new item or variant
    }
  }

  if (!newItem) {
    console.warn("No available item or variant to add.");
    return;
  }

  const updatedItemList = [...props.selectedOrder.itemizedList, newItem];

  emit("updateOrder", {
    ...props.selectedOrder,
    itemizedList: updatedItemList,
  });
  adjustContentHeight();
}
</script>


<style scoped>
.section {
  background: white;
  border-radius: 8px;
  margin-bottom: 1rem;
  width: 100%;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 1rem;
  user-select: none;
}

.section-header h2,
.section-header .collapse-icon {
  font-size: 1.4rem;
  color: #333;
}

.collapse-icon {
  font-size: 1.2rem;
  transition: transform 0.3s;
}

.collapsed {
  transform: rotate(-90deg);
}

.content {
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.5s ease;
}

.input-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
}

.item-list-entry {
  display: flex;
  flex-direction: column;
  max-width: 325px;
  gap: 0.5rem;
  padding: 0.8rem;
  background: rgba(173, 216, 230, 0.1);
  border: 1px solid #ddd;
  border-radius: 6px;
  align-items: center;
}

.item-image img {
  width: 80px;
  height: 80px;
  border-radius: 6px;
  object-fit: cover;
  margin-bottom: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.input-group label {
  font-size: 0.8rem;
  color: #333;
  margin-bottom: 0.3rem;
}

.input-group input[type="text"],
.input-group input[type="number"],
.input-group select,
.input-group textarea {
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  color: #333;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #ccc;
  transition: all 0.3s ease;
  width: 100%;
}

.input-group textarea {
  resize: none;
  height: 4rem;
}

.input-group input:focus,
.input-group select:focus,
.input-group textarea:focus {
  border-color: #4a90e2;
  outline: none;
  box-shadow: 0 0 8px rgba(74, 144, 226, 0.3);
}

.add-button {
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  border: none;
  background-color: #4a90e2;
  color: white;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;
  margin: 1rem;
  border-radius: 6px;
}

.add-button:hover {
  background-color: #357abd;
}

.delete-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.3rem;
  transition: transform 0.2s ease;
}

.delete-button img {
  width: 1.2rem;
  height: 1.2rem;
}

.delete-button:hover {
  transform: scale(1.1);
}

@media (max-width: 830px) {
  .section-header h2 {
    font-size: 1.2rem;
  }

  .input-grid {
    flex-direction: column;
    gap: 0.5rem;
  }

  .item-list-entry {
    max-width: 100%;
  }

  .add-button {
    width: 100%;
    max-width: 200px;
  }
}
</style>
