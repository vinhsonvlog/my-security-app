const Quiz = require('../models/Quiz');
const { generateQuizQuestion, QUESTION_TYPES, DIFFICULTY_LEVELS } = require('../services/geminiService');

/**
 * @route   POST /api/quiz/generate
 * @desc    Generate a new quiz question using Gemini AI
 * @access  Public
 */
const generateQuestion = async (req, res) => {
  try {
    const { type, difficulty } = req.body;

    // Validate type if provided
    if (type && !QUESTION_TYPES.find(t => t.type === type)) {
      return res.status(400).json({
        success: false,
        message: 'Loại câu hỏi không hợp lệ',
        validTypes: QUESTION_TYPES.map(t => t.type)
      });
    }

    // Validate difficulty if provided
    if (difficulty && !DIFFICULTY_LEVELS.includes(difficulty)) {
      return res.status(400).json({
        success: false,
        message: 'Mức độ không hợp lệ',
        validDifficulties: DIFFICULTY_LEVELS
      });
    }

    // Generate question from Gemini
    const questionData = await generateQuizQuestion(type, difficulty || 'cơ bản');

    // Save to database
    const quiz = new Quiz(questionData);
    await quiz.save();

    res.status(201).json({
      success: true,
      data: quiz
    });

  } catch (error) {
    console.error('Error generating question:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi tạo câu hỏi'
    });
  }
};

/**
 * @route   GET /api/quiz
 * @desc    Get all quiz questions with optional filters
 * @access  Public
 */
const getQuestions = async (req, res) => {
  try {
    const { type, difficulty, limit = 10, page = 1 } = req.query;

    const filter = {};
    if (type) filter.type = type;
    if (difficulty) filter.difficulty = difficulty;

    const skip = (page - 1) * limit;

    const questions = await Quiz.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Quiz.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: questions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error getting questions:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách câu hỏi'
    });
  }
};

/**
 * @route   GET /api/quiz/random
 * @desc    Get a random quiz question
 * @access  Public
 */
const getRandomQuestion = async (req, res) => {
  try {
    const { type, difficulty } = req.query;

    const filter = {};
    if (type) filter.type = type;
    if (difficulty) filter.difficulty = difficulty;

    const count = await Quiz.countDocuments(filter);

    if (count === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy câu hỏi phù hợp'
      });
    }

    const random = Math.floor(Math.random() * count);
    const question = await Quiz.findOne(filter).skip(random);

    res.status(200).json({
      success: true,
      data: question
    });

  } catch (error) {
    console.error('Error getting random question:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy câu hỏi ngẫu nhiên'
    });
  }
};

/**
 * @route   GET /api/quiz/:id
 * @desc    Get a specific quiz question by ID
 * @access  Public
 */
const getQuestionById = async (req, res) => {
  try {
    const question = await Quiz.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy câu hỏi'
      });
    }

    res.status(200).json({
      success: true,
      data: question
    });

  } catch (error) {
    console.error('Error getting question:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy câu hỏi'
    });
  }
};

/**
 * @route   DELETE /api/quiz/:id
 * @desc    Delete a quiz question
 * @access  Admin only (add auth middleware)
 */
const deleteQuestion = async (req, res) => {
  try {
    const question = await Quiz.findByIdAndDelete(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy câu hỏi'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Đã xóa câu hỏi thành công'
    });

  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa câu hỏi'
    });
  }
};

/**
 * @route   GET /api/quiz/types
 * @desc    Get available question types
 * @access  Public
 */
const getQuestionTypes = (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      types: QUESTION_TYPES.map(t => t.type),
      difficulties: DIFFICULTY_LEVELS
    }
  });
};

module.exports = {
  generateQuestion,
  getQuestions,
  getRandomQuestion,
  getQuestionById,
  deleteQuestion,
  getQuestionTypes
};
