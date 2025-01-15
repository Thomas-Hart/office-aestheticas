<template>
  <!--prettier-ignore-->
  <div>
    <form @submit.prevent="submitCheck()">
      <h2>Payment</h2>
      <div v-if="loading" class="loading">Loading... if this takes too long, refresh the page.</div>
      <div id="card-container" />
      <SubcomponentsLoadingButton :isLoading="isLoading" text="Pay Now" />
    </form>
    <!-- <div v-if="paymentStatus" id="payment-status-container">
      {{ paymentStatus }}
    </div> -->
  </div>
</template>

<script setup>
const appSandboxId = "sandbox-sq0idb-xegV-8lLjxxyJB-OHexXxg";
const appId = "sq0idp-CsjYCkUtwvN-1L_RyRjIOw";
// const sandboxLocationId = "L8P09136S9B9W";
const locationId = "LSGKY6WPMHNM8";
let card;
let loading = ref(true);
let paymentStatus = ref("");
const store = useItemStore();
const cartItems = store.cart;

onMounted(async () => {
  loading.value = true;
  await initializePaymentForm();
  loading.value = false;
});

useHead({
  script: [
    {
      src: "https://web.squarecdn.com/v1/square.js",
      type: "text/javascript",
      async: true,
    },
  ],
});

// Sandbox version
// useHead({
//   script: [
//     {
//       src: "https://sandbox.web.squarecdn.com/v1/square.js",
//       type: "text/javascript",
//       async: true,
//     },
//   ],
// });

let props = defineProps({
  formsValid: Boolean,
  userLocation: Object,
  isLoading: Boolean,
});

const emit = defineEmits([
  "orderRequest",
  "sendConfirmationEmail",
  "sendFailureEmail",
  "processOrder",
  "toggleLoadingTrue",
  "toggleLoadingFalse",
]);

const submitCheck = async () => {
  emit("toggleLoadingTrue");

  if (props.formsValid) {
    handlePaymentMethodSubmission(cartItems);
  }
};

const handlePaymentMethodSubmission = async (cartItems) => {
  paymentStatus.value = "";
  try {
    // Tokenize the card
    const token = await tokenize(card);
    console.log("Card tokenization successful:", token);

    // Make the API call
    const response = await $fetch("/api/squarePayment/pay", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        locationId,
        sourceId: token,
        cartItems,
        userLocation: props.userLocation,
      }),
    });

    // Parse the response
    const data = typeof response === "string" ? JSON.parse(response) : response;

    // Check payment status
    if (data?.payment?.status === "COMPLETED") {
      paymentStatus.value = "Payment completed";
      emit("sendConfirmationEmail");
      emit("processOrder");
    } else {
      console.warn("Payment failed or incomplete:", data);
      paymentStatus.value = "Payment failed";
    }
  } catch (error) {
    console.error("Error occurred during payment process:", error);

    // Display error to the user
    paymentStatus.value = "An error occurred while processing your payment.";
    emit("toggleLoadingFalse");
  }
};

const initializePaymentForm = async () => {
  if (!Square) {
    throw new Error("Square.js failed to load properly");
  }
  // Sandbox version
  // const payments = Square.payments(appSandboxId, locationId);
  const payments = Square.payments(appId, locationId);

  try {
    card = await payments.card();
    await card.attach("#card-container");
  } catch (e) {
    console.error("Initializing Card failed", e);
    return;
  }
};

const tokenize = async (paymentMethod) => {
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
};
</script>


<style scoped>
h2 {
  font-size: 24px;
  margin-top: 2rem;
  margin-bottom: 20px;
}

.loading {
  margin-bottom: 2rem;
}

#payment-status-container {
  width: fit-content;
  font-family: Arial, Helvetica, sans-serif;
  color: #ffffff;
  background: #1a1a1a;
  display: flex;
  padding: 12px;
  border-radius: 6px;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1), 0px 0px 4px rgba(0, 0, 0, 0.1);
  margin: auto;
  margin-top: 36px;
}

button {
  height: 3rem;
  font-size: 1.25rem;
  font-weight: bold;
}
</style>