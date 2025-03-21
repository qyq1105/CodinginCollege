// src/stores/userStore.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    isLogin: false,
    username: '',
    userType: '',
    userId: ''
  }),
  actions: {
    setIsLogin(isLogin) {
      this.isLogin = isLogin;
    },
    setUsername(username) {
      this.username = username;
    },
    setUserType(userType) {
      this.userType = userType;
    },
    setUserId(userId) {
      this.userId = userId;
    }
  }
});
