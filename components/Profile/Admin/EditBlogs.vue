<template>
  <div class="blog-page">
    <BlogImageWrapper
      v-if="selectedBlog && selectedBlog.image"
      :imageSrc="selectedBlog.image"
      :altText="selectedBlog.mainTitle + ' picture'"
    />
    <div class="blog-content-wrapper" v-if="selectedBlog">
      <div class="blog-post">
        <h1 contenteditable @input="updateTitle">
          {{ selectedBlog.mainTitle }}
        </h1>
        <EditBlogPostHeader
          v-if="selectedBlog.author && selectedBlog.date"
          :author="selectedBlog.author"
          :date="selectedBlog.date"
          :views="selectedBlog.views"
          @updateHeader="updateHeader"
        />
        <div
          v-if="
            selectedBlog.updated &&
            selectedBlog.updated.date &&
            selectedBlog.updated.text
          "
        >
          <p>
            <strong
              >Updated {{ formattedDate(selectedBlog.updated.date) }}:</strong
            >
            {{ selectedBlog.updated.text }}
          </p>
        </div>
        <p v-if="selectedBlog.intro" contenteditable @input="updateIntro">
          {{ selectedBlog.intro }}
        </p>

        <div
          v-for="(section, index) in selectedBlog.sections"
          :key="'section-' + index"
          class="section-wrapper"
        >
          <EditBlogPostContent
            :title="section.title"
            :contents="section.content"
            @updateContent="updateSection(index, $event)"
          />
          <button @click="removeSection(index)" class="remove-section-button">
            ✖
          </button>
        </div>

        <button @click="addSection" class="add-section-button">
          Add Section
        </button>

        <EditBlogReferences
          v-if="selectedBlog.references"
          :references="selectedBlog.references"
          @updateReferences="updateReferences"
        />

        <div class="meta-section">
          <h2>SEO Meta Information</h2>
          <div class="meta-group">
            <label for="metaTitle">Meta Title</label>
            <input
              id="metaTitle"
              type="text"
              :value="selectedBlog.metaTitle"
              @input="updateMetaTitle($event)"
              placeholder="Enter meta title"
            />
          </div>
          <div class="meta-group">
            <label for="metaDescription">Meta Description</label>
            <textarea
              id="metaDescription"
              :value="selectedBlog.metaDescription"
              @input="updateMetaDescription($event)"
              placeholder="Enter meta description"
            ></textarea>
          </div>
        </div>

        <div class="comments-section">
          <h2>Comments</h2>
          <div
            v-for="(comment, index) in selectedBlog.comments"
            :key="'comment-' + index"
            class="comment-group"
          >
            <label>Name</label>
            <input
              type="text"
              :value="comment.name"
              @input="updateComment(index, 'name', $event.target.value)"
              placeholder="Commenter's name"
            />
            <label>Comment</label>
            <textarea
              :value="comment.comment"
              @input="updateComment(index, 'comment', $event.target.value)"
              placeholder="Comment text"
            ></textarea>
            <label>URL</label>
            <input
              type="text"
              :value="comment.url"
              @input="updateComment(index, 'url', $event.target.value)"
              placeholder="Optional URL"
            />
            <label>Date</label>
            <input
              type="date"
              :value="formattedDateInput(comment.date)"
              @input="updateComment(index, 'date', $event.target.value)"
            />
            <button @click="removeComment(index)" class="remove-comment-button">
              ✖ Remove Comment
            </button>
          </div>
          <button @click="addComment" class="add-comment-button">
            Add Comment
          </button>
        </div>
      </div>
      <EditBlogPanel
        :blogs="blogs"
        :selectedBlog="selectedBlog"
        @selectBlog="setSelectedBlog"
        @createBlog="createBlog"
        @deleteBlog="deleteBlog"
        @saveBlog="updateContent"
        @updateBasicInfo="updateBlogLocally"
        @addBlogFromJson="createBlogFromJson"
      />
    </div>

    <EditBlogStructuredData
      v-if="selectedBlog"
      :blog="selectedBlog"
      @updateStructuredData="updateStructuredData"
    />

    <SubcomponentsNotificationPopup
      v-if="notificationMessage"
      :message="notificationMessage"
      :type="notificationType"
    />
  </div>
