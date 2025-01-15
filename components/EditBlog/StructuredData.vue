<template>
  <div class="structured-data-dashboard">
    <h2>Edit Structured Data</h2>

    <div class="grid-container">
      <!-- Basic Information -->
      <div class="grid-group">
        <h3>Basic Information</h3>
        <div class="grid-item">
          <label for="structuredHeadline">Headline</label>
          <input
            id="structuredHeadline"
            :value="structuredData.headline || ''"
            @input="updateField('headline', $event.target.value)"
            :placeholder="blog.mainTitle"
          />
        </div>

        <div class="grid-item">
          <label for="structuredAlternativeHeadline"
            >Alternative Headline</label
          >
          <input
            id="structuredAlternativeHeadline"
            :value="structuredData.alternativeHeadline || ''"
            @input="updateField('alternativeHeadline', $event.target.value)"
            placeholder="Alternative headline (optional)"
          />
        </div>

        <div class="grid-item">
          <label for="structuredDescription">Description</label>
          <textarea
            id="structuredDescription"
            :value="structuredData.description || ''"
            @input="updateField('description', $event.target.value)"
            :placeholder="blog.metaDescription || blog.intro"
          ></textarea>
        </div>
      </div>

      <!-- Image and Video -->
      <div class="grid-group">
        <h3>Media</h3>
        <div class="grid-item">
          <label for="structuredImage">Image URL</label>
          <input
            id="structuredImage"
            :value="structuredData.image?.url || ''"
            @input="updateNestedField('image', 'url', $event.target.value)"
            :placeholder="blog.image"
          />
        </div>

        <div class="grid-item">
          <label for="structuredImageCaption">Image Caption</label>
          <input
            id="structuredImageCaption"
            :value="structuredData.image?.caption || ''"
            @input="updateNestedField('image', 'caption', $event.target.value)"
            placeholder="Image caption (optional)"
          />
        </div>

        <div class="grid-item">
          <label for="structuredVideoName">Video Name</label>
          <input
            id="structuredVideoName"
            :value="structuredData.video?.name || ''"
            @input="updateNestedField('video', 'name', $event.target.value)"
            placeholder="Video name (optional)"
          />
        </div>

        <div class="grid-item">
          <label for="structuredVideoUrl">Video URL</label>
          <input
            id="structuredVideoUrl"
            :value="structuredData.video?.url || ''"
            @input="updateNestedField('video', 'url', $event.target.value)"
            placeholder="Video URL (optional)"
          />
        </div>

        <div class="grid-item">
          <label for="structuredVideoThumbnailUrl">Video Thumbnail URL</label>
          <input
            id="structuredVideoThumbnailUrl"
            :value="structuredData.video?.thumbnailUrl || ''"
            @input="
              updateNestedField('video', 'thumbnailUrl', $event.target.value)
            "
            placeholder="Video thumbnail URL (optional)"
          />
        </div>

        <div class="grid-item">
          <label for="structuredVideoUploadDate">Video Upload Date</label>
          <input
            id="structuredVideoUploadDate"
            type="date"
            :value="structuredData.video?.uploadDate || ''"
            @input="
              updateNestedField('video', 'uploadDate', $event.target.value)
            "
            placeholder="Video upload date (optional)"
          />
        </div>
      </div>

      <!-- Author and Publisher -->
      <div class="grid-group">
        <h3>Author and Publisher</h3>
        <div class="grid-item">
          <label for="structuredAuthorName">Author Name</label>
          <input
            id="structuredAuthorName"
            :value="structuredData.author?.name || ''"
            @input="updateNestedField('author', 'name', $event.target.value)"
            :placeholder="blog.author.name"
          />
        </div>

        <div class="grid-item">
          <label for="structuredAuthorUrl">Author URL</label>
          <input
            id="structuredAuthorUrl"
            :value="structuredData.author?.url || ''"
            @input="updateNestedField('author', 'url', $event.target.value)"
            placeholder="Author profile URL (optional)"
          />
        </div>

        <div class="grid-item">
          <label for="structuredPublisherName">Publisher Name</label>
          <input
            id="structuredPublisherName"
            :value="structuredData.publisher?.name || ''"
            @input="updateNestedField('publisher', 'name', $event.target.value)"
            placeholder="Publisher name"
          />
        </div>

        <div class="grid-item">
          <label for="structuredPublisherLogo">Publisher Logo URL</label>
          <input
            id="structuredPublisherLogo"
            :value="structuredData.publisher?.logo?.url || ''"
            @input="
              updateNestedField('publisher', 'logo.url', $event.target.value)
            "
            placeholder="Publisher logo URL (optional)"
          />
        </div>
      </div>

      <!-- Metadata -->
      <div class="grid-group">
        <h3>Metadata</h3>
        <div class="grid-item">
          <label for="structuredKeywords">Keywords</label>
          <input
            id="structuredKeywords"
            :value="structuredData.keywords || ''"
            @input="updateField('keywords', $event.target.value)"
            :placeholder="blog.tags.join(', ')"
          />
        </div>

        <div class="grid-item">
          <label for="structuredArticleSection">Article Section</label>
          <input
            id="structuredArticleSection"
            :value="structuredData.articleSection || ''"
            @input="updateField('articleSection', $event.target.value)"
            placeholder="Article section (category)"
          />
        </div>

        <div class="grid-item">
          <label for="structuredMainEntityOfPage"
            >Main Entity of Page URL</label
          >
          <input
            id="structuredMainEntityOfPage"
            :value="structuredData.mainEntityOfPage?.['@id'] || ''"
            @input="
              updateNestedField('mainEntityOfPage', '@id', $event.target.value)
            "
            :placeholder="blog.url || 'https://example.com/your-article-url'"
          />
        </div>

        <div class="grid-item">
          <label for="structuredAbout">About</label>
          <input
            id="structuredAbout"
            :value="structuredData.about?.name || ''"
            @input="updateNestedField('about', 'name', $event.target.value)"
            placeholder="Primary topic (optional)"
          />
        </div>

        <div class="grid-item">
          <label for="structuredMentions">Mentions</label>
          <input
            id="structuredMentions"
            :value="structuredData.mentions?.[0]?.name || ''"
            @input="
              updateNestedField('mentions', '0.name', $event.target.value)
            "
            placeholder="Mentioned person or thing (optional)"
          />
        </div>

        <div class="grid-item">
          <label for="structuredDiscussionUrl">Discussion URL</label>
          <input
            id="structuredDiscussionUrl"
            :value="structuredData.discussionUrl || ''"
            @input="updateField('discussionUrl', $event.target.value)"
            placeholder="URL for discussion (optional)"
          />
        </div>
      </div>

      <!-- Additional Information -->
      <div class="grid-group">
        <h3>Additional Information</h3>
        <div class="grid-item">
          <label for="structuredIsPartOf">Is Part Of</label>
          <input
            id="structuredIsPartOf"
            :value="structuredData.isPartOf?.name || ''"
            @input="updateNestedField('isPartOf', 'name', $event.target.value)"
            placeholder="Blog series or collection name (optional)"
          />
        </div>

        <div class="grid-item">
          <label for="structuredLicense">License</label>
          <input
            id="structuredLicense"
            :value="structuredData.license || ''"
            @input="updateField('license', $event.target.value)"
            placeholder="License URL"
          />
        </div>

        <div class="grid-item">
          <label for="structuredAccessMode">Access Mode</label>
          <input
            id="structuredAccessMode"
            :value="structuredData.accessMode || ''"
            @input="updateField('accessMode', $event.target.value)"
            placeholder="Textual, Visual, Auditory, etc."
          />
        </div>

        <div class="grid-item">
          <label for="structuredAccessModeSufficient"
            >Access Mode Sufficient</label
          >
          <input
            id="structuredAccessModeSufficient"
            :value="structuredData.accessModeSufficient || ''"
            @input="updateField('accessModeSufficient', $event.target.value)"
            placeholder="e.g., textual, auditory, and visual for full understanding"
          />
        </div>

        <div class="grid-item">
          <label for="structuredAccessibilitySummary"
            >Accessibility Summary</label
          >
          <textarea
            id="structuredAccessibilitySummary"
            :value="structuredData.accessibilitySummary || ''"
            @input="updateField('accessibilitySummary', $event.target.value)"
            placeholder="Brief summary of accessibility features"
          ></textarea>
        </div>

        <div class="grid-item">
          <label for="structuredCategory">Category</label>
          <input
            id="structuredCategory"
            :value="structuredData.category || ''"
            @input="updateField('category', $event.target.value)"
            placeholder="e.g., News, Opinion, How-to, etc."
          />
        </div>
      </div>

      <!-- Legal Information -->
      <div class="grid-group">
        <h3>Legal Information</h3>
        <div class="grid-item">
          <label for="structuredCopyrightHolder">Copyright Holder</label>
          <input
            id="structuredCopyrightHolder"
            :value="structuredData.copyrightHolder || ''"
            @input="updateField('copyrightHolder', $event.target.value)"
            placeholder="Name of copyright holder"
          />
        </div>

        <div class="grid-item">
          <label for="structuredCopyrightYear">Copyright Year</label>
          <input
            id="structuredCopyrightYear"
            type="number"
            :value="structuredData.copyrightYear || ''"
            @input="updateField('copyrightYear', $event.target.value)"
            placeholder="Year of copyright"
          />
        </div>

        <div class="grid-item">
          <label for="structuredIsFamilyFriendly">Is Family Friendly</label>
          <select
            id="structuredIsFamilyFriendly"
            :value="structuredData.isFamilyFriendly || ''"
            @change="updateField('isFamilyFriendly', $event.target.value)"
          >
            <option value="" disabled>Select an option</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  blog: Object,
});

