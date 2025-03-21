// server/controllers/userController.js
const connection = require('../db');

exports.login = (req, res) => {
    const { username, password, userType } = req.body;
    const query = 'SELECT * FROM user WHERE username = ? AND password = ? AND usertype = ?';
    connection.query(query, [username, password, userType], (error, results) => {
        if (error) {
            console.error('登录错误:', error);
            res.status(500).send('服务器错误');
            return;
        }
        if (results.length > 0) {
            res.status(200).json({ message: '登录成功', userType: results[0].usertype });
        } else {
            res.status(401).json({ message: '用户名或密码错误' });
        }
    });
};

exports.register = (req, res) => {
    const { username, password, name,confirmPassword, userType } = req.body;

    // 检查用户名是否已存在
    const checkUsernameQuery = 'SELECT * FROM user WHERE username = ?';
    connection.query(checkUsernameQuery, [username], (error, results) => {
        if (error) {
            console.error('Error checking username:', error);
            res.status(500).send('服务器错误');
            return;
        }
        if (results.length > 0) {
            return res.status(400).json({ message: '用户名已存在' });
        }

        // 检查密码是否一致
        if (password !== confirmPassword) {
            return res.status(400).json({ message: '两次输入的密码不一致' });
        }

        // 插入新用户
        const insertUserQuery = 'INSERT INTO user (username, password, name,usertype) VALUES (?,?, ?, ?)';
        connection.query(insertUserQuery, [username, password,name, userType], (insertError, insertResults) => {
            if (insertError) {
                console.error('插入用户错误:', insertError);
                res.status(500).send('服务器错误');
                return;
            }
            res.status(201).json({ message: '注册成功' });
        });
    });
};

exports.getStudents = (req, res) => {
    const query = 'SELECT * FROM user WHERE usertype = ?';
    connection.query(query, ['student'], (error, results) => {
        if (error) {
            console.error('Error fetching students:', error);
            res.status(500).send('服务器错误');
            return;
        }
        res.status(200).json(results);
    });
};

exports.deleteUser = (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM user WHERE id = ?';
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error deleting user:', error);
            res.status(500).send('服务器错误');
            return;
        }
        if (results.affectedRows > 0) {
            res.status(200).json({ message: '用户删除成功' });
        } else {
            res.status(404).json({ message: '用户未找到' });
        }
    });
};

exports.updateUser = (req, res) => {
    const { id } = req.params;
    const { username, password, name } = req.body;
    const query = 'UPDATE user SET username = ?, password = ?, name = ? WHERE id = ?';
    connection.query(query, [username, password, name, id], (error, results) => {
        if (error) {
            console.error('Error updating user:', error);
            res.status(500).send('服务器错误');
            return;
        }
        if (results.affectedRows > 0) {
            res.status(200).json({ message: '用户信息更新成功' });
        } else {
            res.status(404).json({ message: '用户未找到' });
        }
    });
};