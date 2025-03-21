<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
const faqs = ref([]);
const searchQuery = ref('');
const selectedCategory = ref('All');
const categories = ref([]);
// 获取常见问题数据
const fetchFaqs = async () => {
  try {
    const response = await axios.get('http://localhost:3001/haqs/getHaqs');
    faqs.value = response.data;
  } catch (error) {
    console.error('Error fetching FAQs:', error);
  }
};

// 获取类别数据
const fetchCategories = async () => {
  try {
    const response = await axios.get('http://localhost:3001/faqs/getCategories');
    categories.value = response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

// 过滤常见问题
const filteredFaqs = computed(() => {
  if (searchQuery.value) {
    return faqs.value.filter(faq =>
      faq.context.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      faq.categories.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  } else {
    return selectedCategory.value === 'All'
      ? faqs.value
      : faqs.value.filter(faq => faq.categories === selectedCategory.value);
  }
});

// 提交解答
const submitAnswer = async (faq) => {
  if (!faq.answer) {
    alert('请填写完整信息');
    return;
  }

  // 使用 userStore.username 作为 tid
  const tid = userStore.username;

  // 从教师的个人信息中获取教师的名字作为 tname
  let tname = '';
  try {
    const response = await axios.get(`http://localhost:3001/teacher/getTeacherNameByUsername`, {
      params: { username: tid }
    });
    tname = response.data.tname;
  } catch (error) {
    console.error('Error fetching teacher name:', error);
    alert('获取教师名字失败，请稍后再试');
    return;
  }

  try {
    const response = await axios.post('http://localhost:3001/haqs/updateHaqs', {
      qid: faq.qid,
      answer: faq.answer,
      tid: tid,
      tname: tname,
      answertime: new Date().toISOString().slice(0, 19).replace('T', ' ')
    });

    if (response.status === 200) {
      alert('解答提交成功');
      fetchFaqs();
    } else {
      alert(`提交失败: ${response.data.message}`);
    }
  } catch (error) {
    console.error('Error submitting answer:', error);
    alert('提交解答失败，请稍后再试');
  }
};

const noResults = computed(() => filteredFaqs.value.length === 0);

onMounted(() => {
  fetchCategories();
  fetchFaqs();
});
</script>

<template>
  <div class="haqs">
    <div class="container">
      <div class="haqs__header">
        <h2 class="haqs__title">学生提问</h2>
        <p class="haqs__description">
          你可以在此处查看学生提问并提交解答
        </p>
      </div>
      <div class="haqs__filter">
        <input v-model="searchQuery" type="text" class="haqs__search" placeholder="搜索问题" />
        <select v-model="selectedCategory" class="haqs__select">
          <option value="All">全部类型</option>
          <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
        </select>
      </div>
      <div class="haqs__table">
        <table v-if="!noResults" class="haqs__table-content">
          <thead>
            <tr>
              <th>问题编号</th>
              <th>提问人</th>
              <th>问题内容</th>
              <th>回答</th>
              <th>问题类型</th>
              <th v-if="userStore.isLogin && userStore.userType === 'teacher'">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="faq in filteredFaqs" :key="faq.qid">
              <td>{{ faq.qid }}</td>
              <td>{{ faq.questioner }}</td>
              <td>{{ faq.context }}</td>
              <td>
                <textarea v-if="userStore.isLogin && userStore.userType === 'teacher'" v-model="faq.answer" class="form-control" placeholder="请输入回答"></textarea>
                <span v-else>{{ faq.answer || '待解答' }}</span>
              </td>
              <td>{{ faq.categories }}</td>
              <td v-if="userStore.isLogin && userStore.userType === 'teacher'">
                <input type="hidden"  :value="userStore.userId" />
                <input type="hidden" :value="userStore.username" />
                <button @click="submitAnswer(faq)" class="btn btn-primary">提交解答</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="haqs__no-results">
          暂未找到
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.haqs {
  padding: 2rem 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.haqs__header {
  text-align: center;
  margin-bottom: 2rem;
}

.haqs__title {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.haqs__description {
  font-size: 1.2rem;
  color: #666;
}

.haqs__filter {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
}

.haqs__search {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 1rem;
  width: 200px;
}

.haqs__select {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.haqs__table {
  width: 100%;
  overflow-x: auto;
}

.haqs__table-content {
  width: 100%;
  border-collapse: collapse;
}

.haqs__table-content th,
.haqs__table-content td {
  border: 1px solid #ddd;
  padding: 0.8rem;
  text-align: left;
}

.haqs__table-content th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.haqs__table-content tr:nth-child(even) {
  background-color: #f9f9f9;
}

.haqs__table-content tr:hover {
  background-color: #f1f1f1;
}

.haqs__no-results {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin-top: 1rem;
}

textarea.form-control {
  resize: vertical;
  min-height: 100px;
}

.btn.btn-primary {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn.btn-primary:hover {
  background-color: #0056b3;
}
</style>
