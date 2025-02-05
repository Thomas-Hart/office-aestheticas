<template>
  <div class="roi-calculator-container">
    <!-- Header / Hero Section -->
    <header class="hero">
      <h1>Custom Store ROI Calculator</h1>
      <p class="tagline">
        Trusted, Data-Driven Estimates Based on Research from Google, Akamai,
        Forrester, and eConsultancy
      </p>
    </header>

    <!-- Main Calculator Card -->
    <div class="calculator-card">
      <div class="input-section">
        <h2>Enter Your Current Store Metrics</h2>
        <div class="input-group">
          <label for="revenue">Current Monthly Revenue ($):</label>
          <input
            id="revenue"
            type="number"
            v-model.number="currentRevenue"
            placeholder="e.g., 10000"
          />
          <small class="description">
            This is your total revenue in a typical month.
          </small>
        </div>

        <div class="input-group">
          <label for="speed">Current Page Load Speed (seconds):</label>
          <input
            id="speed"
            type="number"
            v-model.number="currentSpeed"
            step="0.1"
            placeholder="e.g., 5"
          />
          <small class="description">
            How many seconds does your current site take to load?
          </small>
        </div>

        <div class="input-group">
          <label for="ongoing">Monthly Ongoing Costs ($):</label>
          <input
            id="ongoing"
            type="number"
            v-model.number="ongoingCosts"
            placeholder="e.g., 500"
          />
          <small class="description">
            Include costs for tax APIs, database hosting, AWS, etc.
          </small>
        </div>
      </div>

      <div v-if="currentRevenue && currentSpeed" class="results-section">
        <h2>Estimated Results</h2>
        <div class="result-item">
          <strong>Revenue Increase from Speed Improvements:</strong>
          <span>${{ speedRevenueIncrease.toFixed(2) }}</span>
        </div>
        <div class="result-item">
          <strong>Revenue Increase from UI/UX & SEO Enhancements:</strong>
          <span>${{ uiUxSeoRevenueIncrease.toFixed(2) }}</span>
        </div>
        <div class="result-item">
          <strong>Total Estimated Monthly Revenue:</strong>
          <span>${{ estimatedRevenue.toFixed(2) }}</span>
        </div>
        <div class="result-item">
          <strong>Total Extra Monthly Revenue:</strong>
          <span>${{ extraRevenue.toFixed(2) }}</span>
        </div>
        <div class="result-item">
          <strong>Net Extra Revenue (after ongoing costs):</strong>
          <span>${{ netExtraRevenue.toFixed(2) }}</span>
        </div>
        <div class="result-item">
          <strong>Estimated Payback Period:</strong>
          <span v-if="netExtraRevenue > 0">
            {{ paybackPeriod.toFixed(1) }} months
          </span>
          <span v-else>
            Not applicable (Net Extra Revenue is below ongoing costs)
          </span>
        </div>
      </div>
    </div>

    <!-- Full-Width Calculation Details Section -->
    <section class="calculation-details">
      <h2>Calculation Details & Sources</h2>

      <p>
        <strong>Target Page Load Speed:</strong> We target a load speed of
        <em>1.4 seconds</em> after the custom upgrade. This goal is chosen
        because studies have shown that faster load times lead to better user
        engagement, and we can typically guarantee this time for most stores.
      </p>

      <p>
        <strong>Speed Loss Factor:</strong> Research by Google and Akamai
        indicates that for every extra second beyond 1.4 seconds, conversions
        can drop by about <em>7%</em>. For example, if your site currently loads
        in 5 seconds, the extra 3.6 seconds imply a revenue multiplier
        calculated as: 1 + (3.6 × 0.07).
      </p>

      <p>
        <strong>UI/UX & SEO Bonus:</strong> Independent studies from Forrester
        and eConsultancy suggest that improved design, usability, and SEO can
        yield roughly a <em>10% revenue uplift</em>. This reflects better
        customer engagement and higher search rankings.
      </p>

      <p>
        <strong>Speed Multiplier:</strong> We calculate the speed multiplier
        using the formula: <em>1 + ((Current Speed - 1.4) × 0.07)</em>. For
        example, at 5 seconds, that’s 1 + (3.6 × 0.07) ≈ 1.252.
      </p>

      <p>
        <strong>UI/UX Multiplier:</strong> We use a flat multiplier of
        <em>1.10</em> to represent the 10% boost from improved design and SEO.
      </p>

      <p>
        <strong>Total Multiplier:</strong> The overall revenue multiplier is the
        product of the Speed Multiplier and the UI/UX Multiplier. This
        multiplier is applied to your current revenue to estimate your potential
        monthly revenue after upgrades.
      </p>

      <p>
        <strong>Extra Revenue:</strong> The extra revenue is determined by
        subtracting 1 from the Total Multiplier and multiplying by your current
        revenue.
      </p>

      <p>
        <strong>Net Extra Revenue:</strong> We calculate Net Extra Revenue by
        subtracting your Monthly Ongoing Costs from the Extra Revenue. This
        represents the additional monthly profit available to help recoup the
        upgrade investment.
      </p>

      <p>
        <strong>Payback Period:</strong> Finally, the payback period is
        estimated by dividing a <em>$20,000</em> one-time investment by the Net
        Extra Revenue. This tells you how many months it will take to recoup the
        investment through increased revenue.
      </p>

      <p class="disclaimer">
        <strong>Disclaimer:</strong> The estimates provided here are based on
        industry research and reputable sources including Google, Akamai,
        Forrester, and eConsultancy. Actual results may vary depending on a wide
        range of factors.
      </p>
    </section>
  </div>
