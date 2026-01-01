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
    console.warn('⚠️ GEMINI_API_KEY không được cấu hình, sử dụng câu hỏi mẫu');
    return generateFallbackQuestion(type, difficulty);
  }

  try {
    console.log('🤖 Calling Gemini AI via REST API...');
    
    // Random question type if not specified
    const questionType = type || QUESTION_TYPES[Math.floor(Math.random() * QUESTION_TYPES.length)].type;
    const typeData = QUESTION_TYPES.find(t => t.type === questionType);
    const topic = typeData.topics[Math.floor(Math.random() * typeData.topics.length)];
    
    console.log(`📝 Generating ${questionType} question (${difficulty})...`);

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

    // Call Gemini API directly via REST with gemini-2.5-flash
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 2048,
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error('No response text from Gemini API');
    }
    
    console.log('✅ Gemini AI response received');

    // Clean up the response (remove markdown code blocks if any)
    let cleanedText = text.replace(/```json|```/g, '').trim();
    
    // Try to fix common JSON issues
    cleanedText = cleanedText.replace(/\n/g, ' '); // Remove newlines
    cleanedText = cleanedText.replace(/\s+/g, ' '); // Normalize whitespace
    
    console.log('📄 Cleaned response length:', cleanedText.length);
    
    let parsedData;
    try {
      parsedData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError.message);
      console.log('🔍 First 500 chars:', cleanedText.substring(0, 500));
      console.log('🔍 Last 200 chars:', cleanedText.substring(Math.max(0, cleanedText.length - 200)));
      throw new Error('Failed to parse AI response as JSON');
    }

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
    console.error('❌ Error calling Gemini API:', error.message);
    console.warn('🔄 Sử dụng câu hỏi mẫu thay thế');
    
    // Fallback to sample questions instead of throwing error
    return generateFallbackQuestion(type, difficulty);
  }
};

/**
 * Generate fallback question from database when AI is unavailable
 * @param {string} type - Question type
 * @param {string} difficulty - Difficulty level
 * @returns {Object} Random question from database
 */
async function generateFallbackQuestion(type, difficulty) {
  try {
    const Quiz = require('../models/Quiz');
    
    // Build query filter
    const filter = {};
    if (type) filter.type = type;
    if (difficulty) filter.difficulty = difficulty;
    
    // Count total matching questions
    const count = await Quiz.countDocuments(filter);
    
    if (count === 0) {
      console.warn('⚠️ Không có câu hỏi nào trong database, cần tạo câu hỏi mẫu trước');
      throw new Error('Không có câu hỏi trong database. Vui lòng thử lại sau.');
    }
    
    // Get random question
    const random = Math.floor(Math.random() * count);
    const question = await Quiz.findOne(filter).skip(random);
    
    console.log('📚 Lấy câu hỏi từ database (ID:', question._id, ')');
    
    return {
      scenario: question.scenario,
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      type: question.type,
      difficulty: question.difficulty
    };
    
  } catch (error) {
    console.error('❌ Lỗi khi lấy câu hỏi từ database:', error.message);
    throw new Error('Không thể tạo câu hỏi. Vui lòng thử lại sau!');
  }
}
/**
 * Analyze URL safety using Gemini AI
 * @param {string} url - URL to analyze
 * @param {Object} virusTotalData - VirusTotal scan results
 * @param {Object} blacklistData - Blacklist check results
 * @returns {Object} AI analysis result
 */
