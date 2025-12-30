const express = require('express');
const router = express.Router();
const {
  generateQuestion,
  getQuestions,
  getRandomQuestion,
  getQuestionById,
  deleteQuestion,
  getQuestionTypes
} = require('../controllers/quizController');

// Get available question types and difficulties
router.get('/types', getQuestionTypes);

// Generate new question
router.post('/generate', generateQuestion);

// Get random question
router.get('/random', getRandomQuestion);

// Get all questions with filters
router.get('/', getQuestions);

// Get specific question by ID
router.get('/:id', getQuestionById);

// Delete question (admin only - add auth middleware if needed)
router.delete('/:id', deleteQuestion);

module.exports = router;
