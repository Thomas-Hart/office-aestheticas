<template>
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <ul class="breadcrumb-list">
      <li class="breadcrumb-item">
        <NuxtLink to="/">Home</NuxtLink>
      </li>
      <li class="breadcrumb-item">
        <NuxtLink to="/blog">Blog</NuxtLink>
      </li>
      <li class="breadcrumb-item active" aria-current="page">
        {{ currentBlogTitle }}
      </li>
    </ul>
  </nav>
</template>

<script setup>
const props = defineProps({
  currentBlogTitle: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.breadcrumb {
  padding: 1rem 0;
  background-color: #fff;
  margin-bottom: 1.5rem;
  border-radius: 8px;
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  list-style: none;
  font-size: 0.8rem;
  font-weight: bold;
}

.breadcrumb-item a {
  color: #007bff;
  text-decoration: none;
}

.breadcrumb-item a:hover {
  text-decoration: underline;
}

.breadcrumb-item.active {
  color: #666;
}

.breadcrumb-item + .breadcrumb-item::before {
  content: "/";
  margin-right: 0.5rem;
  color: #666;
}
</style>
