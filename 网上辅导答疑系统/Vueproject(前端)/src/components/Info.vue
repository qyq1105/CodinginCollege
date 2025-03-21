<!-- src/components/Info.vue -->
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const teacherInfo = ref({
  id: '',
  tname: '',
  tsex: '',
  tbirth: '',
  careercall: '',
  profession: '',
  fulltime: '',
  worktime: '',
  phonenumber: ''
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

const fetchTeacherInfo = async () => {
  try {
    const response = await axios.get(`http://localhost:3001/teacher/getTeacherInfo?username=${userStore.username}`);
    teacherInfo.value = {
      ...response.data,
      tbirth: formatDate(response.data.tbirth),
      worktime: formatDate(response.data.worktime)
    };
  } catch (error) {
    console.error('Error fetching teacher info:', error);
    alert('获取教师信息失败');
  }
};

const updateTeacherInfo = async () => {
  try {
    const response = await axios.post('http://localhost:3001/teacher/updateTeacherInfo', {
      username: userStore.username,
      tname: teacherInfo.value.tname,
      tsex: teacherInfo.value.tsex,
      tbirth: teacherInfo.value.tbirth,
      careercall: teacherInfo.value.careercall,
      profession: teacherInfo.value.profession,
      fulltime: teacherInfo.value.fulltime,
      worktime: teacherInfo.value.worktime,
      phonenumber: teacherInfo.value.phonenumber,
    });

    if (response.status === 200) {
      alert('教师信息更新成功');
    } else {
      alert(`更新失败: ${response.data.message}`);
    }
  } catch (error) {
    console.error('Error updating teacher info:', error);
    alert('更新教师信息失败');
  }
};

onMounted(() => {
  fetchTeacherInfo();
});
</script>

<template>
  <div class="info">
    <div class="container">
      <div class="info__header">
        <h2 class="info__title">个人信息</h2>
      </div>
      <form @submit.prevent="updateTeacherInfo">
        <div class="info__form-group">
          <label for="name">姓名:</label>
          <input type="text" id="name" v-model="teacherInfo.tname" class="form-control" required />
        </div>
        <div class="info__form-group">
          <label for="sex">性别:</label>
          <input type="text" id="sex" v-model="teacherInfo.tsex" class="form-control" required />
        </div>
        <div class="info__form-group">
          <label for="birth">生日:</label>
          <input type="date" id="birth" v-model="teacherInfo.tbirth" class="form-control" required />
        </div>
        <div class="info__form-group">
          <label for="career">职称:</label>
          <input type="text" id="career" v-model="teacherInfo.careercall" class="form-control" required />
        </div>
        <div class="info__form-group">
          <label for="profession">教学专业:</label>
          <input type="text" id="profession" v-model="teacherInfo.profession" class="form-control" required />
        </div>
        <div class="info__form-group">
          <label for="fulltime">专职或兼职:</label>
          <input type="text" id="fulltime" v-model="teacherInfo.fulltime" class="form-control" required />
        </div>
        <div class="info__form-group">
          <label for="worktime">聘任时间:</label>
          <input type="date" id="worktime" v-model="teacherInfo.worktime" class="form-control" required />
        </div>
        <div class="info__form-group">
          <label for="phone">电话:</label>
          <input type="text" id="phone" v-model="teacherInfo.phonenumber" class="form-control" required />
        </div>
        <button type="submit" class="btn btn-primary">保存</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.info {
  padding: 2rem 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.info__header {
  text-align: center;
  margin-bottom: 2rem;
}

.info__title {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.info__form-group {
  margin-bottom: 1rem;
}

.info__form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.info__form-group input {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
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
