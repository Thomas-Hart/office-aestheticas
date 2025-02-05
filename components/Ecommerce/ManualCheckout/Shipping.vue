<template>
  <div class="shipping-container">
    <h2>Shipping Information</h2>
    <!-- prettier-ignore -->
    <form class="shipping-form">
      <div class="name">
        <div class="form-group" :class="{ 'input-filled': firstName, 'invalid': invalidFirstName }">
          <label for="firstName">First Name</label>
          <input type="text" id="firstName" v-model="firstName" required placeholder="First Name" />
          <div class="popup" v-if="invalidFirstName">{{ invalidFirstName }}</div>
        </div>
        <div class="form-group" :class="{ 'input-filled': lastName, 'invalid': invalidLastName }">
          <label for="lastName">Last Name</label>
          <input type="text" id="lastName" v-model="lastName" required placeholder="Last Name" />
          <div class="popup" v-if="invalidLastName">{{ invalidLastName }}</div>
        </div>
      </div>
      <div class="address">
        <div class="form-group" :class="{ 'input-filled': address.streetAddress, 'invalid': invalidAddress }">
          <label for="streetAddress">Street Address</label>
          <input type="text" id="streetAddress" v-model="address.streetAddress" required placeholder="Street Address" />
          <div class="error" v-if="invalidAddress">{{ invalidAddress }}</div>
        </div>
      </div>
      <div class="secondary-address">
        <div class="form-group" :class="{ 'input-filled': address.secondaryAddress, 'invalid': invalidAddress }">
          <label for="secondaryAddress">Secondary Address</label>
          <input type="text" id="secondaryAddress" v-model="address.secondaryAddress" required placeholder="Secondary Address" />
        </div>
      </div>
      <div class="location">
        <div class="form-group" :class="{ 'input-filled': address.city, 'invalid': invalidAddress }">
          <label for="city">City</label>
          <input type="text" id="city" v-model="address.city" required placeholder="City" />
        </div>
        <div class="form-group" :class="{ 'input-filled': address.state, 'invalid': invalidAddress }">
          <label for="state">State</label>
          <input type="text" id="state" v-model="address.state" required placeholder="State" />
        </div>
        <div class="form-group" :class="{ 'input-filled': address.ZIPCode, 'invalid': invalidAddress }">
          <label for="zip">Zip</label>
          <input type="text" id="zip" v-model="address.ZIPCode" required placeholder="Zip" />
        </div>
      </div>
      <div class="billing-checkbox">
        <input type="checkbox" id="sameAsShipping" v-model="sameAsShipping" @change="toggleBilling">
        <label for="sameAsShipping">Billing info is the same as shipping info</label>
      </div>
      <transition name="fade">
        <div v-show="!sameAsShipping" class="billing-info">
          <h2>Billing Information</h2>
          <div class="name">
            <div class="form-group" :class="{ 'input-filled': billingFirstName, 'invalid': invalidBillingFirstName }">
              <label for="billingFirstName">First Name</label>
              <input type="text" id="billingFirstName" v-model="billingFirstName" required placeholder="First Name" />
              <div class="popup" v-if="invalidBillingFirstName">{{ invalidBillingFirstName }}</div>
            </div>
            <div class="form-group" :class="{ 'input-filled': billingLastName, 'invalid': invalidBillingLastName }">
              <label for="billingLastName">Last Name</label>
              <input type="text" id="billingLastName" v-model="billingLastName" required placeholder="Last Name" />
              <div class="popup" v-if="invalidBillingLastName">{{ invalidBillingLastName }}</div>
            </div>
          </div>
          <div class="address">
            <div class="form-group" :class="{ 'input-filled': billingAddress.streetAddress, 'invalid': invalidBillingAddress }">
              <label for="billingStreetAddress">Street Address</label>
              <input type="text" id="billingStreetAddress" v-model="billingAddress.streetAddress" required placeholder="Street Address" />
              <div class="error" v-if="invalidBillingAddress">{{ invalidBillingAddress }}</div>
            </div>
          </div>
          <div class="secondary-address">
            <div class="form-group" :class="{ 'input-filled': billingAddress.secondaryAddress, 'invalid': invalidBillingAddress }">
              <label for="billingSecondaryAddress">Secondary Address</label>
              <input type="text" id="billingSecondaryAddress" v-model="billingAddress.secondaryAddress" required placeholder="Secondary Address" />
            </div>
          </div>
          <div class="location">
            <div class="form-group" :class="{ 'input-filled': billingAddress.city, 'invalid': invalidBillingAddress }">
              <label for="billingCity">City</label>
              <input type="text" id="billingCity" v-model="billingAddress.city" required placeholder="City" />
            </div>
            <div class="form-group" :class="{ 'input-filled': billingAddress.state, 'invalid': invalidBillingAddress }">
              <label for="billingState">State</label>
              <input type="text" id="billingState" v-model="billingAddress.state" required placeholder="State" />
            </div>
            <div class="form-group" :class="{ 'input-filled': billingAddress.ZIPCode, 'invalid': invalidBillingAddress }">
              <label for="billingZIP">Zip</label>
              <input type="text" id="billingZIP" v-model="billingAddress.ZIPCode" required placeholder="Zip" />
            </div>
          </div>
        </div>
      </transition>
    </form>
  </div>
