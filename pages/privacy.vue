<template>
  <div class="body">
    <!-- prettier-ignore -->
    <div class="terms">
        <h1>Privacy Policy</h1>

<p>This Privacy Policy describes how Office Aestheticas ("we," "us," or "our") collects, uses, and discloses your personal information when you visit or make a purchase from our website (the "Site"). By using the Site, you agree to the collection and use of information in accordance with this policy.</p>

<h2>1. Information We Collect</h2>

<p>1.1. We collect personal information that you provide to us when you create an account, place an order, subscribe to our newsletter, or contact customer support. This may include your name, email address, phone number, billing and shipping addresses, and payment details.</p>

<p>1.2. We also automatically collect certain information about your device and browsing activity when you visit our Site, including your IP address, browser type, referring website, and pages you visit. We use cookies and similar tracking technologies to enhance your experience.</p>

<h2>2. How We Use Your Information</h2>

<p>2.1. We use the information we collect to:</p>
<ul>
  <li>Process and fulfill your orders, including sending order confirmations and updates</li>
  <li>Provide customer support and respond to your inquiries</li>
  <li>Personalize your shopping experience</li>
  <li>Send marketing and promotional communications, where permitted by law</li>
  <li>Improve our products, services, and website functionality</li>
  <li>Prevent fraudulent transactions and maintain security</li>
</ul>

<h2>3. Sharing Your Information</h2>

<p>3.1. We may share your information with third-party service providers who assist us with payment processing, order fulfillment, shipping, and marketing services. These providers are only permitted to use your information to perform services on our behalf.</p>

<p>3.2. We may disclose your information when required by law, to enforce our policies, or to protect our rights, property, or safety.</p>

<h2>4. Data Security</h2>

<p>4.1. We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, use, or disclosure. However, no online transmission or storage system is 100% secure.</p>

<h2>5. Your Rights and Choices</h2>

<p>5.1. You have the right to access, update, or delete your personal information. You may also opt out of marketing emails by clicking the "unsubscribe" link in any email we send.</p>

<p>5.2. You can manage your cookie preferences through your browser settings.</p>

<h2>6. Third-Party Links</h2>

<p>6.1. Our Site may contain links to third-party websites. We are not responsible for the privacy practices of these external sites.</p>

<h2>7. Changes to This Policy</h2>

<p>7.1. We may update this Privacy Policy from time to time. Any changes will be posted on this page, and the updated date will be revised accordingly.</p>

<h2>8. Contact Us</h2>

<p>8.1. If you have any questions about this Privacy Policy, please contact us at support@officeaestheticas.com.</p>

<p>Last updated: Jan. 29th, 2025</p>
      </div>
  </div>
</template>

<script setup>
// SEO ADJUST
useSeoMeta({
  title: "Privacy Policy | Office Aestheticas",
  ogTitle: "Privacy Policy | Office Aestheticas",
  description:
    "Learn how Office Aestheticas collects, uses, and protects your personal information when you shop on our website.",
  ogDescription:
    "Learn how Office Aestheticas collects, uses, and protects your personal information when you shop on our website.",
  ogImage: "https://www.officeaestheticas.com/og-image.jpg",
  twitterCard: "summary_large_image",
});

const emit = defineEmits(["hide-loading"]);
emit("hide-loading");
</script>
  
<style scoped>
.body {
  width: 100%;
  min-height: 70rem;
  height: auto;
}

.terms {
  max-width: 1300px;
  margin: 0 auto;
  width: 100%;
  padding: 6rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

h1 {
  width: 100%;
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
}

h2 {
  text-align: left;
  width: 100%;
  font-size: 1.3rem;
  font-weight: bold;
}

p {
  width: 100%;
  font-size: 1.3rem;
  margin-top: 0.5rem;
  margin-bottom: 2rem;
  text-align: left;
}

ul {
  list-style: disc;
  margin-bottom: 2rem;
  padding-left: 3rem;
}

li {
  font-size: 1.3rem;
}

a {
  color: blue;
}

a:hover {
  text-decoration: underline;
}
</style>
