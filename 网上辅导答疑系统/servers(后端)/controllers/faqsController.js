// server/controllers/newsController.js
const connection = require('../db');

exports.getCategories = (req, res) => {
    const query = 'SELECT DISTINCT categories FROM faqs';
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching categories:', error);
            res.status(500).send('Server error');
            return;
        }
        res.status(200).json(results.map(row => row.categories));
    });
};

exports.getFaqs = (req, res) => {
    const query = 'SELECT * FROM faqs ';
    connection.query(query,(error, results) => {
        if (error) {
            console.error('Error fetching news by type:', error);
            res.status(500).send('Server error');
            return;
        }
        res.status(200).json(results);
    });
};

exports.getIdFaqs = (req, res) => {
    const { id } = req.query;
    const query = 'SELECT * FROM faqs WHERE qid = ?';
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error fetching faqs by ID:', error);
            res.status(500).send('Server error');
            return;
        }
        res.status(200).json(results);
    });
};

exports.updateFaqs = (req, res) => {
    const { qid, context,answer, categories } = req.body;
    const query = 'UPDATE faqs SET context = ?, answer=?,categories = ? WHERE qid = ?';
    connection.query(query, [context, answer,categories, qid], (error, results) => {
        if (error) {
            console.error('Error updating faqs:', error);
            res.status(500).send('Server error');
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).send('FAQ not found');
            return;
        }
        res.status(200).json({ status: 200 });
    });
};

exports.selectFaqs = (req, res) => {
    const { select } = req.query;
    const query = 'SELECT * FROM faqs WHERE context LIKE ? OR answer LIKE ? OR categories LIKE ?';
    connection.query(query, [`%${select}%`, `%${select}%`,`%${select}%`], (error, results) => {
        if (error) {
            console.error('Error selecting faqs:', error);
            res.status(500).send('Server error');
            return;
        }
        res.status(200).json(results);
    });
};

exports.insertFaqs = (req, res) => {
    const { context, answer, categories } = req.body;
    const query = 'INSERT INTO faqs (context, answer, categories) VALUES (?, ?, ?)';
    connection.query(query, [context, answer, categories], (error, results) => {
        if (error) {
            console.error('Error inserting faqs:', error);
            res.status(500).send('Server error');
            return;
        }
        res.status(200).json({ status: 200 });
    });
};

exports.deleteFaqs = (req, res) => {
    const { qid } = req.query;
    const query = 'DELETE FROM faqs WHERE qid = ?';
    connection.query(query, [qid], (error, results) => {
        if (error) {
            console.error('Error deleting faqs:', error);
            res.status(500).send('Server error');
            return;
        }
        res.status(200).json({ status: 200 });
    });
};