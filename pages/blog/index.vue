<template>
  <div class="blogs-wrapper">
    <div class="content-container">
      <!-- Left Column: Breadcrumbs and Filters -->
      <div class="left-column">
        <!-- Breadcrumbs -->
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <ul class="breadcrumb-list">
            <li class="breadcrumb-item">
              <NuxtLink to="/">Home</NuxtLink>
            </li>
            <li class="breadcrumb-item">
              <NuxtLink to="/blog">Blog</NuxtLink>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
              {{ selectedTag || "All Posts" }}
            </li>
          </ul>
        </nav>
        <!-- Filters -->
        <div class="filters sticky-filters">
          <h3>Filter by</h3>
          <label for="tag-filter">Topic</label>
          <select id="tag-filter" :value="selectedTag" @change="onTagChange">
            <option value="">All Tags</option>
            <option v-for="tag in allTags" :key="tag" :value="tag">
              {{ formatTag(tag) }}
            </option>
          </select>
          <label for="sort-filter">Sorting</label>
          <select id="sort-filter" :value="sortOption" @change="onSortChange">
            <option value="alphabetical">Alphabetical</option>
            <option value="reverse-alphabetical">Reverse Alphabetical</option>
            <option value="most-recent">Most Recent</option>
            <option value="oldest-first">Oldest First</option>
          </select>
        </div>
      </div>

      <!-- Right Column: Featured Blogs and Blog List -->
      <div class="right-column">
        <h1 class="filter-title">{{ selectedTag || "All Posts" }}</h1>

        <!-- Featured Blogs (from API, already sorted by views descending) -->
        <section class="featured-section">
          <h2>Featured Posts</h2>
          <div class="featured-blogs" v-if="sortedFeatured.length">
            <div
              v-for="(blog, index) in sortedFeatured"
              :key="blog._id"
              class="featured-blog"
              @click="goToBlog(blog._id)"
            >
              <div class="featured-thumbnail">
                <NuxtImg
                  :src="resolvedImgPath(blog.thumbnail)"
                  :alt="
                    blog.mainTitle
                      ? blog.mainTitle + ' picture'
                      : 'Blog post image'
                  "
                  :placeholder="generatePlaceholderUrl(blog.thumbnail)"
                  :class="{ 'image-loaded': loadedImages[index] }"
                  @load="onImageLoad(index)"
                />
              </div>
              <div class="featured-content">
                <div class="blog-tags" v-if="blog.tags && blog.tags.length">
                  <span
                    v-for="(tag, idx) in blog.tags"
                    :key="idx"
                    class="blog-tag"
                  >
                    {{ formatTag(tag) }}
                  </span>
                </div>
                <h3>{{ blog.mainTitle || "Untitled Blog" }}</h3>
                <div class="blog-meta">
                  <span>{{ formatDate(blog.date) }}</span>
                  <span
                    v-if="
                      blog.structuredData && blog.structuredData.readingTime
                    "
                  >
                    · {{ blog.structuredData.readingTime }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="no-featured">No featured posts available.</div>
        </section>

        <!-- Loading indicator for filter changes / initial load -->
        <div
          v-if="loading && currentPage === 1"
          class="filter-loading-indicator"
        >
          <div class="spinner small"></div>
          <span>Loading new blogs...</span>
        </div>

        <!-- Regular Blog List (sorted locally) -->
        <section class="blog-list" v-else>
          <div
            v-for="(blog, index) in sortedBlogs"
            :key="blog._id"
            class="blog-entry"
          >
            <NuxtLink class="blog-entry__thumbnail" :to="`/blog/${blog._id}`">
              <NuxtImg
                :src="resolvedImgPath(blog.thumbnail)"
                :alt="
                  blog.mainTitle
                    ? blog.mainTitle + ' picture'
                    : 'Blog post image'
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
              <div class="blog-tags" v-if="blog.tags && blog.tags.length">
                <span
                  v-for="(tag, idx) in blog.tags"
                  :key="idx"
                  class="blog-tag"
                >
                  {{ formatTag(tag) }}
                </span>
              </div>
              <p class="blog-entry__excerpt">{{ blog.preview }}</p>
              <div class="blog-meta">
                <span>{{ formatDate(blog.date) }}</span>
                <span
                  v-if="blog.structuredData && blog.structuredData.readingTime"
                >
                  · {{ blog.structuredData.readingTime }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- Infinite Scroll Trigger & Additional Loading Indicator -->
        <div ref="loadMoreTrigger" class="load-more-trigger"></div>
        <div
          v-if="loading && currentPage > 1"
          class="infinite-loading-indicator"
        >
          <div class="spinner"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "#imports";

// Reactive state
const selectedTag = ref("");
const sortOption = ref("most-recent");
const blogs = ref([]); // Regular blogs (fetched via API)
const featuredBlogs = ref([]); // Featured blogs (fetched via API)
const loadedImages = ref({});
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalRegular = ref(0);
const loading = ref(false);
const allLoaded = ref(false);
const loadMoreTrigger = ref(null);

useSeoMeta({
  // Universal SEO
  title: "E-Commerce SEO & Web Development Insights || HARTECHO Blog",
  description:
    "Stay ahead in e-commerce with expert insights on SEO, web development, and custom-coded online stores. Learn how to optimize your business for success!",

  // Open Graph (Facebook, Instagram, LinkedIn, WhatsApp, Discord, Slack)
  ogTitle: "E-Commerce SEO & Web Development Insights || HARTECHO Blog",
  ogDescription:
    "Explore expert tips and strategies for building high-performance e-commerce websites. From SEO to cutting-edge web development, HARTECHO's blog has you covered!",
  ogImage: "https://hartecho.com/HARTECHOLogo.webp",
  ogUrl: "https://hartecho.com/blog",
  ogType: "website",

  // Twitter/X
  twitterTitle: "E-Commerce SEO & Web Development Insights || HARTECHO Blog",
  twitterDescription:
    "Get the latest insights on e-commerce SEO, custom-coded websites, and online store optimization from HARTECHO’s experts.",
  twitterImage: "https://hartecho.com/HARTECHOLogo.webp",
  twitterCard: "summary_large_image",

  // Pinterest
  pinterestRichPin: "true",
});

// SSR: initial fetch using useFetch (runs on server and client)
const { data: initialData } = await useFetch("/api/blogs", {
  query: { tag: selectedTag.value, page: 1, limit: itemsPerPage.value },
});
if (initialData.value) {
  featuredBlogs.value = initialData.value.featured || [];
  blogs.value = initialData.value.regular || [];
  totalRegular.value = initialData.value.totalRegular || 0;
}

// Client-side function to fetch blogs (for tag changes or infinite scroll)
const fetchBlogs = async (page = 1) => {
  loading.value = true;
  try {
    const data = await $fetch("/api/blogs", {
      query: { tag: selectedTag.value, page, limit: itemsPerPage.value },
    });
    if (page === 1) {
      // On new tag filter, update featured and regular blogs.
      featuredBlogs.value = data.featured || [];
      blogs.value = data.regular || [];
    } else {
      blogs.value = blogs.value.concat(data.regular || []);
    }
    totalRegular.value = data.totalRegular || 0;
    if (blogs.value.length >= totalRegular.value) {
      allLoaded.value = true;
    }
  } catch (error) {
    console.error("Error fetching blogs:", error);
  } finally {
    loading.value = false;
  }
};

const onTagChange = (event) => {
  selectedTag.value = event.target.value;
  resetAndFetch();
};

const onSortChange = (event) => {
  // Sorting is handled locally.
  sortOption.value = event.target.value;
};

const resetAndFetch = () => {
  currentPage.value = 1;
  allLoaded.value = false;
  fetchBlogs(1);
};

const router = useRouter();
const goToBlog = (blogId) => {
  router.push(`/blog/${blogId}`);
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

const onImageLoad = (index) => {
  loadedImages.value = { ...loadedImages.value, [index]: true };
};

const formatDate = (dateString) => {
  if (!dateString) return "No date available";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Helper to format tags: capitalizes first letter of each word.
const formatTag = (tag) => {
  return tag
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// Local sorting for regular blogs.
const sortedBlogs = computed(() => {
  return [...blogs.value].sort((a, b) => {
    const titleA = (a.mainTitle || "").toLowerCase();
    const titleB = (b.mainTitle || "").toLowerCase();
    switch (sortOption.value) {
      case "alphabetical":
        return titleA.localeCompare(titleB);
      case "reverse-alphabetical":
        return titleB.localeCompare(titleA);
      case "oldest-first":
        return new Date(a.date) - new Date(b.date);
      case "most-recent":
      default:
        return new Date(b.date) - new Date(a.date);
    }
  });
});

// Local sorting for featured blogs by views (highest first).
const sortedFeatured = computed(() => {
  return [...featuredBlogs.value].sort(
    (a, b) => (b.views || 0) - (a.views || 0)
  );
});

// Infinite scroll: observe the trigger element to load more blogs.
const createObserver = () => {
  const observer = new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (entry.isIntersecting && !loading.value && !allLoaded.value) {
      currentPage.value++;
      fetchBlogs(currentPage.value);
    }
  });
  if (loadMoreTrigger.value) {
    observer.observe(loadMoreTrigger.value);
  }
};

onMounted(() => {
  createObserver();
});

// Compute available tags from both featured and regular blogs.
const allTags = computed(() => {
  const tagsSet = new Set();
  [...blogs.value, ...featuredBlogs.value].forEach((blog) => {
    blog.tags?.forEach((tag) => tagsSet.add(tag));
  });
  return Array.from(tagsSet).sort();
});

const emit = defineEmits(["hide-loading"]);
emit("hide-loading");
</script>

<style scoped>
.blogs-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem 0;
  margin-top: 75px;
}

.content-container {
  display: flex;
  gap: 5rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  padding: 0 1rem;
}

.left-column {
  width: 20%;
}

.right-column {
  width: 70%;
  margin-top: 5rem;
}

.filter-title {
  font-size: 2rem;
  margin-bottom: 2rem;
}

/* Breadcrumb Styles */
.breadcrumb {
  padding: 1rem 0;
  background-color: #fff;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  font-family: "Source Sans Pro", sans-serif;
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  list-style: none;
  font-size: 0.8rem;
  font-weight: bold;
  font-family: "Source Sans Pro", sans-serif;
}

.breadcrumb-item a {
  color: #007bff;
  text-decoration: none;
  font-size: 1rem;
}

.breadcrumb-item a:hover {
  text-decoration: underline;
}

.breadcrumb-item.active {
  color: #666;
  font-size: 1rem;
}

.breadcrumb-item + .breadcrumb-item::before {
  content: "/";
  margin-right: 0.5rem;
  color: #666;
}

/* Filters */
.filters {
  display: flex;
  flex-direction: column;
}

.filters label {
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.filters select {
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-bottom: 1.5rem;
  width: 100%;
}

.sticky-filters {
  position: sticky;
  top: 1rem;
}

h3 {
  margin-bottom: 2rem;
}

/* Featured Blogs */
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
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
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
  margin-bottom: 1rem;
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
  margin: 0;
  display: flex;
  flex-wrap: wrap;
}

.blog-tag {
  background-color: black;
  padding: 0.4rem 0.6rem;
  margin-right: 0.3rem;
  margin-bottom: 0.2rem;
  font-size: 1rem;
  color: white;
  border-radius: 5px;
  font-weight: bold;
  font-family: "Source Sans Pro", sans-serif;
}

/* Blog Entry Styles */
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
  background-color: #f0f0f0;
}

.blog-entry:nth-child(even) {
  background-color: #ffffff;
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

.blog-entry__excerpt {
  color: #666;
}

.blog-meta {
  font-size: 0.85rem;
  color: #777;
}

/* Loading Indicators */
.filter-loading-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  color: #007bff;
}

.infinite-loading-indicator {
  text-align: center;
  margin: 2rem 0;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 6px solid rgba(0, 0, 0, 0.1);
  border-top-color: #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

.spinner.small {
  width: 30px;
  height: 30px;
  border-width: 4px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.load-more-trigger {
  height: 1px;
}

.no-featured {
  font-style: italic;
  color: #777;
  padding: 1rem 0;
}

/* Responsive Styles */

/* For devices with max-width 768px */
@media (max-width: 768px) {
  .content-container {
    flex-direction: column;
    gap: 0;
  }
  .left-column,
  .right-column {
    width: 100%;
    margin-top: 0;
  }
  .right-column {
    margin-top: 2rem;
  }
  .featured-blogs {
    flex-direction: column;
  }
  .featured-blog {
    width: 100%;
  }
  .blog-entry {
    flex-direction: column;
    align-items: center;
  }
  .blog-entry__thumbnail {
    width: 100%;
    height: auto;
  }
  .blog-entry__content {
    width: 100%;
    padding: 10px;
    text-align: left;
  }
}

/* For devices with max-width 480px */
@media (max-width: 480px) {
  .filter-title {
    font-size: 1.5rem;
  }
  .breadcrumb-list {
    font-size: 0.75rem;
  }
  .filters select {
    font-size: 0.9rem;
  }
  .blog-entry__title {
    font-size: 1.2rem;
  }
  .blog-entry__excerpt {
    font-size: 0.9rem;
  }
  .blog-meta {
    font-size: 0.75rem;
  }
  .blog-tag {
    font-size: 0.8rem;
    padding: 0.3rem 0.5rem;
  }
}
</style>
