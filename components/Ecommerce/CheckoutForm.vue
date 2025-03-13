<template>
  <div class="wrapper">
    <div class="checkout-form">
      <!-- CONTACT SECTION -->
      <div class="email-container">
        <h2>Contact</h2>
        <!-- Email -->
        <div
          class="form-group"
          :class="{ invalid: invalidEmail, 'has-text': userEmail.length > 0 }"
        >
          <label for="email">Email</label>
          <input type="email" id="email" v-model="userEmail" required />
          <div class="error" v-if="invalidEmail">{{ invalidEmail }}</div>
        </div>

        <!-- Optional Phone -->
        <div class="form-group" :class="{ 'has-text': phoneNumber.length > 0 }">
          <label for="phone">Phone (optional)</label>
          <input type="text" id="phone" v-model="phoneNumber" placeholder="" />
        </div>
      </div>

      <!-- SHIPPING / BILLING SECTION -->
      <div class="shipping-container">
        <h2>Shipping</h2>
        <form class="shipping-form">
          <div class="name">
            <div
              class="form-group"
              :class="{
                invalid: invalidFirstName,
                'has-text': firstName.length > 0,
              }"
            >
              <label for="firstName">First Name (optional)</label>
              <input type="text" id="firstName" v-model="firstName" required />
              <div class="error" v-if="invalidFirstName">
                {{ invalidFirstName }}
              </div>
            </div>
            <div
              class="form-group"
              :class="{
                invalid: invalidLastName,
                'has-text': lastName.length > 0,
              }"
            >
              <label for="lastName">Last Name</label>
              <input type="text" id="lastName" v-model="lastName" required />
              <div class="error" v-if="invalidLastName">
                {{ invalidLastName }}
              </div>
            </div>
          </div>

          <div class="address">
            <div
              class="form-group"
              :class="{
                invalid: invalidAddress,
                'has-text': shippingAddress.streetAddress.length > 0,
              }"
            >
              <label for="streetAddress">Address</label>
              <input
                type="text"
                id="streetAddress"
                v-model="shippingAddress.streetAddress"
                required
              />
              <div class="error" v-if="invalidAddress">
                {{ invalidAddress }}
              </div>
            </div>
          </div>

          <div class="secondary-address">
            <div
              class="form-group"
              :class="{
                'has-text': shippingAddress.secondaryAddress.length > 0,
              }"
            >
              <label for="secondaryAddress">
                Apartment, suite, etc. (optional)
              </label>
              <input
                type="text"
                id="secondaryAddress"
                v-model="shippingAddress.secondaryAddress"
                required
              />
            </div>
          </div>

          <div class="location">
            <div
              class="form-group"
              :class="{ 'has-text': shippingAddress.city.length > 0 }"
            >
              <label for="city">City</label>
              <input
                type="text"
                id="city"
                v-model="shippingAddress.city"
                required
              />
              <div class="error" v-if="invalidCity">{{ invalidCity }}</div>
            </div>
            <!-- State dropdown -->
            <div
              class="form-group"
              :class="{ 'has-text': shippingAddress.state.length > 0 }"
            >
              <label for="state">State</label>
              <select id="state" v-model="shippingAddress.state" required>
                <option v-for="st in usStates" :key="st" :value="st">
                  {{ st }}
                </option>
              </select>
              <div class="error" v-if="invalidState">{{ invalidState }}</div>
            </div>
            <div
              class="form-group"
              :class="{ 'has-text': shippingAddress.ZIPCode.length > 0 }"
            >
              <label for="zip">ZIP code</label>
              <input
                type="text"
                id="zip"
                v-model="shippingAddress.ZIPCode"
                required
              />
            </div>
          </div>

          <!-- Checkbox to toggle billing info -->
          <div class="billing-checkbox">
            <input
              type="checkbox"
              id="sameAsShipping"
              v-model="sameAsShipping"
              @change="handleSameAsShipping()"
            />
            <label for="sameAsShipping">
              Billing info is the same as shipping info
            </label>
          </div>

          <!-- Billing info toggles with fade transition -->
          <transition name="fade">
            <div v-show="!sameAsShipping" class="billing-info">
              <h2>Billing</h2>
              <div class="name">
                <div
                  class="form-group"
                  :class="{
                    invalid: invalidBillingFirstName,
                    'has-text': billingFirstName.length > 0,
                  }"
                >
                  <label for="billingFirstName">First Name</label>
                  <input
                    type="text"
                    id="billingFirstName"
                    v-model="billingFirstName"
                    required
                  />
                  <div class="error" v-if="invalidBillingFirstName">
                    {{ invalidBillingFirstName }}
                  </div>
                </div>
                <div
                  class="form-group"
                  :class="{
                    invalid: invalidBillingLastName,
                    'has-text': billingLastName.length > 0,
                  }"
                >
                  <label for="billingLastName">Last Name</label>
                  <input
                    type="text"
                    id="billingLastName"
                    v-model="billingLastName"
                    required
                  />
                  <div class="error" v-if="invalidBillingLastName">
                    {{ invalidBillingLastName }}
                  </div>
                </div>
              </div>

              <div class="address">
                <div
                  class="form-group"
                  :class="{
                    invalid: invalidBillingAddress,
                    'has-text': billingAddress.streetAddress.length > 0,
                  }"
                >
                  <label for="billingStreetAddress">Street Address</label>
                  <input
                    type="text"
                    id="billingStreetAddress"
                    v-model="billingAddress.streetAddress"
                    required
                  />
                  <div class="error" v-if="invalidBillingAddress">
                    {{ invalidBillingAddress }}
                  </div>
                </div>
              </div>

              <div class="secondary-address">
                <div
                  class="form-group"
                  :class="{
                    'has-text': billingAddress.secondaryAddress.length > 0,
                  }"
                >
                  <label for="billingSecondaryAddress">Secondary Address</label>
                  <input
                    type="text"
                    id="billingSecondaryAddress"
                    v-model="billingAddress.secondaryAddress"
                    required
                  />
                </div>
              </div>

              <div class="location">
                <div
                  class="form-group"
                  :class="{ 'has-text': billingAddress.city.length > 0 }"
                >
                  <label for="billingCity">City</label>
                  <input
                    type="text"
                    id="billingCity"
                    v-model="billingAddress.city"
                    required
                  />
                  <div class="error" v-if="invalidBillingCity">
                    {{ invalidBillingCity }}
                  </div>
                </div>
                <!-- Billing state dropdown -->
                <div
                  class="form-group"
                  :class="{ 'has-text': billingAddress.state.length > 0 }"
                >
                  <label for="billingState">State</label>
                  <select
                    id="billingState"
                    v-model="billingAddress.state"
                    required
                  >
                    <option value="" disabled>Select state</option>
                    <option v-for="st in usStates" :key="st" :value="st">
                      {{ st }}
                    </option>
                  </select>
                  <div class="error" v-if="invalidBillingState">
                    {{ invalidBillingState }}
                  </div>
                </div>
                <div
                  class="form-group"
                  :class="{ 'has-text': billingAddress.ZIPCode.length > 0 }"
                >
                  <label for="billingZIP">Zip</label>
                  <input
                    type="text"
                    id="billingZIP"
                    v-model="billingAddress.ZIPCode"
                    required
                  />
                </div>
              </div>
            </div>
          </transition>
        </form>
      </div>

      <!-- SQUARE PAYMENT SECTION -->
      <div>
        <form @submit.prevent="submitCheck">
          <h2>Payment</h2>
          <div v-if="paymentFormLoading" class="loading">
            Loading... if this takes too long, refresh the page.
          </div>
          <div id="card-container" />
          <!-- Gray box reminder -->
          <div class="review-reminder">
            Please review your information before clicking
            <strong>Pay Now</strong>.
          </div>

          <!-- Pay Now button with spinner when isLoading is true -->
          <button type="submit" :disabled="isLoading" class="pay-btn">
            <span v-if="!isLoading">Pay Now</span>
            <span v-else class="spinner">
              <i class="spinner-icon"></i>
              Processing...
            </span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  script: [
    {
      src: "https://web.squarecdn.com/v1/square.js",
      type: "text/javascript",
      async: true,
    },
  ],
});

