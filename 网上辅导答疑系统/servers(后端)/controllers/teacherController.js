// server/controllers/teacherController.js
const connection = require('../db');

exports.getTeacherInfo = (req, res) => {
  const { username } = req.query;
  const query = 'SELECT * FROM teacher WHERE username = ?';
  connection.query(query, [username], (error, results) => {
    if (error) {
      console.error('Error fetching teacher info:', error);
      res.status(500).send('Server error');
      return;
    }
    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({ message: '教师信息未找到' });
    }
  });
};

exports.updateTeacherInfo = (req, res) => {
  const { username, tname, tsex, tbirth, careercall, profession, fulltime, worktime, phonenumber } = req.body;
  const query = 'UPDATE teacher SET tname = ?, tsex = ?, tbirth = ?, careercall = ?, profession = ?, fulltime = ?, worktime = ?, phonenumber = ? WHERE username = ?';
  connection.query(query, [tname, tsex, tbirth, careercall, profession, fulltime, worktime, phonenumber, username], (error, results) => {
    if (error) {
      console.error('Error updating teacher info:', error);
      res.status(500).send('Server error');
      return;
    }
    res.status(200).json({ status: 200 });
  });
};

exports.getTeacherNameByUsername = (req, res) => {
    const { username } = req.query;
    const query = 'SELECT tname FROM teacher WHERE username = ? ';
    connection.query(query, [username], (error, results) => {
      if (error) {
        console.error('Error fetching teacher name:', error);
        res.status(500).send('Server error');
        return;
      }
      if (results.length === 0) {
        res.status(404).send('Teacher not found');
        return;
      }
      res.status(200).json({ tname: results[0].tname });
    });
  };