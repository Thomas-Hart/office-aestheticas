<template>
  <!-- prettier-ignore -->
  <div class="body">
    <div class="terms">
      <h1>Terms of Service</h1>

<p>Welcome to <strong>Office Aestheticas</strong>! These <strong>Terms of Service</strong> ("Terms") govern your access to and use of the <strong>Office Aestheticas</strong> website ("<strong>Site</strong>"), including any content, functionality, and services offered on or through the Site. Please read these Terms carefully before using the Site.</p>

<h2>1. General Conditions</h2>

<p>1.1. By accessing or using the Site, you agree to be bound by these Terms and our <a href="#">Privacy Policy</a>. If you do not agree to these Terms or our Privacy Policy, you may not use the Site.</p>

<p>1.2. You agree not to reproduce, duplicate, copy, sell, resell, or exploit any portion of the Site, use of the Site, or access to the Site without our express written permission.</p>

<h2>2. Products and Services</h2>

<p>2.1. <strong>Office Aestheticas</strong> offers luxury home office equipment and accessories ("<strong>Products</strong>") for sale on the Site.</p>

<p>2.2. All descriptions of Products or Product pricing are subject to change at any time without notice, at our sole discretion.</p>

<p>2.3. We reserve the right to discontinue any Product at any time. Any offer for any Product made on the Site is void where prohibited.</p>

<h2>3. Orders and Payments</h2>

<p>3.1. By placing an order through the Site, you warrant that you are legally capable of entering into binding contracts.</p>

<p>3.2. You agree to provide current, complete, and accurate purchase and account information for all purchases made on the Site.</p>

<p>3.3. All prices for Products are in USD and are subject to change without notice.</p>

<h2>4. Shipping and Returns</h2>

<p>4.1. We aim to ship orders within the timeframe specified on the Site. However, we do not guarantee delivery dates and are not responsible for any delays in shipping.</p>

<p>4.2. For information about shipping rates, delivery times, and return policies, please refer to our <a href="#">Shipping & Returns Policy</a>.</p>

<h2>5. Intellectual Property</h2>

<p>5.1. The Site and its original content, features, and functionality are owned by <strong>Office Aestheticas</strong> and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</p>

<p>5.2. You may not use our trademarks, logos, or service marks without our prior written consent.</p>

<h2>6. Limitation of Liability</h2>

<p>6.1. In no event shall <strong>Office Aestheticas</strong>, its directors, officers, employees, affiliates, agents, contractors, or licensors be liable for any direct, indirect, incidental, special, consequential, or punitive damages, including but not limited to, damages for loss of profits, goodwill, use, data, or other intangible losses resulting from your use of the Site or Products.</p>

<h2>7. Governing Law</h2>

<p>7.1. These Terms shall be governed by and construed in accordance with the laws of the state of Utah, without regard to its conflict of law provisions.</p>

<h2>8. Changes to Terms</h2>

<p>8.1. We reserve the right to update, change, or replace any part of these Terms by posting updates and changes to the Site. It is your responsibility to check the Site periodically for changes. Your continued use of or access to the Site following the posting of any changes constitutes acceptance of those changes.</p>

<h2>9. Contact Information</h2>

<p>9.1. If you have any questions about these Terms, please contact us at support@officeaestheticas.com.</p>

<p>By using the <strong>Office Aestheticas</strong> website, you agree to abide by these <strong>Terms of Service</strong>. Thank you for visiting <strong>Office Aestheticas</strong>!</p>

<p>Last updated: Jan. 29th, 2025</p>
    </div>
  </div>
</template>

<script setup>
// SEO ADJUST
useSeoMeta({
  title: "Terms of Service | Office Aestheticas",
  ogTitle: "Terms of Service | Office Aestheticas",
  description:
    "Review the terms and conditions for using Office Aestheticas' website and purchasing our luxury home office products.",
  ogDescription:
    "Review the terms and conditions for using Office Aestheticas' website and purchasing our luxury home office products.",
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
  align-items: center;
}

h1 {
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
</style>
