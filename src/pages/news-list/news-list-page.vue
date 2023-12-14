<script setup>
import {onMounted, ref} from 'vue'

const news = ref([])
const selectedArticle = ref(null)
const comments = ref([])


const fetchNews = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/v0/topstories.json`)
  const storyIds = await response.json()
  return await Promise.all(storyIds.slice(0, 100).map(async (id) => {
    const storyResponse = await fetch(`${import.meta.env.VITE_API_URL}/v0/item/${id}.json`)
    return await storyResponse.json()
  }))
}


const fetchComments = async (articleId) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/v0/item/${articleId}.json`)
  const article = await response.json()
  // Assuming the comments are stored in the "kids" property of the article
  comments.value = article.kids
}

const showComments = (article) => {
  selectedArticle.value = article
  fetchComments(article.id)
}



const sortByDate = (articles) => {
  return articles.sort((a, b) => b.time - a.time)
}

onMounted(async () => {
  // Fetch news and sort by date
  news.value = sortByDate(await fetchNews())
})
setInterval(() => {
    fetchNews()
}, 60000)


</script>

<template>

<ul class="news-list">
  <li v-for="article in news" :key="article.id" class="article">

    <router-link :to="`/news/${article.id}`" target="_blank">
    <h2>{{ article.title }}</h2>
    </router-link>
    <p>{{article.score}} points | by: {{article.by}}</p>

  </li>
</ul>

</template>


