// server/routes/newsRoutes.js
const express = require('express');
const router = express.Router();
const haqsController = require('../controllers/haqsController');


router.get('/getHaqs', haqsController.getHaqs);


router.get('/getCategories', haqsController.getCategories);

router.get('/TypeHaqs', haqsController.getTypeHaqs);

router.get('/HistoryHaqs', haqsController.getHistoryHaqs);

router.get('/IdHaqs', haqsController.getIdHaqs);

// 学生提问
router.post('/insertHaqs', haqsController.insertHaqs);

// 教师解答
router.post('/updateHaqs', haqsController.updateHaqs);

router.get('/selectHaqs', haqsController.selectHaqs);

module.exports = router;