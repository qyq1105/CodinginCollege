// server/routes/teacherRoutes.js
const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');

// 获取教师信息
router.get('/getTeacherInfo', teacherController.getTeacherInfo);

// 更新教师信息
router.post('/updateTeacherInfo', teacherController.updateTeacherInfo);

// 获取教师名字
router.get('/getTeacherNameByUsername', teacherController.getTeacherNameByUsername);

module.exports = router;