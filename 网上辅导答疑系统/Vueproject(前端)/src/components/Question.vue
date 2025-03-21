<!-- src/components/Question.vue -->
<template>
  <div class="question-form">
    <div class="container">
      <div class="question-form__header">
        <h2 class="question-form__title">提问</h2>
        <p class="question-form__description">
          请在此处选择问题类型并输入您的问题
        </p>
        <div class="question-form__submit">
          <button @click="openModal" class="question-form__button">提交问题</button>
        </div>
      </div>
      <div class="question-form__user-questions">
        <h3>您的问题历史</h3>
        <table v-if="userQuestions.length > 0" class="question-form__table">
          <thead>
            <tr>
              <th>问题编号</th>
              <th>提问时间</th>
              <th>问题内容</th>
              <th>问题类型</th>
              <th>回答</th>
              <th>回答人</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="question in userQuestions" :key="question.qid">
              <td>{{ question.qid }}</td>
              <td>{{ question.puttime }}</td>
              <td>{{ question.context }}</td>
              <td>{{ question.categories }}</td>
              <td>{{ question.answer || '待解答' }}</td>
              <td>{{ question.tname }}</td>
            </tr>
          </tbody>
        </table>
        <div v-else class="question-form__no-results">
          暂未提问过问题
        </div>
      </div>
    </div>
    <!-- 模态框 -->
    <div v-if="isModalOpen" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h2>提问</h2>
        <div class="modal__category">
          <label for="modal-category">问题类型:</label>
          <select id="modal-category" v-model="modalSelectedCategory" class="modal__select">
            <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
          </select>
        </div>
        <div class="modal__question">
          <label for="modal-question">问题内容:</label>
          <textarea id="modal-question" v-model="modalQuestionContent" class="modal__textarea" placeholder="请输入您的问题"></textarea>
        </div>
        <div class="modal__submit">
          <button @click="submitQuestion" class="modal__button">提交问题</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
const categories = ['生活', '数学', '语文', '英语', '物理', '化学', '生物'];
const selectedCategory = ref(categories[0]);
const questionContent = ref('');
const puttime = new Date().toISOString().slice(0, 19).replace('T', ' ');
const userQuestions = ref([]);

const modalSelectedCategory = ref(categories[0]);
const modalQuestionContent = ref('');
const isModalOpen = ref(false);

const fetchUserQuestions = async () => {
  try {
    const response = await axios.get(`http://localhost:3001/haqs/HistoryHaqs?questioner=${userStore.username}`);
    userQuestions.value = response.data;
  } catch (error) {
    console.error('Error fetching user questions:', error);
  }
};

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const submitQuestion = async () => {
  if (!modalQuestionContent.value) {
    alert('请输入问题内容');
    return;
  }

  try {
    const response = await axios.post('http://localhost:3001/haqs/insertHaqs', {
      questioner: userStore.username,
      context: modalQuestionContent.value,
      puttime: puttime,
      categories: modalSelectedCategory.value,
    });

    if (response.status === 200) {
      alert('问题提交成功');
      modalQuestionContent.value = ''; // 清空输入框
      closeModal();
      fetchUserQuestions(); // 刷新用户问题列表
    } else {
      alert(`提交失败: ${response.data.message}`);
    }
  } catch (error) {
    if (error.response) {
      console.error('服务器响应错误:', error.response.data);
      console.error('状态码:', error.response.status);
      console.error('请求头:', error.response.headers);
      alert(`提交失败: ${error.response.data.message}`);
    } else if (error.request) {
      console.error('请求错误:', error.request);
      alert('网络请求失败，请稍后再试');
    } else {
      console.error('请求配置错误:', error.message);
      alert('请求配置错误，请稍后再试');
    }
    console.error('错误配置:', error.config);
  }
};

onMounted(() => {
  fetchUserQuestions();
});
</script>

<style scoped>
.question-form {
  padding: 2rem 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.question-form__header {
  text-align: center;
  margin-bottom: 2rem;
}

.question-form__title {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.question-form__description {
  font-size: 1.2rem;
  color: #666;
}

.question-form__content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.question-form__category,
.question-form__question {
  display: flex;
  flex-direction: column;
}

.question-form__category label,
.question-form__question label {
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.question-form__select,
.question-form__textarea {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.question-form__textarea {
  resize: vertical;
  min-height: 100px;
}

.question-form__submit {
  display: flex;
  justify-content: center;
}

.question-form__button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: #555;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.question-form__button:hover {
  background-color: #777;
}

.question-form__user-questions {
  margin-top: 2rem;
}

.question-form__table {
  width: 100%;
  border-collapse: collapse;
}

.question-form__table th,
.question-form__table td {
  border: 1px solid #ddd;
  padding: 0.8rem;
  text-align: left;
}

.question-form__table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.question-form__table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.question-form__table tr:hover {
  background-color: #f1f1f1;
}

.question-form__no-results {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin-top: 1rem;
}

/* 模态框样式 */
.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 600px;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.modal__category,
.modal__question {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.modal__category label,
.modal__question label {
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.modal__select,
.modal__textarea {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.modal__textarea {
  resize: vertical;
  min-height: 100px;
}

.modal__submit {
  display: flex;
  justify-content: center;
}

.modal__button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.modal__button:hover {
  background-color: #0056b3;
}
</style>
