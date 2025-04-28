<template>
  <div class="payment-methods">
    <h3 class="payment-title">Payment methods</h3>
    <div class="payment-icons">
      <NuxtImg src="/Logos/AMEX.png" alt="American Express" />
      <NuxtImg src="/Logos/Visa.svg" alt="Visa" />
      <NuxtImg src="/Logos/Discover.svg" alt="Discover" />
      <NuxtImg src="/Logos/Mastercard.svg" alt="Mastercard" />
      <NuxtImg src="/Logos/DinersClub.svg" alt="Diners Club" />
      <NuxtImg src="/Logos/GooglePay.svg" alt="Google Pay" class="google-pay" />
      <NuxtImg src="/Logos/ApplePay.svg" alt="Apple Pay" />
      <NuxtImg src="/Logos/Paypal.svg" alt="PayPal" />
    </div>
    <p class="payment-note">
      Your payment information is processed securely and the price includes
      regional tax.
    </p>
  </div>
</template>
  
  <style scoped>
.payment-methods {
  background: #f5f5f5;
  padding: 1rem;
  margin: 2rem 0;
}
.payment-title {
  margin: 0 0 1rem;
  font-size: 1.2rem;
  font-weight: bold;
}
.payment-icons {
  display: flex;
  flex-wrap: wrap; /* ← allow wrapping */
  gap: 0.5rem;
  margin-bottom: 1rem;
}

/* target the <img> inside NuxtImg */
.payment-icons img {
  min-width: 48px; /* ← keep at least this wide */
  height: 30px;
  width: auto; /* ← let it scale proportionally */
  object-fit: cover;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
.payment-note {
  font-size: 0.9rem;
  color: #555;
}
.google-pay {
  padding: 7px 5px 5px 5px;
}
</style>
  