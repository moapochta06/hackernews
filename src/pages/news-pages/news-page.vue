<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import BackButtonComponent from "@/components/back-button-component.vue";

const route = useRoute();
const newsId = ref(route.params.id);
const selectedArticleId = ref(null);
const selectedArticle = ref(null);
const comments = ref([]);
const commentCount = ref();

const formatDate = (time) => {
  time = new Date(time * 1000).toLocaleDateString();
  return time
}
const fetchArticle = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/v0/item/${newsId.value}.json`);
    selectedArticle.value = response.data;
  } catch (error) {
    console.error('Error fetching article', error);
  }
};

const fetchComments = async (articleId) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/v0/item/${articleId}.json`);
    const commentPromises = response.data.kids.map(commentId => axios.get(`${import.meta.env.VITE_API_URL}/v0/item/${commentId}.json`));
    const commentResponses = await Promise.all(commentPromises);
    comments.value = commentResponses.map(response => response.data);
    selectedArticleId.value = articleId;// Update selectedArticleId
    commentCount.value = commentResponses.length;
  }
  catch (error) {
    console.error(`Error fetching comments for article ${articleId}`, error);
  }
};

onMounted(() => {
  fetchArticle();
});
</script>

<template>

  <div class="container" >
    <BackButtonComponent/>
    <div class="news-container" v-if="selectedArticle">
      <h2>{{ selectedArticle.title }}</h2>
      <p>By {{ selectedArticle.by }} on {{ formatDate(selectedArticle.time) }}</p>
      <a class="more-btn" :href="selectedArticle.url">Read more</a>
      <p>number of comments: {{ commentCount }}</p>
      <p>total comments: {{ selectedArticle.descendants }}</p>

      <button class="show-btn" @click="fetchComments(selectedArticle.id)" >Show Comments &#9660</button>
      <ul>
        <li v-for="comment in comments" :key="comment.id" v-html="comment.text"></li>
      </ul>
    </div>
  </div>
</template>
<style scoped>
@import './style.css';
</style>