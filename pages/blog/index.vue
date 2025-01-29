<template>
  <div class="blogs-wrapper">
    <div class="content-container">
      <!-- Left Column -->
      <div class="left-column">
        <BlogSearchBreadcrumbs :currentBlogTitle="selectedTag || 'All Posts'" />
        <BlogSearchFilters
          :allTags="allTags"
          :selectedTag="selectedTag"
          :sortOption="sortOption"
          @update:tag="filterBlogsByTag"
          @update:sort="sortBlogs"
        />
      </div>

      <!-- Right Column -->
      <div class="right-column">
        <h1 class="filter-title">{{ selectedTag || "All Posts" }}</h1>
        <BlogSearchFeaturedBlogs
          :featuredBlogs="featuredBlogs"
          :loadedImages="loadedImages"
          @view-blog="goToBlog"
          @update:loadedImages="updateLoadedImages"
        />
        <BlogSearchBlogList
          :paginatedBlogs="paginatedBlogs"
          :loadedImages="loadedImages"
          :selectedTag="selectedTag"
          @update:loadedImages="updateLoadedImages"
        />
        <BlogSearchPagination
          :totalPages="totalPages"
          :currentPage="currentPage"
          @update:page="goToPage"
        />
      </div>
    </div>
    <!-- <section class="quote-form-section">
        <WebSectionsQuoteForm backgroundColor="rgba(0,0,0,0.1)" />
      </section> -->
  </div>
</template>
    
    <script setup>
const { data: blogs } = await useFetch("/api/blogs");

useSeoMeta({
  title: "Insights on Websites, SEO, Ads, and Branding || HARTECHO Blog",
  ogTitle: "Insights on Websites, SEO, Ads, and Branding || HARTECHO Blog",
  description:
    "Stay updated with HARTECHO's latest blog posts. Explore expert insights on custom-built websites, SEO strategies, data-driven ad campaigns, and branding solutions to grow your business.",
  ogDescription:
    "Stay updated with HARTECHO's latest blog posts. Explore expert insights on custom-built websites, SEO strategies, data-driven ad campaigns, and branding solutions to grow your business.",
  ogImage: "/HARTECHOLogo.webp",
  twitterCard: "/HARTECHOLogo.webp",
});

// Structured Data
// useHead({
//   link: [
//     {
//       rel: "canonical",
//       href: `https://www.hartecho.com/blog`,
//     },
//   ],
//   script: [
//     {
//       type: "application/ld+json",
//       children: JSON.stringify({
//         "@context": "https://schema.org",
//         "@type": "Blog",
//         name: "HARTECHO Blog - Expert Insights on Digital Marketing",
//         url: "https://www.hartecho.com/blog",
//         description:
//           "HARTECHO's blog offers expert insights on custom-built websites, SEO strategies, data-driven ad campaigns, and branding solutions to help businesses thrive online.",
//         publisher: {
//           "@type": "Organization",
//           name: "HARTECHO",
//           url: "https://www.hartecho.com",
//           logo: {
//             "@type": "ImageObject",
//             url: "https://www.hartecho.com/HARTECHOLogo.webp",
//             width: 500,
//             height: 500,
//           },
//           contactPoint: {
//             "@type": "ContactPoint",
//             telephone: "+1-801-793-5456",
//             contactType: "Customer Service",
//             areaServed: "US",
//             availableLanguage: ["English"],
//           },
//         },
//         blogPost: [
//           {
//             "@type": "BlogPosting",
//             headline: "Why Custom Websites Outperform Templates",
//             url: "https://www.hartecho.com/blog",
//             datePublished: "2024-11-28",
//             description:
//               "Discover why custom-built websites crafted by software engineers offer superior performance, SEO, and user experience compared to templates.",
//             author: {
//               "@type": "Person",
//               name: "HARTECHO Team",
//             },
//             image: "https://www.hartecho.com/HARTECHOLogo.webp",
//           },
//           {
//             "@type": "BlogPosting",
//             headline: "5 SEO Strategies to Drive Organic Traffic",
//             url: "https://www.hartecho.com/blog",
//             datePublished: "2024-11-20",
//             description:
//               "Learn the top 5 SEO strategies that can boost your organic traffic and improve search engine rankings for your business.",
//             author: {
//               "@type": "Person",
//               name: "HARTECHO Team",
//             },
//             image: "https://www.hartecho.com/HARTECHOLogo.webp",
//           },
//           {
//             "@type": "BlogPosting",
//             headline: "How to Create ROI-Focused Ad Campaigns",
//             url: "https://www.hartecho.com/blog",
//             datePublished: "2024-11-15",
//             description:
//               "Explore the science behind creating data-driven ad campaigns that maximize ROI and drive measurable results.",
//             author: {
//               "@type": "Person",
//               name: "HARTECHO Team",
//             },
//             image: "https://www.hartecho.com/HARTECHOLogo.webp",
//           },
//         ],
//         about: {
//           "@type": "Thing",
//           name: [
//             "Custom Websites",
//             "SEO Strategies",
//             "Data-Driven Ad Campaigns",
//             "Branding Solutions",
//             "Digital Marketing Insights",
//           ],
//         },
//         breadcrumb: {
//           "@type": "BreadcrumbList",
//           itemListElement: [
//             {
//               "@type": "ListItem",
//               position: 1,
//               name: "Home",
//               item: "https://www.hartecho.com",
//             },
//             {
//               "@type": "ListItem",
//               position: 2,
//               name: "Blog",
//               item: "https://www.hartecho.com/blog",
//             },
//           ],
//         },
//       }),
//     },
//   ],
// });

