<template>
  <div class="amazon-checkout">
    <div v-if="loading" class="loading">
      Loading… if this takes too long, refresh the page.
    </div>
    <div id="amazon-button-container"></div>
  </div>
</template>
  
  <script setup>
// Define the prop so that the component receives the base order total from its parent.
const props = defineProps({
  totalAmount: { type: Number, required: true },
});

// Define the emit for when the order is successfully processed.
const emit = defineEmits(["orderCompleted"]);

const loading = ref(true);
const amazonReady = ref(false);
const taxPatched = ref(false); // flag to ensure tax is patched only once per order

// Function to convert the raw Amazon Pay order data into a universal structure.
function normalizeOrder(amazonOrder) {
  return {
    orderId: amazonOrder.orderReferenceId,
    paymentMethod: "AMAZON_PAY",
    orderDate: new Date().toISOString(),
    totalCost: parseFloat(
      amazonOrder.finalAmount || props.totalAmount.toFixed(2)
    ),
    buyersShippingAddress: {
      firstName:
        amazonOrder.shippingAddress && amazonOrder.shippingAddress.Name
          ? amazonOrder.shippingAddress.Name.split(" ")[0]
          : "",
      lastName:
        amazonOrder.shippingAddress && amazonOrder.shippingAddress.Name
          ? amazonOrder.shippingAddress.Name.split(" ")[1]
          : "",
      streetAddress: amazonOrder.shippingAddress
        ? amazonOrder.shippingAddress.AddressLine1
        : "",
      secondaryAddress: amazonOrder.shippingAddress
        ? amazonOrder.shippingAddress.AddressLine2
        : "",
      city: amazonOrder.shippingAddress ? amazonOrder.shippingAddress.City : "",
      state: amazonOrder.shippingAddress
        ? amazonOrder.shippingAddress.StateOrRegion
        : "",
      ZIPCode: amazonOrder.shippingAddress
        ? amazonOrder.shippingAddress.PostalCode
        : "",
      country_code: amazonOrder.shippingAddress
        ? amazonOrder.shippingAddress.CountryCode
        : "",
    },
    associatedEmail: amazonOrder.buyerEmail || "",
    rawOrder: amazonOrder,
  };
}

/**
 * Calls your tax API using the expected property names.
 * We send:
 *  - totalCost: the base total from props.totalAmount
 *  - userLocation: the shipping address from Amazon Pay
 */
async function fetchTax(shippingAddress) {
  try {
    console.log(
      "Fetching tax. Shipping address received:",
      JSON.stringify(shippingAddress, null, 2)
    );
    const response = await fetch("/api/tax/salesTax", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        totalCost: props.totalAmount,
        userLocation: shippingAddress,
      }),
    });
    console.log("Tax API response status:", response.status);
    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Tax API error body:", errorBody);
      throw new Error("Tax API returned an error");
    }
    const taxResponse = await response.json();
    console.log("Tax API returned data:", JSON.stringify(taxResponse, null, 2));
    return taxResponse;
  } catch (error) {
    console.error("Error fetching tax:", error);
    throw error;
  }
}

/**
 * Loads the Amazon Pay script dynamically.
 */
function loadAmazonScript() {
  return new Promise((resolve, reject) => {
    if (document.getElementById("amazon-pay-script")) {
      return resolve(window.OffAmazonPayments);
    }
    const script = document.createElement("script");
    script.id = "amazon-pay-script";
    script.src =
      "https://static-na.payments-amazon.com/OffAmazonPayments/us/js/Widgets.js";
    script.async = true;
    script.onload = () => resolve(window.OffAmazonPayments);
    script.onerror = () => reject(new Error("Failed to load Amazon Pay SDK"));
    document.head.appendChild(script);
  });
}

/**
 * Renders the Amazon Pay button using the Amazon Pay JavaScript API.
 * This example uses OffAmazonPayments.Widgets.Button to mimic the checkout flow.
 */
function renderAmazonButton() {
  if (!amazonReady.value) {
    console.warn("Amazon Pay SDK not ready. Aborting button render.");
    return;
  }

  new window.OffAmazonPayments.Widgets.Button({
    sellerId: "YOUR_AMAZON_PAY_SELLER_ID", // Replace with your actual Seller ID
    design: {
      size: "large",
      color: "Gold",
      type: "PwA", // Pay with Amazon style button
    },
    onClick: function (orderReference) {
      console.log(
        "Amazon Pay button clicked. Order reference:",
        orderReference
      );
      // Reset the tax patch flag for a new order.
      taxPatched.value = false;
      // Create order reference on your backend if necessary.
    },
    onAddressSelect: function (orderReference) {
      console.log(
        "onAddressSelect triggered for order:",
        orderReference.getAmazonOrderReferenceId()
      );
      orderReference.getAddress((response) => {
        if (response.success) {
          const shippingAddress = response.address;
          console.log(
            "Shipping address received:",
            JSON.stringify(shippingAddress, null, 2)
          );
          if (!taxPatched.value) {
            fetchTax(shippingAddress)
              .then((taxResponse) => {
                const taxAmount = Number(taxResponse);
                const baseTotal = props.totalAmount;
                const finalTotal = baseTotal + taxAmount;
                console.log(
                  "Order will be updated with final total:",
                  finalTotal.toFixed(2),
                  "(base:",
                  baseTotal.toFixed(2),
                  "tax:",
                  taxAmount.toFixed(2),
                  ")"
                );
                // Update order details via your backend or Amazon Pay's API.
                taxPatched.value = true;
              })
              .catch((err) => {
                console.error("Error during tax update:", err);
              });
          }
        } else {
          console.error("Failed to retrieve shipping address", response);
        }
      });
    },
    onPaymentSelect: function (orderReference) {
      console.log(
        "onPaymentSelect triggered for order:",
        orderReference.getAmazonOrderReferenceId()
      );
      // Simulate order capture. In production, call your backend to capture the order.
      const simulatedAmazonOrder = {
        orderReferenceId: orderReference.getAmazonOrderReferenceId(),
        finalAmount: props.totalAmount.toFixed(2),
        shippingAddress: {
          AddressLine1: "123 Main St",
          AddressLine2: "",
          City: "Seattle",
          StateOrRegion: "WA",
          PostalCode: "98101",
          CountryCode: "US",
        },
        buyerEmail: "customer@example.com",
      };
      const normalizedOrder = normalizeOrder(simulatedAmazonOrder);
      console.log(
        "Normalized Order:",
        JSON.stringify(normalizedOrder, null, 2)
      );
      emit("orderCompleted", normalizedOrder);
    },
    onError: function (err) {
      console.error("Amazon Pay button error", err);
    },
  }).bind("amazon-button-container"); // Pass the plain ID string without a '#' prefix

  console.log("Amazon Pay button rendered successfully.");
}

onMounted(async () => {
  try {
    const amazon = await loadAmazonScript();
    if (!amazon) {
      console.error("Failed to load Amazon Pay SDK.");
      return;
    }
    amazonReady.value = true;
    renderAmazonButton();
  } catch (error) {
    console.error("Error loading Amazon Pay SDK", error);
  } finally {
    loading.value = false;
  }
});

watch(
  () => props.totalAmount,
  () => {
    const container = document.getElementById("amazon-button-container");
    if (container) {
      container.innerHTML = "";
      renderAmazonButton();
    }
  }
);
</script>
  
  <style scoped>
.amazon-checkout {
  width: 100%;
}
.loading {
  margin-bottom: 1rem;
}
</style>
  