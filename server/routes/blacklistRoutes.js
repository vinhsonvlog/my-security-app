const express = require('express');
const router = express.Router();
const {
  getAllBlacklist,
  getBlacklistById,
  createBlacklist,
  updateBlacklist,
  deleteBlacklist,
} = require('../controllers/blacklistController');

// Public routes
router.get('/', getAllBlacklist);
router.get('/:id', getBlacklistById);

// Protected routes (require authentication)
router.post('/', createBlacklist);
router.put('/:id', updateBlacklist);
router.delete('/:id', deleteBlacklist);

module.exports = router;