</template>

<script setup>
const props = defineProps({
  invalidAddress: String,
  invalidFirstName: String,
  invalidLastName: String,
  invalidBillingAddress: String,
  invalidBillingFirstName: String,
  invalidBillingLastName: String,
  sameAsShipping: Boolean,
});

const firstName = ref("");
const lastName = ref("");
const address = ref({
  streetAddress: "",
  secondaryAddress: "",
  city: "",
  state: "",
  ZIPCode: "",
});

const billingFirstName = ref("");
const billingLastName = ref("");
const billingAddress = ref({
  streetAddress: "",
  secondaryAddress: "",
  city: "",
  state: "",
  ZIPCode: "",
});

const sameAsShipping = ref(props.sameAsShipping);

const emit = defineEmits([
  "first-name-changed",
  "last-name-changed",
  "address-changed",
  "billing-first-name-changed",
  "billing-last-name-changed",
  "billing-address-changed",
  "update-same-as-shipping",
]);

watch(firstName, (newValue) => {
  emit("first-name-changed", newValue);
  if (sameAsShipping.value) {
    billingFirstName.value = newValue;
    emit("billing-first-name-changed", newValue);
  }
});

watch(lastName, (newValue) => {
  emit("last-name-changed", newValue);
  if (sameAsShipping.value) {
    billingLastName.value = newValue;
    emit("billing-last-name-changed", newValue);
  }
});

watch(
  address,
  (newValue) => {
    emit("address-changed", newValue);
    if (sameAsShipping.value) {
      billingAddress.value = { ...newValue };
      emit("billing-address-changed", { ...newValue });
    }
  },
  { deep: true }
);

watch(billingFirstName, (newValue) => {
  emit("billing-first-name-changed", newValue);
});

watch(billingLastName, (newValue) => {
  emit("billing-last-name-changed", newValue);
});

watch(
  billingAddress,
  (newValue) => {
    emit("billing-address-changed", newValue);
  },
  { deep: true }
);

watch(
  () => props.sameAsShipping,
  (newValue) => {
    sameAsShipping.value = newValue;
    toggleBilling();
  }
);

const toggleBilling = () => {
  if (sameAsShipping.value) {
    billingFirstName.value = firstName.value;
    billingLastName.value = lastName.value;
    billingAddress.value = { ...address.value };
  } else {
    billingFirstName.value = "";
    billingLastName.value = "";
    billingAddress.value = {
      streetAddress: "",
      secondaryAddress: "",
      city: "",
      state: "",
      ZIPCode: "",
    };
  }
  emit("update-same-as-shipping", sameAsShipping.value);
};

watch(sameAsShipping, (newValue) => {
  nextTick(() => {
    const billingInfo = document.querySelector(".billing-info");
    if (newValue) {
      billingInfo.style.height = "0";
    } else {
      billingInfo.style.height = `${billingInfo.scrollHeight}px`;
    }
  });
});
</script>

<style scoped>
.shipping-container {
  display: flex;
  flex-direction: column;
}

.name,
.location {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.location {
  grid-template-columns: repeat(3, 1fr);
}

h2 {
  margin: 2rem 0 20px;
  font-size: 24px;
}

form {
  display: flex;
  flex-direction: column;
}

.form-group {
  position: relative;
  margin-bottom: 20px;
  color: black;
  min-height: 3.7rem;
  overflow: visible;
}

.form-group input {
  width: 100%;
  padding: 10px;
  font-size: 15px;
  height: 3.5rem;
  /* border-radius: 10px; */
  border: 3px solid transparent;
  transition: border 0.3s;
  box-sizing: border-box;
}

.form-group input:focus {
  border-color: #3f654c;
  outline: none;
}

.form-group.input-filled input {
  padding-top: 24px;
}

.form-group input::placeholder {
  color: #3a3a3b;
}

.form-group label {
  position: absolute;
  left: 13px;
  top: 50px;
  opacity: 0;
  transition: opacity 0.2s, top 0.5s;
  pointer-events: none;
  font-size: 15px;
  color: #3a3a3b;
}

.form-group.input-filled label {
  top: 10px;
  font-size: 12px;
  opacity: 1;
}

.form-group.invalid input {
  border-color: red;
}

.error,
.popup {
  position: absolute;
  color: #f44336;
  text-align: left;
  /* border-radius: 6px; */
  z-index: 1;
  left: 0;
  top: -1.25rem;
}

/* .error::after,
.popup::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  border-width: 5px;
  border-style: solid;
  border-color: #f44336 transparent transparent transparent;
} */

.billing-checkbox {
  margin-top: 1rem;
  display: flex;
  align-items: center;
}

.billing-checkbox label {
  margin-left: 0.5rem;
  font-size: 1rem;
}

.billing-info {
  overflow: hidden;
  transition: height 0.3s ease;
  height: 0;
}

@media (max-width: 480px) {
  .error,
  .popup {
    font-size: 0.9rem;
  }
}
</style>
