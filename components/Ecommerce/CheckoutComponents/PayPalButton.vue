<template>
  <div class="paypal-wrapper">
    <h2>Checkout</h2>
    <div v-if="loading" class="loading">
      Loading... if this takes too long, refresh the page.
    </div>
    <div id="paypal-button-container"></div>
  </div>
</template>

<script setup>
import { loadScript } from "@paypal/paypal-js";

const store = useItemStore();
const cartItems = store.cart;
const loading = ref(true);
const totalPrice = ref(0);
const paypalReady = ref(false);

const emit = defineEmits([
  "sendConfirmationEmail",
  "sendFailureEmail",
  "processOrder",
]);

onMounted(async () => {
  loading.value = true;
  console.log("Initializing PayPal SDK...");

  try {
    const total = await $fetch("/api/cart/total", {
      method: "POST",
      body: { cartItems },
    });

    totalPrice.value = total;

    // Load PayPal SDK
    const paypal = await loadScript({
      "client-id":
        "AdtQ4QIhyiTH7owmy8BaLN1wuguwU3mksMpaJOKiGutiCmcFUeXfsZby3QrQaLYgtLUIWgONxU0YNvmf",
      currency: "USD",
      components: "buttons",
    });

    if (!paypal) {
      console.error("PayPal SDK failed to load.");
      loading.value = false;
      return;
    }

    paypalReady.value = true;

    renderPayPalButton();
  } catch (error) {
    console.error(
      JSON.stringify({
        error: "Error initializing PayPal SDK or fetching total price",
        details: error,
      })
    );
  }

  loading.value = false;
});

const renderPayPalButton = () => {
  if (!paypalReady.value) {
    console.warn(
      JSON.stringify({
        warning: "PayPal is not ready. Aborting button render.",
      })
    );
    return;
  }

  window.paypal
    .Buttons({
      createOrder: async (data, actions) => {
        console.log(JSON.stringify({ message: "Creating PayPal order..." }));

        try {
          const orderID = await actions.order.create({
            purchase_units: [
              {
                amount: { value: totalPrice.value },
              },
            ],
          });
          return orderID;
        } catch (err) {
          console.error(
            JSON.stringify({
              error: "Error creating PayPal order",
              details: err,
            })
          );
          throw err;
        }
      },
      onApprove: async (data, actions) => {
        console.log(
          JSON.stringify({
            message: "PayPal order approved. Capturing payment.",
            orderID: data.orderID,
          })
        );
        try {
          const order = await actions.order.capture();
          console.log(
            JSON.stringify({ message: "Payment captured successfully", order })
          );

          emit("sendConfirmationEmail", order);
          emit("processOrder", order);
        } catch (error) {
          console.error(
            JSON.stringify({
              error: "Error capturing PayPal payment",
              details: error,
            })
          );
        }
      },
      onError: (err) => {
        console.error(
          JSON.stringify({ error: "PayPal button error", details: err })
        );
      },
    })
    .render("#paypal-button-container")
    .then(() => {
      console.log(
        JSON.stringify({ message: "PayPal button rendered successfully." })
      );
    })
    .catch((renderError) => {
      console.error(
        JSON.stringify({
          error: "Error rendering PayPal button",
          details: renderError,
        })
      );
    });
};
</script>

<style scoped>
.paypal-wrapper {
  height: 100%;
}

.loading {
  margin-bottom: 2rem;
}

h2 {
  font-size: 24px;
  margin-top: 2rem;
  margin-bottom: 20px;
  text-align: left;
  border-bottom: 1px solid #eee;
  width: 100%;
  padding: 10px;
}

#paypal-button-container {
  margin-top: 1rem;
}
</style>
