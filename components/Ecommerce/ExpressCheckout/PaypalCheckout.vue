<template>
  <div class="paypal-checkout">
    <div v-if="loading" class="loading">
      Loading… if this takes too long, refresh the page.
    </div>
    <div id="paypal-button-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, defineProps, defineEmits } from "vue";
import { loadScript } from "@paypal/paypal-js";

// Define the prop so that the component receives the base order total from its parent.
const props = defineProps({
  totalAmount: { type: Number, required: true },
});

// Define the emit for when the order is successfully processed.
const emit = defineEmits(["orderCompleted"]);

const loading = ref(true);
const paypalReady = ref(false);
const taxPatched = ref(false); // flag to ensure tax is patched only once per order

// Function to convert the raw PayPal order data into a universal structure.
function normalizeOrder(paypalOrder) {
  return {
    orderId: paypalOrder.id,
    paymentMethod: "PAYPAL",
    orderDate: new Date().toISOString(),
    totalCost: parseFloat(paypalOrder.purchase_units[0].amount.value),
    buyersShippingAddress: {
      firstName: paypalOrder.payer.name.given_name,
      lastName: paypalOrder.payer.name.surname,
      streetAddress:
        paypalOrder.purchase_units[0].shipping?.address?.address_line_1 || "",
      secondaryAddress:
        paypalOrder.purchase_units[0].shipping?.address?.address_line_2 || "",
      city: paypalOrder.purchase_units[0].shipping?.address?.admin_area_2 || "",
      state:
        paypalOrder.purchase_units[0].shipping?.address?.admin_area_1 || "",
      ZIPCode:
        paypalOrder.purchase_units[0].shipping?.address?.postal_code || "",
      country_code:
        paypalOrder.purchase_units[0].shipping?.address?.country_code || "",
    },
    associatedEmail: paypalOrder.payer.email_address,
    rawOrder: paypalOrder,
  };
}

/**
 * Calls your tax API using the expected property names.
 * We send:
 *  - totalCost: the base total from props.totalAmount
 *  - userLocation: the shipping address from PayPal
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
        userLocation: shippingAddress, // using property name expected by the API
      }),
    });
    console.log("Tax API response status:", response.status);
    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Tax API error body:", errorBody);
      throw new Error("Tax API returned an error");
    }
    // The API returns a raw number, not an object.
    const taxResponse = await response.json();
    console.log("Tax API returned data:", JSON.stringify(taxResponse, null, 2));
    return taxResponse;
  } catch (error) {
    console.error("Error fetching tax:", error);
    throw error;
  }
}

async function renderPayPalButton() {
  if (!paypalReady.value) {
    console.warn("PayPal SDK not ready. Aborting button render.");
    return;
  }
  window.paypal
    .Buttons({
      // Allow both PayPal and Venmo funding sources.
      funding: {
        allowed: [window.paypal.FUNDING.PAYPAL, window.paypal.FUNDING.VENMO],
        disallowed: [window.paypal.FUNDING.PAYLATER],
      },
      style: {
        layout: "vertical",
        tagline: false,
        label: "pay",
      },
      style: {
        layout: "horizontal", // displays the buttons side by side
        tagline: false, // Hides "Powered by PayPal" text
        label: "pay", // Button label
      },
      createOrder: async (data, actions) => {
        try {
          // Reset the tax patch flag for a new order.
          taxPatched.value = false;
          const orderPayload = {
            purchase_units: [
              {
                reference_id: "default",
                amount: {
                  currency_code: "USD",
                  value: props.totalAmount.toFixed(2),
                  breakdown: {
                    item_total: {
                      currency_code: "USD",
                      value: props.totalAmount.toFixed(2),
                    },
                    // tax_total will be added in onShippingChange.
                  },
                },
              },
            ],
          };
          console.log(
            "Creating PayPal order with payload:",
            JSON.stringify(orderPayload, null, 2)
          );
          return await actions.order.create(orderPayload);
        } catch (err) {
          console.error("Error creating PayPal order", err);
          throw err;
        }
      },
      onShippingChange: async (data, actions) => {
        try {
          console.log(
            "onShippingChange triggered. Data received:",
            JSON.stringify(data, null, 2)
          );
          if (!taxPatched.value) {
            const shippingAddress = data.shipping_address;
            console.log(
              "Shipping address for tax calculation:",
              JSON.stringify(shippingAddress, null, 2)
            );
            const taxResponse = await fetchTax(shippingAddress);
            const taxAmount = Number(taxResponse); // taxResponse is now a number (e.g., 0.05)
            const baseTotal = props.totalAmount;
            const finalTotal = baseTotal + taxAmount;
            console.log(
              "Patching order with final total:",
              finalTotal.toFixed(2),
              " (base:",
              baseTotal.toFixed(2),
              "tax:",
              taxAmount.toFixed(2),
              ")"
            );
            await actions.order.patch([
              {
                op: "replace",
                path: "/purchase_units/@reference_id=='default'/amount",
                value: {
                  currency_code: "USD",
                  value: finalTotal.toFixed(2),
                  breakdown: {
                    item_total: {
                      currency_code: "USD",
                      value: baseTotal.toFixed(2),
                    },
                    tax_total: {
                      currency_code: "USD",
                      value: taxAmount.toFixed(2),
                    },
                  },
                },
              },
            ]);
            taxPatched.value = true;
          }
          // Instead of returning actions.order.get(), call actions.resolve() to complete the update.
          return actions.resolve();
        } catch (err) {
          console.error("Error in onShippingChange", err);
          return actions.reject();
        }
      },

      onApprove: async (data, actions) => {
        try {
          const order = await actions.order.capture();
          console.log(
            "Raw PayPal order captured:",
            JSON.stringify(order, null, 2)
          );
          const normalizedOrder = normalizeOrder(order);
          console.log(
            "Normalized Order:",
            JSON.stringify(normalizedOrder, null, 2)
          );
          emit("orderCompleted", normalizedOrder);
        } catch (error) {
          console.error("Error capturing PayPal payment", error);
        }
      },
      onError: (err) => {
        console.error("PayPal button error", err);
      },
    })
    .render("#paypal-button-container")
    .then(() => console.log("PayPal button rendered successfully."))
    .catch((renderError) =>
      console.error("Error rendering PayPal button", renderError)
    );
}

onMounted(async () => {
  try {
    const paypal = await loadScript({
      "client-id":
        "AdtQ4QIhyiTH7owmy8BaLN1wuguwU3mksMpaJOKiGutiCmcFUeXfsZby3QrQaLYgtLUIWgONxU0YNvmf",
      currency: "USD",
      components: "buttons",
    });
    if (!paypal) {
      console.error("Failed to load PayPal SDK.");
      return;
    }
    paypalReady.value = true;
    renderPayPalButton();
  } catch (error) {
    console.error("Error loading PayPal SDK", error);
  } finally {
    loading.value = false;
  }
});

watch(
  () => props.totalAmount,
  () => {
    const container = document.getElementById("paypal-button-container");
    if (container) {
      container.innerHTML = "";
      renderPayPalButton();
    }
  }
);
</script>

<style scoped>
.paypal-checkout {
  width: 100%;
}
.loading {
  margin-bottom: 1rem;
}
</style>
