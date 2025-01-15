<template>
  <div class="steps-section">
    <div class="step-cards">
      <div class="step-card" v-for="(step, index) in steps" :key="index">
        <div class="icon">
          <img :src="step.icon" :alt="`Step ${index + 1} icon`" />
        </div>
        <h3>{{ step.title }}</h3>
        <p>{{ step.description }}</p>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
const steps = [
  {
    icon: "/Graphics/CourseIcon.webp",
    title: "Step 1: Enroll in the Course",
    description:
      "Sign up for the appropriate course that aligns with the type of sales you want to master.",
  },
  {
    icon: "/Graphics/TrainingIcon.webp",
    title: "Step 2: Complete the Training",
    description:
      "Go through the course material, watch the videos, and complete the training modules.",
  },
  {
    icon: "/Graphics/DocumentIcon.webp",
    title: "Step 3: Submit Documentation",
    description:
      "Send us the required documentation and fill out the application to proceed.",
  },
  {
    icon: "/Graphics/SubmitIcon.webp",
    title: "Step 4: Notify Completion",
    description:
      "Let us know once you have completed all the steps and are ready for the next phase.",
  },
];
</script>
  
  <style scoped>
.steps-section {
  /* background-color: #000; */
  color: white;
  padding: 4rem 2rem;
  text-align: center;
}

.steps-section h2 {
  font-size: 2.5rem;
  color: #0197b2;
  margin-bottom: 1rem;
}

.subheading {
  font-size: 1rem;
  color: #ccc;
  margin-bottom: 3rem;
}

.step-cards {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.step-card {
  background-color: #333;
  padding: 2rem;
  width: 16rem;
  text-align: left;
  border-radius: 8px;
  box-shadow: 1px 1px 5px rgba(255, 255, 255, 0.3);
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.step-card:hover {
  transform: translateY(-5px);
  box-shadow: 1px 1px 8px rgba(255, 255, 255, 0.5);
}

.icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
}

.icon img {
  height: 3rem;
  width: 3rem;
}

h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

p {
  font-size: 1rem;
  line-height: 1.5;
  color: #ccc;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .step-cards {
    gap: 1.5rem;
  }

  .step-card {
    width: 14rem;
    padding: 1.5rem;
  }

  h3 {
    font-size: 1.3rem;
  }

  p {
    font-size: 0.95rem;
  }
}

@media (max-width: 768px) {
  .step-cards {
    flex-direction: column;
    align-items: center;
  }

  .step-card {
    width: 90%;
    max-width: 20rem;
    text-align: center;
  }

  .icon {
    justify-content: center;
  }

  h3 {
    font-size: 1.2rem;
  }

  p {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .steps-section {
    padding: 2rem 1rem;
  }

  .step-card {
    padding: 1rem;
  }

  .icon img {
    height: 2.5rem;
    width: 2.5rem;
  }

  h3 {
    font-size: 1.1rem;
  }

  p {
    font-size: 0.85rem;
  }
}
</style>
  