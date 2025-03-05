<template>
  <div class="blog-page-wrapper">
    <div class="content">
      <div class="heading">
        <!-- Breadcrumbs remains as is -->
        <BlogSearchBreadcrumbs
          :currentBlogTitle="post?.tags[0] || 'All Posts'"
        />
        <h1 class="blog-title">{{ post.mainTitle }}</h1>

        <div class="blog-metadata">
          <NuxtImg
            src="/HARTECHOLogo.webp"
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
                  src="/Graphics/calendar-icon.svg"
                  alt="Date icon"
                  class="meta-icon"
                />
                <span>{{ formattedDate(post.date) }}</span>
              </div>
              <div class="meta-reading-time">
                <NuxtImg
                  src="/Graphics/clock-icon.svg"
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
            <!-- Inlined BlogImageWrapper -->
            <div class="img-wrapper" v-if="post.image">
              <NuxtImg
                :src="blogImageWrapperResolvedImgPath(post.image)"
                :alt="post.mainTitle + ' picture'"
                :placeholder="
                  blogImageWrapperGeneratePlaceholderUrl(post.image)
                "
                loading="eager"
                @load="blogImageWrapperOnImageLoad"
                :class="{ 'image-loaded': blogImageWrapperImageLoaded }"
              />
            </div>

            <div class="under-photo">
              <div class="left-sticky-column">
                <SubcomponentsStickyCTA />
              </div>
              <div class="blog-body">
                <p>{{ post.intro }}</p>
                <!-- Inlined BlogPostContent for each section -->
                <div
                  v-for="(section, index) in post.sections"
                  :key="'section-' + index"
                >
                  <div>
                    <h2>{{ section.title }}</h2>
                    <div
                      v-for="(content, index2) in section.content"
                      :key="index2"
                    >
                      <p v-if="content.type === 'paragraph'">
                        {{ content.paragraph.text }}
                      </p>
                      <h3
                        v-if="content.type === 'subheading'"
                        class="subheading"
                      >
                        {{ content.subheading.text }}
                      </h3>
                      <div v-if="content.type === 'list'" class="list-section">
                        <h4>{{ content.list.title }}</h4>
                        <ul>
                          <li
                            v-for="(item, itemIndex) in content.list.items"
                            :key="itemIndex"
                          >
                            <strong>{{ item.title }}</strong>
                            <p>{{ item.description }}</p>
                          </li>
                        </ul>
                      </div>
                      <div
                        v-if="content.type === 'image'"
                        class="section-img-wrapper"
                      >
                        <NuxtImg
                          :src="
                            blogPostContentResolvedImgPath(content.image.url)
                          "
                          :alt="content.image.caption"
                          loading="lazy"
                        />
                        <p class="image-caption">{{ content.image.caption }}</p>
                      </div>
                      <!-- Interactive items remain as component calls -->
                      <BlogInteractiveQuiz
                        v-if="content.type === 'quiz'"
                        :quiz="content.quiz"
                      />
                      <BlogInteractivePoll
                        v-if="content.type === 'poll'"
                        :poll="content.poll"
                        @updatePoll="updateContent()"
                      />
                      <BlogInteractiveVideoContent
                        v-if="content.type === 'video'"
                        :video="content.video"
                      />
                    </div>
                  </div>
                </div>

                <!-- Inlined BlogReferences -->
                <div v-if="post.references && post.references.length">
                  <h2>References</h2>
                  <div
                    v-for="(reference, refIndex) in post.references"
                    :key="refIndex"
                  >
                    <p class="references">{{ reference }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="comments">
            <!-- Inlined BlogComments -->
            <div class="comments-section">
              <h2>Comments</h2>
              <div
                v-if="post.comments && post.comments.length"
                class="comments-list"
              >
                <div
                  v-for="(comment, index) in post.comments"
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

        <div class="right-sticky-column">
          <SubcomponentsBlogSidebar />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect } from "vue";
import { useRoute } from "vue-router";

// Main blog post data
const route = useRoute();
const { data: post } = await useFetch(`/api/blogs?_id=${route.params.id}`);

const formattedDate = (date) => {
  return new Date(date).toLocaleDateString();
};

const addComment = async (newCommentData) => {
  if (newCommentData.name && newCommentData.comment) {
    post.value.comments.push({
      name: newCommentData.name,
      comment: newCommentData.comment,
      date: new Date().toISOString(),
      url: newCommentData.url,
    });
    await updateComments();
  } else {
    alert("Please enter your name and comment.");
  }
};

onMounted(async () => {
  post.value.views++;
  incrementViews();
});

