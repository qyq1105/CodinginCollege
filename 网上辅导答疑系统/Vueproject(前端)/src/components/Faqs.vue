<script setup>
import { ref, computed,onMounted} from 'vue';
import axios from 'axios';

const categories = ref([]);
const searchQuery = ref('');
const selectedCategory = ref('All');

let faqs = ref([]);

// 获取常见问题数据
const fetchFaqs = async () => {
  try {
    const response = await axios.get('http://localhost:3001/faqs/getFaqs');
    faqs.value = response.data;
  } catch (error) {
    console.error('Error fetching FAQs:', error);
  }
};


const fetchCategories = async () => {
  try {
    const response = await axios.get('http://localhost:3001/faqs/getCategories')
    categories.value = response.data
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

const filteredFaqs = computed(() => {
  if (searchQuery.value) {
    return faqs.value.filter(faq =>
      faq.context.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.value.toLowerCase())||
      faq.categories.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  } else {
    return selectedCategory.value === 'All'
      ? faqs.value
      : faqs.value.filter(faq => faq.categories === selectedCategory.value);
  }
});

const noResults = computed(() => filteredFaqs.value.length === 0);
onMounted(() => {
  fetchCategories()
  fetchFaqs()
})
</script>

<template>
  <div class="faqs">
    <div class="container">
      <div class="faqs__header">
        <h2 class="faqs__title">常见问题库</h2>
        <p class="faqs__description">
          你可以在此处搜索一些常见问题
        </p>
      </div>
      <div class="faqs__filter">
        <input v-model="searchQuery" type="text" class="faqs__search" placeholder="搜索问题" />
        <select v-model="selectedCategory" class="faqs__select">
          <option value="All">全部类型</option>
          <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
        </select>
      </div>
      <div class="faqs__table">
        <table v-if="!noResults" class="faqs__table-content">
          <thead>
            <tr>
              <th>问题编号</th>
              <th>问题内容</th>
              <th>回答</th>
              <th>问题类型</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="faq in filteredFaqs" :key="faq.qid">
              <td>{{ faq.qid }}</td>
              <td>{{ faq.context }}</td>
              <td>{{ faq.answer }}</td>
              <td>{{ faq.categories }}</td>
            </tr>
          </tbody>
        </table>
        <div v-else class="faqs__no-results">
          暂未找到
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.faqs {
  padding: 2rem 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.faqs__header {
  text-align: center;
  margin-bottom: 2rem;
}

.faqs__title {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.faqs__description {
  font-size: 1.2rem;
  color: #666;
}

.faqs__filter {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
}

.faqs__search {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 1rem;
  width: 200px;
}

.faqs__select {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.faqs__table {
  width: 100%;
  overflow-x: auto;
}

.faqs__table-content {
  width: 100%;
  border-collapse: collapse;
}

.faqs__table-content th,
.faqs__table-content td {
  border: 1px solid #ddd;
  padding: 0.8rem;
  text-align: left;
}

.faqs__table-content th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.faqs__table-content tr:nth-child(even) {
  background-color: #f9f9f9;
}

.faqs__table-content tr:hover {
  background-color: #f1f1f1;
}

.faqs__no-results {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin-top: 1rem;
}
</style>
