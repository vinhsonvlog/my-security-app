const express = require('express');
const router = express.Router();
const { 
  checkUrl, 
  submitUrl, 
  getPublicBlacklist 
} = require('../controllers/urlCheckerController');

router.post('/check', checkUrl);
router.post('/submit', submitUrl);
router.get('/blacklist', getPublicBlacklist);

module.exports = router;
