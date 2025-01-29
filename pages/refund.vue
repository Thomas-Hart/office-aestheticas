<template>
  <div class="body">
    <!-- prettier-ignore -->
    <div class="terms">
        <h1>Refund Policy</h1>
  
  <p>At <strong>Office Aestheticas</strong>, we stand by the quality of our luxury home office products. Due to the premium nature of our offerings, our refund policy is designed to ensure fairness while protecting our business from misuse.</p>
  
  <h2>1. Eligibility for Refunds</h2>
  
  <p>1.1. Refunds are only available for defective or damaged products reported within <strong>3 days</strong> of delivery.</p>
  
  <p>1.2. To qualify for a refund, you must provide clear photographic evidence of the defect or damage and submit it to our support team at <a href="mailto:support@officeaestheticas.com">support@officeaestheticas.com</a>.</p>
  
  <p>1.3. Refunds are <strong>not</strong> issued for buyer’s remorse, incorrect orders placed by the customer, or minor aesthetic variations that do not impact functionality.</p>
  
  <h2>2. Return Process</h2>
  
  <p>2.1. If your refund request is approved, we will provide return instructions. The item must be returned in its original packaging, unused, and in the same condition as received.</p>
  
  <p>2.2. Customers are responsible for return shipping costs unless the product was deemed defective or damaged upon arrival.</p>
  
  <p>2.3. We recommend using a trackable shipping service. We are not responsible for lost return shipments.</p>
  
  <h2>3. Refund Processing</h2>
  
  <p>3.1. Once we receive and inspect your returned item, we will notify you of the approval or rejection of your refund request.</p>
  
  <p>3.2. Approved refunds will be processed within <strong>7-10 business days</strong> to the original payment method.</p>
  
  <p>3.3. Shipping costs and handling fees are non-refundable.</p>
  
  <h2>4. Non-Refundable Items</h2>
  
  <p>4.1. The following items are <strong>not eligible</strong> for refunds:</p>
  <ul>
    <li>Customized or personalized products</li>
    <li>Gift cards</li>
    <li>Items purchased on final sale or clearance</li>
    <li>Products damaged due to improper use or handling</li>
  </ul>
  
  <h2>5. Chargebacks & Fraudulent Claims</h2>
  
  <p>5.1. Chargeback fraud will be pursued to the fullest extent of the law. We reserve the right to dispute chargebacks and ban customers who abuse the system.</p>
  
  <p>5.2. If a chargeback is filed without first contacting our support team for resolution, we reserve the right to reject future purchases.</p>
  
  <h2>6. Changes to This Policy</h2>
  
  <p>6.1. We reserve the right to update this Refund Policy at any time. Changes will be posted on our website, and continued use of our services constitutes acceptance of the new policy.</p>
  
  <h2>7. Contact Information</h2>
  
  <p>7.1. If you have any questions regarding our refund policy, please contact us at <a href="mailto:support@officeaestheticas.com">support@officeaestheticas.com</a>.</p>
  
  <p>Last updated: Jan. 29th, 2025</p>
      </div>
  </div>
</template>
  
  <script setup>
// SEO ADJUST
useSeoMeta({
  title: "Refund Policy | Office Aestheticas",
  ogTitle: "Refund Policy | Office Aestheticas",
  description:
    "Review our stringent refund policy to understand eligibility, return procedures, and processing details for refunds at Office Aestheticas.",
  ogDescription:
    "Review our stringent refund policy to understand eligibility, return procedures, and processing details for refunds at Office Aestheticas.",
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

ul {
  list-style: disc;
  margin-bottom: 2rem;
  padding-left: 3rem;
}

li {
  font-size: 1.3rem;
}
</style>
  