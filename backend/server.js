// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Health check - helpful for Render and debugging
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// Serve static files from frontend (public)
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));

// Register API routes
// Keep the same path you used. If this file doesn't exist the app will throw on startup
const studentRoutes = require('./routes/studentRoutes');
app.use('/api/students', studentRoutes);

// Fallback to index.html for client-side routing (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

// Helpful validation before trying to connect
if (!MONGO_URI) {
  console.error('FATAL: MONGO_URI environment variable is not set.');
  console.error('Set MONGO_URI to your Atlas connection string before starting the app.');
  process.exit(1);
}

// Mongoose connection with recommended options
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // serverSelectionTimeoutMS: 10000, // optional: fail faster if desired
};

async function startServer() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, mongooseOptions);
    console.log('MongoDB Connected ✅');

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // graceful shutdown
    const graceful = () => {
      console.log('Shutting down gracefully...');
      server.close(() => {
        mongoose.connection.close(false, () => {
          console.log('MongoDB connection closed.');
          process.exit(0);
        });
      });
      // Force exit if not closed in 10s
      setTimeout(() => {
        console.error('Forcing shutdown.');
        process.exit(1);
      }, 10000).unref();
    };

    process.on('SIGINT', graceful);
    process.on('SIGTERM', graceful);

    // Optional: log uncaught rejections and exceptions (you can customize)
    process.on('unhandledRejection', (reason, p) => {
      console.error('Unhandled Rejection at:', p, 'reason:', reason);
    });
    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception thrown:', err);
      // Optional: graceful(); // choose whether to shutdown on exception
    });

  } catch (err) {
    console.error('MongoDB connection error:', err && err.message ? err.message : err);
    // Exit so Render shows the error and you don't run an app without DB
    process.exit(1);
  }
}

startServer();
