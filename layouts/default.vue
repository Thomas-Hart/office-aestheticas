<template>
  <div>
    <NavFooterPreloadOANav />

    <div>
      <slot />
    </div>
    <!-- <div class="divider">
        <svg
          width="100%"
          height="100"
          viewBox="0 0 100 10"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="100" height="10" fill="" />
          <path d="M 0 0 Q 0 10 25 10 L 100 10 L 100 0 Z" fill="white" />
        </svg>
      </div> -->
    <NavFooterPreloadOAFooter />
  </div>
</template>
  
  <script setup>
const showMobileNav = ref(false);

const store = useUserStore();
const isLoggedIn = computed(() => !!store.token);

// Define the two arrays
const paths1 = [
  "home",
  "search Contractors",
  "search Subcontractors",
  "search Suppliers",
  "search Agencies",
  "articles",
  "contact",
];
const paths2 = [
  "home",
  // "profile",
  "search Contractors",
  "search Subcontractors",
  "search Suppliers",
  "search Agencies",
  "articles",
  "contact",
];

// Reactive variable to control which array is active
const usePaths1 = ref(true);

// Computed property to return the current array based on the reactive variable
const currentPaths = computed(() => {
  return p;
});
</script>
  
  <style scoped media="screen">
#app {
  scroll-behavior: smooth;
  background-color: #545454;
  font-family: "Montserrat", sans-serif, "HelveticaNeue-Light",
    "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande",
    sans-serif;
  position: static;
}

/* For Webkit browsers */
::-webkit-scrollbar {
  width: 8px; /* Adjust the width of the scrollbar */
}

::-webkit-scrollbar-track {
  background: #f0f0f0; /* Track background color */
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background-color: #888; /* Thumb color */
  border-radius: 10px; /* Round edges */
  border: 2px solid #f0f0f0; /* Space between thumb and track */
}

::-webkit-scrollbar-thumb:hover {
  background-color: #555; /* Thumb color on hover */
}

/* For Firefox */
* {
  scrollbar-width: thin; /* Make it thinner */
  scrollbar-color: #888 #f0f0f0; /* Thumb color and track background */
}

.content {
  width: 100%;
  height: auto;
  animation: item-load 0.8s;
}

footer {
  /* position: relative;
  
  border-top: 1px solid gray;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  min-height: 40rem;
  overflow: hidden; */
}

.image-overflow-hidden {
  overflow: hidden;
  width: 100%;
  height: 25vh;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}

.image-overflow-hidden img {
  width: 100%;
}

.divider {
  margin-bottom: -4px;
}

.divider-grow {
  transform: scale(100%);
  transition: 3s ease-out;
  max-width: 100%;
}

.divider-grow.active {
  transform: scale(140%);
}

@keyframes item-load {
  0% {
    transform: translateY(8%);
    opacity: 0%;
  }

  50% {
    transform: translateY(8%);
    opacity: 0%;
  }

  100% {
    transform: translateY(0%);
    opacity: 100%;
  }
}

@keyframes page-load {
  0% {
    transform: translateY(-20%);
    opacity: 0%;
  }

  100% {
    transform: translateY(0%);
    opacity: 100%;
  }
}

@media (max-width: 768px) {
  /* Mobile View */
  body.overflow-hidden {
    overflow: hidden;
  }

  .image-overflow-hidden {
    height: 32vh;
  }

  .nav-slide-out {
    transform: translateY(10%);
    opacity: 0;
    z-index: -1;
  }

  .divider-grow {
    transform: scale(100%);
    transition: 3s all ease-out;
    max-width: 100%;
  }

  .divider-grow.active {
    transform: scale(140%);
  }
}

@media (max-width: 480px) {
  .image-overflow-hidden {
    height: 25vh;
  }
}
</style>

  