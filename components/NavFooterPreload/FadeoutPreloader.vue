<template lang="html">
    <div class="preloader">
        <div  class="typewriter-container">
           <h1 :style="{'--steps' : text.length, color: textColor }">{{ text }}</h1> 
        </div>
        <video autoplay playsinline loop muted class="vid" :src="resolveVidPath()"></video>
        <!-- <img :src="resolvePicPath(logoPath)" alt="Logo"> -->
    </div>
</template>

<script setup>
let { logoPath, vidPath, text, textColor } = defineProps({
  logoPath: String,
  vidPath: String,
  text: String,
  textColor: String,
});

const resolvePicPath = (path) => {
  return `/${path}`;
};

const resolveVidPath = () => {
  return `/${vidPath}`;
};

onMounted(() => {
  window.addEventListener("load", () => {
    const preloader = document.querySelector(".preloader");
    preloader.addEventListener("transitionend", () => {
      document.body.removeChild(preloader);
    });
  });
});

defineExpose({
  resolvePicPath,
});
</script>

<style scoped>
.preloader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: black;
  z-index: 100;
  animation: preload 2.5s ease forwards;
}

h1 {
  width: auto;
  font-size: 2rem;
  font-weight: bolder;
  font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue",
    Helvetica, Arial, "Lucida Grande", sans-serif;
}

.vid,
img {
  pointer-events: none;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  animation: video-transition 1.5s ease forwards;
  margin-top: 20px;
}

/* .preloader::after {          // If you want a loading symbol
    content: "";
    width: 75px;
    height: 75px;
    border: 15px solid #dddddd;
    border-top-color: #009578;
    border-radius: 50%;
    animation: loading 0.75s ease infinite;
} */

/* @keyframes loading {
    from { transform: rotate(0turn); }
    to { transform: rotate(1turn); }
} */

@keyframes video-transition {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes preload {
  0% {
    opacity: 1;
    visibility: visible;
    /* transform: translateY(0); */
  }

  70% {
    opacity: 1;
    visibility: visible;
    /* transform: translateY(0); */
  }

  75% {
    opacity: 1;
    visibility: visible;
    /* transform: translateY(2%); */
  }

  100% {
    opacity: 0;
    visibility: hidden;
    /* transform: translateY(-100%); */
  }
}

/* The typing effect */
@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

/* The typewriter cursor effect */
@keyframes blink-caret {
  from,
  to {
    border-color: transparent;
  }
  50% {
    border-color: blue;
  }
}

video::-webkit-media-controls-start-playback-button {
  display: none;
}
</style>