const config = useRuntimeConfig();

const formsValid = ref(false);
const isLoading = ref(false);

// Validation errors
const invalidEmail = ref("");
const invalidAddress = ref("");
const invalidBillingAddress = ref("");
const invalidFirstName = ref("");
const invalidBillingFirstName = ref("");
const invalidLastName = ref("");
const invalidBillingLastName = ref("");
const invalidCity = ref("");
const invalidState = ref("");
const invalidBillingCity = ref("");
const invalidBillingState = ref("");

// Form fields
const userEmail = ref("");
const phoneNumber = ref("");
const firstName = ref("");
const billingFirstName = ref("");
const lastName = ref("");
const billingLastName = ref("");
const shippingAddress = ref({
  streetAddress: "",
  secondaryAddress: "",
  city: "",
  state: "",
  urbanization: "",
  ZIPCode: "",
  ZIPPlus4: "",
});
const billingAddress = ref({
  streetAddress: "",
  secondaryAddress: "",
  city: "",
  state: "",
  urbanization: "",
  ZIPCode: "",
  ZIPPlus4: "",
});
const sameAsShipping = ref(true);

const props = defineProps({
  cartItems: Object,
});

const emit = defineEmits("orderCompleted");

let accessToken;
const { data: tokenData, error: tokenError } = await useFetch(
  "/api/shipping/token",
  { method: "POST", headers: { "Content-Type": "application/json" } }
);
if (tokenError?.value) {
  console.error("Error fetching token:", tokenError.value);
}
accessToken = tokenData.value;

