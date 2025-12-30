// Test script để kiểm tra Gemini API
require('dotenv').config();
const { generateQuizQuestion } = require('./services/geminiService');

const testGeminiAPI = async () => {
  console.log('🔍 Đang kiểm tra kết nối Gemini API...\n');

  // Check API key
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ Lỗi: GEMINI_API_KEY chưa được cấu hình trong file .env');
    console.log('👉 Vui lòng thêm GEMINI_API_KEY vào file .env');
    process.exit(1);
  }

  if (process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    console.error('❌ Lỗi: GEMINI_API_KEY vẫn là giá trị mặc định');
    console.log('👉 Vui lòng thay thế bằng API key thực từ https://aistudio.google.com/app/apikey');
    process.exit(1);
  }

  console.log('✅ API Key đã được cấu hình\n');

  try {
    console.log('🤖 Đang tạo câu hỏi mẫu về Phishing Email...\n');
    
    const question = await generateQuizQuestion('Phishing Email', 'cơ bản');

    console.log('✅ Thành công! Câu hỏi đã được tạo:\n');
    console.log('━'.repeat(60));
    console.log(`📌 Loại: ${question.type}`);
    console.log(`📊 Mức độ: ${question.difficulty}`);
    console.log('━'.repeat(60));
    console.log(`\n📖 Tình huống:\n${question.scenario}\n`);
    console.log(`❓ Câu hỏi:\n${question.question}\n`);
    console.log('📝 Đáp án:');
    console.log(`   A. ${question.options.A}`);
    console.log(`   B. ${question.options.B}`);
    console.log(`   C. ${question.options.C}`);
    console.log(`   D. ${question.options.D}\n`);
    console.log(`✅ Đáp án đúng: ${question.correctAnswer}\n`);
    console.log(`💡 Giải thích:\n${question.explanation}\n`);
    console.log('━'.repeat(60));
    console.log('\n🎉 Gemini API hoạt động tốt! Bạn có thể bắt đầu sử dụng.');
    console.log('👉 Chạy: npm run dev để khởi động server\n');

  } catch (error) {
    console.error('❌ Lỗi khi gọi Gemini API:');
    console.error(error.message);
    console.log('\n🔧 Các bước khắc phục:');
    console.log('1. Kiểm tra API key có đúng không');
    console.log('2. Kiểm tra kết nối Internet');
    console.log('3. Xem log chi tiết bên trên');
    process.exit(1);
  }
};

// Run test
testGeminiAPI();
