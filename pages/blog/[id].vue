<template>
  <div class="blog-page-wrapper">
    <div class="content">
      <div class="heading">
        <BlogSearchBreadcrumbs
          :currentBlogTitle="post?.tags[0] || 'All Posts'"
        />
        <h1 class="blog-title">{{ post.mainTitle }}</h1>

        <div class="blog-metadata">
          <NuxtImg
            src="/Logos/OALogo.svg"
            alt="Author image"
            class="author-image"
          />
          <div class="post-info">
            <div class="author-info">
              <span
                >by <b>{{ post.author.name }}</b></span
              >
            </div>
            <div class="meta-info">
              <div class="meta-date">
                <NuxtImg
                  src="/calendar-icon.svg"
                  alt="Date icon"
                  class="meta-icon"
                />
                <span>{{ formattedDate(post.date) }}</span>
              </div>
              <div class="meta-reading-time">
                <NuxtImg
                  src="/clock-icon.svg"
                  alt="Clock icon"
                  class="meta-icon"
                />
                <span>{{
                  post.structuredData.readingTime || "Reading time unavailable"
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="blog-content-wrapper">
        <div class="blog-post" v-if="post">
          <div class="left">
            <BlogImageWrapper
              :imageSrc="`/BlogPics/${post.image}`"
              :altText="post.mainTitle + ' picture'"
              class="blog-image"
            />
            <div class="under-photo">
              <div class="left-sticky-column">
                <SubcomponentsStickyCTA />
              </div>
              <div class="blog-body">
                <p>{{ post.intro }}</p>
                <div
                  v-for="(section, index) in post.sections"
                  :key="'section-' + index"
                >
                  <BlogPostContent
                    :title="section.title"
                    :contents="section.content"
                    @updatePoll="updateContent()"
                  />
                </div>
                <BlogReferences :references="post.references" />
              </div>
            </div>
          </div>
          <div class="comments">
            <BlogComments :comments="post.comments" @addComment="addComment" />
          </div>
        </div>

        <div class="right-sticky-column">
          <SubcomponentsBlogSidebar />
        </div>
      </div>
    </div>

    <!-- <section class="quote-form-section">
      <WebSectionsQuoteForm backgroundColor="rgba(0,0,0,0.1)" />
    </section> -->
  </div>
</template>

<script setup>
const route = useRoute();
const { data: post } = await useFetch(`/api/blogs?_id=${route.params.id}`);

const formattedDate = (date) => {
  return new Date(date).toLocaleDateString();
};

const addComment = async (newComment) => {
  if (newComment.name && newComment.comment) {
    post.value.comments.push({
      name: newComment.name,
      comment: newComment.comment,
      date: new Date().toISOString(),
      url: newComment.url,
    });
    await updateComments();
  } else {
    alert("Please enter your name and comment.");
  }
};

const description = computed(() => {
  return post.value
    ? `${post.value.title} - HARTECHO Digital Marketing Blog || Custom Websites, SEO, Ads, and Branding`
    : "HARTECHO Digital Marketing Blog || #1 Utah-based Marketing Agency";
});

onMounted(async () => {
  post.value.views++;
  incrementViews();
});

watchEffect(() => {
  if (post.value) {
    useHead({
      link: [
        {
          rel: "canonical",
          href: `https://www.aestheticas.com/blog/${post.value._id}`,
        },
      ],
      script: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.value.mainTitle,
            image: post.value.image,
            author: {
              "@type": "Person",
              name: post.value.author.name,
            },
            datePublished: post.value.date,
            description: post.value.description,
            keywords: post.value.tags.join(", "),
          }),
        },
      ],
    });

    useSeoMeta({
      title: post.value.mainTitle,
      ogTitle: post.value.mainTitle,
      description: post.value.description,
      ogDescription: post.value.description,
      ogImage: post.value.image,
      twitterCard: post.value.image,
    });
  }
});

const incrementViews = async () => {
  try {
    await $fetch(`/api/blogs/${post.value._id}`, {
      method: "PUT",
      body: { increment: 1 },
    });
  } catch (error) {
    console.error("Failed to increment blog views:", error);
  }
};

const updateComments = async () => {
  try {
    await $fetch(`/api/blogs/${post.value._id}`, {
      method: "PUT",
      body: { newComments: post.value.comments },
    });
  } catch (error) {
    console.error("Failed to update blog comments:", error);
  }
};

const updateContent = async () => {
  try {
    await $fetch(`/api/blogs/${post.value._id}`, {
      method: "PUT",
      body: post.value,
    });
  } catch (error) {
    console.error("Failed to update the blog post:", error);
  }
};

const emit = defineEmits(["hide-loading"]);
emit("hide-loading");
</script>

<style scoped>
/* Main Blog Page Wrapper */
.blog-page-wrapper {
  padding: 2rem 0rem;
  font-family: Proxima Nova, proxima-nova, -apple-system, BlinkMacSystemFont,
    Segoe UI, Roboto, Helvetica Neue, Helvetica, sans-serif, Apple Color Emoji,
    Segoe UI Emoji, Segoe UI Symbol;
}

.content {
  max-width: 1350px;
  margin: 0 auto;
  padding: 0 2rem;
}

.heading {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

/* Blog Title */
.blog-title {
  font-size: 3.2rem;
  line-height: 3.2rem;
  text-align: left;
  color: black;
  font-weight: bolder;
}

.post-info {
  display: flex;
  gap: 2rem;
}

/* Blog Metadata Section */
.blog-metadata {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin: 2rem 0 2.5rem 0;
  align-items: center;
}

.author-info {
  display: flex;
  align-items: center;
  /* gap: 1rem; */
}

.author-image {
  border-radius: 50%;
  width: 50px;
  height: 50px;
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

/* Blog Content and Sticky Columns */
.blog-content-wrapper {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  max-width: 1350px;
  margin: 0 auto;
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

.blog-image {
  margin-bottom: 1.5rem;
  height: auto;
  width: 100%;
}

.blog-body {
  line-height: 1.8;
  color: #444;
  padding-right: 2rem;
}

p {
  margin-bottom: 1.5rem;
}

/* Left Sticky Column */
.left-sticky-column {
  flex: 1;
  position: sticky;
  top: 2rem;
  min-width: 15rem;
}

/* Right Sticky Column */
.right-sticky-column {
  flex: 1;
  position: sticky;
  top: 2rem;
}

.comments {
  width: 100%;
  /* max-width: 1350px; */
  margin: 0 auto;
}

.quote-form-section {
  margin-top: 2rem;
}

/* Media Queries */
@media (max-width: 1024px) {
  .blog-content-wrapper {
    flex-direction: column;
  }

  .blog-body {
    padding: 0;
  }

  .left-sticky-column,
  .right-sticky-column {
    position: relative;
    top: 0;
  }

  .left-sticky-column {
    min-width: 12rem;
  }
}

@media (max-width: 768px) {
  .content {
    padding: 0 1rem;
  }

  .blog-metadata {
    gap: 0.5rem;
  }

  .left-sticky-column {
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
