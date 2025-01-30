<template>
  <div class="wrapper">
    <!-- prettier-ignore -->
    <div class="checkout-form">
      <div>
        <EcommerceCheckoutComponentsCheckoutContact
          @email-changed="updateUserEmail"
          @verify-email-changed="updateUserVerifyEmail"
          :invalid="invalidEmail"
        />
        <EcommerceCheckoutComponentsShipping
          @first-name-changed="updateFirstName"
          @last-name-changed="updateLastName"
          @address-changed="updateAddress"
          @billing-first-name-changed="updateBillingFirstName"
          @billing-last-name-changed="updateBillingLastName"
          @billing-address-changed="updateBillingAddress"
          :invalidAddress="invalidAddress"
          :invalidBillingAddress="invalidBillingAddress"
          :invalidFirstName="invalidFirstName"
          :invalidBillingFirstName="invalidBillingFirstName"
          :invalidLastName="invalidLastName"
          :invalidBillingLastName="invalidBillingLastName"
          :same-as-shipping="sameAsShipping"
          @update-same-as-shipping="updateSameAsShipping"
        />
        <EcommerceCheckoutComponentsSquarePaymentForm
          :formsValid="formsValid"
          :userLocation="shippingAddress"
          :isLoading="isLoading"
          @orderRequest="orderInfoIsValid()"
          @sendConfirmationEmail="sendConfirmationEmail()"
          @processOrder="processOrder()"
          @sendFailureEmail="sendFailureEmail()"
          @toggleLoadingTrue="toggleLoadingTrue()"
          @toggleLoadingFalse="toggleLoadingFalse()"
        />

        <!-- Divider -->
        <!-- <div class="divider">
          <span>Or pay with</span>
        </div> -->

        <!-- PayPal Button -->
        <div class="paypal-button">
          <EcommerceCheckoutComponentsPayPalButton
          :formsValid="formsValid"
          :userLocation="shippingAddress"
          :isLoading="isLoading"
          @validateForms="validateForms()"
          @sendConfirmationEmail="sendConfirmationEmail()"
          @processOrder="processOrder()"
          @sendFailureEmail="sendFailureEmail()"
          @toggleLoadingTrue="toggleLoadingTrue()"
          @toggleLoadingFalse="toggleLoadingFalse()"
        />
        </div>
      </div>
      <div>
        <EcommerceBasicCart :checkout="true" :userLocation="shippingAddress" />
      </div>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();
const itemStore = useItemStore();
const userStore = useUserStore();
const env = "NOT_CAT";

const formsValid = ref(false);
const isLoading = ref(false);

// Validation error messages
const invalidEmail = ref("");
const invalidAddress = ref("");
const invalidBillingAddress = ref("");
const invalidFirstName = ref("");
const invalidBillingFirstName = ref("");
const invalidLastName = ref("");
const invalidBillingLastName = ref("");

// Form fields
const userEmail = ref("");
const userVerifyEmail = ref("");
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

const pricingInfo = ref({
  originZIPCode: "84109",
  destinationZIPCode: "84097",
  weight: 1,
  length: 4,
  width: 4,
  height: 4,
  mailClass: "USPS_RETAIL_GROUND",
  priceType: "RETAIL",
});

const packageDescription = ref({
  weight: 1,
  length: 4,
  width: 4,
  height: 4,
  mailClass: "USPS_RETAIL_GROUND",
  rateIndicator: "SP",
  processingCategory: "MACHINABLE",
  destinationEntryFacilityType: "NONE",
  mailingData: "",
});

const labelFromAddress = ref({
  streetAddress: "1229 s 1100 e",
  city: "Orem",
  state: "UT",
  ZIPCode: "84097",
});

let accessToken;
if (env === "CAT") {
  const { data: catTokenData, error: catTokenError } = await useFetch(
    "/api/shipping/cat/cat-token",
    { method: "POST", headers: { "Content-Type": "application/json" } }
  );
  if (catTokenError?.value) {
    console.error("Error fetching CAT token:", catTokenError.value);
  }
  accessToken = catTokenData.value;
} else {
  const { data: tokenData, error: tokenError } = await useFetch(
    "/api/shipping/token",
    { method: "POST", headers: { "Content-Type": "application/json" } }
  );
  if (tokenError?.value) {
    console.error("Error fetching token:", tokenError.value);
  }
  accessToken = tokenData.value;
}

// -------------------- VALIDATION METHODS -------------------- //
function verifyEmailFormat(email) {
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return emailRegex.test(email);
}

