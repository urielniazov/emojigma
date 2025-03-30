const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import routes
const puzzleRoutes = require('./routes/puzzles');

// Create Express app
const app = express();

// Apply middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: ['https://emojigma.vercel.app', 'http://localhost:5173']
}));
app.use(express.json()); // Parse JSON request bodies
app.use(morgan('dev')); // Request logging

// Apply routes
app.use('/api/puzzles', puzzleRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Emojigma API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

module.exports = app;