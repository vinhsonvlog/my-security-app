const { GoogleGenerativeAI } = require('@google/generative-ai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Các dạng câu hỏi và chủ đề
const QUESTION_TYPES = [
  {
    type: 'Phishing Email',
    topics: ['email giả mạo ngân hàng', 'email từ công ty lừa đảo', 'email trúng thưởng', 'email reset password']
  },
  {
    type: 'Link độc hại',
    topics: ['URL rút gọn', 'domain giả mạo', 'link tải file độc hại', 'link giả mạo trang web']
  },
  {
    type: 'SMS lừa đảo',
    topics: ['SMS trúng thưởng', 'SMS khoá tài khoản ngân hàng', 'SMS giả mạo chính phủ', 'SMS giao hàng giả']
  },
  {
    type: 'Social Engineering',
    topics: ['giả IT support', 'giả nhân viên ngân hàng', 'giả cơ quan thuế', 'giả người thân']
  },
  {
    type: 'Password',
    topics: ['đặt mật khẩu an toàn', 'quản lý mật khẩu', 'password policy', 'sử dụng password manager']
  },
  {
    type: '2FA',
    topics: ['xác thực 2 lớp', 'bảo vệ tài khoản', 'phương thức 2FA an toàn', 'tránh bị đánh cắp OTP']
  }
];

const DIFFICULTY_LEVELS = ['cơ bản', 'trung bình', 'nâng cao'];

/**
 * Generate a cybersecurity quiz question using Gemini API
 * @param {string} type - Type of question (Phishing Email, Link độc hại, etc.)
 * @param {string} difficulty - Difficulty level (cơ bản, trung bình, nâng cao)
 * @returns {Object} Generated question object
 */
const generateQuizQuestion = async (type = null, difficulty = 'cơ bản') => {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY không được cấu hình trong file .env');
  }

  try {
    // Random question type if not specified
    const questionType = type || QUESTION_TYPES[Math.floor(Math.random() * QUESTION_TYPES.length)].type;
    const typeData = QUESTION_TYPES.find(t => t.type === questionType);
    const topic = typeData.topics[Math.floor(Math.random() * typeData.topics.length)];

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
Bạn là chuyên gia an ninh mạng.

Hãy tạo 1 câu hỏi trắc nghiệm để kiểm tra nhận thức về an ninh mạng.

Yêu cầu:
- Loại câu hỏi: ${questionType}
- Chủ đề: ${topic}
- Mức độ: ${difficulty}
- Cung cấp tình huống thực tế bằng tiếng Việt
- Câu hỏi cụ thể liên quan đến tình huống
- 4 đáp án (A, B, C, D) - chỉ 1 đáp án đúng
- Giải thích ngắn gọn vì sao đáp án đó đúng
- Không tạo nội dung gây hại thật

Trả lời CHÍNH XÁC theo định dạng JSON sau, KHÔNG thêm bất kỳ text nào khác bên ngoài JSON:

{
  "scenario": "Mô tả tình huống cụ thể (ví dụ: nội dung email, SMS, link...)",
  "question": "Câu hỏi cụ thể về tình huống",
  "options": {
    "A": "Đáp án A",
    "B": "Đáp án B",
    "C": "Đáp án C",
    "D": "Đáp án D"
  },
  "correct_answer": "B",
  "explanation": "Giải thích tại sao đáp án này đúng"
}
`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Clean up the response (remove markdown code blocks if any)
    const cleanedText = text.replace(/```json|```/g, '').trim();
    const parsedData = JSON.parse(cleanedText);

    // Return formatted data
    return {
      scenario: parsedData.scenario,
      question: parsedData.question,
      options: parsedData.options,
      correctAnswer: parsedData.correct_answer,
      explanation: parsedData.explanation,
      type: questionType,
      difficulty: difficulty
    };

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Không thể tạo câu hỏi từ Gemini API');
  }
};

module.exports = {
  generateQuizQuestion,
  QUESTION_TYPES,
  DIFFICULTY_LEVELS
};
