const express = require('express');
const router = express.Router();
const { 
  submitReport, 
  getMyReports, 
  getAllReports, 
  updateReportStatus, 
  deleteReport,
  createReport,
  getReportStatus,
  getUserReports
} = require('../controllers/reportController');
const { protect, admin } = require('../middleware/auth');
const { reportValidation } = require('../middleware/validation');

// Public routes
router.post('/create', reportValidation, createReport);
router.get('/status/:reportId', getReportStatus);
router.get('/user', getUserReports);

// Protected routes
router.post('/', protect, submitReport);
router.get('/my-reports', protect, getMyReports);

// Admin routes
router.get('/admin/all', protect, admin, getAllReports);
router.put('/:id', protect, admin, updateReportStatus);
router.delete('/:id', protect, admin, deleteReport);

module.exports = router;
