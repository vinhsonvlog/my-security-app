const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Vui lòng nhập họ và tên'],
    trim: true,
    maxlength: [100, 'Tên không được vượt quá 100 ký tự']
  },
  email: {
    type: String,
    required: [true, 'Vui lòng nhập email'],
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Email không hợp lệ'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Vui lòng nhập số điện thoại'],
    match: [/^[0-9()+\-\s]{7,20}$/, 'Số điện thoại không hợp lệ']
  },
  specialty: {
    type: String,
    required: true,
    enum: {
      values: ['tu-van', 'ky-thuat', 'content'],
      message: 'Chuyên môn không hợp lệ'
    }
  },
  experience: {
    type: String,
    default: '',
    maxlength: [1000, 'Kinh nghiệm không được vượt quá 1000 ký tự']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  notes: {
    type: String,
    default: '',
    maxlength: [500, 'Ghi chú không được vượt quá 500 ký tự']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
volunteerSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Volunteer', volunteerSchema);
