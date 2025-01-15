<template>
  <div>
    <input
      type="text"
      v-model="editableTitle"
      class="title-input"
      placeholder="Enter title"
      @input="updateTitle"
    />
    <div
      v-for="(content, index) in editableContents"
      :key="index"
      class="content-wrapper"
    >
      <div class="action-buttons">
        <button @click="moveContentUp(index)" :disabled="index === 0">▲</button>
        <button
          @click="moveContentDown(index)"
          :disabled="index === editableContents.length - 1"
        >
          ▼
        </button>
      </div>
      <p
        v-if="content.type === 'paragraph'"
        contenteditable
        @input="updateParagraph(index, $event)"
        class="editable-field"
      >
        {{ content.paragraph.text }}
      </p>
      <h2
        v-if="content.type === 'subheading'"
        contenteditable
        @input="updateSubheading(index, $event)"
        class="editable-field"
      >
        {{ content.subheading.text }}
      </h2>
      <div v-if="content.type === 'list'" class="list-section editable-field">
        <h3 contenteditable @input="updateListTitle(index, $event)">
          {{ content.list.title }}
        </h3>
        <ul>
          <li
            v-for="(item, itemIndex) in content.list.items"
            :key="itemIndex"
            class="list-item"
          >
            <strong
              contenteditable
              @input="updateListItemTitle(index, itemIndex, $event)"
            >
              {{ item.title }}
            </strong>
            <p
              contenteditable
              @input="updateListItemDescription(index, itemIndex, $event)"
            >
              {{ item.description }}
            </p>
          </li>
        </ul>
        <button @click="addListItem(index)" class="add-list-item-button">
          Add List Item
        </button>
      </div>
      <div
        v-if="content.type === 'image'"
        class="section-img-wrapper editable-field"
      >
        <input
          type="text"
          v-model="editableContents[index].image.url"
          class="image-url-input"
          placeholder="Enter image URL"
        />
        <NuxtImg
          :src="resolvedImgPath(content.image.url)"
          :alt="content.image.caption"
          loading="lazy"
        />
        <p
          class="image-caption"
          contenteditable
          @input="updateImageCaption(index, $event)"
        >
          {{ content.image.caption }}
        </p>
      </div>
      <EditBlogInteractiveQuiz
        v-if="content.type === 'quiz'"
        :quiz="content.quiz"
      />
      <EditBlogInteractivePoll
        v-if="content.type === 'poll'"
        :poll="content.poll"
      />
      <EditBlogInteractiveVideoContent
        v-if="content.type === 'video'"
        :video="content.video"
      />
      <button @click="removeContent(index)" class="remove-content-button">
        ✖
      </button>
    </div>
    <div class="add-content-type">
      <button @click="addParagraph" class="add-content-type-button">
        Add Paragraph
      </button>
      <button @click="addList" class="add-content-type-button">Add List</button>
      <button @click="addImage" class="add-content-type-button">
        Add Image
      </button>
      <button @click="addSubheading" class="add-content-type-button">
        Add Subheading
      </button>
      <button @click="addQuiz" class="add-content-type-button">Add Quiz</button>
      <button @click="addPoll" class="add-content-type-button">Add Poll</button>
      <button @click="addVideo" class="add-content-type-button">
        Add Video
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  title: String,
  contents: Array,
});

const emit = defineEmits(["updateContent"]);

const editableTitle = ref(props.title);
const editableContents = ref([...props.contents]);

const resolvedImgPath = (path) => {
  return path ? "/" + path : "/HARTECHOLogo.webp";
};

// Watch title and contents and emit updates
watch(editableTitle, () =>
  emit("updateContent", {
    title: editableTitle.value,
    contents: editableContents.value,
  })
);
watch(
  editableContents,
  () =>
    emit("updateContent", {
      title: editableTitle.value,
      contents: editableContents.value,
    }),
  { deep: true }
);

const updateTitle = (event) => {
  editableTitle.value = event.target.value;
  emit("updateContent", {
    title: editableTitle.value,
    contents: editableContents.value,
  });
};

const updateParagraph = (index, event) => {
  editableContents.value[index].paragraph.text = event.target.innerText;
  emit("updateContent", {
    title: editableTitle.value,
    contents: editableContents.value,
  });
};

const updateSubheading = (index, event) => {
  editableContents.value[index].subheading.text = event.target.innerText;
  emit("updateContent", {
    title: editableTitle.value,
    contents: editableContents.value,
  });
};

const updateListTitle = (index, event) => {
  editableContents.value[index].list.title = event.target.innerText;
  emit("updateContent", {
    title: editableTitle.value,
    contents: editableContents.value,
  });
};

const updateListItemTitle = (contentIndex, itemIndex, event) => {
  editableContents.value[contentIndex].list.items[itemIndex].title =
    event.target.innerText;
  emit("updateContent", {
    title: editableTitle.value,
    contents: editableContents.value,
  });
};

