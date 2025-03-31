const request = require('supertest');
const express = require('express');
const rateLimit = require('express-rate-limit');

// Create a simple Express app for testing
const app = express();

// Configure rate limiters
const postLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  // For testing purposes, set the skip function to identify test requests
  skipFailedRequests: false,
  // This is important for testing - store the rate limiter state in memory
  store: new rateLimit.MemoryStore()
});

const getLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: false,
  store: new rateLimit.MemoryStore()
});

// Create test routes
app.get('/api/test/get', getLimiter, (req, res) => {
  res.json({ message: 'GET request successful' });
});

app.post('/api/test/post', postLimiter, (req, res) => {
  res.json({ message: 'POST request successful' });
});

// Tests
describe('Rate Limiter Tests', () => {
  // Test GET limiter (10 requests per minute)
  describe('GET Rate Limiter', () => {
    it('should allow 10 GET requests and block the 11th', async () => {
      // Make 10 requests - all should succeed
      for (let i = 0; i < 10; i++) {
        const response = await request(app).get('/api/test/get');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('GET request successful');
      }
      
      // The 11th request should be blocked
      const blockedResponse = await request(app).get('/api/test/get');
      expect(blockedResponse.status).toBe(429); // Too Many Requests
      expect(blockedResponse.text).toContain('Too many requests');
    });
  });
  
  // Test POST limiter (10 requests per 15 minutes)
  describe('POST Rate Limiter', () => {
    it('should allow 10 POST requests and block the 11th', async () => {
      // Make 10 requests - all should succeed
      for (let i = 0; i < 10; i++) {
        const response = await request(app).post('/api/test/post');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('POST request successful');
      }
      
      // The 11th request should be blocked
      const blockedResponse = await request(app).post('/api/test/post');
      expect(blockedResponse.status).toBe(429); // Too Many Requests
      expect(blockedResponse.text).toContain('Too many requests');
    });
  });
});

// Export app for testing
module.exports = app;