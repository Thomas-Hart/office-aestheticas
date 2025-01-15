<template>
  <div class="interactive-quiz">
    <h3 contenteditable @input="updateQuestion">{{ quiz.question }}</h3>
    <ul>
      <li v-for="(option, optionIndex) in quiz.options" :key="optionIndex">
        <div class="quiz-option-container">
          <input
            type="radio"
            :name="quiz.question"
            @click="quiz.correctAnswer = optionIndex"
            :checked="quiz.correctAnswer === optionIndex"
          />
          <span
            class="quiz-option-text"
            contenteditable
            @input="updateOption(optionIndex, $event)"
          >
            {{ option }}
          </span>
        </div>
      </li>
    </ul>
    <button @click="addOption" class="add-option-button">Add Option</button>
  </div>
</template>

<script setup>
const props = defineProps({
  quiz: Object,
});

const updateQuestion = (event) => {
  props.quiz.question = event.target.innerText;
};

const updateOption = (index, event) => {
  props.quiz.options[index] = event.target.innerText;
};

const addOption = () => {
  props.quiz.options.push("New Option");
};
</script>

<style scoped>
.quiz-option-container {
  margin: 10px 0;
}

.quiz-option-text {
  margin-left: 10px;
  font-size: 16px;
}

.add-option-button {
  margin-top: 10px;
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
