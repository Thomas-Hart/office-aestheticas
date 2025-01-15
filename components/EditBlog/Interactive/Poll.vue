<template>
  <div class="interactive-poll">
    <h3 contenteditable @input="updateQuestion">{{ poll.question }}</h3>
    <ul>
      <li v-for="(option, optionIndex) in poll.options" :key="optionIndex">
        <div class="poll-option-container">
          <button
            class="poll-option-button"
            :class="{
              selected: optionIndex === selectedPollOption,
              correct: optionIndex === correctPollOption,
            }"
            @click="selectOption(optionIndex)"
            :disabled="selectedPollOption !== null"
          >
            <span
              class="option-text"
              contenteditable
              @input="updateOption(optionIndex, $event)"
            >
              {{ option.option }}
            </span>
            <span class="percentage-text" v-if="showPercentages">
              {{ Math.round(option.percentage) }}%
            </span>
            <div
              class="fill-bar"
              :style="{
                width: showPercentages ? option.percentage + '%' : '0%',
              }"
            ></div>
          </button>
          <button
            @click="removeOption(optionIndex)"
            class="remove-option-button"
            v-if="poll.options.length > 2"
          >
            ✖
          </button>
          <button
            @click="setCorrectOption(optionIndex)"
            class="set-correct-option-button"
          >
            ✅
          </button>
        </div>
      </li>
    </ul>
    <button @click="addOption" class="add-option-button">Add Option</button>
  </div>
</template>

<script setup>
const props = defineProps({
  poll: Object,
});

const selectedPollOption = ref(null);
const correctPollOption = ref(null);
const showPercentages = ref(false);

const updateQuestion = (event) => {
  props.poll.question = event.target.innerText;
};

const updateOption = (index, event) => {
  props.poll.options[index].option = event.target.innerText;
};

const addOption = () => {
  props.poll.options.push({ option: "New Option", votes: 0, percentage: 0 });
};

const removeOption = (index) => {
  if (props.poll.options.length > 2) {
    props.poll.options.splice(index, 1);
    if (correctPollOption.value === index) {
      correctPollOption.value = null;
    }
  }
};

const setCorrectOption = (index) => {
  correctPollOption.value = index;
  props.poll.correctAnswer = index;
};

const selectOption = (index) => {
  selectedPollOption.value = index;
};
</script>

<style scoped>
.poll-option-button {
  position: relative;
  width: 100%;
  padding: 12px 20px;
  background-color: #e0e0e0;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  overflow: hidden;
  text-align: left;
  font-size: 16px;
  color: #333;
}

.add-option-button {
  margin-top: 10px;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.poll-option-button:hover {
  background-color: #d5d5d5;
}

.poll-option-button:disabled {
  cursor: not-allowed;
  opacity: 0.8;
}

.poll-option-button.selected {
  font-weight: bold;
  background-color: #c7e1ff;
}

.poll-option-button.correct {
  border: 2px solid #28a745;
}

.option-text {
  position: relative;
  z-index: 2;
}

.percentage-text {
  position: absolute;
  right: 20px;
  z-index: 2;
}

.fill-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #007bff;
  z-index: 1;
  transition: width 1s ease;
  border-radius: 25px;
}

.remove-option-button,
.set-correct-option-button {
  margin-left: 10px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #333;
  padding: 0 5px;
}

.remove-option-button:hover {
  color: #dc3545;
}

.set-correct-option-button:hover {
  color: #28a745;
}
</style>
