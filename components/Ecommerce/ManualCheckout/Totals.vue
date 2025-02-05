<template>
  <!--prettier-ignore-->
  <div v-if="hydrated" :class="{ 'totals-wrapper': !checkout, 'totals-wrapper-checkout': checkout }">
    <div  class="form-group">
      <label for="subtotal">Subtotal</label>
      <p id="subtotal">${{ subtotal.toFixed(2) }}</p>
    </div>
    <div class="form-group" v-if="checkout">
      <label for="tax">Estimated Sales Tax</label>
      <p id="tax" v-if="fullUserLocation()">${{ formattedTax }}</p>
      <p v-else>{{ taxMessage }}</p>
    </div>
    <div class="form-group">
      <label for="shipping">Shipping Cost</label>
      <p id="shipping">Free</p>
      <!-- Assuming a fixed shipping cost -->
    </div>
    <div class="form-group" v-if="checkout">
      <label for="coupon">Coupon Code</label>
      <input type="text" id="coupon" />
    </div>
    <div class="form-group">
      <label for="total">Total</label>
      <p id="total">${{ total.toFixed(2) }}</p>
    </div>
    <button type="submit" class="honey-button" @click="switchRoute()" v-if="!checkout">Checkout</button>
  </div>
</template>

<script setup>
const props = defineProps({
  checkout: Boolean,
  next: Boolean,
  placeOrder: Boolean,
  items: Boolean,
  userLocation: Object,
});

const hydrated = ref(false);
const tax = ref(0);
const taxCounter = ref(0);
const taxMessage = ref("$0.00");
const store = useItemStore();
const subtotal = computed(() => store.getCartSubtotal());
const total = computed(() => subtotal.value + tax.value);

onMounted(() => {
  hydrated.value = true;
});

// Define a reactive watcher
watch(
  () => [props.userLocation],
  async () => {
    // Use $fetch directly for post-mount data fetching
    if (fullUserLocation() && taxCounter.value < 3) {
      taxCounter.value++; // Stops the tax API from being called 1000 times
      // console.log(taxCounter.value);
      try {
        const response = await $fetch("/api/tax/salesTax", {
          method: "POST",
          body: JSON.stringify({
            totalCost: subtotal.value,
            userLocation: props.userLocation,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        tax.value = response;
      } catch (error) {
        console.error("Failed to fetch tax:", error);
        tax.value = 0; // Set default or error state
      }
    }
  },
  {
    deep: true,
    immediate: true,
  }
);

const formattedTax = computed(() => {
  return tax.value !== null ? tax.value.toFixed(2) : "0.00";
});

function fullUserLocation() {
  if (!props.userLocation) {
    return false;
  }

  if (props.userLocation.streetAddress == "") {
    return false;
  }

  if (props.userLocation.city == "") {
    return false;
  }

  if (props.userLocation.state == "" || props.userLocation.state.length != 2) {
    return false;
  }

  if (
    props.userLocation.ZIPCode == "" ||
    props.userLocation.ZIPCode.length != 5
  ) {
    return false;
  }

  return true;
}

function switchRoute() {
  useRouter().push("/checkout");
}
</script>


<style scoped>
.totals-wrapper {
  padding: 20px;
  background: rgba(58, 58, 59, 1);
  box-shadow: 0 0 2px rgba(255, 255, 255, 1);
  color: white;
  height: auto;
  width: 100%;
  /* border-radius: 10px; */
  margin-top: 2rem;
}

.totals-wrapper-checkout {
}

.form-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
  max-height: 2.5rem;
}

.form-group:last-child {
  border-bottom: none;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 25px;
  font-style: bolder;
}

.form-group p,
.form-group input {
  text-align: right;
  max-width: 10rem;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  /* border-radius: 4px; */
  font-size: 16px;
  margin-bottom: 10px;
}

button {
  width: 100%;
}

@media (max-width: 768px) {
  /*  ------------  MOBILE  ------------   */
  .totals-wrapper-checkout {
    /* padding: 10px; */
    border-radius: 0;
    box-shadow: none;
    padding-top: 2rem;
  }

  .totals-wrapper {
    margin-top: 0;
    border-radius: 0;
    box-shadow: none;
  }
}

@media (max-width: 480px) {
  /*  ------------  MOBILE  ------------   */
  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-size: 20px;
    font-style: bolder;
  }

  .form-group p,
  .form-group input {
    text-align: right;
    max-width: 7rem;
  }
}
</style>