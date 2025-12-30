const express = require('express');
const router = express.Router();
const {
  getNewsfeed,
  getTopScams,
  getScamsByType,
} = require('../controllers/newsfeedController');

// Public routes
router.get('/', getNewsfeed);
router.get('/top', getTopScams);
router.get('/by-type', getScamsByType);

module.exports = router;
