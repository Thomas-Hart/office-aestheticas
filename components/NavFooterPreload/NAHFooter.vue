<template>
  <footer class="footer-section">
    <div class="blurred-element"></div>
    <div class="newsletter-signup">
      <h2 class="signup-heading">
        GET UPDATES ON COOL STUFF YOU PROBABLY WANT TO KNOW ABOUT
      </h2>
      <div class="email-input-container">
        <input
          type="email"
          placeholder="Enter your email"
          class="email-input"
        />
        <button class="submit-button" @click.prevent="subscribe()">
          Subscribe
          <span class="arrow-icon">➔</span>
        </button>
      </div>
      <div class="social-icons">
        <i class="fab fa-instagram"></i>
        <i class="fab fa-tiktok"></i>
        <i class="fab fa-facebook"></i>
      </div>
    </div>
    <div class="footer-links">
      <div class="footer-column">
        <h3>QUICK LINKS</h3>
        <ul>
          <li><a href="#">Shop</a></li>
          <li><a href="#">About us</a></li>
          <li><a href="#">Contact Us</a></li>
          <li><a href="#">Blog</a></li>
        </ul>
      </div>
      <div class="footer-column">
        <h3>SUPPORT</h3>
        <ul>
          <li><a href="#">Shipping & Delivery</a></li>
          <li><a href="#">Returns & Exchanges</a></li>
          <li><a href="#">Track Your Order</a></li>
          <li><a href="#">FAQ</a></li>
        </ul>
      </div>
      <div class="footer-column">
        <h3>LEGAL</h3>
        <ul>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms & Conditions</a></li>
          <li><a href="#">Refund Policy</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-info">
      <div class="payment-icons">
        <img src="/PaymentGraphics.webp" alt="Payment Methods" />
      </div>
      <p>
        Designed by HARTECHO Digital Marketing | sales@hartecho.com | (801) -
        793 - 5456
      </p>
    </div>
  </footer>
</template>

<script setup>
async function subscribe() {
  console.log("Implement subscribe function");
}
</script>

<style scoped>
.footer-section {
  color: white;
  padding: 40px;
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  position: relative;
  background: #737373;
  overflow: hidden;
  font-family: Montserrat, sans-serif;
}

.blurred-element {
  position: absolute;
  bottom: -20%;
  left: -10%;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  filter: blur(80px);
  animation: float 10s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(30px, 50px);
  }
  100% {
    transform: translate(0, 0);
  }
}

.newsletter-signup {
  flex: 1;
  /* min-width: 300px; */
  text-align: center;
  width: 100%;
}

.signup-heading {
  color: #ff7f00;
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 20px;
  word-wrap: break-word; /* Allow wrapping long words */
  word-break: break-word; /* Break long words */
  white-space: normal; /* Allow wrapping for multiline text */
  line-height: 1.2; /* Adjust line height for better readability */
}

.email-input-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  gap: 10px;
  flex-wrap: wrap;
}

.email-input {
  padding: 10px 15px;
  border-radius: 20px;
  border: 2px solid #ff7f00;
  background-color: transparent;
  color: white;
  width: 100%;
  outline: none;
  transition: all 0.3s ease;
}

.email-input::placeholder {
  color: #ccc;
}

.email-input:focus {
  border-color: #ffa726;
}

.submit-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 10px 20px;
  border-radius: 20px;
  border: none;
  background-color: #ff7f00;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
}

.submit-button:hover {
  background-color: #ffa726;
}

.arrow-icon {
  font-size: 1.5rem;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.social-icons i {
  font-size: 2rem;
  cursor: pointer;
}

.social-icons i:hover {
  color: #ffa726;
}

.footer-links {
  display: flex;
  justify-content: space-between;
  flex: 2;
  flex-wrap: wrap;
  gap: 2rem;
}

.footer-column {
  flex: 1;
  min-width: 150px;
}

.footer-column h3 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: white;
}

.footer-column ul {
  list-style: none;
  padding: 0;
}

.footer-column li {
  margin-bottom: 10px;
}

.footer-column a {
  color: white;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-column a:hover {
  color: #ffa726;
}

.footer-info {
  text-align: center;
  flex: 1 1 100%;
}

.payment-icons img {
  width: 150px;
  margin: 10px auto;
}

.footer-info p {
  margin: 10px 0 0;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .footer-section {
    padding: 2rem 1rem;
    flex-direction: column;
  }

  .signup-heading {
    font-size: 20px;
  }

  .email-input-container {
    flex-direction: column;
  }

  .email-input,
  .submit-button {
    width: 100%;
    max-width: none;
  }

  .footer-links {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>
