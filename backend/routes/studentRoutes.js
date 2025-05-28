const express = require('express');
const router = express.Router();
const Student = require('../models/student');

// For Excel export
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

// Route: POST /api/students
router.post('/', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json({ message: 'Student saved!' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Route: GET /api/students/export
router.get('/export', async (req, res) => {
  try {
    const students = await Student.find();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Students');

    worksheet.columns = [
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Gender', key: 'gender', width: 10 },
      { header: 'Date of Birth', key: 'dob', width: 15 },
      { header: 'Field', key: 'field', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Quota', key: 'quota', width: 10 },
      { header: 'Location', key: 'location', width: 20 },
    ];

    students.forEach(student => {
      worksheet.addRow(student.toObject());
    });

    const filePath = path.join(__dirname, '../students.xlsx');
    await workbook.xlsx.writeFile(filePath);

    res.download(filePath, 'students.xlsx', () => {
      fs.unlinkSync(filePath); // delete file after sending
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to export Excel file' });
  }
});

module.exports = router;
