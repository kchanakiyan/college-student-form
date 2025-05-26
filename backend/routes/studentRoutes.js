const express = require('express');
const router = express.Router();
const Student = require('../models/student');  // note lowercase 'student'

router.post('/', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json({ message: 'Student saved!' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
