const express = require('express');
const router = express.Router();
const {
  createPost,
  getApprovedPosts,
  getPendingPosts,
  getAllPosts,
  approvePost,
  rejectPost,
  deletePost,
  getMyPosts,
  getPostById
} = require('../controllers/postController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.get('/', getApprovedPosts);

// Protected routes (authenticated users)
router.post('/', protect, createPost);
router.get('/my', protect, getMyPosts);

// Admin only routes - Đặt các route cụ thể TRƯỚC route có params
router.get('/pending', protect, admin, getPendingPosts);
router.get('/all', protect, admin, getAllPosts);
router.put('/:id/approve', protect, admin, approvePost);
router.put('/:id/reject', protect, admin, rejectPost);
router.delete('/:id', protect, admin, deletePost);

// Dynamic routes - Đặt CUỐI CÙNG
router.get('/:id', getPostById);

module.exports = router;