const selectedTag = ref("");
const sortOption = ref("most-recent");
const loadedImages = ref({});
const currentPage = ref(1);
const itemsPerPage = ref(5);

const allTags = computed(() => {
  const tags = new Set();
  if (blogs.value) {
    blogs.value.forEach((blog) => {
      blog.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }
  return null;
});

const filteredBlogs = computed(() => {
  let filtered = blogs.value;

  // Filter by selected tag
  if (selectedTag.value) {
    filtered = filtered.filter((blog) => blog.tags.includes(selectedTag.value));
  }

  // Sort blogs based on the selected sort option
  switch (sortOption.value) {
    case "alphabetical":
      filtered = filtered.sort((a, b) => {
        const titleA = a.mainTitle ? a.mainTitle.toLowerCase() : ""; // Check if title exists
        const titleB = b.mainTitle ? b.mainTitle.toLowerCase() : "";
        return titleA.localeCompare(titleB);
      });
      break;
    case "reverse-alphabetical":
      filtered = filtered.sort((a, b) => {
        const titleA = a.mainTitle ? a.mainTitle.toLowerCase() : "";
        const titleB = b.mainTitle ? b.mainTitle.toLowerCase() : "";
        return titleB.localeCompare(titleA);
      });
      break;
    case "most-recent":
      filtered = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case "oldest-first":
      filtered = filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
      break;
    default:
      break;
  }

  return filtered;
});

const featuredBlogs = computed(() => paginatedBlogs.value.slice(0, 3));
const paginatedBlogs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredBlogs.value.slice(start, end);
});

const totalPages = computed(() =>
  Math.ceil(filteredBlogs.value.length / itemsPerPage.value)
);

const goToBlog = (blogId) => {
  useRouter().push(`/blog/${blogId}`);
};

const filterBlogsByTag = (tag) => {
  selectedTag.value = tag;
};

const sortBlogs = (option) => {
  sortOption.value = option;
};

const goToPage = (page) => {
  currentPage.value = page;
};

const updateLoadedImages = ({ index, status }) => {
  loadedImages.value = { ...loadedImages.value, [index]: status };
};

const emit = defineEmits(["hide-loading"]);
emit("hide-loading");
</script>
    
    <style scoped>
.blogs-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem 0;
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

.quote-form-section {
  margin-top: 2rem;
}

@media (max-width: 1025px) {
  .content-container {
    flex-direction: column;
    gap: 0rem;
  }

  .left-column,
  .right-column {
    width: 100%;
    margin-top: 0; /* Remove top margin for smaller screens */
  }

  .right-column {
    margin-top: 2rem; /* Optional: Adjust spacing between elements */
  }
}
</style>
    