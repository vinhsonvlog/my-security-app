const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  content: {
    type: String,
    required: [true, 'Please provide content'],
    maxlength: [5000, 'Content cannot exceed 5000 characters']
  },
  imageUrl: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Đang diễn ra', 'Sắp tới', 'Đã kết thúc'],
    default: 'Sắp tới'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: String,
    default: ''
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
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

// Update the updatedAt timestamp before saving
eventSchema.pre('save', async function() {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Event', eventSchema);