const usStates = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

let card;
const paymentFormLoading = ref(true);
const paymentStatus = ref("");

onMounted(async () => {
  paymentFormLoading.value = true;
  await initializePaymentForm();
  paymentFormLoading.value = false;
});

watch(
  shippingAddress,
  (newVal) => {
    if (sameAsShipping.value) {
      billingAddress.value = { ...newVal };
    }
  },
  { deep: true }
);

watch(firstName, (newVal) => {
  if (sameAsShipping.value) {
    billingFirstName.value = newVal;
  }
});
watch(lastName, (newVal) => {
  if (sameAsShipping.value) {
    billingLastName.value = newVal;
  }
});

function handleSameAsShipping() {
  if (sameAsShipping.value) {
    billingAddress.value = { ...shippingAddress.value };
    billingFirstName.value = firstName.value;
    billingLastName.value = lastName.value;
  }
}

function processOrder() {}
function toggleLoadingTrue() {
  isLoading.value = true;
}
function toggleLoadingFalse() {
  isLoading.value = false;
}

function verifyEmailFormat(email) {
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return emailRegex.test(email);
}
function verifyZIPCode(zip) {
  return /^[0-9]{5}$/.test(zip);
}

async function verifySingleAddress(address) {
  if (!address.streetAddress || !verifyZIPCode(address.ZIPCode)) {
    return false;
  }

  const filteredAddress = Object.fromEntries(
    Object.entries(address).filter(([_, val]) => val)
  );

  try {
    const fetchURL = "/api/shipping/verify-address";
    const response = await $fetch(fetchURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { address: filteredAddress, accessToken },
    });
    return response?.additionalInfo?.DPVConfirmation === "Y";
  } catch (error) {
    console.error("Error verifying address:", error);
    return false;
  }
}

