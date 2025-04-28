<template>
  <div class="email-template-page">
    <h1>Create SES Email Template</h1>
    <form @submit.prevent="onSubmit" class="template-form">
      <div class="form-group">
        <label for="templateName">Template Name</label>
        <input
          id="templateName"
          v-model="form.templateName"
          type="text"
          required
        />
      </div>

      <div class="form-group">
        <label for="subjectPart">Subject</label>
        <input
          id="subjectPart"
          v-model="form.subjectPart"
          type="text"
          required
        />
      </div>

      <div class="form-group">
        <label for="htmlPart">HTML Content</label>
        <textarea
          id="htmlPart"
          v-model="form.htmlPart"
          rows="8"
          required
        ></textarea>
      </div>

      <div class="form-group">
        <label for="textPart">Plain Text Content (optional)</label>
        <textarea id="textPart" v-model="form.textPart" rows="4"></textarea>
      </div>

      <button :disabled="isLoading" type="submit">
        {{ isLoading ? "Creating..." : "Create Template" }}
      </button>
    </form>

    <div v-if="notification" class="notification">
      {{ notification }}
    </div>
  </div>
</template>
  
  <script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

const form = reactive({
  templateName: "",
  subjectPart: "",
  htmlPart: "",
  textPart: "",
});
const isLoading = ref(false);
const notification = ref("");
const router = useRouter();

async function onSubmit() {
  if (!form.templateName || !form.subjectPart || !form.htmlPart) {
    notification.value = "Please fill out all required fields.";
    return;
  }

  isLoading.value = true;
  notification.value = "";

  try {
    const res = await $fetch("/api/email-templates", {
      method: "POST",
      body: {
        templateName: form.templateName,
        subjectPart: form.subjectPart,
        htmlPart: form.htmlPart,
        textPart: form.textPart,
      },
    });
    notification.value = `Template "${res.templateName}" created successfully.`;
    // Optionally clear form or navigate
    form.templateName = "";
    form.subjectPart = "";
    form.htmlPart = "";
    form.textPart = "";
  } catch (err) {
    notification.value = err?.statusMessage || "Failed to create template.";
  } finally {
    isLoading.value = false;
  }
}
</script>
  
  <style scoped>
.email-template-page {
  max-width: 600px;
  margin: auto;
  padding: 2rem;
  font-family: sans-serif;
}
.template-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.form-group {
  display: flex;
  flex-direction: column;
}
label {
  margin-bottom: 0.25rem;
  font-weight: 600;
}
input,
textarea {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}
button {
  padding: 0.75rem;
  font-size: 1rem;
  background: #3f51b5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:disabled {
  background: #9fa8da;
  cursor: not-allowed;
}
.notification {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #e8f5e9;
  color: #2e7d32;
  border-radius: 4px;
}
</style>