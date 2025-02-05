<template>
  <div class="checkout-panel-inner">
    <!-- Express Checkout Section -->
    <div class="express-checkout">
      <div class="express-buttons-container">
        <!-- Only the payment buttons are displayed -->
        <EcommerceExpressCheckoutPaypalCheckout
          :totalAmount="totalAmount"
          @orderCompleted="$emit('orderCompleted', $event)"
        />
        <EcommerceExpressCheckoutAmazonPay
          :totalAmount="totalAmount"
          @orderCompleted="$emit('orderCompleted', $event)"
        />

        <!-- <EcommerceExpressCheckoutGooglePay
          :totalAmount="totalAmount"
          @orderCompleted="$emit('orderCompleted', $event)"
        />

        <EcommerceExpressCheckoutVenmoPay
          :totalAmount="totalAmount"
          @orderCompleted="$emit('orderCompleted', $event)"
        /> -->
      </div>
    </div>

    <!-- Divider -->
    <div class="divider">
      <span>OR</span>
    </div>

    <!-- Manual Checkout Section -->
    <div class="manual-checkout">
      <!-- Replace ManualCheckoutForm with your actual manual checkout component -->
      <!-- <ManualCheckoutForm
        :totalAmount="totalAmount"
        @orderCompleted="$emit('orderCompleted', $event)"
      /> -->
    </div>
  </div>
</template>
  
  <script setup>
defineProps({
  totalAmount: { type: Number, required: true },
});
</script>
  
  <style scoped>
.checkout-panel-inner {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Express Checkout Section */
.express-checkout {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: center;
}
.express-checkout-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: lighter;
}

.express-buttons-container {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Divider */
.divider {
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #ddd;
  margin: 1rem 0;
  position: relative;
}
.divider span {
  background: #fff;
  padding: 0 1rem;
  position: relative;
  top: -10px;
  color: #666;
}

/* Manual Checkout Section */
.manual-checkout {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.manual-checkout-header {
  text-align: left;
}
.manual-checkout-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: lighter;
}
</style>
  