async function validateForms() {
  invalidEmail.value = "";
  invalidAddress.value = "";
  invalidBillingAddress.value = "";
  invalidFirstName.value = "";
  invalidBillingFirstName.value = "";
  invalidLastName.value = "";
  invalidBillingLastName.value = "";
  invalidCity.value = "";
  invalidState.value = "";
  invalidBillingCity.value = "";
  invalidBillingState.value = "";

  let invalidField = false;

  if (!verifyEmailFormat(userEmail.value)) {
    invalidEmail.value = "Email format is not valid";
    invalidField = true;
  }

  if (!firstName.value) {
    invalidFirstName.value = "Missing first name";
    invalidField = true;
  }
  if (!lastName.value) {
    invalidLastName.value = "Missing last name";
    invalidField = true;
  }
  if (!billingFirstName.value) {
    invalidBillingFirstName.value = "Missing first name";
    invalidField = true;
  }
  if (!billingLastName.value) {
    invalidBillingLastName.value = "Missing last name";
    invalidField = true;
  }

  if (!verifyZIPCode(shippingAddress.value.ZIPCode)) {
    invalidAddress.value = "Invalid shipping ZIP code";
    invalidField = true;
  }
  if (!shippingAddress.value.city) {
    invalidCity.value = "Missing city";
    invalidField = true;
  }
  if (!shippingAddress.value.state) {
    invalidState.value = "Missing state";
    invalidField = true;
  }
  if (!sameAsShipping.value && !verifyZIPCode(billingAddress.value.ZIPCode)) {
    invalidBillingAddress.value = "Invalid billing ZIP code";
    invalidField = true;
  }
  if (!sameAsShipping.value) {
    if (!billingAddress.value.city) {
      invalidBillingCity.value = "Missing city";
      invalidField = true;
    }
    if (!billingAddress.value.state) {
      invalidBillingState.value = "Missing state";
      invalidField = true;
    }
  }

  if (invalidField) {
    formsValid.value = false;
    return false;
  }

  const shippingValid = await verifySingleAddress(shippingAddress.value);
  if (!shippingValid) {
    invalidAddress.value = "Invalid shipping address";
    formsValid.value = false;
    return false;
  }

  if (!sameAsShipping.value) {
    const billingValid = await verifySingleAddress(billingAddress.value);
    if (!billingValid) {
      invalidBillingAddress.value = "Invalid billing address";
      formsValid.value = false;
      return false;
    }
  }

  formsValid.value = true;
  return true;
}

const submitCheck = async () => {
  toggleLoadingTrue();
  const isValid = await validateForms();
  if (!isValid) {
    toggleLoadingFalse();
    return;
  }
  await handlePaymentMethodSubmission(props.cartItems);
};

async function initializePaymentForm() {
  if (!window.Square) {
    throw new Error("Square.js failed to load properly");
  }
  const payments = Square.payments(
    config.public.SQUARE_APP_ID,
    config.public.SQUARE_LOCATION_ID
  );

  try {
    card = await payments.card();
    await card.attach("#card-container");
  } catch (e) {
    console.error("Initializing Card failed", e);
  }
}

async function tokenize(paymentMethod) {
  const tokenResult = await paymentMethod.tokenize();
  if (tokenResult.status === "OK") {
    return tokenResult.token;
  } else {
    let errorMessage = `Tokenization failed with status: ${tokenResult.status}`;
    if (tokenResult.errors) {
      errorMessage += ` and errors: ${JSON.stringify(tokenResult.errors)}`;
    }
    throw new Error(errorMessage);
  }
}

async function handlePaymentMethodSubmission(cartItems) {
  paymentStatus.value = "";
  try {
    const token = await tokenize(card);
    const locationId = config.public.SQUARE_LOCATION_ID;
    const response = await $fetch("/api/squarePayment/pay", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        locationId,
        sourceId: token,
        cartItems,
        userLocation: shippingAddress.value.ZIPCode,
      }),
    });

    const squareOrder =
      typeof response === "string" ? JSON.parse(response) : response;

    if (squareOrder?.payment?.status === "COMPLETED") {
      paymentStatus.value = "Payment completed";
      emit("orderCompleted", normalizeOrder(squareOrder));
    } else {
      paymentStatus.value = "Payment failed";
    }
  } catch (error) {
    console.error("Error occurred during payment process:", error);
    paymentStatus.value = "An error occurred while processing your payment.";
    toggleLoadingFalse();
  }
}

