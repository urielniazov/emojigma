const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');

// Import routes
const puzzleRoutes = require('./routes/puzzles');
const userPuzzleAttemptRoutes = require('./routes/userPuzzleAttempts');
const leaderboardRoutes = require('./routes/leaderboard');
const feedbackRoutes = require('./routes/feedbackRoutes');


// Create Express app
const app = express();

// Stricter limiter for POST endpoints (10 requests per 15 minutes)
const postLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many attempts, please try again later',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// More generous limiter for GET endpoints (10 requests per minute)
const getLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per minute
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});


// Apply middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: ['https://emojigma.vercel.app', 'http://localhost:5173']
}));
app.use(express.json()); // Parse JSON request bodies
app.use(morgan('dev')); // Request logging
app.use(express.urlencoded({ extended: true })); 

if (process.env.NODE_ENV === 'development') {
  app.get('/_vercel/insights/script.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.send('console.log("Vercel Analytics mock for local development");');
  });
}
// Apply routes
app.use('/api/puzzles', puzzleRoutes);
app.use('/api/attempts', userPuzzleAttemptRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/feedback', feedbackRoutes);

// Apply rate limiters
app.use('/api/puzzles/today', getLimiter);
app.use('/api/attempts/streak', getLimiter);
app.use('/api/leaderboard', getLimiter);
app.use('/api/attempts/guess', postLimiter);
app.use('/api/attempts/shared', postLimiter);
app.use('/api/attempts/start', postLimiter);
app.use('/api/feedback', postLimiter);


app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
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