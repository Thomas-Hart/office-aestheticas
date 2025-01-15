<template>
  <div class="content-page-intro">
    <div class="content" :style="{ color: textColor, textShadow: textShadow }">
      <h1>{{ header }}</h1>
      <h2>{{ subheader }}</h2>
      <div class="down-arrow-wrapper">
        <img :src="resolvedDownArrowPath()" alt="Down Arrow" />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  header: String,
  subheader: String,
  textColor: String,
  textShadow: String,
  buttonClass: String,
  buttonPath: String,
  buttonText: String,
  downArrowPath: String,
});

const resolvedDownArrowPath = () => "/" + props.downArrowPath;
</script>

<style scoped>
.content-page-intro {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.content {
  width: 100%;
  height: 100%;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-top: -6rem;
}

h1 {
  font-size: 70px;
  font-weight: 700;
  margin: 0;
}

h2 {
  font-size: 32px;
  margin: 10px 0 60px 0;
  font-weight: normal;
}

.down-arrow-wrapper {
  position: absolute;
  left: 50%;
  bottom: 20%;
  transform: translate(-50%, -50%);
  height: 5rem;
  width: 5rem;
  object-fit: cover;
}

.down-arrow-wrapper img {
  height: 100%;
  width: 100%;
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  /*  ------------  MOBILE  ------------   */
  .content-page-intro {
    padding: 5rem 1rem;
  }

  .content {
    align-items: center;
    text-align: center;
    margin-top: 0;
  }

  h1 {
    font-size: 40px;
  }

  h2 {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .down-arrow-wrapper {
    bottom: 10%;
  }
}

@media (max-width: 350px) {
  h1 {
    font-size: 35px;
  }
}
</style>