// servers/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 用户登录
router.post('/login', userController.login);

// 用户注册
router.post('/register', userController.register);

// 获取所有学生信息
router.get('/getStudents', userController.getStudents);

// 删除指定学生
router.delete('/deleteUser/:id', userController.deleteUser);

// 更新指定学生信息
router.put('/updateUser/:id', userController.updateUser);

module.exports = router;