const updateListItemDescription = (contentIndex, itemIndex, event) => {
  editableContents.value[contentIndex].list.items[itemIndex].description =
    event.target.innerText;
  emit("updateContent", {
    title: editableTitle.value,
    contents: editableContents.value,
  });
};

const updateImageCaption = (index, event) => {
  editableContents.value[index].image.caption = event.target.innerText;
  emit("updateContent", {
    title: editableTitle.value,
    contents: editableContents.value,
  });
};

const moveContentUp = (index) => {
  const content = editableContents.value.splice(index, 1)[0];
  editableContents.value.splice(index - 1, 0, content);
  emit("updateContent", {
    title: editableTitle.value,
    contents: editableContents.value,
  });
};

const moveContentDown = (index) => {
  const content = editableContents.value.splice(index, 1)[0];
  editableContents.value.splice(index + 1, 0, content);
  emit("updateContent", {
    title: editableTitle.value,
    contents: editableContents.value,
  });
};

const addParagraph = () => {
  editableContents.value.push({
    type: "paragraph",
    paragraph: { text: "New Paragraph" },
  });
  emit("updateContent", {
    title: editableTitle.value,
    contents: editableContents.value,
  });
};

const addSubheading = () => {
  editableContents.value.push({
    type: "subheading",
    subheading: { text: "New Subheading" },
  });
  emit("updateContent", {
    title: editableTitle.value,
    contents: editableContents.value,
  });
};

const addList = () => {
  editableContents.value.push({
    type: "list",
    list: {
      title: "New List",
      items: [{ title: "New Item", description: "New Description" }],
    },
  });
  emit("updateContent", {
    title: editableTitle.value,
    contents: editableContents.value,
  });
};

const addImage = () => {
  editableContents.value.push({
    type: "image",
    image: { url: "", caption: "New Image Caption" },
  });
  emit("updateContent", {
    title: editableTitle.value,
    contents: editableContents.value,
  });
};

const addQuiz = () => {
  editableContents.value.push({
    type: "quiz",
    quiz: {
      question: "New Question",
      options: ["Option 1", "Option 2"],
      correctAnswer: 0,
    },
  });
  emit("updateContent", {
    title: editableTitle.value,
    contents: editableContents.value,
  });
};

const addPoll = () => {
  editableContents.value.push({
    type: "poll",
    poll: {
      question: "New Poll Question",
      options: [
        { option: "Option 1", votes: 0, percentage: 0 },
        { option: "Option 2", votes: 0, percentage: 0 },
      ],
    },
  });
  emit("updateContent", {
    title: editableTitle.value,
    contents: editableContents.value,
  });
};

const addVideo = () => {
  editableContents.value.push({
    type: "video",
    video: { url: "", caption: "New Video Caption" },
  });
  emit("updateContent", {
    title: editableTitle.value,
    contents: editableContents.value,
  });
};

const removeContent = (index) => {
  editableContents.value.splice(index, 1);
  emit("updateContent", {
    title: editableTitle.value,
    contents: editableContents.value,
  });
};
</script>

<style scoped>
h2,
.title-input {
  color: #555;
  font-size: 2rem;
  line-height: 2.2rem;
  padding-bottom: 0.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  border-top: none;
  border-right: none;
  border-left: none;
  border-bottom: 2px solid #eee;
  width: 100%;
}

p {
  margin-bottom: 1.5rem;
}

.list-section {
  background: #f0f8ff;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.list-section h3 {
  font-size: 1.5rem;
  color: #444;
  margin-bottom: 0.5rem;
}

.list-section ul {
  padding-left: 1.5rem;
}

.list-section ul li {
  margin-bottom: 0.75rem;
}

.list-section ul li strong {
  font-size: 1.2rem;
  font-family: "Merriweather", serif;
  color: #333;
}

.section-img-wrapper {
  width: 100%;
  height: auto;
  margin-bottom: 1.5em;
}

.section-img-wrapper img {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
}

.image-caption {
  text-align: center;
  font-size: 1rem;
  color: #777;
  margin-top: 0.5rem;
}

.add-content-button,
.add-list-item-button {
  margin-top: 10px;
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.image-url-input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.editable-field {
  position: relative;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border 0.3s ease;
}

.content-wrapper:hover .editable-field {
  border: 2px dashed #007bff;
}

.content-wrapper .editable-field:focus {
  border: 2px solid #007bff;
}

.content-wrapper {
  display: flex;
  width: 100%;
  justify-content: space-between;
  position: relative;
  margin-bottom: 20px;
}

.action-buttons {
  position: absolute;
  top: 25%;
  left: -25px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.action-buttons button {
  padding: 5px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.action-buttons .remove-content-button {
  background-color: #ff5c5c;
}

.remove-content-button {
  height: 1.5rem;
  min-width: 1.5rem;
  background-color: #ff5c5c;
  color: white;
  border: none;
  border-radius: 50%;
}

.add-content-type {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}
.add-content-type-button {
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