useHead({
  link: [
    {
      rel: "canonical",
      href: `https://www.hartecho.com/blog/${post.value._id}`,
    },
  ],
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.value.mainTitle,
        name: post.value.mainTitle,
        url: `https://www.hartecho.com/blog/${post.value._id}`,
        description: post.value.description,
        datePublished: post.value.date,
        dateModified: post.value.updatedAt || post.value.date,
        image: `https://www.hartecho.com/BlogPics/${post.value.image}`,
        keywords: post.value.tags.join(", "),
        author: {
          "@type": "Person",
          name: post.value.author.name,
        },
        publisher: {
          "@type": "Organization",
          name: "HARTECHO",
          url: "https://www.hartecho.com",
          logo: {
            "@type": "ImageObject",
            url: "https://www.hartecho.com/HARTECHOLogo.webp",
            width: 500,
            height: 500,
          },
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+1-801-793-5456",
            contactType: "Customer Service",
            areaServed: "US",
            availableLanguage: ["English"],
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://www.hartecho.com/blog/${post.value._id}`,
        },
        articleSection: post.value.tags.join(", "),
        wordCount: post.value.structuredData.wordCount || undefined,
        timeRequired: post.value.structuredData.readingTime
          ? `PT${post.value.structuredData.readingTime.split(" ")[0]}M`
          : undefined,
        discussionUrl: `https://www.hartecho.com/blog/${post.value._id}#comments`,
        commentCount: post.value.comments ? post.value.comments.length : 0,
        comment: post.value.comments.map((comment) => ({
          "@type": "Comment",
          author: {
            "@type": "Person",
            name: comment.name,
          },
          datePublished: comment.date,
          text: comment.comment,
        })),
        potentialAction: {
          "@type": "Action",
          target: `https://www.hartecho.com/blog/${post.value._id}`,
          name: "Read Blog Post",
          description: `Explore insights on ${post.value.tags.join(
            ", "
          )} in this HARTECHO blog post.`,
        },
        about: {
          "@type": "Thing",
          name: post.value.tags,
        },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://www.hartecho.com",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Blog",
              item: "https://www.hartecho.com/blog",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: post.value.mainTitle,
              item: `https://www.hartecho.com/blog/${post.value._id}`,
            },
          ],
        },
      }),
    },
  ],
});

useSeoMeta({
  // Universal SEO
  title: post.value.mainTitle,
  description: post.value.description,

  // Open Graph (Facebook, Instagram, LinkedIn, WhatsApp, Discord, Slack)
  ogTitle: post.value.mainTitle,
  ogDescription: post.value.description,
  ogImage: `https://www.hartecho.com/BlogPics/${post.value.image}`,
  ogUrl: `https://hartecho.com/blog/${post.value._id}`,
  ogType: "article",

  // Twitter/X
  twitterTitle: post.value.mainTitle,
  twitterDescription: post.value.description,
  twitterImage: `https://www.hartecho.com/BlogPics/${post.value.image}`,
  twitterCard: "summary_large_image",

  // Pinterest
  pinterestRichPin: "true",
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

// --- Inlined BlogImageWrapper logic ---
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

// --- Inlined BlogPostContent logic ---
function blogPostContentResolvedImgPath(path) {
  return path ? "/" + path : "/HARTECHOLogo.webp";
}

// --- Inlined BlogComments logic ---
const newComment = ref({ name: "", comment: "", url: "" });
function formatUrl(url) {
  if (!/^https?:\/\//i.test(url)) {
    return `http://${url}`;
  }
  return url;
}
function submitComment() {
  if (newComment.value.name && newComment.value.comment) {
    addComment({ ...newComment.value });
    newComment.value = { name: "", comment: "", url: "" };
  } else {
    alert("Please enter your name and comment.");
  }
}
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
  margin: 0 auto;
}

/* BlogPostContent Styles */
h2 {
  font-family: "Poppins";
  border-bottom: 2px solid #eee;
  color: black;
  font-size: 2rem;
  line-height: 2.2rem;
  padding-bottom: 0.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

h3.subheading {
  color: #333;
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  margin-top: 1rem;
}

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
}

.image-caption {
  text-align: center;
  font-size: 1rem;
  color: #777;
  margin-top: 0.5rem;
}

/* BlogReferences Styles */
.references {
  font-size: 1.2rem;
  word-break: break-all;
  color: #888;
}

/* BlogComments Styles */
.comments-section {
  margin-top: 3rem;
  padding: 2rem;
  background: #f9f9f9;
  border-radius: 8px;
  margin-left: auto;
  margin-right: auto;
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
  background-color: #fff;
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

.add-comment-form h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
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
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  font-size: 0.9rem;
  font-weight: bold;
  text-decoration: none;
  transition: background-color 0.3s ease-in-out;
  width: 10rem;
  text-align: center;
  cursor: pointer;
  border: none;
}

.cta-button:hover {
  background-color: #01c5ee;
}

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
