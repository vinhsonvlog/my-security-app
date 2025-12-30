const express = require('express');
const router = express.Router();
const {
  getStatistics,
  getTrendingScams,
  getReportStats,
} = require('../controllers/statsController');

// Public routes
router.get('/', getStatistics);
router.get('/trending', getTrendingScams);
router.get('/reports', getReportStats);

module.exports = router;
