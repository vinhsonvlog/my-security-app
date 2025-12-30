const Post = require('../models/Post');

/**
 * @route   POST /api/posts
 * @desc    Create a new post (user)
 * @access  Private
 */
const createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const post = await Post.create({
      user: req.user._id,
      username: req.user.username,
      title,
      content,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      data: post,
      message: 'Bài viết đã được gửi và đang chờ duyệt'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/posts
 * @desc    Get all approved posts (public)
 * @access  Public
 */
const getApprovedPosts = async (req, res, next) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ status: 'approved' })
      .sort({ approvedAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .populate('user', 'username');

    const total = await Post.countDocuments({ status: 'approved' });

    res.json({
      success: true,
      data: posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/posts/pending
 * @desc    Get all pending posts (admin only)
 * @access  Private/Admin
 */
const getPendingPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .populate('user', 'username email');

    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/posts/all
 * @desc    Get all posts with filter (admin only)
 * @access  Private/Admin
 */
const getAllPosts = async (req, res, next) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (status) filter.status = status;

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .populate('user', 'username email')
      .populate('approvedBy', 'username');

    const total = await Post.countDocuments(filter);

    res.json({
      success: true,
      data: posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/posts/:id/approve
 * @desc    Approve a post (admin only)
 * @access  Private/Admin
 */
const approvePost = async (req, res, next) => {
  try {
    const { adminNote } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      const error = new Error('Không tìm thấy bài viết');
      error.statusCode = 404;
      return next(error);
    }

    post.status = 'approved';
    post.adminNote = adminNote || '';
    post.approvedBy = req.user._id;
    post.approvedAt = new Date();

    await post.save();

    res.json({
      success: true,
      data: post,
      message: 'Bài viết đã được duyệt'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/posts/:id/reject
 * @desc    Reject a post (admin only)
 * @access  Private/Admin
 */
const rejectPost = async (req, res, next) => {
  try {
    const { adminNote } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      const error = new Error('Không tìm thấy bài viết');
      error.statusCode = 404;
      return next(error);
    }

    post.status = 'rejected';
    post.adminNote = adminNote || 'Bài viết không phù hợp';
    post.approvedBy = req.user._id;

    await post.save();

    res.json({
      success: true,
      data: post,
      message: 'Bài viết đã bị từ chối'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/posts/:id
 * @desc    Delete a post (admin only)
 * @access  Private/Admin
 */
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      const error = new Error('Không tìm thấy bài viết');
      error.statusCode = 404;
      return next(error);
    }

    res.json({
      success: true,
      message: 'Bài viết đã được xóa'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/posts/my
 * @desc    Get current user's posts
 * @access  Private
 */
const getMyPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/posts/:id
 * @desc    Get single post by ID
 * @access  Public
 */
const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'username')
      .populate('approvedBy', 'username');

    if (!post) {
      const error = new Error('Không tìm thấy bài viết');
      error.statusCode = 404;
      return next(error);
    }

    // Only show approved posts to public
    if (post.status !== 'approved') {
      const error = new Error('Bài viết không tồn tại hoặc chưa được duyệt');
      error.statusCode = 404;
      return next(error);
    }

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getApprovedPosts,
  getPendingPosts,
  getAllPosts,
  approvePost,
  rejectPost,
  deletePost,
  getMyPosts,
  getPostById
};
