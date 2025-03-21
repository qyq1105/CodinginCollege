// server/controllers/newsController.js
const connection = require('../db');

exports.getTypeHaqs = (req, res) => {
    const { categories } = req.query;
    const query = 'SELECT * FROM haqs WHERE categories = ?';
    connection.query(query, [categories], (error, results) => {
        if (error) {
            console.error('Error fetching haqs by type:', error);
            res.status(500).send('Server error');
            return;
        }
        res.status(200).json(results);
    });
};

exports.getCategories = (req, res) => {
    const query = 'SELECT DISTINCT categories FROM aqs';
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching categories:', error);
            res.status(500).send('Server error');
            return;
        }
        res.status(200).json(results.map(row => row.categories));
    });
};

exports.getHistoryHaqs = (req, res) => {
    const { questioner } = req.query;
    const query = 'SELECT * FROM haqs WHERE questioner = ?';
    connection.query(query, [questioner], (error, results) => {
        if (error) {
            console.error('Error fetching haqs by type:', error);
            res.status(500).send('Server error');
            return;
        }
        res.status(200).json(results);
    });
};

exports.getHaqs = (req, res) => {
    const query = 'SELECT * FROM haqs ';
    connection.query(query,(error, results) => {
        if (error) {
            console.error('Error fetching haqs by type:', error);
            res.status(500).send('Server error');
            return;
        }
        res.status(200).json(results);
    });
};

exports.getIdHaqs = (req, res) => {
    const { id } = req.query;
    const query = 'SELECT * FROM haqs WHERE qid = ?';
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error fetching haqs by ID:', error);
            res.status(500).send('Server error');
            return;
        }
        res.status(200).json(results);
    });
};

exports.insertHaqs = (req, res) => {
    const { questioner,context,puttime, categories} = req.body;
    const query ='INSERT INTO haqs (questioner, context, puttime, categories) VALUES (?, ?, ?, ?)';
    connection.query(query, [questioner,context, puttime,  categories], (error, results) => {
        if (error) {
            console.error('Error updating haqs:', error);
            res.status(500).send('Server error');
            return;
        }
        res.status(200).json({ status: 200, qid: results.insertId });
    });
};

exports.updateHaqs = (req, res) => {
    const { qid, answer, tid,tname,answertime } = req.body;
    const query = 'UPDATE haqs SET answer = ?, tid = ? ,tname=?,answertime=? WHERE qid = ?';
    connection.query(query, [answer,tid, tname,answertime, qid], (error, results) => {
        if (error) {
            console.error('Error updating haqs:', error);
            res.status(500).send('Server error');
            return;
        }
        res.status(200).json({ status: 200 });
    });
};

exports.selectHaqs = (req, res) => {
    const { select } = req.query;
    const query = 'SELECT * FROM haqs WHERE context LIKE ?';
    connection.query(query, [`%${select}%`, `%${select}%`], (error, results) => {
        if (error) {
            console.error('Error selecting haqs:', error);
            res.status(500).send('Server error');
            return;
        }
        res.status(200).json(results);
    });
};