<script setup>
import { ref, onMounted,computed } from 'vue'
import axios from 'axios'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
const faqs = ref([])
const newFaq = ref({ context: '', answer: '', categories: '' })
const searchQuery = ref('')
const categories = ref([]);
const showModal = ref(false) // 控制模态框的显示和隐藏
const selectedCategory = ref('All');
// 获取常见问题数据
const fetchFaqs = async () => {
  try {
    const response = await axios.get('http://localhost:3001/faqs/getFaqs')
    faqs.value = response.data
  } catch (error) {
    console.error('Error fetching FAQs:', error)
  }
}

//根据不同类别来获取常见问题数据
const fetchCategories = async () => {
  try {
    const response = await axios.get('http://localhost:3001/faqs/getCategories')
    categories.value = response.data
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

// 添加常见问题
const addFaq = async () => {
  if (!newFaq.value.context || !newFaq.value.answer || !newFaq.value.categories) {
    alert('请填写完整信息')
    return
  }

  try {
    const response = await axios.post('http://localhost:3001/faqs/insertFaqs', newFaq.value)
    if (response.status === 200) {
      alert('常见问题添加成功')
      fetchFaqs()
      newFaq.value = { context: '', answer: '', categories: '' }
      showModal.value = false // 关闭模态框
    } else {
      alert(`添加失败: ${response.data.message}`)
    }
  } catch (error) {
    console.error('Error adding FAQ:', error)
    alert('添加常见问题失败，请稍后再试')
  }
}

// 删除常见问题
const deleteFaq = async (qid) => {
  try {
    const response = await axios.delete(`http://localhost:3001/faqs/deleteFaqs?qid=${qid}`)
    if (response.status === 200) {
      alert('常见问题删除成功')
      fetchFaqs()
    } else {
      alert(`删除失败: ${response.data.message}`)
    }
  } catch (error) {
    console.error('Error deleting FAQ:', error)
    alert('删除常见问题失败，请稍后再试')
  }
}

// 更新常见问题
const updateFaq = async (faq) => {
  try {
    const response = await axios.post(`http://localhost:3001/faqs/updateFaqs`, faq)
    if (response.status === 200) {
      alert('常见问题更新成功')
      fetchFaqs() // 重新获取数据
    } else {
      alert(`更新失败: ${response.data.message}`)
    }
  } catch (error) {
    console.error('Error updating FAQ:', error)
    alert('更新常见问题失败，请稍后再试')
  }
}

// 查询常见问题
const searchFaqs = async () => {
  if (!searchQuery.value) {
    fetchFaqs()
    return
  }

  try {
    const response = await axios.get(`http://localhost:3001/faqs/SelectFaqs?select=${searchQuery.value}`)
    faqs.value = response.data
  } catch (error) {
    console.error('Error searching FAQs:', error)
    alert('查询常见问题失败，请稍后再试')
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
  <div class="faqs-manage">
    <div class="container">
      <div class="faqs-manage__header">
        <h2 class="faqs-manage__title">常见问题库管理</h2>
        <p class="faqs-manage__description">
          你可以在此处添加、删除和修改常见问题
        </p>
      </div>
      <div class="faqs-manage__filter">
        <input v-model="searchQuery" type="text" class="faqs__search" placeholder="搜索问题" @keyup.enter="searchFaqs"/>
        <button @click="searchFaqs" class="btn btn-primary">搜索</button>
      </div>

      <div class="faqs-manage__actions">
        <button @click="showModal = true" class="btn btn-primary">添加常见问题</button>
      </div>
      <div class="faqs-manage__table">
        <table class="faqs-manage__table-content">
          <thead>
            <tr>
              <th>问题编号</th>
              <th>问题内容</th>
              <th>回答</th>
              <th>问题类型</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="faq in faqs" :key="faq.qid">
              <td>{{ faq.qid }}</td>
              <td>
                <input type="text" v-model="faq.context" class="form-control" />
              </td>
              <td>
                <input type="text" v-model="faq.answer" class="form-control" />
              </td>
              <td>
                <select v-model="faq.categories" class="form-control">
                  <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
                </select>
              </td>
              <td>
                <button @click="updateFaq(faq)" class="btn btn-success">更新</button>
                <button @click="deleteFaq(faq.qid)" class="btn btn-danger">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 模态框 -->
    <div v-if="showModal" class="modal-overlay" @click="showModal = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>添加常见问题</h3>
          <button @click="showModal = false" class="btn btn-danger close-btn">关闭</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="context">问题内容:</label>
            <textarea id="context" v-model="newFaq.context" class="form-control" placeholder="请输入问题内容"></textarea>
          </div>
          <div class="form-group">
            <label for="answer">回答:</label>
            <textarea id="answer" v-model="newFaq.answer" class="form-control" placeholder="请输入回答"></textarea>
          </div>
          <div class="form-group">
            <label for="categories">问题类型:</label>
            <select id="categories" v-model="newFaq.categories" class="form-control">
              <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
            </select>
          </div>
          <button @click="addFaq" class="btn btn-primary">添加常见问题</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.faqs-manage {
  padding: 2rem 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.faqs-manage__header {
  text-align: center;
  margin-bottom: 2rem;
}

.faqs-manage__title {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.faqs-manage__description {
  font-size: 1.2rem;
  color: #666;
}

.faqs-manage__filter {
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

.faqs-manage__filter input {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 1rem;
  width: 200px;
}

.faqs-manage__filter button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.faqs-manage__filter button:hover {
  background-color: #0056b3;
}

.faqs-manage__actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2rem;
}

.faqs-manage__actions button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.faqs-manage__actions button:hover {
  background-color: #0056b3;
}

.faqs-manage__table {
  width: 100%;
  overflow-x: auto;
}

.faqs-manage__table-content {
  width: 100%;
  border-collapse: collapse;
}

.faqs-manage__table-content th,
.faqs-manage__table-content td {
  border: 1px solid #ddd;
  padding: 0.8rem;
  text-align: left;
}

.faqs-manage__table-content th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.faqs-manage__table-content tr:nth-child(even) {
  background-color: #f9f9f9;
}

.faqs-manage__table-content tr:hover {
  background-color: #f1f1f1;
}


/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.modal-header h3 {
  margin: 0;
}

.modal-header .close-btn {
  font-size: 1rem;
  padding: 0.2rem 0.5rem;
}

.modal-body .form-group {
  margin-bottom: 1rem;
}

.modal-body .form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.modal-body .form-control {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;

}

.modal-body .btn {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;

}

.modal-body .btn-primary {
  background-color: #2b2c2d;

}

.modal-body .btn-primary:hover {
  background-color: #0056b3;

}
</style>
