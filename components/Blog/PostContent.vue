<template>
  <div>
    <h2>{{ title }}</h2>
    <div v-for="(content, index) in contents" :key="index">
      <p v-if="content.type === 'paragraph'">{{ content.paragraph.text }}</p>
      <h3 v-if="content.type === 'subheading'" class="subheading">
        {{ content.subheading.text }}
      </h3>
      <div v-if="content.type === 'list'" class="list-section">
        <h4>{{ content.list.title }}</h4>
        <ul>
          <li v-for="(item, itemIndex) in content.list.items" :key="itemIndex">
            <strong>{{ item.title }}</strong>
            <p>{{ item.description }}</p>
          </li>
        </ul>
      </div>
      <div v-if="content.type === 'image'" class="section-img-wrapper">
        <NuxtImg
          :src="resolvedImgPath(content.image.url)"
          :alt="content.image.caption"
          loading="lazy"
        />
        <p class="image-caption">{{ content.image.caption }}</p>
      </div>
      <BlogInteractiveQuiz
        v-if="content.type === 'quiz'"
        :quiz="content.quiz"
      />
      <BlogInteractivePoll
        v-if="content.type === 'poll'"
        :poll="content.poll"
        @updatePoll="updatePoll($event, index)"
      />
      <BlogInteractiveVideoContent
        v-if="content.type === 'video'"
        :video="content.video"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  contents: Array,
});

const emit = defineEmits(["updatePoll"]);

const resolvedImgPath = (path) => {
  return path ? "/" + path : "/HARTECHOLogo.webp";
};

const updatePoll = () => {
  emit("updatePoll", props.contents);
};
</script>

<style scoped>
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

p {
  margin-bottom: 1.5rem;
}

.list-section {
  background: #f0f8ff;
  padding: 1rem;
  /* border-radius: 8px; */
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
  /* border-radius: 8px; */
}

.image-caption {
  text-align: center;
  font-size: 1rem;
  color: #777;
  margin-top: 0.5rem;
}
</style>