function normalizeOrder(squareOrder) {
  return {
    invoiceNumber: squareOrder.payment.id,
    paymentMethod: "SQUARE",
    orderDate: new Date().toISOString(),
    totalCost: (squareOrder.payment.totalMoney.amount / 100).toFixed(2),
    buyersShippingAddress: {
      firstName: firstName.value,
      lastName: lastName.value,
      streetAddress: shippingAddress.value.streetAddress,
      secondaryAddress: shippingAddress.value.secondaryAddress,
      city: shippingAddress.value.city,
      state: shippingAddress.value.state,
      ZIPCode: shippingAddress.value.ZIPCode,
      country_code: "USA",
    },
    associatedEmail: userEmail.value,
    rawOrder: squareOrder,
  };
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.wrapper {
  max-width: 600px;
  margin: 0 auto;
}

.checkout-form {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  color: #000000;
}

.email-container,
.shipping-container {
  padding: 0;
}

h2 {
  font-size: 22px;
  margin: 1rem 0 0.75rem 0;
  color: #000000;
  font-family: "Source Sans Pro", Arial, Helvetica, sans-serif;
  font-weight: 600;
}

.review-reminder {
  background-color: #f0f0f0;
  color: #333;
  padding: 0.75rem;
  margin: 1rem 0;
  border-radius: 4px;
  font-size: 14px;
  font-family: "Source Sans Pro", Arial, Helvetica, sans-serif;
}

.form-group {
  position: relative;
  margin-bottom: 0.75rem;
  height: 50px;
}

.form-group input,
.form-group select {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  line-height: 60px;
  padding: 0 12px;
  font-size: 13px;
  font-family: "Source Sans Pro", Arial, Helvetica, sans-serif;
  color: #000;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: #fff;
  transition: 0.2s ease all;
}

.form-group.has-text input,
.form-group.has-text select {
  line-height: 12px;
  padding-top: 16px;
  border-color: #66afe9;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #66afe9;
  outline: none;
}

.form-group label {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: #777;
  pointer-events: none;
  transition: 0.2s ease all;
  font-family: "Source Sans Pro", Arial, Helvetica, sans-serif;
  z-index: 2;
}

.form-group.has-text label {
  top: 8px;
  transform: none;
  font-size: 12px;
  color: #555;
}

.form-group.invalid input,
.form-group.invalid select {
  border-color: #f44336;
}
.form-group.invalid {
  margin-bottom: 1.5rem;
}

.error {
  position: absolute;
  bottom: -18px;
  left: 2px;
  font-size: 12px;
  color: #f44336;
  font-family: "Source Sans Pro", Arial, Helvetica, sans-serif;
}

.shipping-form {
  display: flex;
  flex-direction: column;
}

.name,
.location {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.location {
  grid-template-columns: repeat(3, 1fr);
}

.billing-checkbox {
  margin-top: 16px;
  display: flex;
  align-items: center;
}

.billing-checkbox label {
  margin-left: 8px;
  font-size: 14px;
  color: #000000;
  font-family: "Source Sans Pro", Arial, Helvetica, sans-serif;
}

.billing-info {
  overflow: hidden;
}

@media (max-width: 480px) {
  .name,
  .location {
    grid-template-columns: 1fr;
  }
  .error {
    font-size: 0.9rem;
  }
}

.loading {
  margin-bottom: 2rem;
  color: #000;
  font-family: "Source Sans Pro", Arial, Helvetica, sans-serif;
}

#payment-status-container {
  width: fit-content;
  font-family: "Source Sans Pro", Arial, Helvetica, sans-serif;
  color: #000000;
  background: #f0f0f0;
  display: flex;
  padding: 12px;
  border-radius: 4px;
  margin: auto;
  margin-top: 36px;
}

button {
  height: 44px;
  font-size: 14px;
  font-weight: 400;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-family: "Source Sans Pro", Arial, Helvetica, sans-serif;
}

button:hover {
  background-color: #0056b3;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.pay-btn {
  width: 100%;
}

.spinner {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
.spinner-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #fff;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spinner 0.6s linear infinite;
  margin-bottom: -2px;
}

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}
</style>
