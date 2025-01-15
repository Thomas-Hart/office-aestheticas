<template>
  <div class="interactive-quiz">
    <h3>{{ quiz.question }}</h3>
    <ul>
      <li v-for="(option, optionIndex) in quiz.options" :key="optionIndex">
        <button
          @click="checkAnswer(optionIndex, quiz.correctAnswer)"
          :class="[
            'quiz-option-button',
            {
              correct:
                selectedQuizOption !== null &&
                optionIndex === quiz.correctAnswer,
              incorrect:
                selectedQuizOption === optionIndex &&
                optionIndex !== quiz.correctAnswer,
            },
          ]"
          :disabled="selectedQuizOption !== null"
        >
          {{ option }}
        </button>
      </li>
    </ul>
  </div>
</template>
  
  <script setup>
const props = defineProps({
  quiz: Object,
});

const selectedQuizOption = ref(null);

const checkAnswer = (selected, correct) => {
  if (selectedQuizOption.value !== null) return; // Prevent multiple selections

  selectedQuizOption.value = selected;
};
</script>
  
  <style scoped>
.interactive-quiz {
  margin-bottom: 2rem;
}

.quiz-option-button {
  display: block;
  width: 100%;
  margin: 0.5rem 0;
  padding: 0.8rem;
  font-size: 1rem;
  background-color: #e0e0e0;
  border: none;
  border-radius: 25px;
  transition: background-color 0.3s ease, transform 0.3s ease;
  cursor: pointer;
  text-align: left;
  position: relative;
}

.quiz-option-button.correct {
  background-color: #28a745;
  color: white;
}

.quiz-option-button.incorrect {
  background-color: #dc3545;
  color: white;
}

.quiz-option-button:hover:not(.correct):not(.incorrect) {
  background-color: #d0d0d0;
  transform: translateY(-2px);
}

ul {
  list-style-type: none;
}
</style>
  