const analyzeUrlWithAI = async (url, virusTotalData = null, blacklistData = null) => {
  // Use AI if API key is available
  if (!GEMINI_API_KEY) {
    console.log('📊 Using heuristic analysis (No API key)');
    return provideFallbackAnalysis(virusTotalData, blacklistData);
  }

  try {
    console.log('🤖 Analyzing URL with Gemini AI...');
    
    // Build analysis context
    let context = `Phân tích an toàn của URL: ${url}\n\n`;
    
    if (blacklistData?.isSafe === false) {
      context += `⚠️ URL này đã bị đưa vào DANH SÁCH ĐEN:\n`;
      context += `- Loại lừa đảo: ${blacklistData.data?.scamType || 'Không rõ'}\n`;
      context += `- Mức độ nguy hiểm: ${blacklistData.data?.dangerLevel || 'Không rõ'}\n\n`;
    }
    
    if (virusTotalData?.details) {
      const { malicious, suspicious, harmless, undetected, total } = virusTotalData.details;
      context += `Kết quả quét VirusTotal (${total} công cụ bảo mật):\n`;
      context += `- Phát hiện độc hại: ${malicious}\n`;
      context += `- Đáng ngờ: ${suspicious}\n`;
      context += `- An toàn: ${harmless}\n`;
      context += `- Không phát hiện: ${undetected}\n`;
    }

    const prompt = `Bạn là chuyên gia an ninh mạng. Hãy phân tích mức độ an toàn của URL sau:

${context}

Yêu cầu:
1. Đánh giá mức độ rủi ro: safe, low, medium, hoặc high
2. Tính điểm tin cậy từ 0-100 (100 là an toàn nhất)
3. Phân tích chi tiết bằng tiếng Việt (1 đoạn văn ngắn)
4. Đưa ra 2-3 khuyến nghị

QUAN TRỌNG: 
- Trả về JSON hợp lệ, KHÔNG xuống dòng trong các giá trị string
- KHÔNG thêm markdown code blocks
- KHÔNG thêm bất kỳ text nào ngoài JSON

Format JSON:
{"riskLevel":"safe","trustScore":85,"analysis":"Phân tích ngắn gọn...","recommendations":["Khuyến nghị 1","Khuyến nghị 2"]}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 2048,
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error('No response from Gemini AI');
    }
    
    console.log('✅ AI analysis received (length:', text.length, ')');
    console.log('📄 Full response:', text);

    // Parse JSON response - handle Unicode properly
    let cleanedText = text.replace(/```json|```/g, '').trim();
    
    // Try to parse directly first (works if response is properly formatted)
    let aiResult;
    try {
      aiResult = JSON.parse(cleanedText);
    } catch (firstError) {
      console.log('⚠️ First parse failed, trying advanced cleaning...');
      
      // More aggressive cleaning
      cleanedText = cleanedText.replace(/[\r\n\t]/g, ' '); // Remove all newlines and tabs  
      cleanedText = cleanedText.replace(/\s+/g, ' '); // Normalize whitespace
      
      try {
        aiResult = JSON.parse(cleanedText);
      } catch (secondError) {
        console.error('❌ JSON parse failed after cleaning');
        console.log('Raw (first 500):', text.substring(0, 500));
        throw secondError;
      }
    }
    
    return {
      success: true,
      riskLevel: aiResult.riskLevel || 'unknown',
      trustScore: aiResult.trustScore || 50,
      analysis: aiResult.analysis || 'Không có phân tích chi tiết.',
      recommendations: aiResult.recommendations || [],
      aiPowered: true
    };

  } catch (error) {
    console.error('❌ AI analysis error:', error.message);
    console.log('🔄 Using fallback heuristic analysis');
    return provideFallbackAnalysis(virusTotalData, blacklistData);
  }
};

/**
 * Provide fallback analysis when AI is unavailable
 */
function provideFallbackAnalysis(virusTotalData, blacklistData) {
  // Provide smart fallback based on VirusTotal data
  if (virusTotalData && virusTotalData.details) {
    const malicious = virusTotalData.details.malicious || 0;
    const suspicious = virusTotalData.details.suspicious || 0;
    const harmless = virusTotalData.details.harmless || 0;
    const undetected = virusTotalData.details.undetected || 0;
    const total = virusTotalData.details.total || 1;
    
    // Tính điểm dựa trên tỉ lệ thực tế
    const safeCount = harmless + undetected;
    const dangerCount = malicious + suspicious;
    const safePercentage = Math.round((safeCount / total) * 100);
    const dangerPercentage = Math.round((dangerCount / total) * 100);
    
    let riskLevel = 'low';
    let trustScore = 50;
    let analysis = 'Phân tích dựa trên dữ liệu VirusTotal: ';
    
    if (malicious === 0 && suspicious === 0) {
      riskLevel = 'safe';
      // Điểm tin cậy từ 85-98 dựa trên tỉ lệ harmless/undetected
      trustScore = Math.min(98, 85 + Math.floor(safePercentage / 10));
      analysis += 'Không phát hiện mối đe dọa từ các công cụ bảo mật.';
    } else if (dangerPercentage < 10) {
      riskLevel = 'low';
      trustScore = Math.max(60, 80 - (dangerCount * 2));
      analysis += `Phát hiện ${dangerCount} cảnh báo nhỏ, nên cẩn thận.`;
    } else if (dangerPercentage < 30) {
      riskLevel = 'medium';
      trustScore = Math.max(30, 60 - dangerPercentage);
      analysis += `Có ${dangerCount} cảnh báo nguy hiểm từ các công cụ bảo mật.`;
    } else {
      riskLevel = 'high';
      trustScore = Math.max(5, 30 - dangerPercentage);
      analysis += `NGUY HIỂM! ${dangerCount} công cụ bảo mật đã cảnh báo URL này.`;
    }
    
    return {
      success: true,
      analysis: analysis,
      riskLevel: riskLevel,
      trustScore: trustScore,
      suspiciousIndicators: malicious > 0 ? [`${malicious} cảnh báo từ antivirus engines`] : [],
      recommendations: malicious > 0 ? ['Không nên truy cập', 'Kiểm tra nguồn gốc URL'] : ['URL có vẻ an toàn']
    };
  }
  
  // Default fallback if no VirusTotal data
  return {
    success: true,
    analysis: 'Chưa có đủ dữ liệu để phân tích. Hãy dựa vào kết quả VirusTotal và cơ sở dữ liệu.',
    riskLevel: 'unknown',
    trustScore: 50,
    recommendations: ['Hãy cẩn thận khi truy cập URL này', 'Kiểm tra nguồn gốc URL']
  };
}

module.exports = {
  generateQuizQuestion,
  analyzeUrlWithAI,
  QUESTION_TYPES,
  DIFFICULTY_LEVELS
};
