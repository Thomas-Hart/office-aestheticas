<template>
  <div class="wrapper" v-if="hydrated">
    <transition name="fade" mode="out-in">
      <div v-if="!isLoggedIn" class="login-form">
        <div class="left">
          <div class="image-wrapper">
            <img src="/BlogPics/BlogPic1.webp" alt="" />
          </div>
        </div>
        <NavFooterPreloadLoginPage />
      </div>
      <div v-else class="dash">
        <ProfileSidebar
          :isSidebarVisible="isSidebarVisible"
          :currentSection="currentSection"
          @toggle-sidebar="isSidebarVisible = !isSidebarVisible"
          @change-section="changeSection"
        />
        <WebSectionsProfileContent
          :isSidebarVisible="isSidebarVisible"
          :currentSection="currentSection"
          @toggle-sidebar="isSidebarVisible = !isSidebarVisible"
          @close-sidebar="isSidebarVisible = false"
        />
      </div>
    </transition>
  </div>
</template>

<script setup>
const userStore = useUserStore();
const isLoggedIn = computed(() => !!userStore.token);
const hydrated = ref(false);

const currentSection = ref("dashboard");
const isSidebarVisible = ref(false);

const route = useRoute();
const router = useRouter();

const changeSection = (newSection) => {
  currentSection.value = newSection;
};

// Update the URL whenever `currentSection` changes
watch(currentSection, (newSection) => {
  router.replace({ query: { section: newSection } });
});

// Set `currentSection` based on the URL query parameter when the component mounts
onMounted(() => {
  hydrated.value = true;

  // Set the initial section based on the URL, defaulting to "dashboard"
  const sectionFromUrl = route.query.section;
  if (sectionFromUrl) {
    currentSection.value = sectionFromUrl;
  }

  window.addEventListener("resize", handleResize);
  handleResize(); // Initial check for sidebar visibility
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

const handleResize = () => {
  if (window.innerWidth > 768) {
    isSidebarVisible.value = true;
  }
};

useSeoMeta({
  title: "Nexgen Sales Portal - Access Your Door-to-Door Sales Training",
  ogTitle: "Nexgen Sales Portal - Access Your Door-to-Door Sales Training",
  description:
    "Log in to the Nexgen Sales Portal to access your door-to-door sales courses, track your progress, and enhance your skills with our interactive training modules.",
  ogDescription:
    "Access the Nexgen Sales Portal for exclusive door-to-door sales courses, progress tracking, and more. Start learning and advancing your sales career today.",
  ogImage: "/Logos/OAName.svg",
  twitterCard: "/Logos/OAName.svg",
});

const emit = defineEmits(["hide-loading"]);
emit("hide-loading");
</script>


<style scoped>
.wrapper {
  border-top: 2px solid white;
  border-bottom: 2px solid white;
  min-height: 100vh;
  background: white;
  /* overflow-y: scroll; */
  overflow-x: hidden;
  width: 100%;
}

.login-form {
  display: flex;
  align-items: stretch; /* Ensures both sides maintain their height */
  justify-content: space-between;
}

.left {
  width: 100%; /* Adjust as needed to control the width of the image section */
  display: flex;
}

.image-wrapper {
  width: 100%;
  height: 100vh; /* Ensures the image fills the entire height of the viewport */
}

img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.dash {
  display: flex;
  flex-direction: row;
  min-width: 100%;
  height: 100%;
}
</style>
