<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from "vue-router";
import TopNavbar from './TopNavbar.vue';

const userStore = useUserStore();
const router = useRouter();
const userType = ref('student');
const username = ref('');
const name = ref('');
const password = ref('');
const confirmPassword = ref('');
const showLoginForm = ref(true); // 控制显示登录表单还是注册表单

const login = async () => {
  try {
    const response = await axios.post('http://localhost:3001/user/login', {
      username: username.value,
      password: password.value,
      userType: userType.value, // 包含用户类型信息
    });

    if (response.status === 200) {
      userStore.setIsLogin(true);
      userStore.setUsername(username.value);
      userStore.setUserType(response.data.userType);
      userStore.setUserId(response.data.userId); // 假设服务器返回 userId
      alert('登录成功');
      router.push('/');
    } else {
      alert(`登录失败: ${response.data.message}`); // 显示具体的错误信息
    }
  } catch (error) {
    if (error.response) {
      // 请求已发出，但服务器响应的状态码不在 2xx 范围内
      // console.error('服务器响应错误:', error.response.data);
      // console.error('状态码:', error.response.status);
      // console.error('请求头:', error.response.headers);
      alert(`登录失败: ${error.response.data.message}`);
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      console.error('请求错误:', error.request);
      alert('网络请求失败，请稍后再试');
    } else {
      // 一些设置请求时发生错误
      console.error('请求配置错误:', error.message);
      alert('请求配置错误，请稍后再试');
    }
    console.error('错误配置:', error.config);
  }
};

const register = async () => {
  if (password.value !== confirmPassword.value) {
    alert('密码不一致');
    return;
  }
  if (password.value == ""||username.value==""||confirmPassword.value=="") {
    alert('用户名或密码为空！');
    return;
  }
  try {
    const response = await axios.post('http://localhost:3001/user/register', {
      username: username.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
      name:name.value,
      userType: userType.value, // 包含用户类型信息
    });

    if (response.status === 201) {
      alert('注册成功');
      toggleForm(); // 切换回登录表单
    } else {
      alert(`注册失败: ${response.data.message}`); // 显示具体的错误信息
    }
  } catch (error) {
    if (error.response) {
      // 请求已发出，但服务器响应的状态码不在 2xx 范围内
      console.error('服务器响应错误:', error.response.data);
      console.error('状态码:', error.response.status);
      console.error('请求头:', error.response.headers);
      alert(`注册失败: ${error.response.data.message}`);
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      console.error('请求错误:', error.request);
      alert('网络请求失败，请稍后再试');
    } else {
      // 一些设置请求时发生错误
      console.error('请求配置错误:', error.message);
      alert('请求配置错误，请稍后再试');
    }
    console.error('错误配置:', error.config);
  }
};

const toggleForm = () => {
  showLoginForm.value = !showLoginForm.value;
};
</script>

<template>
    <div v-if="showLoginForm" class="login-form">
      <div>
        <label>
          <input type="radio" v-model="userType" value="student" />
          我是学生
        </label>
        <label>
          <input type="radio" v-model="userType" value="teacher" />
          我是老师
        </label>
      </div>
      <input type="text" v-model="username" placeholder="用户名" />
      <input type="password" v-model="password" placeholder="密码" @keyup.enter="login" />
      <button @click="login">登录</button>
      <button @click="toggleForm">注册</button>
    </div>
    <div v-else class="register-form">
      <div>
        <label>
          <input type="radio" v-model="userType" value="student" />
          我是学生
        </label>
        <label>
          <input type="radio" v-model="userType" value="teacher" />
          我是老师
        </label>
      </div>
      <input type="text" v-model="username" placeholder="用户名" />
      <input type="text" v-model="name" placeholder="昵称" />
      <input type="password" v-model="password" placeholder="密码" />
      <input type="password" v-model="confirmPassword" placeholder="确认密码" />
      <button @click="register">注册</button>
      <button @click="toggleForm">登录</button>
    </div>
</template>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 300px;
}

.login-form input {
  padding: 5px;
  font-size: 14px;
}

.login-form button {
  padding: 5px 10px;
  font-size: 14px;
  background-color: #555;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-form button:hover {
  background-color: #777;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 300px;
}

.register-form input {
  padding: 5px;
  font-size: 14px;
}

.register-form button {
  padding: 5px 10px;
  font-size: 14px;
  background-color: #555;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.register-form button:hover {
  background-color: #777;
}
</style>
