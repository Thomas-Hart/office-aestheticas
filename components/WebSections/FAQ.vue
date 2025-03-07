<template>
  <!--prettier-ignore-->
  <div class="FAQ-wrapper">
    <h1>Frequently Asked Questions</h1>
    <div v-for="(item, index) in items" :key="index" class="faq-item">
      <div class="question" @click="trackAndToggle(index)">
        <div class="content">
          <div>
            {{ item.question }}
          </div>
          <div class="toggle-icon" :class="{ 'open': isActive(index) }">
            +
          </div>
        </div>
      </div>
      <div class="answer" :class="{ 'open': isActive(index) }">
        <div>
          {{ item.answer }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const activeIndices = ref([]);

const userStore = useUserStore();

// Check if user is logged in
const isLoggedIn = computed(() => !!userStore.token);

// Inject Meta Pixel and Klaviyo with $ prefix
const { $fbq } = useNuxtApp();
const { $klaviyo } = useNuxtApp();

const items = ref([
  {
    question: "What is the return policy?",
    answer: "Please contact us for information about our return policy.",
  },
  {
    question: "How long does shipping take?",
    answer: "Shipping typically takes 3-5 business days.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards and PayPal.",
  },
]);

const toggle = (index) => {
  const position = activeIndices.value.indexOf(index);
  if (position === -1) {
    activeIndices.value.push(index);
  } else {
    activeIndices.value.splice(position, 1);
  }
};

const isActive = (index) => {
  return activeIndices.value.includes(index);
};

/** Toggle FAQ and track the action. */
function trackAndToggle(index) {
  trackNavigation("FAQ", items.value[index].question);
  toggle(index);
}

/** Track navigation or interaction events with Meta Pixel and Klaviyo, including login status and user data. */
function trackNavigation(actionType, action = null) {
  let eventName, properties;

  if (actionType === "FAQ") {
    eventName = "ToggledFAQ";
    properties = {
      question: action,
      timestamp: new Date().toISOString(),
    };
  }

  const enhancedProperties = isLoggedIn.value
    ? {
        ...properties,
        isLoggedIn: true,
        userId: userStore.user._id,
        email: userStore.user.email,
        cartSize: userStore.user.cart.length,
        wishlistSize: userStore.user.wishlist.length,
        recentlyViewedCount: userStore.user.recentlyViewedItems.length,
        location: `${userStore.user.contact.city}, ${userStore.user.contact.state}`,
      }
    : {
        ...properties,
        isLoggedIn: false,
      };

  // Track with Meta Pixel
  $fbq("trackCustom", eventName, enhancedProperties);

  // Track with Klaviyo
  $klaviyo("track", eventName, enhancedProperties);
}
</script>

<style scoped>
.FAQ-wrapper {
  margin: 0 auto;
  max-width: 1300px;
  padding: 4rem 2rem 12rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  user-select: none;
  font-family: Manrope, cursive;
}

h1 {
  font-size: 3rem;
  margin-bottom: 3rem;
}
.faq-item {
  cursor: pointer;
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.question {
  cursor: pointer;
  width: 100%;
  height: 7rem;
  display: flex;
  align-items: center;
  border-bottom: 2px solid #e4e7eb;
  margin: -1px 0;
  font-size: 1.25rem;
  font-weight: bold;
  padding: 0 2rem;
}

.content {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.toggle-icon {
  display: flex;
  flex-direction: column;
  min-width: 5rem;
  width: 5rem;
  min-height: 5rem;
  height: 5rem;
  border-radius: 50%;
  border: 2px solid black;
  justify-content: center;
  align-items: center;
  margin: 0 2rem;
  font-size: 4rem;
  font-weight: lighter;
  transition: transform 0.3s ease-in-out;
}

.toggle-icon.open {
  transform: rotate(135deg);
}

.answer {
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  margin: -1px 0;
  background: #e4e7eb;
  overflow: hidden;
  height: 7rem;
  max-height: 0;
  transition: max-height 0.3s ease-in-out;
  padding: 0 5rem;
  font-size: 1rem;
}
.answer.open {
  max-height: 7rem;
}

@media (max-width: 480px) {
  /*  ------------  MOBILE  ------------   */
  .FAQ-wrapper {
    padding: 6rem 1rem;
  }

  .question {
    padding: 0;
  }

  .toggle-icon {
    margin: 0 1rem;
  }

  .answer {
    padding: 0 1rem;
  }
}
</style>