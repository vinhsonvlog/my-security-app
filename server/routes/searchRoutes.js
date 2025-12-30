const express = require('express');
const router = express.Router();
const {
  searchUrl,
  bulkSearchUrls,
} = require('../controllers/searchController');

// Public routes
router.get('/', searchUrl);
router.post('/bulk', bulkSearchUrls);

module.exports = router;
