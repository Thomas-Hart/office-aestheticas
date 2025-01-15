<template>
  <div class="item">
    <!-- prettier-ignore -->
    <div class="img-wrapper" @click="goToItem(item._id)">
      <img :src="resolvedItemImg()" :alt="item.name" />
      <img :src="resolvedCheckImg()" class="checkmark" v-if="isAddedToCart" alt="check mark" />
    </div>
    <!-- prettier-ignore -->
    <div class="item-details">
      <h3>{{ item.name }}</h3>
      <p>${{ item.price.toFixed(2) }}</p>
      <p class="preview">{{ item.preview }}</p>
      <button class="honey-button" @click="addToCart(item)">Add to Cart</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const isAddedToCart = ref(false);
const store = useItemStore();

function resolvedItemImg() {
  return `/${props.item.image}`;
}

function resolvedCheckImg() {
  return "/CheckMark.svg";
}

function addToCart(item) {
  store.addToCart(item);
  isAddedToCart.value = true;
}

const goToItem = (itemId) => {
  useRouter().push(`/item/${itemId}`);
};
</script>

<style scoped>
.item {
  height: 100%;
  width: 15rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  border: 3px solid black;
  border-radius: 4px;
  background: #3a3a3b;
  color: white;
  position: relative;
}

.img-wrapper {
  overflow: hidden;
  position: relative;
  cursor: pointer;
}

.item img {
  width: 100%;
  height: auto;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.item img:hover {
  transform: scale(1.05);
}

@keyframes pop {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.checkmark {
  position: absolute;
  padding: 3rem;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  animation: pop 0.3s ease;
}

.item-details {
  height: auto;
  padding: 0;
  flex-grow: 1;
  width: 100%;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 1rem;
  justify-content: space-between;
}

.item h3 {
  font-size: 1.2rem;
  margin: 0;
}

.preview {
  font-size: 0.8rem;
  margin: 0.5rem 0;
}
</style>
