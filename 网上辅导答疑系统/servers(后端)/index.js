// servers/index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

// 启用 CORS
app.use(cors());

// 使用 body-parser 解析 JSON 请求体
app.use(bodyParser.json());

// 引入路由
const teacherRoutes = require('./routes/teacherRoutes');
const userRoutes = require('./routes/userRoutes');
const faqsRoutes = require('./routes/faqsRoutes');
const haqsRoutes = require('./routes/haqsRoutes');

// 使用路由
app.use('/teacher', teacherRoutes);
app.use('/user', userRoutes);
app.use('/faqs', faqsRoutes);
app.use('/haqs', haqsRoutes);

// 启动服务器
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});