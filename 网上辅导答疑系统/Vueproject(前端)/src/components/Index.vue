<script setup>
import TopNavbar from './TopNavbar.vue';
</script>

<template>

  <div class="home-container">
    <section class="welcome-section">
      <h1>欢迎来到在线辅导答疑系统</h1>
      <p>我们提供专业的在线辅导服务，帮助你解决学习中的各种问题。</p>
    </section>
    <section class="services-section">
      <h2>我们的服务</h2>
      <div class="service-item">
        <h3>常见问题库查询</h3>
        <p>查询一些常见的问题，帮助你解决学习难题。</p>
      </div>
      <div class="service-item">
        <h3>答疑解惑</h3>
        <p>随时提问，快速得到解答，让你的学习更加高效。</p>
      </div>
      <!-- 可以根据需要添加更多服务项 -->
    </section>
  </div>
  <RouterView />
</template>

<style scoped>
.home-container {
  margin-top: 60px;
  padding: 20px;
  text-align: center;
  width: 100%;
  max-width: 600px; /* 可选：设置最大宽度 */
}

.welcome-section {
  margin-bottom: 40px;
}

.services-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.service-item {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 20px;
  margin: 10px;
  width: 100%;
  text-align: center;
}

.service-item h3 {
  margin-top: 0;
}
</style>
