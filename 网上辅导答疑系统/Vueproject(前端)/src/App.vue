<!-- src/App.vue -->
<script setup>
import { RouterLink, RouterView } from 'vue-router'
import TopNavbar from '@/components/TopNavbar.vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
</script>

<template>
  <div>
    <TopNavbar />
  <div class="home-container">
    <RouterView></RouterView>
  </div>
  </div>
</template>

<style scoped>
.home-container {
  margin-top: 60px; /* 确保内容不会被固定在顶部的导航栏遮挡 */
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center; /* 水平居中 */
  width: 100%;
  max-width: 1200px; /* 可选：设置最大宽度 */
  margin: 0 auto; /* 水平居中 */
}

</style>
