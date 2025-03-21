<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
const students = ref([]);
const editingStudentId = ref(null);
const editedName = ref('');

const fetchStudents = async () => {
  try {
    const response = await axios.get('http://localhost:3001/user/getStudents');
    students.value = response.data;
  } catch (error) {
    console.error('Error fetching students:', error);
  }
};

const deleteStudent = async (userId) => {
  try {
    await axios.delete(`http://localhost:3001/user/deleteUser/${userId}`);
    students.value = students.value.filter(student => student.id !== userId);
    alert('学生删除成功');
  } catch (error) {
    console.error('Error deleting student:', error);
    alert('删除学生失败');
  }
};

const startEditing = (studentId, name) => {
  editingStudentId.value = studentId;
  editedName.value = name;
};

const cancelEditing = () => {
  editingStudentId.value = null;
  editedName.value = '';
};

const updateStudent = async () => {
  try {
    const studentId = editingStudentId.value;
    const student = students.value.find(student => student.id === studentId);
    if (!student) return;

    const updatedStudent = { ...student, name: editedName.value };
    await axios.put(`http://localhost:3001/user/updateUser/${studentId}`, updatedStudent);
    students.value = students.value.map(student =>
      student.id === studentId ? updatedStudent : student
    );
    alert('学生信息更新成功');
    cancelEditing();
  } catch (error) {
    console.error('Error updating student:', error);
    alert('更新学生信息失败');
  }
};

onMounted(() => {
  fetchStudents();
});
</script>

<template>
  <div class="student-manage">
    <div class="container">
      <div class="student-manage__header">
        <h2 class="student-manage__title">学生管理</h2>
        <p class="student-manage__description">
          你可以在此处查看、修改和删除学生信息
        </p>
      </div>
      <div class="student-manage__table">
        <table v-if="students.length > 0" class="student-manage__table-content">
          <thead>
            <tr>
              <th>学生编号</th>
              <th>用户名</th>
              <th>姓名</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in students" :key="student.id">
              <td>{{ student.id }}</td>
              <td>{{ student.username }}</td>
              <td v-if="editingStudentId !== student.id">{{ student.name }}</td>
              <td v-else>
                <input v-model="editedName" type="text" class="student-manage__input" />
              </td>
              <td>
                <button v-if="editingStudentId !== student.id" @click="startEditing(student.id, student.name)" class="student-manage__button">编辑</button>
                <button v-else @click="updateStudent" class="student-manage__button">保存</button>
                <button v-if="editingStudentId !== student.id" @click="deleteStudent(student.id)" class="student-manage__button">删除</button>
                <button v-else @click="cancelEditing" class="student-manage__button">取消</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="student-manage__no-results">
          暂无学生信息
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.student-manage {
  padding: 2rem 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.student-manage__header {
  text-align: center;
  margin-bottom: 2rem;
}

.student-manage__title {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.student-manage__description {
  font-size: 1.2rem;
  color: #666;
}

.student-manage__table {
  width: 100%;
  overflow-x: auto;
}

.student-manage__table-content {
  width: 100%;
  border-collapse: collapse;
}

.student-manage__table-content th,
.student-manage__table-content td {
  border: 1px solid #ddd;
  padding: 0.8rem;
  text-align: left;
}

.student-manage__table-content th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.student-manage__table-content tr:nth-child(even) {
  background-color: #f9f9f9;
}

.student-manage__table-content tr:hover {
  background-color: #f1f1f1;
}

.student-manage__no-results {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin-top: 1rem;
}

.student-manage__button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: #555;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-right: 0.5rem;
}

.student-manage__button:hover {
  background-color: #777;
}

.student-manage__input {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
