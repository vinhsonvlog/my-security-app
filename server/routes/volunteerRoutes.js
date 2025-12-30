const express = require('express');
const router = express.Router();
const {
  createVolunteer,
  getAllVolunteers,
  getVolunteer,
  updateVolunteer,
  deleteVolunteer
} = require('../controllers/volunteerController');
const { protect, admin } = require('../middleware/auth');

// Public route
router.post('/', createVolunteer);

// Admin routes
router.get('/', protect, admin, getAllVolunteers);
router.get('/:id', protect, admin, getVolunteer);
router.put('/:id', protect, admin, updateVolunteer);
router.delete('/:id', protect, admin, deleteVolunteer);

module.exports = router;
