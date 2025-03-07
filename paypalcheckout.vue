<template>
  <div class="paypal-checkout">
    <div v-if="loading" class="loading">
      Loading… if this takes too long, refresh the page.
    </div>
    <!-- Container with fixed width -->
    <div id="paypal-button-container" style="width: 150px"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, defineProps, defineEmits } from "vue";
import { loadScript } from "@paypal/paypal-js";

const props = defineProps({
  totalAmount: { type: Number, required: true },
});

const emit = defineEmits(["orderCompleted"]);

const loading = ref(true);
const paypalReady = ref(false);
const taxPatched = ref(false);

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

async function minimalShippingChange(data, actions) {
  console.log("Shipping change detected:", data.shipping_address);
  return actions.order.get();
}

async function renderPayPalButton() {
  if (!paypalReady.value) {
    console.warn("PayPal SDK not ready. Aborting button render.");
    return;
  }
  window.paypal
    .Buttons({
      fundingSource: window.paypal.FUNDING.PAYPAL, // Explicitly PayPal only
      style: {
        layout: "horizontal",
        tagline: false,
        label: "paypal",
        color: "gold",
        shape: "rect",
        height: 35, // Set explicit height to preserve default tall appearance
      },
      createOrder: async (data, actions) => {
        try {
          taxPatched.value = false;
          return await actions.order.create({
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
                  },
                },
              },
            ],
          });
        } catch (err) {
          console.error("Error creating PayPal order", err);
          throw err;
        }
      },
      onShippingChange: minimalShippingChange,
      onApprove: async (data, actions) => {
        try {
          const order = await actions.order.capture();
          console.log("Raw PayPal order captured:", order);
          const normalizedOrder = normalizeOrder(order);
          console.log("Normalized Order:", normalizedOrder);
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
      "disable-funding": "paylater,credit", // Disable Pay Later and Credit buttons
      "enable-funding": "paypal", // Explicitly enable only PayPal
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
