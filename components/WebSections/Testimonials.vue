<template>
  <div class="testimonials">
    <!-- prettier-ignore -->
    <div class="testimonials-container">
      <span class="arrow left" @click="prevTestimonial">&#8249;</span>
      <div class="testimonial-content">
        <div class="logo-wrapper">
          <img :src="resolvedLogoPath()" alt="company logo" />
        </div>
        <transition name="slide" mode="out-in">
          <div class="testimonial" :key="currentTestimonialIndex">
            <div class="star-rating">
              <!-- prettier-ignore -->
              <span v-for="star in currentTestimonial.rating" :key="star" class="star"></span>
            </div>
            <p class="comment">"{{ currentTestimonial.comment }}"</p>
            <p class="name">
              <b>{{ currentTestimonial.name }}</b>
            </p>
          </div>
        </transition>
        <div class="testimonial-circles">
          <!-- prettier-ignore -->
          <span v-for="(testimonial, index) in testimonials" :key="index" :class="{ active: index === currentTestimonialIndex }" class="circle" @click="changeTestimonial(index)"></span>
        </div>
      </div>
      <span class="arrow right" @click="nextTestimonial">&#8250;</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  logoPath: String,
});

const testimonials = ref([
  {
    name: "John Doe",
    rating: 5,
    comment:
      "I love this clinic! Dr Gurney has healed anything I've come in for! Definitely recommend!",
  },
  {
    name: "Jane Smith",
    rating: 5,
    comment:
      "I've been coming here for a few months now and I've seen amazing results.",
  },
  {
    name: "Bob Johnson",
    rating: 5,
    comment:
      "I've tried a lot of different clinics, but this one is by far the best.",
  },
]);

const currentTestimonialIndex = ref(0);

const currentTestimonial = computed(() => {
  return testimonials.value[currentTestimonialIndex.value];
});

function resolvedLogoPath() {
  return "/" + props.logoPath;
}

function prevTestimonial() {
  currentTestimonialIndex.value =
    (currentTestimonialIndex.value - 1 + testimonials.value.length) %
    testimonials.value.length;
}

function nextTestimonial() {
  currentTestimonialIndex.value =
    (currentTestimonialIndex.value + 1) % testimonials.value.length;
}

function changeTestimonial(index) {
  currentTestimonialIndex.value = index;
}
</script>

<style scoped>
.testimonials {
  text-align: center;
  max-width: 1300px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 2rem;
  background: transparent;
  min-height: 20rem;
}

.testimonials-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
  position: relative;
}

.arrow {
  cursor: pointer;
  font-size: 50px;
  margin: 0 20px;
  opacity: 0;
  transition: opacity 0.3s, transform 0.3s;
  -webkit-user-select: none; /* Safari 3.1+ So the arrows don't highlight when I click them */
  -moz-user-select: none; /* Firefox 2+ */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Standard syntax */
  color: white;
}

.testimonials-container:hover .arrow.left {
  opacity: 1;
  transform: translateX(-1.5rem);
}

.testimonials-container:hover .arrow.right {
  opacity: 1;
  transform: translateX(1.5rem);
}

.testimonial-content {
  padding: 2rem;
  background: rgba(0, 0, 0, 0.05);
  /* border: 2px solid black; */
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  width: 100%;
  height: 100%;
  /* min-height: 20rem; */
  gap: 2rem;
  position: relative;
  border-radius: 0px;
  background: white;
}

.logo-wrapper {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  overflow: hidden;
}

.logo-wrapper img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.testimonial {
  display: flex;
  flex-direction: column;
  margin-bottom: 40px;
  width: 100%;
  height: 100%;
  align-items: flex-start;
}

.star-rating {
  margin-top: 10px;
}

.star {
  display: inline-block;
  margin-right: 5px;
  width: 20px;
  height: 20px;
  background: url("/star.webp") no-repeat;
  background-size: cover;
}

.comment {
  font-style: italic;
  font-size: 19px;
  margin-top: 5px;
  text-align: left;
}

.name {
  font-style: bold;
  margin-top: 2rem;
}

.testimonial-circles {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 2rem;
  left: 0;
  right: 0;
  /* background: blue; */
}

.circle {
  cursor: pointer;
  display: inline-block;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 3px solid #3a3a3b;
  margin: 0 5px;
}

.active {
  background-color: black;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter,
.slide-leave-to {
  opacity: 0;
  transform: translateX(10%);
}

.slide-leave,
.slide-enter-to {
  opacity: 1;
  transform: translateX(0);
}

@media (max-width: 768px) {
  /*  ------------  MOBILE  ------------   */
  .arrow {
    opacity: 1;
  }
}

@media (max-width: 480px) {
  .testimonials {
    padding: 1rem;
  }

  .testimonial-content {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .arrow {
    margin: 0 20px;
  }
}
</style>
