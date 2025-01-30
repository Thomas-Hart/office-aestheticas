<template>
  <div class="wrapper">
    <!-- prettier-ignore -->
    <div class="checkout-form">
        <div>  
          <!-- PayPal Button -->
          <div class="paypal-button">
            <EcommerceCheckoutComponentsPayPalButton
            @validateForms="validateForms()"
            @sendConfirmationEmail="sendConfirmationEmail"
            @processOrder="processOrderPaypal"
            @sendFailureEmail="sendFailureEmail()"
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
// import { KlaviyoClient } from "klaviyo-api";

// const klaviyo = new KlaviyoClient({
//   apiKey: "pk_e6c4ee31b20f43f9d07873a294f52af153",
// });

const router = useRouter();
const itemStore = useItemStore();
const userStore = useUserStore();

// Form fields
const userEmail = ref("");
const fullName = ref("");
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

// Fix this
async function processOrderPaypal(order) {
  try {
    console.log("Starting processOrderPaypal function.");

    // Log the entire order object
    console.log("Received Order Object:", JSON.stringify(order, null, 2));

    // Log the purchase units
    console.log(
      "Purchase Units:",
      JSON.stringify(order.purchase_units, null, 2)
    );

    // Initialize labelToAddress with actual business information
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
    console.log(
      "Initialized labelToAddress:",
      JSON.stringify(labelToAddress, null, 2)
    );

    // Format the current date
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;
    console.log("Formatted Current Date:", formattedDate);

    // THIS IS NOT WORKING. PAYER.ADDRESS ONLY HAS COUNTRY CODE. SWITCH BUYERS BILLING ADDRESS TO OPTIONAL??
    const buyersBillingAddress = null;

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

    console.log(
      "Constructed buyersBillingAddress:",
      JSON.stringify(buyersBillingAddress, null, 2)
    );

    // Construct taxInfo object
    const taxInfo = {
      invoiceNumber: "INV-" + Date.now(), // Generate a unique invoice number
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
      salesTax: 0, // You may want to calculate this based on totalCost and salesTaxRate
      salesTaxRate: 0, // Define appropriate tax rate if applicable
      buyersBillingAddress: buyersBillingAddress, // Updated with complete address
      buyersShippingAddress: buyersShippingAddress,
      sellersBusinessInformation: {
        businessName: "National Auto Hub",
        address: labelToAddress,
        taxIDNum: "YOUR_TAX_ID_HERE", // Replace with your actual Tax ID if required
      },
      paymentMethod: "PAYPAL",
      status: "Pending",
      userId: userStore.user?._id || null, // Ensure user is authenticated
      shippedDate: null,
      expectedDeliveryDate: null,
      deliveryDate: null,
      trackingNumber: "",
      associatedEmail: order.payer.email,
    };
    console.log(
      "Constructed taxInfo Object:",
      JSON.stringify(taxInfo, null, 2)
    );

    // Log the itemized list
    console.log(
      "Itemized List:",
      JSON.stringify(taxInfo.itemizedList, null, 2)
    );

    // Send POST request to /api/tax
    console.log("Sending POST request to /api/tax with taxInfo.");
    const taxResponse = await $fetch("/api/tax", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: taxInfo,
    });
    console.log("Received taxResponse:", JSON.stringify(taxResponse, null, 2));

    // Extract orderId from taxResponse
    const orderId = taxResponse._id;
    console.log("Extracted Order ID:", orderId);
    if (!orderId) throw new Error("Order ID not found in tax response.");

    // Clear the cart
    console.log("Clearing the cart.");
    itemStore.clearCart();
    console.log("Cart cleared successfully.");

    // Attempt to update the user's cart in the database
    try {
      const currentUser = userStore.user;
      console.log("Current User:", JSON.stringify(currentUser, null, 2));
      if (currentUser) {
        const updatedUser = { ...currentUser, cart: [] };
        console.log(
          "Updated User Object for PUT Request:",
          JSON.stringify(updatedUser, null, 2)
        );
        console.log(
          `Sending PUT request to /api/users/${currentUser._id} to update user cart.`
        );
        await $fetch(`/api/users/${currentUser._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: updatedUser,
        });
        console.log("User cart updated successfully.");
      } else {
        console.log("No current user found. Skipping user cart update.");
      }
    } catch (error) {
      console.error("Error clearing user cart:", error);
    }

    // Redirect to the order page
    console.log(`Redirecting to /order/${orderId}.`);
    router.push({ path: `/order/${orderId}` });
    console.log("Redirection successful.");
  } catch (error) {
    console.error("Error in processOrderPaypal:", error);
  }
}

// -------------------- ORDER & EMAIL METHODS -------------------- //
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

// async function sendConfirmationEmailAndSMS(order) {
//   try {
//     // Extract user details from the order
//     const userEmail = order.payer.email_address;
//     const userPhone = order.purchase_units[0]?.shipping?.address?.phone || null; // Update this if phone data is stored elsewhere

//     const emailResponse = await klaviyo.apiRequest({
//       method: "POST",
//       endpoint: "/v1/send-email",
//       body: {
//         to: userEmail,
//         subject: "Order Confirmation",
//         fromEmail: "no-reply@nationalautohub.com",
//         content: `Hello ${order.payer.name.given_name}, your order has been placed!`,
//       },
//     });

//     console.log("Email Response:", emailResponse);

//     if (userPhone) {
//       const smsResponse = await klaviyo.apiRequest({
//         method: "POST",
//         endpoint: "/v1/send-sms",
//         body: {
//           to: userPhone,
//           body: `Hi ${order.payer.name.given_name}, your order #${order.id} has been confirmed!`,
//         },
//       });

//       console.log("SMS Response:", smsResponse);
//     }
//   } catch (error) {
//     console.error("Error sending confirmation email or SMS:", error);
//   }
// }

// Custom email through Lambda or google cloud functions
async function sendConfirmationEmail() {
  // try {
  //   const response = await fetch(
  //     "https://jf32m0961a.execute-api.us-east-2.amazonaws.com/first/send-custom-email",
  //     {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         to: userEmail.value,
  //         from: "sales@hartecho.com",
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
  padding: 2rem;
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
  