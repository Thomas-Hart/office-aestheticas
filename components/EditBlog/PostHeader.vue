<template>
  <div class="post-header" v-if="author">
    <div class="author-info">
      <img
        v-if="author.image"
        :src="`/${author.image}`"
        alt="Author Image"
        class="author-image"
      />
      <div class="author-details">
        <p class="header">
          Authored by
          <span contenteditable @input="updateAuthorName">{{
            editableAuthorName
          }}</span
          >,
          <span contenteditable @blur="formatAndEmitDate">{{
            formattedDate(editableDate)
          }}</span>
        </p>
        <p class="bio" contenteditable @input="updateAuthorBio">
          {{ editableAuthorBio }}
        </p>
      </div>
    </div>
    <div class="views">
      <img src="/ViewCountEye.svg" alt="Views Icon" class="views-icon" />
      <span>{{ formattedViews }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  author: {
    type: Object,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["updateHeader"]);

// Create local refs to allow for inline editing
const editableAuthorName = ref(props.author.name);
const editableAuthorBio = ref(props.author.bio);
const editableDate = ref(props.date);

const updateAuthorName = (event) => {
  editableAuthorName.value = event.target.innerText;
  emitUpdate();
};

const updateAuthorBio = (event) => {
  editableAuthorBio.value = event.target.innerText;
  emitUpdate();
};

const formatAndEmitDate = (event) => {
  const inputDate = new Date(event.target.innerText);
  const formattedDate = inputDate.toLocaleDateString();

  // Update the content of the span with the formatted date
  editableDate.value = inputDate.toISOString();
  event.target.innerText = formattedDate;

  emitUpdate();
};

const emitUpdate = () => {
  emit("updateHeader", {
    author: {
      ...props.author,
      name: editableAuthorName.value,
      bio: editableAuthorBio.value,
    },
    date: editableDate.value,
  });
};

const formattedDate = (date) => {
  return new Date(date).toLocaleDateString();
};

const formattedViews = computed(() => {
  return props.views ? formatNumberWithCommas(props.views) : "0";
});

const formatNumberWithCommas = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Watch for prop changes and update the local refs
watch(
  () => props.author,
  (newAuthor) => {
    editableAuthorName.value = newAuthor.name;
    editableAuthorBio.value = newAuthor.bio;
  }
);

watch(
  () => props.date,
  (newDate) => {
    editableDate.value = newDate;
  }
);
</script>

<style scoped>
.post-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.author-info {
  display: flex;
  align-items: center;
}

.author-image {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  margin-right: 1rem;
}

.author-details {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.header {
  color: #555;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5em;
  font-style: italic;
}

.bio {
  color: #777;
  font-size: 1rem;
  font-style: italic;
}

.views {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.views-icon {
  width: 1.5rem;
  height: 1.5rem;
}
</style>
