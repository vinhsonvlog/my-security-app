const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  scenario: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: {
    A: { type: String, required: true },
    B: { type: String, required: true },
    C: { type: String, required: true },
    D: { type: String, required: true }
  },
  correctAnswer: {
    type: String,
    required: true,
    enum: ['A', 'B', 'C', 'D']
  },
  explanation: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Phishing Email', 'Link độc hại', 'SMS lừa đảo', 'Social Engineering', 'Password', '2FA']
  },
  difficulty: {
    type: String,
    enum: ['cơ bản', 'trung bình', 'nâng cao'],
    default: 'cơ bản'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index để tìm kiếm nhanh hơn
quizSchema.index({ type: 1, difficulty: 1 });

module.exports = mongoose.model('Quiz', quizSchema);