</template>
  
  <script setup>
import { ref, computed } from "vue";

// User inputs
const currentRevenue = ref(0);
const currentSpeed = ref(0);
const ongoingCosts = ref(500); // Monthly ongoing costs (e.g., tax API, database hosting, AWS, etc.)

// Constants for our model
const targetSpeed = 1.4; // seconds (target page load speed)
const speedLossFactor = 0.07; // 7% conversion loss per extra second (Google/Akamai research)
const uiUxSeoBonus = 0.1; // 10% revenue boost from improved UI/UX & SEO

// Compute extra seconds above the target speed
const extraSeconds = computed(() => {
  return currentSpeed.value > targetSpeed
    ? currentSpeed.value - targetSpeed
    : 0;
});

// Speed multiplier: each extra second adds 7% potential improvement (if recovered)
const speedMultiplier = computed(() => {
  return 1 + extraSeconds.value * speedLossFactor;
});

// UI/UX & SEO multiplier: flat 10% boost
const uiUxSeoMultiplier = computed(() => {
  return 1 + uiUxSeoBonus;
});

// Total multiplier: product of Speed and UI/UX multipliers
const totalMultiplier = computed(() => {
  return speedMultiplier.value * uiUxSeoMultiplier.value;
});

// Revenue increase from speed improvements only
const speedRevenueIncrease = computed(() => {
  return currentRevenue.value * (speedMultiplier.value - 1);
});

// Revenue increase from UI/UX & SEO improvements only
const uiUxSeoRevenueIncrease = computed(() => {
  return currentRevenue.value * (uiUxSeoMultiplier.value - 1);
});

// Estimated total monthly revenue after improvements
const estimatedRevenue = computed(() => {
  return currentRevenue.value * totalMultiplier.value;
});

// Extra monthly revenue (the difference between estimated and current revenue)
const extraRevenue = computed(() => {
  return estimatedRevenue.value - currentRevenue.value;
});

// Net extra revenue after subtracting ongoing monthly costs
const netExtraRevenue = computed(() => {
  return extraRevenue.value - ongoingCosts.value;
});

// Estimated payback period for a $20,000 one-time investment (in months)
const paybackPeriod = computed(() => {
  return netExtraRevenue.value > 0 ? 20000 / netExtraRevenue.value : Infinity;
});
</script>
  
  <style scoped>
/* CSS Variables for consistent color palette */
:root {
  --primary-color: #2c74b3; /* A trustworthy blue */
  --secondary-color: #555;
  --background-light: #f8f8f8;
  --card-background: #fff;
  --details-background: #f1f1f1;
  --accent-color: #007bff;
  --font-family: "Helvetica Neue", Arial, sans-serif;
}

.roi-calculator-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1em;
  font-family: var(--font-family);
  color: var(--secondary-color);
}

/* Hero Section */
.hero {
  text-align: center;
  padding: 1em 0;
  margin-bottom: 1em;
  background: var(--background-light);
  border-bottom: 2px solid var(--primary-color);
}

.hero h1 {
  color: var(--primary-color);
  margin-bottom: 0.5em;
}

.hero .tagline {
  font-size: 1.1em;
  color: var(--secondary-color);
}

/* Calculator Card */
.calculator-card {
  background: var(--card-background);
  padding: 1.5em;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2em;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.input-section h2 {
  text-align: center;
  margin-bottom: 1em;
  color: var(--primary-color);
}

.input-group {
  margin-bottom: 1.2em;
}

.input-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5em;
}

.input-group input {
  width: 100%;
  padding: 0.6em;
  font-size: 1em;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.input-group .description {
  font-size: 0.85em;
  color: var(--secondary-color);
  margin-top: 0.3em;
}

/* Results Section */
.results-section {
  background: var(--background-light);
  padding: 1.2em;
  border-radius: 6px;
  margin-top: 1.5em;
}

.results-section h2 {
  text-align: center;
  color: var(--primary-color);
  margin-bottom: 1em;
}

.result-item {
  margin: 0.8em 0;
  font-size: 1em;
  display: flex;
  justify-content: space-between;
}

/* Calculation Details Section (Full Width) */
.calculation-details {
  width: 100%;
  background: var(--details-background);
  padding: 1.5em;
  box-sizing: border-box;
  margin-top: 2em;
}

.calculation-details h2 {
  text-align: center;
  margin-bottom: 1em;
  color: var(--primary-color);
}

.calculation-details p {
  max-width: 700px;
  margin: 0.8em auto;
  line-height: 1.6;
  font-size: 1em;
}

/* Disclaimer styling */
.disclaimer {
  font-size: 0.9em;
  font-style: italic;
  color: var(--secondary-color);
  text-align: center;
  margin-top: 1.5em;
}
</style>
  