const emit = defineEmits(["updateStructuredData"]);

const structuredData = computed(() => {
  return {
    headline: props.blog?.structuredData?.headline || "",
    alternativeHeadline: props.blog?.structuredData?.alternativeHeadline || "",
    description: props.blog?.structuredData?.description || "",
    image: props.blog?.structuredData?.image || { url: "", caption: "" },
    author: props.blog?.structuredData?.author || { name: "", url: "" },
    publisher: props.blog?.structuredData?.publisher || {
      name: "",
      logo: { url: "" },
    },
    datePublished: props.blog?.structuredData?.datePublished || "",
    dateModified: props.blog?.structuredData?.dateModified || "",
    keywords: props.blog?.structuredData?.keywords || "",
    articleSection: props.blog?.structuredData?.articleSection || "",
    mainEntityOfPage: props.blog?.structuredData?.mainEntityOfPage || {
      "@id": "",
    },
    about: props.blog?.structuredData?.about || { name: "" },
    mentions: props.blog?.structuredData?.mentions || [{ name: "" }],
    discussionUrl: props.blog?.structuredData?.discussionUrl || "",
    isPartOf: props.blog?.structuredData?.isPartOf || { name: "" },
    inLanguage: props.blog?.structuredData?.inLanguage || { name: "English" },
    video: props.blog?.structuredData?.video || {
      name: "",
      url: "",
      thumbnailUrl: "",
      uploadDate: "",
    },
    interactionStatistic: props.blog?.structuredData?.interactionStatistic || {
      userInteractionCount: "",
    },
    license: props.blog?.structuredData?.license || "",
    accessMode: props.blog?.structuredData?.accessMode || "",
    accessModeSufficient:
      props.blog?.structuredData?.accessModeSufficient || "",
    accessibilitySummary:
      props.blog?.structuredData?.accessibilitySummary || "",
    category: props.blog?.structuredData?.category || "",
    copyrightHolder: props.blog?.structuredData?.copyrightHolder || "",
    copyrightYear: props.blog?.structuredData?.copyrightYear || "",
    isFamilyFriendly: props.blog?.structuredData?.isFamilyFriendly || "",
  };
});

const updateField = (field, value) => {
  const updatedData = { ...structuredData.value, [field]: value };
  emit("updateStructuredData", updatedData);
};

const updateNestedField = (parentField, childField, value) => {
  const updatedData = { ...structuredData.value };
  const fields = childField.split(".");

  let obj = updatedData[parentField] || {};
  for (let i = 0; i < fields.length - 1; i++) {
    if (!obj[fields[i]]) {
      obj[fields[i]] = {};
    }
    obj = obj[fields[i]];
  }

  obj[fields[fields.length - 1]] = value;
  updatedData[parentField] = { ...updatedData[parentField], ...obj };
  emit("updateStructuredData", updatedData);
};
</script>

<style scoped>
.structured-data-dashboard {
  margin-top: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.grid-group {
  grid-column: span 2;
}

.grid-group h3 {
  margin-bottom: 10px;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.grid-item {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.grid-item label {
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}

.grid-item input,
.grid-item textarea,
.grid-item select {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
</style>
