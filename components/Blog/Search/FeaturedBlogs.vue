<template>
  <section class="featured-section">
    <h2>Featured Posts</h2>
    <div class="featured-blogs">
      <div
        v-for="(blog, index) in featuredBlogs"
        :key="blog._id"
        class="featured-blog"
        @click="goToBlog(blog._id)"
      >
        <div class="featured-thumbnail">
          <NuxtImg
            :src="resolvedImgPath(blog.thumbnail)"
            :alt="
              blog.mainTitle ? blog.mainTitle + ' picture' : 'Blog post image'
            "
            :placeholder="generatePlaceholderUrl(blog.thumbnail)"
            :class="{ 'image-loaded': loadedImages[index] }"
            @load="onImageLoad(index)"
          />
        </div>
        <div class="featured-content">
          <!-- Tags listed here -->
          <div class="blog-tags" v-if="blog.tags && blog.tags.length">
            <span
              v-for="(tag, index) in blog.tags"
              :key="index"
              class="blog-tag"
              >{{ tag }}</span
            >
          </div>
          <h3>{{ blog.mainTitle || "Untitled Blog" }}</h3>

          <!-- Date and reading time -->
          <div class="blog-meta">
            <span>{{ formatDate(blog.date) }}</span>
            <span v-if="blog.structuredData && blog.structuredData.readingTime">
              · {{ blog.structuredData.readingTime }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  featuredBlogs: {
    type: Array,
    required: true,
  },
  loadedImages: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["view-blog", "update:loadedImages"]);

const goToBlog = (blogId) => {
  emit("view-blog", blogId);
};

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
.featured-section {
  margin-bottom: 3rem;
}

.featured-blogs {
  display: flex;
  gap: 1rem;
}

h2 {
  font-family: "Poppins";
  font-size: 1.2rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}

.featured-blog {
  width: 30%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  padding: 0.5rem;
}

.featured-blog:hover {
  transform: scale(1.03);
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
}

.featured-thumbnail {
  height: 150px;
  overflow: hidden;
}

.featured-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.featured-content h3 {
  margin: 0.5rem 0;
  font-size: 1rem;
}

.blog-tags {
  margin: 0.5rem 0;
  display: flex;
  flex-wrap: wrap;
}

.blog-tag {
  background-color: #444;
  padding: 0.3rem 0.6rem;
  margin-right: 0.3rem;
  margin-bottom: 0.3rem;
  font-size: 0.8rem;
  color: #333;
  border-radius: 10px;
  color: white;
  font-weight: bold;
}

.blog-meta {
  font-size: 0.85rem;
  color: #777;
  margin-bottom: 1rem;
}

.featured-content a {
  color: #007bff;
  font-weight: bold;
  text-decoration: none;
}

.featured-content a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .featured-blogs {
    flex-direction: column; /* Stack featured blogs vertically */
  }

  .featured-blog {
    width: 100%; /* Make each blog take full width */
  }

  .featured-thumbnail {
    height: auto; /* Let the image adjust based on its aspect ratio */
  }
}
</style>
