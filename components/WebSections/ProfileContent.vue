<template>
  <div class="dashboard">
    <div class="content-section" :class="{ shifted: isSidebarVisible }">
      <button class="toggle-sidebar" @click="toggleSidebar()">
        <img src="/Graphics/NavBars.svg" alt="Menu" />
      </button>
      <transition name="fade" mode="out-in">
        <ProfileDashboard v-if="currentSection == 'dashboard'" />
        <ProfilePreferences v-else-if="currentSection == 'profile'" />
        <ProfileOrders
          v-else-if="currentSection == 'orders'"
          :orders="orders"
        />
        <ProfileWishlist
          v-else-if="currentSection == 'wishlist'"
          @close-sidebar="closeSidebar()"
        />
        <ProfileTicketSupport v-else-if="currentSection == 'support'" />
        <ProfileAdminTickets
          v-else-if="
            currentSection == 'tickets' && userStore.user.role == 'admin'
          "
          @close-sidebar="closeSidebar()"
        />
        <ProfileAdminEditOrders
          v-else-if="
            currentSection == 'edit-orders' && userStore.user.role == 'admin'
          "
          @close-sidebar="closeSidebar()"
        />
        <ProfileAdminEditUsers
          v-else-if="
            currentSection == 'edit-users' && userStore.user.role == 'admin'
          "
          @close-sidebar="closeSidebar()"
        />
        <ProfileAdminEditBlogs
          v-else-if="
            currentSection == 'edit-blogs' && userStore.user.role == 'admin'
          "
        />
      </transition>
    </div>
  </div>
</template>

<script setup>
const userStore = useUserStore();

const props = defineProps({
  isSidebarVisible: Boolean,
  currentSection: String,
});

const { data: orders } = useFetch(`/api/orders/${userStore.user._id}`);

const mockOrders = [
  {
    invoiceNumber: "INV100001",
    orderDate: "2024-11-20",
    shippedDate: "2024-11-22",
    expectedDeliveryDate: "2024-11-25",
    deliveryDate: null,
    status: "Shipped",
    totalCost: 150.75,
    itemizedList: [
      {
        image: "/BlogPics/BlogPic1.webp",
        name: "Item A",
        quantity: 2,
        price: 30.5,
      },
      { image: "/BlogPic2.webp", name: "Item B", quantity: 1, price: 90.0 },
    ],
    salesTax: 10.25,
    salesTaxRate: 0.08,
    buyersBillingAddress: {
      streetAddress: "123 Main St",
      city: "Springfield",
      state: "IL",
      ZIPCode: "62701",
      firstName: "John",
      lastName: "Doe",
    },
    buyersShippingAddress: {
      streetAddress: "123 Main St",
      city: "Springfield",
      state: "IL",
      ZIPCode: "62701",
      firstName: "John",
      lastName: "Doe",
    },
    sellersBusinessInformation: {
      businessName: "Best Products LLC",
      address: {
        streetAddress: "456 Market Ave",
        city: "Metropolis",
        state: "NY",
        ZIPCode: "10101",
      },
      taxIDNum: "123-456-789",
    },
    paymentMethod: "Credit Card",
    trackingNumber: 987654321,
  },
  {
    invoiceNumber: "INV100002",
    orderDate: "2024-11-15",
    shippedDate: "2024-11-16",
    expectedDeliveryDate: "2024-11-19",
    deliveryDate: "2024-11-18",
    status: "Delivered",
    totalCost: 275.99,
    itemizedList: [
      { image: "/BlogPic3.webp", name: "Item C", quantity: 3, price: 50.0 },
      { image: "/BlogPic4.webp", name: "Item D", quantity: 1, price: 125.99 },
      { image: "/BlogPic5.webp", name: "Item E", quantity: 2, price: 25.0 },
    ],
    salesTax: 20.99,
    salesTaxRate: 0.08,
    buyersBillingAddress: {
      streetAddress: "789 Elm St",
      city: "Riverdale",
      state: "CA",
      ZIPCode: "90210",
      firstName: "Jane",
      lastName: "Smith",
    },
    buyersShippingAddress: {
      streetAddress: "789 Elm St",
      city: "Riverdale",
      state: "CA",
      ZIPCode: "90210",
      firstName: "Jane",
      lastName: "Smith",
    },
    sellersBusinessInformation: {
      businessName: "Tech Solutions Inc.",
      address: {
        streetAddress: "101 Silicon Valley",
        city: "San Jose",
        state: "CA",
        ZIPCode: "95110",
      },
      taxIDNum: "987-654-321",
    },
    paymentMethod: "PayPal",
    trackingNumber: 123456789,
  },
];

const emit = defineEmits(["toggle-sidebar", "change-section", "close-sidebar"]);

const toggleSidebar = () => {
  emit("toggle-sidebar");
};

const closeSidebar = () => {
  emit("close-sidebar");
};
</script>

<style scoped>
.dashboard {
  display: flex;
  font-family: "Source Sans Pro", Montserrat;
  font-weight: bold;
  transition: transform 0.3s ease;
  width: 100%;
  min-width: 350px;
  position: relative;
  transition: all 0.3s ease;
}

.content-section {
  flex: 1;
  background-color: #737373;
  min-height: 100vh;
  transition: margin-left 0.3s ease;
  width: 100%;
  transition: transform 0.3s ease;
  padding: 0;
  position: relative;
}

.toggle-sidebar {
  background: transparent;
  border: none;
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 1000;
  cursor: pointer;
}

.toggle-sidebar img {
  height: 30px;
  width: 30px;
}

@media (max-width: 768px) {
  .content-section {
    margin-left: 0;
  }

  /* Adjust margins for buttons and other elements */
  .toggle-sidebar {
    margin: 1rem; /* Ensure there's space from the viewport edges */
  }

  .content-section.shifted {
    /* transform: translateX(225px); */
  }

  .toggle-sidebar {
    display: block;
    margin-left: 0rem;
    margin-top: 0rem;
  }
}

@media (min-width: 768px) {
  .toggle-sidebar {
    display: none;
  }

  .content-section {
  }
}
</style>
