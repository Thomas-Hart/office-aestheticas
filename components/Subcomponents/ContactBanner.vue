<template>
  <div
    class="contact-banner-wrapper"
    :style="{ background: resolvedBackground() }"
  >
    <!-- prettier-ignore -->
    <div class="contact-banner-content">
      Questions?
      <div class="contact-graphic-wrapper">
        <img :src="resolvedImgPath()" alt="NOT WORKING" />
      </div>
      <button :class="buttonClass" @click="switchRoute(buttonPath)">{{ buttonText }}</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  graphicPath: String,
  buttonClass: String,
  buttonPath: String,
  buttonText: {
    type: String,
    default: "Contact Us",
  },
  backgroundPath: String,
  background: String,
});

const router = useRouter();

const resolvedImgPath = () => "/" + props.graphicPath;

const switchRoute = (route) => {
  router.push(route);
};

const resolvedBackground = () => {
  if (props.backgroundPath) {
    return `url(${"/" + props.backgroundPath}) no-repeat, #166dae`;
  } else {
    return props.background;
  }
};
</script>

<style scoped>
.contact-banner-wrapper {
  position: relative;
  margin-top: 10rem;
  bottom: 2rem;
  min-height: 8rem;
  height: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  border: none;
  z-index: 4;
}

.contact-banner-content {
  margin: 0 auto;
  max-width: 1200px;
  padding: 2rem;
  height: 100%;
  display: flex;
  justify-content: space-around;
  gap: 2rem;
  align-items: center;
  color: white;
  font-size: 2rem;
}

.contact-graphic-wrapper {
  height: 5rem;
  width: 5rem;
}

.contact-graphic-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 600px) {
  /*  ------------  MOBILE  ------------   */
  .contact-banner-content {
    padding: 3rem 1rem;
    flex-direction: column;
    gap: 1rem;
  }
}
</style>