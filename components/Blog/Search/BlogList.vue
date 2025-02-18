<template>
  <section class="blog-list">
    <!-- Dynamic Header -->
    <h2 class="blog-list__header">
      {{ selectedTag ? selectedTag : "All" }} Posts
    </h2>

    <div
      v-for="(blog, index) in paginatedBlogs"
      :key="blog._id"
      class="blog-entry"
    >
      <NuxtLink class="blog-entry__thumbnail" :to="`/blog/${blog._id}`">
        <NuxtImg
          :src="resolvedImgPath(blog.thumbnail)"
          :alt="
            blog.mainTitle ? blog.mainTitle + ' picture' : 'Blog post image'
          "
          :placeholder="generatePlaceholderUrl(blog.thumbnail)"
          :class="{ 'image-loaded': loadedImages[index] }"
          @load="onImageLoad(index)"
        />
      </NuxtLink>
      <div class="blog-entry__content">
        <h2 class="blog-entry__title">
          {{ blog.mainTitle || "Untitled Blog" }}
        </h2>
        <!-- Tags listed here -->
        <div class="blog-tags" v-if="blog.tags && blog.tags.length">
          <span
            v-for="(tag, index) in blog.tags"
            :key="index"
            class="blog-tag"
            >{{ tag }}</span
          >
        </div>
        <p class="blog-entry__excerpt">{{ blog.preview }}</p>
        <div class="blog-meta">
          <span>{{ formatDate(blog.date) }}</span>
          <span v-if="blog.structuredData && blog.structuredData.readingTime">
            · {{ blog.structuredData.readingTime }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  paginatedBlogs: {
    type: Array,
    required: true,
  },
  loadedImages: {
    type: Object,
    required: true,
  },
  selectedTag: {
    type: String,
    required: false,
  },
});

const emit = defineEmits(["view-blog", "update:loadedImages"]);

function resolvedImgPath(path) {
  return path ? `/BlogPics/${path}` : "/HARTECHOLogo.webp";
}

const generatePlaceholderUrl = (url) => {
  if (!url || typeof url !== "string" || url.length === 0) {
    return "/defaultPlaceholderImageBlur.webp";
  }

  const lastDotIndex = url.lastIndexOf(".");
  if (lastDotIndex === -1 || lastDotIndex === 0) return url;

  const extension = url.slice(lastDotIndex);
  const baseUrl = url.slice(0, lastDotIndex);

  return resolvedImgPath(`${baseUrl}Blur${extension}`);
};

// Function to handle image load event
const onImageLoad = (index) => {
  emit("update:loadedImages", { index, status: true });
};

// Function to format date
const formatDate = (dateString) => {
  if (!dateString) return "No date available";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
</script>

<style scoped>
.blog-list__header {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}

.blog-entry {
  display: flex;
  border-radius: 0px;
  margin-bottom: 20px;
  max-width: 100%;
  min-height: 15rem;
  overflow: hidden;
  transition: all 0.2s ease-in-out;
}

.blog-entry:nth-child(odd) {
  background-color: #f0f0f0; /* light grey background for odd elements */
}

.blog-entry:nth-child(even) {
  background-color: #ffffff; /* white background for even elements */
}

.blog-entry:hover {
  transform: scale(1.005);
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
}

.blog-entry__thumbnail {
  height: 15rem;
  min-width: 20rem;
  overflow: hidden;
  cursor: pointer;
}

.blog-entry__thumbnail img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  transform: scale(1.2);
  transition: transform 0.5s ease-in-out;
}

.blog-entry__thumbnail img.image-loaded {
  transform: scale(1);
}

.blog-meta {
  font-size: 0.85rem;
  color: #777;
}

.blog-entry__content {
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.blog-entry__title {
  font-size: 1.5rem;
  color: #333;
}

.blog-tags {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
}

.blog-tag {
  background-color: #444;
  padding: 0.3rem 0.6rem;
  margin-right: 0.3rem;
  margin-bottom: 0.1rem;
  font-size: 0.8rem;
  color: #333;
  border-radius: 10px;
  color: white;
  font-weight: bold;
}

.blog-entry__excerpt {
  color: #666;
}

.blog-entry__link {
  color: #005ba0;
  text-decoration: none;
  font-weight: bold;
}

.blog-entry__link:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .blog-entry {
    flex-direction: column; /* Stack image on top */
    align-items: center; /* Center the content */
  }

  .blog-entry__thumbnail {
    width: 100%; /* Make the image take full width */
    height: 15rem; /* Adjust height for smaller screens */
  }

  .blog-entry__content {
    width: 100%; /* Ensure content takes full width */
    padding: 10px;
    text-align: left; /* Center text content */
    gap: 0.8rem;
  }

  .blog-entry__title {
    font-size: 1.2rem;
  }
}
</style>
