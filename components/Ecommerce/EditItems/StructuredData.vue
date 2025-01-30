<template>
  <div class="structured-data-dashboard">
    <h2>Edit Structured Data for Product</h2>

    <div class="grid-container">
      <!-- Basic Information -->
      <div class="grid-group">
        <h3>Basic Information</h3>
        <div class="grid-item">
          <label for="structuredName">Product Name</label>
          <input
            id="structuredName"
            :value="selectedItem.structuredData?.name || ''"
            @input="updateField('name', $event.target.value)"
            placeholder="Product name"
          />
        </div>

        <div class="grid-item">
          <label for="structuredDescription">Description</label>
          <textarea
            id="structuredDescription"
            :value="selectedItem.structuredData?.description || ''"
            @input="updateField('description', $event.target.value)"
            placeholder="Product description"
          ></textarea>
        </div>

        <div class="grid-item">
          <label for="structuredSku">SKU</label>
          <input
            id="structuredSku"
            :value="selectedItem.structuredData?.sku || ''"
            @input="updateField('sku', $event.target.value)"
            placeholder="Product SKU"
          />
        </div>

        <div class="grid-item">
          <label for="structuredMpn">MPN</label>
          <input
            id="structuredMpn"
            :value="selectedItem.structuredData?.mpn || ''"
            @input="updateField('mpn', $event.target.value)"
            placeholder="Manufacturer Part Number (MPN)"
          />
        </div>

        <div class="grid-item">
          <label for="structuredBrand">Brand</label>
          <input
            id="structuredBrand"
            :value="selectedItem.structuredData?.brand?.name || ''"
            @input="updateNestedField('brand', 'name', $event.target.value)"
            placeholder="Brand name"
          />
        </div>

        <div class="grid-item">
          <label for="structuredCategory">Category</label>
          <input
            id="structuredCategory"
            :value="selectedItem.structuredData?.category || ''"
            @input="updateField('category', $event.target.value)"
            placeholder="Product category"
          />
        </div>
      </div>

      <!-- Offers -->
      <div class="grid-group">
        <h3>Offers</h3>
        <div class="grid-item">
          <label for="structuredPrice">Price</label>
          <input
            id="structuredPrice"
            type="number"
            :value="selectedItem.structuredData?.offers?.price || ''"
            @input="updateNestedField('offers', 'price', $event.target.value)"
            placeholder="Product price"
          />
        </div>

        <div class="grid-item">
          <label for="structuredPriceCurrency">Currency</label>
          <input
            id="structuredPriceCurrency"
            :value="selectedItem.structuredData?.offers?.priceCurrency || 'USD'"
            @input="
              updateNestedField('offers', 'priceCurrency', $event.target.value)
            "
            placeholder="Currency (e.g., USD)"
          />
        </div>

        <div class="grid-item">
          <label for="structuredAvailability">Availability</label>
          <select
            id="structuredAvailability"
            :value="
              selectedItem.structuredData?.offers?.availability ||
              'http://schema.org/InStock'
            "
            @change="
              updateNestedField('offers', 'availability', $event.target.value)
            "
          >
            <option disabled value="">Select Availability</option>
            <option value="http://schema.org/InStock">In Stock</option>
            <option value="http://schema.org/OutOfStock">Out of Stock</option>
            <option value="http://schema.org/PreOrder">PreOrder</option>
          </select>
        </div>

        <div class="grid-item">
          <label for="structuredUrl">URL</label>
          <input
            id="structuredUrl"
            :value="selectedItem.structuredData?.offers?.url || ''"
            @input="updateNestedField('offers', 'url', $event.target.value)"
            placeholder="Product URL"
          />
        </div>
      </div>

      <!-- Ratings and Reviews -->
      <div class="grid-group">
        <h3>Ratings and Reviews</h3>
        <div class="grid-item">
          <label for="structuredAggregateRatingValue">Aggregate Rating</label>
          <input
            id="structuredAggregateRatingValue"
            type="number"
            :value="
              selectedItem.structuredData?.aggregateRating?.ratingValue || ''
            "
            @input="
              updateNestedField(
                'aggregateRating',
                'ratingValue',
                $event.target.value
              )
            "
            placeholder="Aggregate rating value"
          />
        </div>

        <div class="grid-item">
          <label for="structuredReviewCount">Review Count</label>
          <input
            id="structuredReviewCount"
            type="number"
            :value="
              selectedItem.structuredData?.aggregateRating?.reviewCount || ''
            "
            @input="
              updateNestedField(
                'aggregateRating',
                'reviewCount',
                $event.target.value
              )
            "
            placeholder="Total number of reviews"
          />
        </div>

        <div class="grid-item">
          <label for="structuredBestRating">Best Rating</label>
          <input
            id="structuredBestRating"
            type="number"
            :value="
              selectedItem.structuredData?.aggregateRating?.bestRating || 5
            "
            @input="
              updateNestedField(
                'aggregateRating',
                'bestRating',
                $event.target.value
              )
            "
            placeholder="Highest possible rating"
          />
        </div>

        <div class="grid-item">
          <label for="structuredWorstRating">Worst Rating</label>
          <input
            id="structuredWorstRating"
            type="number"
            :value="
              selectedItem.structuredData?.aggregateRating?.worstRating || 1
            "
            @input="
              updateNestedField(
                'aggregateRating',
                'worstRating',
                $event.target.value
              )
            "
            placeholder="Lowest possible rating"
          />
        </div>
      </div>

      <!-- Additional Information -->
      <div class="grid-group">
        <h3>Additional Information</h3>
        <div class="grid-item">
          <label for="structuredGtin">GTIN</label>
          <input
            id="structuredGtin"
            :value="selectedItem.structuredData?.gtin || ''"
            @input="updateField('gtin', $event.target.value)"
            placeholder="Global Trade Item Number (GTIN)"
          />
        </div>

        <div class="grid-item">
          <label for="structuredReleaseDate">Release Date</label>
          <input
            id="structuredReleaseDate"
            type="date"
            :value="selectedItem.structuredData?.releaseDate || ''"
            @input="updateField('releaseDate', $event.target.value)"
            placeholder="Product release date"
          />
        </div>

        <div class="grid-item">
          <label for="structuredItemCondition">Item Condition</label>
          <select
            id="structuredItemCondition"
            :value="
              selectedItem.structuredData?.itemCondition ||
              'http://schema.org/NewCondition'
            "
            @change="updateField('itemCondition', $event.target.value)"
          >
            <option disabled value="">Select Condition</option>
            <option value="http://schema.org/NewCondition">New</option>
            <option value="http://schema.org/UsedCondition">Used</option>
            <option value="http://schema.org/RefurbishedCondition">
              Refurbished
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
const props = defineProps({
  selectedItem: Object,
});

const emit = defineEmits(["updateItem"]);

const updateField = (field, value) => {
  const updatedData = {
    ...props.selectedItem,
    structuredData: { ...props.selectedItem.structuredData, [field]: value },
  };
  emit("updateItem", updatedData);
};

const updateNestedField = (parentField, childField, value) => {
  const updatedData = { ...props.selectedItem };
  const fields = childField.split(".");

  let obj = updatedData.structuredData[parentField] || {};
  for (let i = 0; i < fields.length - 1; i++) {
    if (!obj[fields[i]]) {
      obj[fields[i]] = {};
    }
    obj = obj[fields[i]];
  }

  obj[fields[fields.length - 1]] = value;
  updatedData.structuredData[parentField] = {
    ...updatedData.structuredData[parentField],
    ...obj,
  };
  emit("updateItem", updatedData);
};
</script>
  
  <style scoped>
.structured-data-dashboard {
  margin-top: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.grid-group {
  grid-column: span 2;
}

.grid-group h3 {
  margin-bottom: 10px;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.grid-item {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.grid-item label {
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}

.grid-item input,
.grid-item textarea,
.grid-item select {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
</style>
  