function verifyZIPCode(zip) {
  // Basic check: 5 digit ZIP code
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
    const fetchURL =
      env === "CAT"
        ? "/api/shipping/cat/cat-verify-address"
        : "/api/shipping/verify-address";
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

// Centralized form validation
async function validateForms() {
  // Reset errors
  invalidEmail.value = "";
  invalidAddress.value = "";
  invalidBillingAddress.value = "";
  invalidFirstName.value = "";
  invalidBillingFirstName.value = "";
  invalidLastName.value = "";
  invalidBillingLastName.value = "";

  // Start with synchronous validations
  let invalidField = false;

  // Check email
  if (!verifyEmailFormat(userEmail.value)) {
    invalidEmail.value = "Email format is not valid";
    invalidField = true;
  } else if (userEmail.value !== userVerifyEmail.value) {
    invalidEmail.value = "Emails do not match";
    invalidField = true;
  }

  // Check names
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

  // Check ZIP codes (synchronous)
  if (!verifyZIPCode(shippingAddress.value.ZIPCode)) {
    invalidAddress.value = "Invalid shipping ZIP code";
    invalidField = true;
  }
  if (!sameAsShipping.value && !verifyZIPCode(billingAddress.value.ZIPCode)) {
    invalidBillingAddress.value = "Invalid billing ZIP code";
    invalidField = true;
  }

  // If anything failed so far, skip address verification
  if (invalidField) {
    formsValid.value = false;
    return false;
  }

  // Async address verification only if all above checks passed
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

  // If we reach here, all validations passed
  formsValid.value = true;
  return true;
}

async function processOrderPaypal(order) {
  billingAddress.value.firstName = billingFirstName.value;
  billingAddress.value.lastName = billingLastName.value;

  const labelToAddress = { ...shippingAddress.value };
  labelToAddress.firstName = firstName.value;
  labelToAddress.lastName = lastName.value;
  labelToAddress.email = userEmail.value;

  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}-${String(
    currentDate.getMonth() + 1
  ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

  const taxInfo = {
    invoiceNumber: "",
    orderDate: formattedDate,
    totalCost: 0,
    itemizedList: itemStore.cart.map((item) => ({
      itemId: item.itemId || item._id || item.id,
      variantId: item.variantId || null,
      variantDetails: item.variantDetails || {},
      image: item.image,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
    salesTax: 0,
    salesTaxRate: 0,
    buyersBillingAddress: billingAddress.value,
    buyersShippingAddress: shippingAddress.value,
    sellersBusinessInformation: {
      businessName: "National Auto Hub",
      address: labelFromAddress.value,
      taxIDNum: 0,
    },
    paymentMethod: "CARD",
    status: "Pending",
    userId: userStore.user?._id || null,
    shippedDate: null,
    expectedDeliveryDate: null,
    deliveryDate: null,
    trackingNumber: "",
  };

  try {
    const taxResponse = await $fetch("/api/tax", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: taxInfo,
    });

    const orderId = taxResponse._id;
    if (!orderId) throw new Error("Order ID not found in tax response.");

    itemStore.clearCart();

    try {
      const currentUser = userStore.user;
      if (currentUser) {
        const updatedUser = { ...currentUser, cart: [] };
        await $fetch(`/api/users/${currentUser._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: updatedUser,
        });
      }
    } catch (error) {
      console.error("Error clearing user cart:", error);
    }

    router.push({ path: `/order/${orderId}` });
  } catch (error) {
    console.log("Error posting label info: ", error);
  }
}

// -------------------- ORDER & EMAIL METHODS -------------------- //
async function processOrderCustom() {
  billingAddress.value.firstName = billingFirstName.value;
  billingAddress.value.lastName = billingLastName.value;

  const labelToAddress = { ...shippingAddress.value };
  labelToAddress.firstName = firstName.value;
  labelToAddress.lastName = lastName.value;
  labelToAddress.email = userEmail.value;

  try {
    await $fetch("/api/shipping/label", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toAddress: labelToAddress,
        fromAddress: labelFromAddress.value,
        packageDescription: packageDescription.value,
      }),
    });
  } catch (error) {
    console.log("Error posting label info: ", error);
  }

  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}-${String(
    currentDate.getMonth() + 1
  ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

  const taxInfo = {
    invoiceNumber: "",
    orderDate: formattedDate,
    totalCost: 0,
    itemizedList: itemStore.cart.map((item) => ({
      itemId: item.itemId || item._id || item.id,
      variantId: item.variantId || null,
      variantDetails: item.variantDetails || {},
      image: item.image,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
    salesTax: 0,
    salesTaxRate: 0,
    buyersBillingAddress: billingAddress.value,
    buyersShippingAddress: shippingAddress.value,
    sellersBusinessInformation: {
      businessName: "National Auto Hub",
      address: labelFromAddress.value,
      taxIDNum: 0,
    },
    paymentMethod: "CARD",
    status: "Pending",
    userId: userStore.user?._id || null,
    shippedDate: null,
    expectedDeliveryDate: null,
    deliveryDate: null,
    trackingNumber: "",
  };

  try {
    const taxResponse = await $fetch("/api/tax", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: taxInfo,
    });

    const orderId = taxResponse._id;
    if (!orderId) throw new Error("Order ID not found in tax response.");

    itemStore.clearCart();

    try {
      const currentUser = userStore.user;
      if (currentUser) {
        const updatedUser = { ...currentUser, cart: [] };
        await $fetch(`/api/users/${currentUser._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: updatedUser,
        });
      }
    } catch (error) {
      console.error("Error clearing user cart:", error);
    }

    router.push({ path: `/order/${orderId}` });
  } catch (error) {
    console.log("Error posting label info: ", error);
  }
}

async function sendFailureEmail() {
  try {
    const response = await fetch(
      "https://jf32m0961a.execute-api.us-east-2.amazonaws.com/first/send-custom-email",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: userEmail.value,
          from: "beau@nationalautohub.com",
          message:
            "There was a problem processing your order. Please try again. If this continues, please contact us through the contact page on our website.",
          company: "National Auto Hub",
        }),
      }
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  } catch (error) {
    console.log("Error in sendFailureEmail()");
  }
}

// Uncomment when this works again
async function sendConfirmationEmail(order) {
  // try {
  //   const response = await fetch(
  //     "https://jf32m0961a.execute-api.us-east-2.amazonaws.com/first/send-custom-email",
  //     {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         to: userEmail.value,
  //         from: "beau@nationalautohub.com",
  //         message:
  //           "Your order has been placed! Order details will be sent after your order is processed.",
  //         company: "National Auto Hub",
  //       }),
  //     }
  //   );
  //   if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  // } catch (error) {
  //   console.log("Error in sendConfirmationEmail()");
  // }
}

// -------------------- INPUT UPDATE HANDLERS -------------------- //
// Each update method resets related errors and re-validates
const updateUserEmail = (newEmail) => {
  userEmail.value = newEmail;
  validateForms();
};
const updateUserVerifyEmail = (newVerifyEmail) => {
  userVerifyEmail.value = newVerifyEmail;
  validateForms();
};
const updateFirstName = (newFirstName) => {
  firstName.value = newFirstName;
  shippingAddress.value.firstName = newFirstName;
  if (sameAsShipping.value) billingAddress.value.firstName = newFirstName;
  validateForms();
};
const updateLastName = (newLastName) => {
  lastName.value = newLastName;
  shippingAddress.value.lastName = newLastName;
  if (sameAsShipping.value) billingAddress.value.lastName = newLastName;
  validateForms();
};
const updateAddress = (newAddress) => {
  shippingAddress.value = newAddress;
  if (sameAsShipping.value) billingAddress.value = { ...newAddress };
  validateForms();
};
const updateBillingFirstName = (newFirstName) => {
  billingFirstName.value = newFirstName;
  validateForms();
};
const updateBillingLastName = (newLastName) => {
  billingLastName.value = newLastName;
  validateForms();
};
const updateBillingAddress = (newAddress) => {
  billingAddress.value = newAddress;
  validateForms();
};
const updateSameAsShipping = (value) => {
  sameAsShipping.value = value;
  if (value) billingAddress.value = { ...shippingAddress.value };
  validateForms();
};

// Loading toggles
const toggleLoadingTrue = () => {
  isLoading.value = true;
};
const toggleLoadingFalse = () => {
  isLoading.value = false;
};

// Optional shipping price check (not required for validation)
async function getShippingPrice() {
  const filteredPricingInfo = Object.fromEntries(
    Object.entries(pricingInfo.value).filter(([_, val]) => val !== "")
  );
  try {
    const response = await $fetch("/api/shipping/get-price", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { pricingInfo: filteredPricingInfo, accessToken },
    });
    // console.log("Shipping Price: ", response.rateOptions[0].totalBasePrice);
  } catch (error) {
    console.error("Error verifying address:", error);
  }
}
</script>

<style scoped>
.wrapper {
  max-width: 1300px;
  margin: 0 auto;
  padding: 2rem;
}

.checkout-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 2rem;
  padding: 3rem;
  color: white;
  height: auto;
  background: rgba(58, 58, 59, 0.95);
  border-radius: 0px;
  /* box-shadow: 0px 0px 2px rgba(255, 255, 255, 1); */
}

.divider {
  display: flex;
  align-items: center;
  margin: 2rem 0;
  text-align: center;
}

.divider span {
  flex: 1;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  border-top: 1px solid rgba(255, 255, 255, 0.5);
  line-height: 0.1rem;
  margin: 0 1rem;
}

.divider span::before,
.divider span::after {
  content: "";
  flex: 1;
  border-top: 1px solid rgba(255, 255, 255, 0.5);
}

.paypal-button {
  text-align: center;
}

.paypal img {
  width: auto;
  height: 50px;
}

.paypal {
  background: none;
  border: none;
  cursor: pointer;
}

@media (max-width: 768px) {
  .wrapper {
    padding: 0;
  }

  .checkout-form {
    display: flex;
    flex-direction: column-reverse;
    padding: 1rem;
    border-radius: 0;
    height: 100%;
    box-shadow: none;
    margin-bottom: 5rem;
  }

  .checkout-form > div:first-child {
    flex: 1 1 auto;
  }

  .checkout-form > div:last-child {
    flex: 0 0 auto;
  }
}
</style>