</template>

<script setup>
// Define refs for the blogs and selected blog
const blogs = ref([]);
const defaultBlog = ref({
  _id: "",
  mainTitle: "New Blog Post",
  author: {
    name: "Author name",
    bio: "Author bio",
    image: "HARTECHOLogo.webp",
  },
  date: new Date().toISOString(),
  intro: "This is an introduction.",
  sections: [],
  references: [],
  image: "HARTECHOLogo.webp",
  thumbnail: "",
  preview: "",
  tags: [],
  updated: {
    date: new Date().toISOString(),
    text: "Recently updated",
  },
  metaTitle: "",
  metaDescription: "",
  views: 0,
  comments: [],
});
let selectedBlog = defaultBlog;

const notificationMessage = ref("");
const notificationType = ref("success");

// Fetch the blogs from the API
const { data } = await useFetch("/api/blogs");
blogs.value = data.value;

// Set the selected blog and ensure the author is an object
const setSelectedBlog = (blogId) => {
  const blog = blogs.value.find((blog) => blog._id === blogId);
  if (blog) {
    selectedBlog.value = {
      ...blog,
      author:
        typeof blog.author === "string"
          ? { name: blog.author, bio: "", image: "/HARTECHOLogo.webp" }
          : blog.author,
    };
  }
  // console.log(
  //   "StructuredData: " + JSON.stringify(selectedBlog.value.structuredData)
  // );
  // console.log("Comments: " + JSON.stringify(selectedBlog.value.comments));
};

// Function to create a new blog
const createBlog = async () => {
  selectedBlog.value._id = null;
  try {
    const createdBlog = await $fetch(`/api/blogs`, {
      method: "POST",
      body: selectedBlog.value,
    });

    blogs.value.push(createdBlog);
    setSelectedBlog(createdBlog._id);
    showNotification("Blog created successfully!", "success");
  } catch (error) {
    showNotification("Failed to create blog.", "error");
  }
};

// Function to delete a blog
const deleteBlog = async (blogId) => {
  try {
    await $fetch(`/api/blogs/${blogId}`, {
      method: "DELETE",
    });
    blogs.value = blogs.value.filter((blog) => blog._id !== blogId);
    selectedBlog = defaultBlog;
    showNotification("Blog deleted successfully!", "success");
  } catch (error) {
    showNotification("Failed to delete blog.", "error");
    console.log(error);
  }
};

const updateBlogLocally = (updatedBlog) => {
  selectedBlog.value = { ...updatedBlog };
};

// Functions to update various parts of the blog
const updateTitle = (event) => {
  selectedBlog.value.mainTitle = event.target.innerText;
};

const updateIntro = (event) => {
  selectedBlog.value.intro = event.target.innerText;
};

const updateHeader = ({ author, date }) => {
  // console.log("Author: " + JSON.stringify(author));
  // console.log("Before Update:", selectedBlog.value.author);
  selectedBlog.value.author = author;
  selectedBlog.value.date = date;
  // console.log("After Update:", selectedBlog.value.author);
};

const updateSection = (index, updatedData) => {
  selectedBlog.value.sections[index].title = updatedData.title;
  selectedBlog.value.sections[index].content = updatedData.contents;
};

const updateReferences = (updatedReferences) => {
  selectedBlog.value.references = updatedReferences;
};

const updateStructuredData = (updatedData) => {
  // console.log("Here: " + JSON.stringify(updatedData));
  selectedBlog.value.structuredData = updatedData;
  // console.log("After Update: ", selectedBlog.value.structuredData);
};

const updateMetaTitle = (event) => {
  selectedBlog.value.metaTitle = event.target.value;
};

const updateMetaDescription = (event) => {
  selectedBlog.value.metaDescription = event.target.value;
};

// Functions to manage comments
const updateComment = (index, field, value) => {
  selectedBlog.value.comments[index][field] = value;
};

const addComment = () => {
  selectedBlog.value.comments.push({
    name: "New Commenter",
    comment: "New comment text",
    date: new Date().toISOString(),
    url: "",
  });
};

