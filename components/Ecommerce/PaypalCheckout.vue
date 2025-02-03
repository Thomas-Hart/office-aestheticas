<template>
  <div class="wrapper">
    <div class="checkout-form">
      <div class="paypal-wrapper">
        <div v-if="loading" class="loading">
          Loading… if this takes too long, refresh the page.
        </div>
        <div id="paypal-button-container"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { loadScript } from "@paypal/paypal-js";

const router = useRouter();
const itemStore = useItemStore();
const userStore = useUserStore();

const userEmail = ref("");
const loading = ref(true);
const totalPrice = ref(0);
const paypalReady = ref(false);

async function processOrderPaypal(order) {
  try {
    console.log("Starting processOrderPaypal function.");
    console.log("Received Order Object:", order);

    // Business (seller) address info
    const labelToAddress = {
      firstName: "National",
      lastName: "Auto Hub",
      email: "contact@nationalautohub.com",
      streetAddress: "1229 s 1100 e",
      secondaryAddress: "",
      city: "Orem",
      state: "UT",
      urbanization: "",
      ZIPCode: "84097",
      ZIPPlus4: "",
    };

    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

    // Use the payer’s shipping details from PayPal
    const buyersShippingAddress = {
      firstName: order.payer.name.given_name,
      lastName: order.payer.name.surname,
      streetAddress:
        order.purchase_units[0].shipping.address?.address_line_1 || "",
      secondaryAddress:
        order.purchase_units[0].shipping.address?.address_line_2 || "",
      city: order.purchase_units[0].shipping.address?.admin_area_2 || "",
      state: order.purchase_units[0].shipping.address?.admin_area_1 || "",
      ZIPCode: order.purchase_units[0].shipping.address?.postal_code || "",
      country_code:
        order.purchase_units[0].shipping.address?.country_code || "",
    };

    // Construct the tax info for your backend
    const taxInfo = {
      invoiceNumber: "INV-" + Date.now(),
      orderDate: formattedDate,
      totalCost: parseFloat(order.purchase_units[0].amount.value),
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
      buyersBillingAddress: null,
      buyersShippingAddress,
      sellersBusinessInformation: {
        businessName: "Office Aestheticas",
        address: labelToAddress,
        taxIDNum: "YOUR_TAX_ID_HERE",
      },
      paymentMethod: "PAYPAL",
      status: "Pending",
      userId: userStore.user?._id || null,
      shippedDate: null,
      expectedDeliveryDate: null,
      deliveryDate: null,
      trackingNumber: "",
      associatedEmail: order.payer.email,
    };

    const taxResponse = await $fetch("/api/tax", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: taxInfo,
    });
    const orderId = taxResponse._id;
    if (!orderId) throw new Error("Order ID not found in tax response.");

    itemStore.clearCart();
    if (userStore.user) {
      const updatedUser = { ...userStore.user, cart: [] };
      await $fetch(`/api/users/${userStore.user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: updatedUser,
      });
    }
    router.push({ path: `/order/${orderId}` });
  } catch (error) {
    console.error("Error in processOrderPaypal:", error);
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
          from: "support@aestheticas.com",
          message:
            "There was a problem processing your order. Please try again. If this continues, please contact us through the contact page on our website.",
          company: "Office Aestheticas",
        }),
      }
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  } catch (error) {
    console.log("Error in sendFailureEmail()");
  }
}

async function sendConfirmationEmail(order) {
  // Currently disabled.
}

onMounted(async () => {
  loading.value = true;
  try {
    const total = await $fetch("/api/cart/total", {
      method: "POST",
      body: { cartItems: itemStore.cart },
    });
    totalPrice.value = total;
    const paypal = await loadScript({
      "client-id":
        "AdtQ4QIhyiTH7owmy8BaLN1wuguwU3mksMpaJOKiGutiCmcFUeXfsZby3QrQaLYgtLUIWgONxU0YNvmf",
      currency: "USD",
      components: "buttons",
    });
    if (!paypal) {
      console.error("PayPal SDK failed to load.");
      return;
    }
    paypalReady.value = true;
    renderPayPalButton();
  } catch (error) {
    console.error(
      "Error initializing PayPal SDK or fetching total price",
      error
    );
  } finally {
    loading.value = false;
  }
});

const renderPayPalButton = () => {
  if (!paypalReady.value) {
    console.warn("PayPal is not ready. Aborting button render.");
    return;
  }
  window.paypal
    .Buttons({
      // This ensures only the standard PayPal button is shown.
      fundingSource: window.paypal.FUNDING.PAYPAL,
      style: {
        layout: "vertical",
        tagline: false, // Hides "Powered by PayPal" text
        label: "pay", // Renders a single "Pay" button
      },
      createOrder: async (data, actions) => {
        try {
          return await actions.order.create({
            purchase_units: [
              {
                amount: { value: totalPrice.value },
              },
            ],
          });
        } catch (err) {
          console.error("Error creating PayPal order", err);
          throw err;
        }
      },
      onApprove: async (data, actions) => {
        try {
          const order = await actions.order.capture();
          await sendConfirmationEmail(order);
          await processOrderPaypal(order);
        } catch (error) {
          console.error("Error capturing PayPal payment", error);
        }
      },
      onError: (err) => {
        console.error("PayPal button error", err);
        sendFailureEmail();
      },
    })
    .render("#paypal-button-container")
    .then(() => console.log("PayPal button rendered successfully."))
    .catch((renderError) =>
      console.error("Error rendering PayPal button", renderError)
    );
};
</script>

<style scoped>
.wrapper {
  width: 100%;
  margin: 0;
  padding: 0;
}

.checkout-form {
  width: 100%;
  display: block;
  background: none;
  padding: 0;
}

.paypal-wrapper {
  width: 100%;
}

.loading {
  margin-bottom: 1rem;
}

#paypal-button-container {
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .wrapper {
    padding: 0;
  }
  .checkout-form {
    padding: 0;
    margin-bottom: 0;
  }
}
</style>
