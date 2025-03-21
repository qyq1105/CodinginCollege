<template>
  <nav class="top-navbar">
    <div class="navbar-logo">网上辅导答疑</div>
    <ul class="navbar-links">
      <li><RouterLink to="/">首页</RouterLink></li>
      <li v-if="!userStore.isLogin">
        <RouterLink to="/login">登录</RouterLink>
      </li>
      <li v-else>
        <div class="dropdown">
          <button class="dropbtn">{{ userStore.username }}</button>
          <div class="dropdown-content">
            <a @click="logout">退出登录</a>
          </div>
        </div>
      </li>
      <li><RouterLink to="/haqs">人工答疑</RouterLink></li>
      <li><RouterLink to="/faqsmanage">常见问题库管理</RouterLink></li>
      <li><RouterLink to="/studentsmanage">学生管理</RouterLink></li>
    </ul>
  </nav>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const logout = () => {
  userStore.setIsLogin(false);
  userStore.setUsername('');
  userStore.setUserType('');
  router.push('/login'); // 退出登录后跳转到登录页面
};
</script>

<style scoped>
/* 现有的样式 */
.top-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #333;
  padding: 10px 20px;
  position: fixed; /* 固定在顶部 */
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000; /* 确保导航栏在其他内容之上 */
}

.navbar-logo {
  color: white;
  font-size: 24px;
  font-weight: bold;
}

.navbar-links {
  list-style: none;
  display: flex;
  gap: 20px;
  margin: 0;
  padding: 0;
}

.navbar-links li {
  display: inline;
}

.navbar-links a {
  color: white;
  text-decoration: none;
  font-size: 16px;
  transition: color 0.3s;
}

.navbar-links a:hover {
  color: #ddd;
}

/* 下拉菜单样式 */
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {
  background-color: #f1f1f1;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropbtn {
  background-color: #333;
  color: white;
  padding: 10px;
  font-size: 16px;
  border: none;
  cursor: pointer;
}
</style>
