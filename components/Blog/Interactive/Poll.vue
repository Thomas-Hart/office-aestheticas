<template>
  <div class="interactive-poll">
    <h3>{{ poll.question }}</h3>
    <ul>
      <li v-for="(option, optionIndex) in poll.options" :key="optionIndex">
        <div class="poll-option-container">
          <button
            class="poll-option-button"
            :class="{ selected: selectedPollOption === optionIndex }"
            @click="votePoll(optionIndex)"
            :disabled="selectedPollOption !== null"
          >
            <span class="option-text">{{ option.option }}</span>
            <transition name="fade">
              <span class="percentage-text" v-if="showPercentages">
                {{ Math.round(option.percentage) }}%
              </span>
            </transition>
            <div
              class="fill-bar"
              :style="{
                width: showPercentages ? option.percentage + '%' : '0%',
              }"
            ></div>
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  poll: Object,
});

const emit = defineEmits(["updatePoll"]);

const selectedPollOption = ref(null);
const showPercentages = ref(false);

const votePoll = (optionIndex) => {
  if (selectedPollOption.value !== null) return; // Prevent multiple selections

  selectedPollOption.value = optionIndex;

  // Increment the vote count for the selected option
  props.poll.options[optionIndex].votes += 1;

  // Calculate the total votes after the update
  const totalVotes = props.poll.options.reduce(
    (total, option) => total + option.votes,
    0
  );

  // Update the percentages
  props.poll.options.forEach((option) => {
    option.percentage = ((option.votes / totalVotes) * 100).toFixed(2);
  });

  // Reveal the percentages
  showPercentages.value = true;

  // Emit the updated poll to the parent component
  emit("updatePoll", props.poll);
};
</script>

<style scoped>
.interactive-poll {
  margin: 1.5rem 0;
}

ul {
  list-style: none;
  padding: 0;
}

.poll-option-container {
  position: relative;
  margin: 10px 0;
}

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

.poll-option-button:hover {
  background-color: #d5d5d5;
}

.poll-option-button:disabled {
  cursor: not-allowed;
  opacity: 0.8;
}

.poll-option-button.selected {
  font-weight: bold;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