const removeComment = (index) => {
  selectedBlog.value.comments.splice(index, 1);
};

const addSection = () => {
  selectedBlog.value.sections.push({
    title: "New Section",
    content: [],
  });
};

const removeSection = (index) => {
  selectedBlog.value.sections.splice(index, 1);
};

const createBlogFromJson = async (blogData) => {
  try {
    const createdBlog = await $fetch(`/api/blogs`, {
      method: "POST",
      body: blogData,
    });

    blogs.value.push(createdBlog);
    setSelectedBlog(createdBlog._id);
    showNotification("Blog created from JSON successfully!", "success");
  } catch (error) {
    showNotification("Failed to create blog from JSON.", "error");
  }
};

// Function to update the blog content and ensure that no undefined properties are accessed
const updateContent = async () => {
  // console.log("YOOOOOOOOOOOO");
  // console.log("selectedBlog.value: " + JSON.stringify(selectedBlog.value));
  try {
    // Create a deep copy of selectedBlog to avoid mutating the original object directly
    const updatedBlog = JSON.parse(JSON.stringify(selectedBlog.value));

    // Check if the blog exists in the blogs array and update it
    const index = blogs.value.findIndex((blog) => blog._id === updatedBlog._id);
    if (index !== -1) {
      // Save to backend
      await $fetch(`/api/blogs/${selectedBlog.value._id}`, {
        method: "PUT",
        body: selectedBlog.value,
      });

      showNotification("Blog updated successfully!", "success");
    } else {
      showNotification("Failed to update blog. Invalid blog data.", "error");
    }
  } catch (error) {
    showNotification("Failed to update blog.", "error");
    console.log(error);
  }
};

// Function to show notifications
const showNotification = (message, type) => {
  notificationMessage.value = message;
  notificationType.value = type;
  setTimeout(() => {
    notificationMessage.value = "";
  }, 3000);
};

// Function to format dates
const formattedDate = (date) => {
  return date ? new Date(date).toLocaleDateString() : "";
};

const formattedDateInput = (date) => {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};

const emit = defineEmits(["hide-loading"]);
emit("hide-loading");
</script>

<style scoped>
h1 {
  font-family: "Poppins";
  font-family: Proxima Nova, proxima-nova, -apple-system, BlinkMacSystemFont,
    Segoe UI, Roboto, Helvetica Neue, Helvetica, sans-serif, Apple Color Emoji,
    Segoe UI Emoji, Segoe UI Symbol;
  color: #333;
  font-size: 2.5rem;
  line-height: 2.7rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

p {
  margin-bottom: 1.5rem;
}

.blog-page {
  /* display: flex; */
}

.blog-content-wrapper {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  gap: 2rem;
  padding: 2rem;
}

.blog-post {
  padding: 4rem 2rem;
  background: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  flex: 2;
}

.add-section-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}

.add-section-button:hover {
  background-color: #218838;
}

.section-wrapper {
  position: relative;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.section-action-buttons {
  position: absolute;
  top: 5px;
  left: -30px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.section-action-buttons button {
  padding: 5px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.remove-section-button {
  background-color: #ff5c5c;
  height: 1.5rem;
  min-width: 1.5rem;
  color: white;
  border-radius: 50%;
  border: none;
}

.meta-section {
  margin-top: 2rem;
}

.meta-section h2 {
  font-family: "Poppins";
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.meta-group {
  margin-bottom: 1.5rem;
}

.meta-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.meta-group input,
.meta-group textarea {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.comments-section {
  margin-top: 2rem;
}

.comments-section h2 {
  font-family: "Poppins";
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.comment-group {
  margin-bottom: 1.5rem;
}

.comment-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.comment-group input,
.comment-group textarea {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.add-comment-button {
  margin-top: 10px;
  padding: 8px 15px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}

.add-comment-button:hover {
  background-color: #218838;
}

.remove-comment-button {
  margin-top: 10px;
  padding: 8px 15px;
  background-color: #ff5c5c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}

.remove-comment-button:hover {
  background-color: #e04646;
}
</style>
