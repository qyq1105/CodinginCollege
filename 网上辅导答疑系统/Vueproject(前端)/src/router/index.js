import { createRouter, createWebHistory } from 'vue-router'
import Index from '@/components/Index.vue'
import Login from '@/components/Login.vue'
import Question from '@/components/Question.vue'
import { useUserStore } from '@/stores/userStore'
import Faqs from '@/components/Faqs.vue'
import Faqsmanage from '@/components/Faqsmanage.vue'
import Haqs from '@/components/Haqs.vue'
import Info from '@/components/Info.vue'
import Studentmanage from '@/components/Studentmanage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Index,
    meta: {
      requiresAuth: false // 首页不需要登录
    },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      requiresAuth: false // 登录页面不需要登录
    },
  },
  {
    path: '/question',
    name: 'question',
    component: Question,
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/faqs',
    name: 'faqs',
    component: Faqs,
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/faqsmanage',
    name: 'faqsmanage',
    component: Faqsmanage,
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/haqs',
    name: 'haqs',
    component: Haqs,
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/info',
    name: 'info',
    component: Info,
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/studentmanage',
    name: 'studentmanage',
    component: Studentmanage,
    meta: {
      requiresAuth: true
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

// 添加导航守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !userStore.isLogin) {
    next({ name: 'login' }); // 未登录用户重定向到登录页面
  } else {
    next(); // 已登录用户或访问不需要登录的页面
  }
})

export default router
