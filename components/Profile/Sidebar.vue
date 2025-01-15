<template>
  <transition name="slid">
    <div v-if="isSidebarVisible" class="sidebar">
      <!-- <div class="logo-wrapper">
        <img src="/OAName.webp" alt="Logo" />
      </div> -->
      <!-- Use computedSections and apply the active class similar to the first component -->
      <div
        v-for="section in computedSections"
        :key="section.name"
        class="nav-item"
        :class="{ active: isActive(section.name, false) }"
        @click="
          section.name === 'logout'
            ? handleLogout()
            : toggleDropdown(section.name)
        "
      >
        <div class="section-title">
          <img :src="getImageSrc(section.icon, section.name)" alt="Icon" />
          <h3>{{ section.title }}</h3>
          <img
            v-if="section.hasDropdown"
            :src="getArrowSrc(section.name)"
            class="arrow"
            alt="Dropdown Arrow"
          />
        </div>
        <div v-if="dropdowns[section.name]" class="sub-menu">
          <div
            v-for="sub in section.subSections"
            :key="sub.name"
            class="sub-item"
            :class="{ active: isActive(sub.name, true) }"
            @click="setActiveSection(sub.name)"
          >
            {{ sub.title }}
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
  
<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router"; // Import router to handle routes

const router = useRouter();
const dropdowns = ref({});
const userStore = useUserStore();

const props = defineProps({
  isSidebarVisible: Boolean,
  currentSection: String,
});

const emit = defineEmits(["toggle-sidebar", "change-section"]);

// Admin and regular sections
const sections = [
  { name: "dashboard", hasDropdown: false, title: "Dashboard", icon: "Dash" },
  {
    name: "profile",
    hasDropdown: false,
    title: "Profile & Preferences",
    icon: "Profile",
  },
  {
    name: "orders",
    hasDropdown: false,
    title: "Orders & Returns",
    icon: "Orders",
  },
  { name: "wishlist", hasDropdown: false, title: "Wishlist", icon: "Wishlist" },
  {
    name: "payment",
    hasDropdown: false,
    title: "Payment & Shipping",
    icon: "Payment",
  },
  { name: "support", hasDropdown: false, title: "Support", icon: "Support" },
  { name: "logout", hasDropdown: false, title: "Logout", icon: "Logout" },
];

const adminSections = [
  { name: "dashboard", hasDropdown: false, title: "Dashboard", icon: "Dash" },
  {
    name: "profile",
    hasDropdown: false,
    title: "Profile & Preferences",
    icon: "Profile",
  },
  {
    name: "orders",
    hasDropdown: false,
    title: "Orders & Returns",
    icon: "Orders",
  },
  { name: "wishlist", hasDropdown: false, title: "Wishlist", icon: "Wishlist" },
  {
    name: "payment",
    hasDropdown: false,
    title: "Payment & Shipping",
    icon: "Payment",
  },
  { name: "support", hasDropdown: false, title: "Support", icon: "Support" },
  { name: "logout", hasDropdown: false, title: "Logout", icon: "Logout" },
  {
    name: "admin",
    hasDropdown: true,
    title: "Admin Console",
    icon: "Orders",
    subSections: [
      { name: "tickets", title: "Tickets" },
      { name: "edit-orders", title: "Edit Orders" },
      { name: "edit-users", title: "Edit Users" },
      { name: "edit-blogs", title: "Edit Blogs" },
    ],
  },
];

// Computed sections based on user role
const computedSections = computed(() => {
  const role = userStore.user.role;
  return role === "admin" ? adminSections : sections;
});

// Function to check if a section or subsection is active
const isActive = (sectionName, isSubsection = false) => {
  // Check if it's a subsection
  if (isSubsection) {
    return props.currentSection === sectionName;
  }
  // Check if the parent section is active or if any of its subsections are active
  const hasActiveChild = isSubsectionActive(sectionName);
  return props.currentSection === sectionName || hasActiveChild;
};

// Toggle dropdown visibility for sections with subsections
const toggleDropdown = (sectionName) => {
  const section = computedSections.value.find((s) => s.name === sectionName);

  if (section?.hasDropdown) {
    dropdowns.value[sectionName] = !dropdowns.value[sectionName];
  } else {
    setActiveSection(sectionName);
  }
};

// Check if any subsection is active
const isSubsectionActive = (parentSection) => {
  return computedSections.value
    .find((s) => s.name === parentSection)
    ?.subSections?.some((sub) => props.currentSection === sub.name);
};

// Set the active section or subsection
const setActiveSection = (sectionName) => {
  emit("change-section", sectionName);

  // Close all dropdowns after setting the active section
  Object.keys(dropdowns.value).forEach((key) => {
    dropdowns.value[key] = false;
  });

  // Hide the sidebar on mobile devices
  if (window.innerWidth <= 768) {
    emit("toggle-sidebar");
  }
};

// Get the appropriate arrow icon for sections with dropdowns
const getArrowSrc = (section) => {
  const isDropdownOpen = dropdowns.value[section];
  const hasActiveSubsection = isSubsectionActive(section);
  return isDropdownOpen
    ? hasActiveSubsection
      ? `/ProfilePics/UpArrowActive.svg`
      : `/ProfilePics/UpArrow.svg`
    : hasActiveSubsection
    ? `/ProfilePics/DownArrowActive.svg`
    : `/ProfilePics/DownArrow.svg`;
};

// Get the icon source for sections
const getImageSrc = (baseName, section) =>
  `/ProfilePics/${isActive(section) ? baseName + "Active" : baseName}.svg`;

// Handle logout
const handleLogout = () => {
  userStore.logout();
  router.push("/"); // Redirect to home page
};
</script>
  
  <style scoped>
.sidebar {
  min-width: 300px;
  background-color: #4a4a4a;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  top: 0;
  left: 0;
  z-index: 10;
  padding: 1rem 0;
}

.logo-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: auto;
}

.logo-wrapper img {
  height: 100%;
  width: 100%;
}

img {
  height: 20px;
  width: 20px;
}

h3 {
  font-size: 1rem;
}

.arrow {
  height: 15px;
  width: 15px;
}

.nav-item {
  padding: 1rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 1rem;
  color: #aaaaaa;
  transition: color 0.3s ease;
}

.nav-item.active {
  color: white;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sub-menu {
  padding-left: 1rem;
  padding-top: 0.5rem;
}

.sub-item {
  margin-bottom: 1rem;
  cursor: pointer;
  color: #aaaaaa;
  font-size: 1rem;
}

.sub-item.active {
  color: white;
}

@media (max-width: 768px) {
  .sidebar {
    min-width: 225px;
  }

  h3 {
    font-size: 0.8rem;
  }
}
</style>
  