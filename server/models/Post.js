const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: [true, 'Vui lòng nhập tiêu đề'],
    trim: true,
    maxlength: [200, 'Tiêu đề không được quá 200 ký tự']
  },
  content: {
    type: String,
    required: [true, 'Vui lòng nhập nội dung'],
    trim: true,
    maxlength: [2000, 'Nội dung không được quá 2000 ký tự']
  },
  imageUrl: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminNote: {
    type: String,
    trim: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
postSchema.index({ status: 1, createdAt: -1 });
postSchema.index({ user: 1 });

module.exports = mongoose.model('Post', postSchema);
