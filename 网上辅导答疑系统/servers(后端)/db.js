// server/db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'software'
});

connection.connect((err) => {
    if (err) {
        console.error('数据库连接失败', err);
        process.exit(1); // 如果连接失败，退出进程
    }
    console.log('数据库连接成功');
});

module.exports = connection;