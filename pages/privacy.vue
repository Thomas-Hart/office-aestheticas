<template>
  <div class="body">
    <!-- prettier-ignore -->
    <div class="terms">
        <h1>Privacy Policy</h1>

<p>This Privacy Policy describes how National Auto Hub ("we" or "us") collects, uses, and discloses your personal information when you use our website ("Site") and the choices you have associated with that information. By using the Site, you agree to the collection and use of information in accordance with this policy.</p>

<h2>1. Information Collection and Use</h2>

<p>1.1. We may collect personal information, such as your name, email address, mailing address, phone number, and payment information, when you make a purchase or register an account on the Site.</p>

<p>1.2. We may also collect information automatically when you use the Site, including your IP address, browser type, device type, operating system, and website usage data through cookies and similar tracking technologies.</p>

<h2>2. Use of Information</h2>

<p>2.1. We may use the information we collect to:</p>
<ul>
  <li>Process and fulfill your orders</li>
  <li>Communicate with you about your orders and account</li>
  <li>Send you promotional emails and newsletters</li>
  <li>Improve our products and services</li>
  <li>Analyze website usage and trends</li>
  <li>Prevent fraudulent activity and enhance security</li>
</ul>

<h2>3. Disclosure of Information</h2>

<p>3.1. We may share your personal information with third-party service providers that assist us in operating our business, such as payment processors, shipping carriers, and marketing agencies. These service providers are authorized to use your personal information only as necessary to provide services to us.</p>

<p>3.2. We may also disclose your personal information when required by law or in response to valid legal requests, such as subpoenas or court orders.</p>

<h2>4. Data Security</h2>

<p>4.1. We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security of your information.</p>

<h2>5. Your Choices</h2>

<p>5.1. You may opt out of receiving promotional emails from us by following the unsubscribe instructions provided in the email.</p>

<h2>6. Changes to this Privacy Policy</h2>

<p>6.1. We reserve the right to update or change this Privacy Policy at any time. Any changes will be effective immediately upon posting the revised Privacy Policy on the Site. Your continued use of the Site after the posting of any changes constitutes acceptance of those changes.</p>

<h2>7. Contact Information</h2>

<p>7.1. If you have any questions about this Privacy Policy, please contact us at sales@buzzed-honey.com.</p>

<p>Last updated: Feb. 7th, 2024</p>
      </div>
  </div>
</template>

<script setup>
// SEO ADJUST
useSeoMeta({
  title: "post.value.mainTitle",
  ogTitle: "post.value.mainTitle",
  description: "post.value.preview",
  ogDescription: "post.value.preview",
  ogImage: "post.value.thumbnail",
  twitterCard: "post.value.thumbnail",
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
  font-style: normal !important;
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