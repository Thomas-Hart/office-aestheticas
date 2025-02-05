<template>
  <div class="amazonpay-checkout">
    <div v-if="loading" class="loading">
      Loading… if this takes too long, refresh the page.
    </div>
    <div id="amazon-pay-button-container"></div>
  </div>
</template>
  
  <script setup>
import { ref, onMounted, watch, defineProps, defineEmits } from "vue";
import { useRuntimeConfig } from "#app";

// Define the prop for the base order total.
const props = defineProps({
  totalAmount: { type: Number, required: true },
});

// (Optional) Emit an event for order completion.
const emit = defineEmits(["orderCompleted"]);

// State variables.
const loading = ref(true);
const amazonPayScriptLoaded = ref(false);

// Retrieve Amazon Pay settings from runtime config.
const runtimeConfig = useRuntimeConfig();
console.log(
  "Runtime config in component: " + JSON.stringify(runtimeConfig, null, 2)
);
const amazonPayMerchantId = runtimeConfig.public.AMAZON_PAY_SELLER_ID; // Seller and merchant IDs same
const amazonPayPublicKeyId = runtimeConfig.public.AMAZON_PAY_PUBLIC_KEY_ID;
const amazonPayStoreId = runtimeConfig.public.AMAZON_PAY_STORE_ID;
const checkoutReviewReturnUrl =
  runtimeConfig.public.AMAZON_PAY_CHECKOUT_RETURN_URL;
const ledgerCurrency = runtimeConfig.public.AMAZON_PAY_LEDGER_CURRENCY || "USD";
const amazonPayRegion = runtimeConfig.public.AMAZON_PAY_REGION || "US";
const amazonPaySandbox = runtimeConfig.public.AMAZON_PAY_SANDBOX || true;

// Function to dynamically load the Amazon Pay script.
function loadAmazonPayScript() {
  return new Promise((resolve, reject) => {
    if (document.getElementById("amazon-pay-script")) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src =
      amazonPayRegion === "JP"
        ? "https://static-fe.payments-amazon.com/checkout.js"
        : "https://static-na.payments-amazon.com/checkout.js";
    script.id = "amazon-pay-script";
    script.async = true;
    script.onload = () => {
      console.log("Amazon Pay script loaded successfully");
      resolve();
    };
    script.onerror = (err) => {
      console.error(
        "Error loading Amazon Pay script: " + JSON.stringify(err, null, 2)
      );
      reject(err);
    };
    document.head.appendChild(script);
  });
}

// Create the JSON payload for the Create Checkout Session API.
function generateCheckoutSessionPayload() {
  const payload = {
    webCheckoutDetails: {
      checkoutReviewReturnUrl: checkoutReviewReturnUrl,
    },
    storeId: amazonPayStoreId,
    scopes: ["name", "email", "phoneNumber", "billingAddress"],
  };
  console.log(
    "Generated checkout session payload: " + JSON.stringify(payload, null, 2)
  );
  return JSON.stringify(payload);
}

// Secure the payload by fetching its signature from the backend.
async function fetchSignature(payloadJSON) {
  try {
    console.log(
      "Fetching signature with payload: " + JSON.stringify(payloadJSON, null, 2)
    );
    const response = await fetch("/api/amazonpay/generateSignature", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload: payloadJSON }),
    });
    console.log(
      "Response from signature API: " +
        JSON.stringify(
          {
            status: response.status,
            ok: response.ok,
          },
          null,
          2
        )
    );
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        "Signature API error body: " + JSON.stringify(errorBody, null, 2)
      );
      throw new Error("Failed to fetch signature from server.");
    }
    const data = await response.json();
    console.log("Received signature data: " + JSON.stringify(data, null, 2));
    return data.signature;
  } catch (error) {
    console.error(
      "Error fetching signature: " +
        JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
    );
    throw error;
  }
}

// Render the Amazon Pay button.
async function renderAmazonPayButton() {
  try {
    // Load the Amazon Pay script if not already loaded.
    if (!amazonPayScriptLoaded.value) {
      await loadAmazonPayScript();
      amazonPayScriptLoaded.value = true;
    }
    // Generate payload and obtain signature.
    const payloadJSON = generateCheckoutSessionPayload();
    const signature = await fetchSignature(payloadJSON);
    console.log("Signature obtained: " + JSON.stringify(signature, null, 2));
    console.log("Total Amount: " + props.totalAmount.toFixed(2));

    // Render the Amazon Pay button.
    if (window.amazon && window.amazon.Pay) {
      amazon.Pay.renderButton("#amazon-pay-button-container", {
        merchantId: amazonPayMerchantId,
        publicKeyId: amazonPayPublicKeyId,
        ledgerCurrency: ledgerCurrency,
        checkoutLanguage: "en_US",
        productType: "PayAndShip",
        placement: "Cart",
        buttonColor: "Gold",
        estimatedOrderAmount: {
          amount: props.totalAmount.toFixed(2),
          currencyCode: ledgerCurrency,
        },
        createCheckoutSessionConfig: {
          payloadJSON: payloadJSON,
          signature: signature,
          algorithm: "AMZN-PAY-RSASSA-PSS-V2",
        },
        onError: (err) => {
          console.error(
            "Amazon Pay button error: " + JSON.stringify(err, null, 2)
          );
        },
      });
      console.log("Amazon Pay button rendered successfully.");
    } else {
      console.error(
        "Amazon Pay SDK is not available on window.amazon.Pay: " +
          JSON.stringify(window.amazon, null, 2)
      );
    }
  } catch (err) {
    console.error(
      "Error rendering Amazon Pay button: " +
        JSON.stringify(err, Object.getOwnPropertyNames(err), 2)
    );
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  renderAmazonPayButton();
});

// Re-render the button if the order total changes.
watch(
  () => props.totalAmount,
  () => {
    const container = document.getElementById("amazon-pay-button-container");
    if (container) {
      container.innerHTML = "";
      renderAmazonPayButton();
    }
  }
);
</script>
  
  <style scoped>
.amazonpay-checkout {
  width: 100%;
}
.loading {
  margin-bottom: 1rem;
}
</style>
  