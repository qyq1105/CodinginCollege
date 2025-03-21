// server/routes/newsRoutes.js
const express = require('express');
const router = express.Router();
const faqsController = require('../controllers/faqsController');

// 获取所有常见问题
router.get('/getFaqs', faqsController.getFaqs);

// // 根据类型获取常见问题
router.get('/getCategories', faqsController.getCategories);

// // 根据 ID 获取常见问题
router.get('/idFaqs', faqsController.getIdFaqs);

// 更新常见问题
router.post('/updateFaqs', faqsController.updateFaqs);

// 搜索常见问题
router.get('/selectFaqs', faqsController.selectFaqs);

// 添加常见问题
router.post('/insertFaqs', faqsController.insertFaqs);

// 删除常见问题
router.delete('/deleteFaqs', faqsController.deleteFaqs);


module.exports = router;