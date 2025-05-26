require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Import routes
const studentRoutes = require('./routes/studentRoutes');
app.use('/api/students', studentRoutes);

const port = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.listen(port, () => console.log(`Server running on port ${port}`));
