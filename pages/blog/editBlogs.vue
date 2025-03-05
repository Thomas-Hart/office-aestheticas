<template>
  <div class="blog-page-wrapper">
    <div class="content">
      <!-- Header -->
      <div class="heading" v-if="selectedBlog">
        <BlogSearchBreadcrumbs
          :currentBlogTitle="selectedBlog.tags[0] || 'All Posts'"
        />
        <h1
          class="blog-title"
          contenteditable
          @dblclick="enableEditing"
          @input="
            markDirty;
            updateTitle($event);
          "
          @keyup="markDirty"
        >
          {{ selectedBlog.mainTitle }}
        </h1>
        <div class="blog-metadata">
          <NuxtImg
            src="/HARTECHOLogo.webp"
            alt="Author image"
            class="author-image"
          />
          <div class="post-info">
            <div class="author-info">
              <span
                >by
                <b
                  contenteditable
                  @dblclick="enableEditing"
                  @input="
                    markDirty;
                    updateAuthor($event);
                  "
                  @keyup="markDirty"
                >
                  {{ selectedBlog.author.name }}
                </b></span
              >
            </div>
            <div class="meta-info">
              <div class="meta-date">
                <NuxtImg
                  src="/Graphics/calendar-icon.svg"
                  alt="Date icon"
                  class="meta-icon"
                />
                <span>{{ formattedDate(selectedBlog.date) }}</span>
              </div>
              <div class="meta-reading-time">
                <NuxtImg
                  src="/Graphics/clock-icon.svg"
                  alt="Clock icon"
                  class="meta-icon"
                />
                <span>{{
                  selectedBlog.structuredData.readingTime ||
                  "Reading time unavailable"
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Blog Content Wrapper -->
      <div class="blog-content-wrapper" v-if="selectedBlog">
        <div class="blog-post">
          <div class="left">
            <!-- Inlined Image Wrapper -->
            <div class="img-wrapper">
              <NuxtImg
                :src="blogImageWrapperResolvedImgPath(selectedBlog.image)"
                :alt="selectedBlog.mainTitle + ' picture'"
                :placeholder="
                  blogImageWrapperGeneratePlaceholderUrl(selectedBlog.image)
                "
                loading="eager"
                @load="blogImageWrapperOnImageLoad"
                :class="{ 'image-loaded': blogImageWrapperImageLoaded }"
              />
              <!-- Always visible image edit field -->
              <div class="image-edit-field">
                <label>Image Path:</label>
                <span
                  contenteditable
                  @dblclick="enableEditing"
                  @input="
                    markDirty;
                    updateImagePath($event);
                  "
                  @keyup="markDirty"
                >
                  {{ selectedBlog.image }}
                </span>
              </div>
            </div>
            <!-- Under-photo area -->
            <div class="under-photo">
              <!-- Left Panel: Blog Selection (fixed width) -->
              <div class="left-panel">
                <h2>Blogs</h2>
                <ul class="blog-selection-list">
                  <li
                    v-for="blog in blogs"
                    :key="blog._id"
                    :class="{
                      selected: selectedBlog && blog._id === selectedBlog._id,
                    }"
                    @click="handleSelectBlog(blog._id)"
                  >
                    {{ blog.mainTitle }}
                  </li>
                </ul>
                <button
                  class="add-blog-button"
                  @click="showAddBlogModal = true"
                >
                  Add Blog
                </button>
              </div>
              <!-- Blog Body -->
              <div class="blog-body">
                <p
                  contenteditable
                  @dblclick="enableEditing"
                  @input="
                    markDirty;
                    updateIntro($event);
                  "
                  @keyup="markDirty"
                >
                  {{ selectedBlog.intro }}
                </p>
                <!-- Editable Sections -->
                <div
                  v-for="(section, sIndex) in selectedBlog.sections"
                  :key="'section-' + sIndex"
                  class="section"
                  @mouseenter="hoveredSection = sIndex"
                  @mouseleave="hoveredSection = null"
                >
                  <div class="section-header">
                    <h2
                      contenteditable
                      @dblclick="enableEditing"
                      @input="
                        markDirty;
                        updateSectionTitle(sIndex, $event);
                      "
                      @keyup="markDirty"
                    >
                      {{ section.title }}
                    </h2>
                    <div
                      class="section-controls"
                      v-if="hoveredSection === sIndex"
                    >
                      <button
                        class="arrow-button"
                        @click="moveSectionUp(sIndex)"
                        :disabled="sIndex === 0"
                      >
                        ↑
                      </button>
                      <button
                        class="arrow-button"
                        @click="moveSectionDown(sIndex)"
                        :disabled="sIndex === selectedBlog.sections.length - 1"
                      >
                        ↓
                      </button>
                      <button
                        class="delete-button"
                        @click="removeSection(sIndex)"
                      >
                        ✖
                      </button>
                    </div>
                  </div>
                  <div class="section-content">
                    <div
                      v-for="(content, cIndex) in section.content"
                      :key="'content-' + cIndex"
                      class="content-item"
                      @mouseenter="setContentControls(sIndex, cIndex)"
                      @mouseleave="clearContentControls"
                    >
                      <!-- Paragraph -->
                      <template v-if="content.type === 'paragraph'">
                        <p
                          contenteditable
                          @dblclick="enableEditing"
                          @input="
                            markDirty;
                            updateContentItem(
                              sIndex,
                              cIndex,
                              $event,
                              'paragraph'
                            );
                          "
                          @keyup="markDirty"
                        >
                          {{ content.paragraph.text }}
                        </p>
                      </template>
                      <!-- Subheading -->
                      <template v-else-if="content.type === 'subheading'">
                        <h3
                          class="subheading"
                          contenteditable
                          @dblclick="enableEditing"
                          @input="
                            markDirty;
                            updateContentItem(
                              sIndex,
                              cIndex,
                              $event,
                              'subheading'
                            );
                          "
                          @keyup="markDirty"
                        >
                          {{ content.subheading.text }}
                        </h3>
                      </template>
                      <!-- List -->
                      <template v-else-if="content.type === 'list'">
                        <div class="list-section">
                          <h4
                            contenteditable
                            @dblclick="enableEditing"
                            @input="
                              markDirty;
                              updateContentItem(
                                sIndex,
                                cIndex,
                                $event,
                                'listTitle'
                              );
                            "
                            @keyup="markDirty"
                          >
                            {{ content.list.title }}
                          </h4>
                          <ul>
                            <li
                              v-for="(item, iIndex) in content.list.items"
                              :key="iIndex"
                              class="list-item"
                            >
                              <div class="list-item-content">
                                <strong
                                  contenteditable
                                  @dblclick="enableEditing"
                                  @input="
                                    markDirty;
                                    updateListItem(
                                      sIndex,
                                      cIndex,
                                      iIndex,
                                      $event,
                                      'title'
                                    );
                                  "
                                  @keyup="markDirty"
                                >
                                  {{ item.title }}
                                </strong>
                                <p
                                  contenteditable
                                  @dblclick="enableEditing"
                                  @input="
                                    markDirty;
                                    updateListItem(
                                      sIndex,
                                      cIndex,
                                      iIndex,
                                      $event,
                                      'description'
                                    );
                                  "
                                  @keyup="markDirty"
                                >
                                  {{ item.description }}
                                </p>
                              </div>
                              <div
                                class="list-item-controls"
                                v-if="
                                  hoveredListItemMatches(sIndex, cIndex, iIndex)
                                "
                              >
                                <button
                                  class="arrow-button"
                                  @click="
                                    moveListItemUp(sIndex, cIndex, iIndex)
                                  "
                                  :disabled="iIndex === 0"
                                >
                                  ↑
                                </button>
                                <button
                                  class="arrow-button"
                                  @click="
                                    moveListItemDown(sIndex, cIndex, iIndex)
                                  "
                                  :disabled="
                                    iIndex === content.list.items.length - 1
                                  "
                                >
                                  ↓
                                </button>
                                <button
                                  class="delete-button"
                                  @click="
                                    removeListItem(sIndex, cIndex, iIndex)
                                  "
                                >
                                  ✖
                                </button>
                                <button
                                  class="add-button"
                                  @click="
                                    showAddDropdownForList(
                                      sIndex,
                                      cIndex,
                                      iIndex
                                    )
                                  "
                                >
                                  Add
                                </button>
                              </div>
                              <!-- Dropdown for List Items -->
                              <div
                                class="add-dropdown"
                                v-if="
                                  addDropdownList.show &&
                                  addDropdownList.sIndex === sIndex &&
                                  addDropdownList.cIndex === cIndex &&
                                  addDropdownList.iIndex === iIndex
                                "
                              >
                                <button
                                  @click="
                                    addListItemAfter(
                                      sIndex,
                                      cIndex,
                                      iIndex,
                                      'text'
                                    )
                                  "
                                >
                                  Text Item
                                </button>
                                <button @click="hideAddDropdownList">
                                  Cancel
                                </button>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </template>
                      <!-- Image -->
                      <template v-else-if="content.type === 'image'">
                        <div class="section-img-wrapper">
                          <NuxtImg
                            :src="
                              blogPostContentResolvedImgPath(content.image.url)
                            "
                            :alt="content.image.caption"
                            loading="lazy"
                          />
                          <p
                            class="image-caption"
                            contenteditable
                            @dblclick="enableEditing"
                            @input="
                              markDirty;
                              updateContentItem(
                                sIndex,
                                cIndex,
                                $event,
                                'imageCaption'
                              );
                            "
                            @keyup="markDirty"
                          >
                            {{ content.image.caption }}
                          </p>
                        </div>
                      </template>
                      <!-- Extra Controls for Content Items -->
                      <div
                        class="content-controls"
                        v-if="
                          hoveredContent.sectionIndex === sIndex &&
                          hoveredContent.contentIndex === cIndex
                        "
                      >
                        <button
                          class="arrow-button"
                          @click="moveContentUp(sIndex, cIndex)"
                          :disabled="cIndex === 0"
                        >
                          ↑
                        </button>
                        <button
                          class="arrow-button"
                          @click="moveContentDown(sIndex, cIndex)"
                          :disabled="cIndex === section.content.length - 1"
                        >
                          ↓
                        </button>
                        <button
                          class="delete-button"
                          @click="removeContentItem(sIndex, cIndex)"
                        >
                          ✖
                        </button>
                        <button
                          class="add-button"
                          @click="showAddDropdownFor(sIndex, cIndex)"
                        >
                          Add
                        </button>
                      </div>
                      <!-- Dropdown for Adding New Content After This Item -->
                      <div
                        class="add-dropdown"
                        v-if="
                          addDropdown.show &&
                          addDropdown.sIndex === sIndex &&
                          addDropdown.cIndex === cIndex
                        "
                      >
                        <button
                          @click="
                            addContentItemAfter(sIndex, cIndex, 'paragraph')
                          "
                        >
                          Paragraph
                        </button>
                        <button
                          @click="
                            addContentItemAfter(sIndex, cIndex, 'subheading')
                          "
                        >
                          Subheading
                        </button>
                        <button
                          @click="addContentItemAfter(sIndex, cIndex, 'list')"
                        >
                          List
                        </button>
                        <button
                          @click="addContentItemAfter(sIndex, cIndex, 'image')"
                        >
                          Image
                        </button>
                        <button
                          @click="addContentItemAfter(sIndex, cIndex, 'quiz')"
                        >
                          Quiz
                        </button>
                        <button
                          @click="addContentItemAfter(sIndex, cIndex, 'poll')"
                        >
                          Poll
                        </button>
                        <button
                          @click="addContentItemAfter(sIndex, cIndex, 'video')"
                        >
                          Video
                        </button>
                        <button @click="hideAddDropdown">Cancel</button>
                      </div>
                    </div>
                    <!-- "Add Content" Button at End of Section -->
                    <button
                      class="add-end-button"
                      @click="addContentItem(sIndex)"
                    >
                      Add Content
                    </button>
                  </div>
                </div>
                <!-- Section-level Actions -->
                <div class="section-actions">
                  <button class="add-section-button" @click="addSection">
                    Add Section
                  </button>
                </div>
                <!-- Editable References -->
                <div
                  v-if="
                    selectedBlog.references && selectedBlog.references.length
                  "
                  class="references"
                >
                  <h2>References</h2>
                  <div
                    v-for="(reference, rIndex) in selectedBlog.references"
                    :key="rIndex"
                    class="reference-item"
                    @mouseenter="hoveredReference = rIndex"
                    @mouseleave="hoveredReference = null"
                  >
                    <p
                      contenteditable
                      @dblclick="enableEditing"
                      @input="
                        markDirty;
                        updateReference(rIndex, $event);
                      "
                      @keyup="markDirty"
                    >
                      {{ reference }}
                    </p>
                    <button
                      v-if="hoveredReference === rIndex"
                      class="delete-button"
                      @click="removeReference(rIndex)"
                    >
                      ✖
                    </button>
                  </div>
                  <button class="add-button" @click="addReference">
                    Add Reference
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- Inlined Blog Comments -->
          <div class="comments">
            <div class="comments-section">
              <h2>Comments</h2>
              <div
                v-if="selectedBlog.comments && selectedBlog.comments.length"
                class="comments-list"
              >
                <div
                  v-for="(comment, index) in selectedBlog.comments"
                  :key="'comment-' + index"
                  class="comment-item"
                >
                  <div class="comment-header">
                    <strong class="comment-name">{{ comment.name }}</strong>
                    <span class="comment-date"
                      >({{ formattedDate(comment.date) }})</span
                    >
                  </div>
                  <p class="comment-text">{{ comment.comment }}</p>
                  <a
                    v-if="comment.url"
                    :href="formatUrl(comment.url)"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="comment-url"
                  >
                    Visit Website
                  </a>
                </div>
              </div>
              <div v-else>
                <p class="no-comments">
                  No comments yet. Be the first to comment!
                </p>
              </div>
              <div class="add-comment-form">
                <h3>Leave a Comment</h3>
                <input
                  type="text"
                  v-model="newComment.name"
                  placeholder="Your Name"
                  class="input-field"
                />
                <textarea
                  v-model="newComment.comment"
                  placeholder="Your Comment"
                  class="textarea-field"
                ></textarea>
                <input
                  type="text"
                  v-model="newComment.url"
                  placeholder="Optional: Your Website URL"
                  class="input-field"
                />
                <button class="cta-button" @click="submitComment">
                  Submit Comment
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Sticky Column: Editor Actions Panel -->
        <div class="right-sticky-column">
          <div class="sidebar">
            <h2>Blog Actions</h2>
            <button class="save-button" @click="saveBlog" :disabled="!isDirty">
              Save Blog
            </button>
            <button class="delete-button" @click="deleteBlog(selectedBlog._id)">
              Delete Blog
            </button>
            <div class="meta-section">
              <h3>SEO Meta Information</h3>
              <div class="meta-group">
                <label>Meta Title</label>
                <span
                  contenteditable
                  @dblclick="enableEditing"
                  @input="
                    markDirty;
                    updateMetaTitle($event);
                  "
                  @keyup="markDirty"
                >
                  {{ selectedBlog.metaTitle }}
                </span>
              </div>
              <div class="meta-group">
                <label>Meta Description</label>
                <span
                  contenteditable
                  @dblclick="enableEditing"
                  @input="
                    markDirty;
                    updateMetaDescription($event);
                  "
                  @keyup="markDirty"
                >
                  {{ selectedBlog.metaDescription }}
                </span>
              </div>
            </div>
            <div class="structured-data-section">
              <h3>Structured Data (JSON)</h3>
              <textarea
                v-model="structuredDataJson"
                @input="markDirty"
                class="structured-data-input"
              ></textarea>
              <button
                class="update-structured-data-button"
                @click="updateStructuredData"
              >
                Update Structured Data
              </button>
            </div>
            <div class="unsaved-indicator" v-if="isDirty">
              <p>You have unsaved changes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for Adding New Blog -->
    <div v-if="showAddBlogModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Add New Blog</h2>
        <label>Title</label>
        <input type="text" v-model="newBlogTitle" placeholder="Blog title" />
        <label>Author</label>
        <input type="text" v-model="newBlogAuthor" placeholder="Author name" />
        <div class="modal-buttons">
          <button @click="createNewBlog">Create Blog</button>
          <button @click="showAddBlogModal = false">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const blogs = ref([]);
const defaultBlog = {
  _id: "",
  mainTitle: "New Blog Post",
  metaTitle: "",
  metaDescription: "",
  author: { name: "Author name", bio: "", image: "BlogPic1.webp" },
  date: new Date().toISOString(),
  intro: "This is an introduction.",
  sections: [
    {
      title: "New Section",
      content: [
        { type: "paragraph", paragraph: { text: "New section paragraph" } },
      ],
    },
  ],
  references: [],
  image: "BlogPic1.webp",
  thumbnail: "",
  preview: "",
  tags: [],
  structuredData: {},
  updated: { date: new Date().toISOString(), text: "Recently updated" },
  views: 0,
  comments: [],
};

const selectedBlog = ref(null);
const notificationMessage = ref("");
const notificationType = ref("success");
const isDirty = ref(false);
const structuredDataJson = ref("");

const { data: blogsData } = await useFetch("/api/blogs");
blogs.value = blogsData.value || [];
if (route.params.id) {
  const { data: blogData } = await useFetch(
    `/api/blogs?_id=${route.params.id}`
  );
  selectedBlog.value = blogData.value || blogs.value[0] || defaultBlog;
} else {
  selectedBlog.value = blogs.value[0] || defaultBlog;
}
structuredDataJson.value = JSON.stringify(
  selectedBlog.value.structuredData || {},
  null,
  2
);

// For Add Blog modal
const showAddBlogModal = ref(false);
const newBlogTitle = ref("");
const newBlogAuthor = ref("");

const formattedDate = (date) =>
  date ? new Date(date).toLocaleDateString() : "";
const formattedDateInput = (date) => {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};
const formatUrl = (url) => (/^https?:\/\//i.test(url) ? url : `http://${url}`);

// --- Comment Functions ---
const newComment = ref({ name: "", comment: "", url: "" });
function submitComment() {
  if (newComment.value.name && newComment.value.comment) {
    selectedBlog.value.comments.push({
      name: newComment.value.name,
      comment: newComment.value.comment,
      date: new Date().toISOString(),
      url: newComment.value.url,
    });
    updateComments();
    newComment.value = { name: "", comment: "", url: "" };
  } else {
    alert("Please enter your name and comment.");
  }
}
const updateComments = async () => {
  try {
    await $fetch(`/api/blogs/${selectedBlog.value._id}`, {
      method: "PUT",
      body: { newComments: selectedBlog.value.comments },
    });
  } catch (error) {
    console.error("Failed to update blog comments:", error);
  }
};

// --- Save / Delete Functions ---
const saveBlog = async () => {
  try {
    await $fetch(`/api/blogs/${selectedBlog.value._id}`, {
      method: "PUT",
      body: selectedBlog.value,
    });
    showNotification("Blog updated successfully!", "success");
    isDirty.value = false;
  } catch (error) {
    showNotification("Failed to update blog.", "error");
  }
};
const deleteBlog = async (blogId) => {
  try {
    await $fetch(`/api/blogs/${blogId}`, { method: "DELETE" });
    showNotification("Blog deleted successfully!", "success");
    // Optionally, set selectedBlog to another blog
  } catch (error) {
    showNotification("Failed to delete blog.", "error");
  }
};
const showNotification = (msg, type) => {
  notificationMessage.value = msg;
  notificationType.value = type;
  setTimeout(() => {
    notificationMessage.value = "";
  }, 3000);
};

// --- Dirty Flag & Editing ---
const markDirty = () => {
  isDirty.value = true;
};
const enableEditing = (event) => {
  /* Additional logic if needed */
};

// --- Update Functions ---
const updateTitle = (event) => {
  selectedBlog.value.mainTitle = event.target.innerText;
};
const updateAuthor = (event) => {
  selectedBlog.value.author.name = event.target.innerText;
};
const updateIntro = (event) => {
  selectedBlog.value.intro = event.target.innerText;
};
const updateImagePath = (event) => {
  selectedBlog.value.image = event.target.innerText;
};
const updateSectionTitle = (sIndex, event) => {
  selectedBlog.value.sections[sIndex].title = event.target.innerText;
};
const updateContentItem = (sIndex, cIndex, event, field) => {
  const item = selectedBlog.value.sections[sIndex].content[cIndex];
  if (item.type === "paragraph" && field === "paragraph") {
    item.paragraph.text = event.target.innerText;
  } else if (item.type === "subheading" && field === "subheading") {
    item.subheading.text = event.target.innerText;
  } else if (item.type === "list" && field === "listTitle") {
    item.list.title = event.target.innerText;
  } else if (item.type === "image" && field === "imageCaption") {
    item.image.caption = event.target.innerText;
  }
};
const updateListItem = (sIndex, cIndex, iIndex, event, field) => {
  const listItem =
    selectedBlog.value.sections[sIndex].content[cIndex].list.items[iIndex];
  if (field === "title") {
    listItem.title = event.target.innerText;
  } else if (field === "description") {
    listItem.description = event.target.innerText;
  }
};
const updateReference = (rIndex, event) => {
  selectedBlog.value.references[rIndex] = event.target.innerText;
};
const updateMetaTitle = (event) => {
  selectedBlog.value.metaTitle = event.target.innerText;
};
const updateMetaDescription = (event) => {
  selectedBlog.value.metaDescription = event.target.innerText;
};

// --- Content Management ---
const removeContentItem = (sIndex, cIndex) => {
  selectedBlog.value.sections[sIndex].content.splice(cIndex, 1);
  markDirty();
};
const addContentItem = (sIndex) => {
  const section = selectedBlog.value.sections[sIndex];
  if (section.content.length === 0) {
    showAddDropdownFor(sIndex, 0);
  } else {
    showAddDropdownFor(sIndex, section.content.length - 1);
  }
};
const addContentItemAfter = (sIndex, cIndex, type) => {
  let newContent = null;
  switch (type) {
    case "paragraph":
      newContent = { type: "paragraph", paragraph: { text: "New paragraph" } };
      break;
    case "subheading":
      newContent = {
        type: "subheading",
        subheading: { text: "New subheading" },
      };
      break;
    case "list":
      newContent = {
        type: "list",
        list: {
          title: "New list",
          items: [{ title: "Item 1", description: "Description 1" }],
        },
      };
      break;
    case "image":
      newContent = {
        type: "image",
        image: { url: "BlogPic1.webp", caption: "New image caption" },
      };
      break;
    case "quiz":
      newContent = {
        type: "quiz",
        quiz: {
          question: "New quiz question",
          options: ["Option 1", "Option 2"],
          correctAnswer: 0,
        },
      };
      break;
    case "poll":
      newContent = {
        type: "poll",
        poll: {
          question: "New poll question",
          options: [
            { option: "Option 1", votes: 0 },
            { option: "Option 2", votes: 0 },
          ],
        },
      };
      break;
    case "video":
      newContent = {
        type: "video",
        video: { url: "https://", caption: "New video caption" },
      };
      break;
    default:
      newContent = { type: "paragraph", paragraph: { text: "New paragraph" } };
  }
  selectedBlog.value.sections[sIndex].content.splice(cIndex + 1, 0, newContent);
  markDirty();
  hideAddDropdown();
};

const removeReference = (rIndex) => {
  selectedBlog.value.references.splice(rIndex, 1);
  markDirty();
};
const addReference = () => {
  selectedBlog.value.references.push("New reference");
  markDirty();
};

// --- Section Management ---
const addSection = () => {
  selectedBlog.value.sections.push({
    title: "New Section",
    content: [
      { type: "paragraph", paragraph: { text: "New section paragraph" } },
    ],
  });
  markDirty();
};
const removeSection = (sIndex) => {
  selectedBlog.value.sections.splice(sIndex, 1);
  markDirty();
};
const moveSectionUp = (sIndex) => {
  if (sIndex > 0) {
    const secs = selectedBlog.value.sections;
    [secs[sIndex - 1], secs[sIndex]] = [secs[sIndex], secs[sIndex - 1]];
    markDirty();
  }
};
const moveSectionDown = (sIndex) => {
  const secs = selectedBlog.value.sections;
  if (sIndex < secs.length - 1) {
    [secs[sIndex + 1], secs[sIndex]] = [secs[sIndex], secs[sIndex + 1]];
    markDirty();
  }
};

// --- Reordering for Content Items ---
const moveContentUp = (sIndex, cIndex) => {
  const contents = selectedBlog.value.sections[sIndex].content;
  if (cIndex > 0) {
    [contents[cIndex - 1], contents[cIndex]] = [
      contents[cIndex],
      contents[cIndex - 1],
    ];
    markDirty();
  }
};
const moveContentDown = (sIndex, cIndex) => {
  const contents = selectedBlog.value.sections[sIndex].content;
  if (cIndex < contents.length - 1) {
    [contents[cIndex + 1], contents[cIndex]] = [
      contents[cIndex],
      contents[cIndex + 1],
    ];
    markDirty();
  }
};
const moveListItemUp = (sIndex, cIndex, iIndex) => {
  const items = selectedBlog.value.sections[sIndex].content[cIndex].list.items;
  if (iIndex > 0) {
    [items[iIndex - 1], items[iIndex]] = [items[iIndex], items[iIndex - 1]];
    markDirty();
  }
};
const moveListItemDown = (sIndex, cIndex, iIndex) => {
  const items = selectedBlog.value.sections[sIndex].content[cIndex].list.items;
  if (iIndex < items.length - 1) {
    [items[iIndex + 1], items[iIndex]] = [items[iIndex], items[iIndex + 1]];
    markDirty();
  }
};
const moveCommentUp = (index) => {
  const comm = selectedBlog.value.comments;
  if (index > 0) {
    [comm[index - 1], comm[index]] = [comm[index], comm[index - 1]];
    markDirty();
  }
};
const moveCommentDown = (index) => {
  const comm = selectedBlog.value.comments;
  if (index < comm.length - 1) {
    [comm[index + 1], comm[index]] = [comm[index], comm[index + 1]];
    markDirty();
  }
};

// --- List Item Management ---
const removeListItem = (sIndex, cIndex, iIndex) => {
  selectedBlog.value.sections[sIndex].content[cIndex].list.items.splice(
    iIndex,
    1
  );
  markDirty();
};
const addListItemAfter = (sIndex, cIndex, iIndex, type) => {
  const newItem = { title: "New Item", description: "New description" };
  selectedBlog.value.sections[sIndex].content[cIndex].list.items.splice(
    iIndex + 1,
    0,
    newItem
  );
  markDirty();
  hideAddDropdownList();
};

// --- Dropdown for Adding New Content (for content items) ---
const addDropdown = ref({ sIndex: null, cIndex: null, show: false });
const showAddDropdownFor = (sIndex, cIndex) => {
  addDropdown.value = { sIndex, cIndex, show: true };
};
const hideAddDropdown = () => {
  addDropdown.value = { sIndex: null, cIndex: null, show: false };
};

// --- Dropdown for List Items ---
const addDropdownList = ref({
  sIndex: null,
  cIndex: null,
  iIndex: null,
  show: false,
});
const showAddDropdownForList = (sIndex, cIndex, iIndex) => {
  addDropdownList.value = { sIndex, cIndex, iIndex, show: true };
};
const hideAddDropdownList = () => {
  addDropdownList.value = {
    sIndex: null,
    cIndex: null,
    iIndex: null,
    show: false,
  };
};

// --- Hover State ---
const hoveredContent = ref({ sectionIndex: null, contentIndex: null });
const hoveredListItem = ref({
  sectionIndex: null,
  contentIndex: null,
  itemIndex: null,
});
const hoveredReference = ref(null);
const hoveredSection = ref(null);
const setContentControls = (sIndex, cIndex) => {
  hoveredContent.value = { sectionIndex: sIndex, contentIndex: cIndex };
};
const clearContentControls = () => {
  hoveredContent.value = { sectionIndex: null, contentIndex: null };
};
const hoverListItem = (sIndex, cIndex, iIndex) => {
  hoveredListItem.value = {
    sectionIndex: sIndex,
    contentIndex: cIndex,
    itemIndex: iIndex,
  };
};
const clearListItemControls = () => {
  hoveredListItem.value = {
    sectionIndex: null,
    contentIndex: null,
    itemIndex: null,
  };
};
const hoveredListItemMatches = (sIndex, cIndex, iIndex) => {
  return (
    hoveredListItem.value.sectionIndex === sIndex &&
    hoveredListItem.value.contentIndex === cIndex &&
    hoveredListItem.value.itemIndex === iIndex
  );
};

// --- Image Handling ---
const blogImageWrapperImageLoaded = ref(false);
function blogImageWrapperResolvedImgPath(path) {
  return path ? "/BlogPics/" + path : "/HARTECHOLogo.webp";
}
function blogImageWrapperGeneratePlaceholderUrl(url) {
  const lastDotIndex = url.lastIndexOf(".");
  if (lastDotIndex === -1) return url;
  const extension = url.slice(lastDotIndex);
  const baseUrl = url.slice(0, lastDotIndex);
  return blogImageWrapperResolvedImgPath(`${baseUrl}Blur${extension}`);
}
function blogImageWrapperOnImageLoad() {
  blogImageWrapperImageLoaded.value = true;
}
function blogPostContentResolvedImgPath(path) {
  return path ? "/" + path : "/HARTECHOLogo.webp";
}

// --- Sticky Scroll Behavior for Right Panel ---
const lastScrollTop = ref(0);
const isLarge = ref(true);
const handleScroll = () => {
  const st = window.pageYOffset || document.documentElement.scrollTop;
  isLarge.value = st <= lastScrollTop.value;
  lastScrollTop.value = st <= 0 ? 0 : st;
};
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

// --- Blog Selection ---
const setSelectedBlog = (blogId) => {
  const blog = blogs.value.find((b) => b._id === blogId);
  if (blog) {
    selectedBlog.value = {
      ...blog,
      author:
        typeof blog.author === "string"
          ? { name: blog.author, bio: "", image: "/HARTECHOLogo.webp" }
          : blog.author,
    };
    structuredDataJson.value = JSON.stringify(
      selectedBlog.value.structuredData || {},
      null,
      2
    );
    isDirty.value = false;
  }
};
const handleSelectBlog = (blogId) => {
  setSelectedBlog(blogId);
};

// --- New Blog Modal Functions ---
const createNewBlog = async () => {
  const blogToCreate = {
    ...defaultBlog,
    mainTitle: newBlogTitle.value,
    author: { ...defaultBlog.author, name: newBlogAuthor.value },
    date: new Date().toISOString(),
  };
  try {
    const createdBlog = await $fetch(`/api/blogs`, {
      method: "POST",
      body: blogToCreate,
    });
    blogs.value.push(createdBlog);
    setSelectedBlog(createdBlog._id);
    showNotification("Blog created successfully!", "success");
  } catch (error) {
    showNotification("Failed to create blog.", "error");
  }
  showAddBlogModal.value = false;
};
</script>

<style scoped>
/* Main Blog Page Wrapper */
.blog-page-wrapper {
  padding: 2rem 0;
  font-family: Proxima Nova, proxima-nova, -apple-system, BlinkMacSystemFont,
    Segoe UI, Roboto, Helvetica Neue, Helvetica, sans-serif, Apple Color Emoji,
    Segoe UI Emoji, Segoe UI Symbol;
}
.content {
  max-width: 1350px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Header */
.heading {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.blog-title {
  font-size: 3.2rem;
  line-height: 3.2rem;
  text-align: left;
  color: black;
  font-weight: bolder;
}
.blog-metadata {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin: 2rem 0 2.5rem 0;
  align-items: center;
}
.author-image {
  border-radius: 50%;
  width: 50px;
  height: 50px;
}
.post-info {
  display: flex;
  gap: 2rem;
}
.meta-info {
  display: flex;
  align-items: center;
  gap: 2rem;
}
.meta-date,
.meta-reading-time {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.meta-icon {
  width: 16px;
  height: 16px;
}

/* Blog Content & Columns */
.blog-content-wrapper {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
}
.blog-post {
  flex: 3;
}
.left {
}
.under-photo {
  display: flex;
  gap: 2rem;
}

/* Left Panel: Blog Selection */
.left-panel {
  width: 15rem;
  flex-shrink: 0;
}
.blog-selection-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.blog-selection-list li {
  padding: 0.5rem 0;
  cursor: pointer;
}
.blog-selection-list li.selected {
  font-weight: bold;
  color: #005ba0;
}
.add-blog-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.add-blog-button:hover {
  background-color: #218838;
}

/* Image Wrapper & Edit Field */
.img-wrapper {
  width: 100%;
  height: 25rem;
  overflow: hidden;
  position: relative;
  margin-bottom: 2rem;
}
.img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.2);
  transition: transform 0.5s ease-in-out;
}
.img-wrapper img.image-loaded {
  transform: scale(1);
}
.image-edit-field {
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}
.image-edit-field label {
  font-weight: bold;
  margin-right: 0.5rem;
}
.image-edit-field span {
  border-bottom: 1px dashed #ccc;
  cursor: text;
}

/* Blog Body */
.blog-body {
  line-height: 1.8;
  color: #444;
  padding-right: 2rem;
}
p {
  margin-bottom: 1.5rem;
}

/* Sections */
.section {
  margin-bottom: 1rem;
  position: relative;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.section-controls {
  display: flex;
  gap: 0.5rem;
}
.section-controls button {
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.3rem 0.6rem;
  cursor: pointer;
  font-size: 0.9rem;
}
.section-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.add-section-button {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.add-section-button:hover {
  background-color: #218838;
}
.section-actions {
  margin-top: 1rem;
}

/* Section Content */
.section-content {
  margin-top: 1rem;
}
.add-end-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #005ba0;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.add-end-button:hover {
  background-color: #01c5ee;
}

/* Extra Controls on Content Items */
.content-item {
  position: relative;
}
.content-controls {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 0.25rem;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.2rem;
  border-radius: 4px;
}
.arrow-button {
  background: #007bff;
  color: #fff;
  border: none;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.8rem;
}
.delete-button {
  background: #ff5c5c;
  color: #fff;
  border: none;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.8rem;
}
.add-button {
  background: #28a745;
  color: #fff;
  border: none;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.8rem;
}

/* Dropdown for Adding New Content */
.add-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  z-index: 10;
  display: flex;
  flex-direction: column;
}
.add-dropdown button {
  padding: 0.3rem 0.6rem;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
}
.add-dropdown button:hover {
  background: #f0f0f0;
}

/* List Section - Restore styling */
.list-section {
  background: #f0f8ff;
  padding: 1rem;
  margin-bottom: 1.5rem;
}
.list-section h4 {
  font-size: 1.5rem;
  line-height: 1.6rem;
  color: #444;
  margin-bottom: 0.5rem;
}
.list-section ul {
  padding-left: 1.5rem;
}
.list-section ul li {
  margin-bottom: 0.75rem;
  position: relative;
  padding-right: 3rem; /* Leave room for controls */
  z-index: 1;
}
.list-item-controls {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
  display: flex;
  gap: 0.25rem;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.2rem;
  border-radius: 4px;
}
.list-item-controls button {
  background: #007bff;
  color: #fff;
  border: none;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.8rem;
}

/* References */
.references {
  margin-top: 2rem;
  font-size: 1.2rem;
  word-break: break-all;
  color: #888;
}
.reference-item {
  position: relative;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
}
.reference-item p {
  margin: 0;
}
.remove-reference-button {
  position: absolute;
  right: 0;
  top: 0;
  background: #ff5c5c;
  color: #fff;
  border: none;
  border-radius: 50%;
  padding: 0.2rem 0.4rem;
  cursor: pointer;
}

/* Comments */
.comments {
  width: 100%;
}
.comments-section {
  margin-top: 3rem;
  padding: 2rem;
  background: #f9f9f9;
  border-radius: 8px;
  margin: 0 auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.comments-section h2 {
  font-family: "Poppins";
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  font-weight: bold;
}
.comments-list {
  margin-bottom: 2rem;
}
.comment-item {
  margin-bottom: 1.5rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}
.comment-name {
  font-size: 1rem;
  color: #333;
  font-weight: bold;
}
.comment-date {
  font-size: 0.85rem;
  color: #777;
}
.comment-text {
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 1rem;
}
.comment-url {
  font-size: 0.9rem;
  color: #005ba0;
  text-decoration: underline;
}
.comment-url:hover {
  color: #01c5ee;
  text-decoration: none;
}
.no-comments {
  font-size: 1rem;
  color: #777;
}
.add-comment-form {
  margin-top: 2rem;
}
.input-field,
.textarea-field {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border-radius: 5px;
  border: 1px solid #ccc;
}
.textarea-field {
  height: 150px;
  resize: none;
}
.cta-button {
  display: inline-block;
  background-color: #005ba0;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  font-size: 0.9rem;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s ease-in-out;
  width: 10rem;
}
.cta-button:hover {
  background-color: #01c5ee;
}

/* Right Sticky Column (Editor Actions Panel) */
.right-sticky-column {
  flex: 1;
  position: sticky;
  top: 2rem;
  align-self: flex-start;
}
.sidebar {
  padding: 1rem;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.sidebar h2 {
  font-family: "Poppins";
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}
.meta-section {
  margin-top: 1rem;
}
.meta-group label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: bold;
}
.meta-group span {
  display: inline-block;
  padding: 0.25rem;
  border-bottom: 1px dashed #ccc;
  cursor: text;
}
.structured-data-section {
  margin-top: 1rem;
}
.structured-data-input {
  width: 100%;
  height: 100px;
  padding: 0.5rem;
}
.update-structured-data-button {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
}

/* Modern Save Button Styling */
.save-button {
  background: linear-gradient(to right, #4caf50, #45a049);
  color: #fff;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 1rem;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: background 0.3s ease-in-out;
}
.save-button:hover {
  background: linear-gradient(to right, #45a049, #4caf50);
}

/* Unsaved Changes Indicator */
.unsaved-indicator {
  margin-top: 1rem;
  color: #dc3545;
  font-weight: bold;
}

/* Modal for Adding New Blog */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}
.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
}
.modal-content h2 {
  margin-bottom: 1rem;
}
.modal-content label {
  display: block;
  margin-top: 0.5rem;
  font-weight: bold;
}
.modal-content input {
  width: 100%;
  padding: 0.5rem;
  margin: 0.25rem 0 0.5rem 0;
}
.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}
.modal-buttons button {
  padding: 0.5rem 1rem;
  cursor: pointer;
}

@media (max-width: 1024px) {
  .blog-content-wrapper {
    flex-direction: column;
  }
  .blog-body {
    padding: 0;
  }
  .left-panel,
  .right-sticky-column {
    position: relative;
    top: 0;
  }
  .left-panel {
    min-width: 15rem;
  }
}
@media (max-width: 768px) {
  .content {
    padding: 0 1rem;
  }
  .blog-metadata {
    gap: 0.5rem;
  }
  .left-panel {
    display: none;
  }
  .post-info {
    flex-direction: column;
    gap: 0.5rem;
    font-size: 0.75rem;
  }
  .meta-info {
    gap: 1rem;
  }
}
@media (max-width: 480px) {
  .blog-title {
    font-size: 2rem;
    line-height: 2.3rem;
  }
}
</style>
