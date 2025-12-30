# 🚀 Hướng dẫn Setup Tính năng Quiz với Gemini AI

## ✅ Đã hoàn thành

Tôi đã thiết lập hoàn chỉnh hệ thống Quiz với Gemini AI theo kiến trúc:

```
Frontend (React + Vite)
   ↓
   POST /api/quiz/generate
   ↓
Backend (Node.js + Express)
   ↓
   Gemini API (Google AI Studio)
   ↓
MongoDB (Lưu câu hỏi + đáp án)
```

## 📁 File đã tạo/cập nhật

### Backend
- ✅ `server/models/Quiz.js` - Model lưu câu hỏi vào MongoDB
- ✅ `server/services/geminiService.js` - Service gọi Gemini API
- ✅ `server/controllers/quizController.js` - Controller xử lý logic
- ✅ `server/routes/quizRoutes.js` - Routes cho API endpoints
- ✅ `server/server.js` - Đã thêm quiz routes
- ✅ `server/.env` - Thêm GEMINI_API_KEY
- ✅ `server/.env.example` - Template cho env variables
- ✅ `server/GEMINI_SETUP.md` - Hướng dẫn chi tiết

### Frontend
- ✅ `cyber-security-handbook/src/pages/CyberQuiz.jsx` - Component hiển thị quiz với multiple choice
- ✅ `cyber-security-handbook/src/services/geminiApi.js` - Service gọi backend API

### Dependencies
- ✅ Đã cài `@google/generative-ai` cho backend
- ✅ Đã cài `axios` cho frontend

## 🔑 Bước tiếp theo - Cấu hình API Key

### 1. Lấy Gemini API Key

1. Truy cập: https://aistudio.google.com/app/apikey
2. Đăng nhập bằng tài khoản Google
3. Click **"Create API Key"**
4. Copy API Key

### 2. Thêm vào file .env

Mở file `server/.env` và thay thế:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Bằng API key bạn vừa lấy:

```env
GEMINI_API_KEY=AIzaSy...your_actual_key...
```

## 🎯 Các tính năng đã implement

### 1. **6 loại câu hỏi**
- ✅ Phishing Email - Email giả mạo ngân hàng, công ty
- ✅ Link độc hại - URL rút gọn, domain giả
- ✅ SMS lừa đảo - SMS trúng thưởng, khoá tài khoản
- ✅ Social Engineering - Giả IT support, nhân viên
- ✅ Password - Đặt mật khẩu, quản lý mật khẩu
- ✅ 2FA - Xác thực 2 lớp

### 2. **3 mức độ khó**
- Cơ bản
- Trung bình  
- Nâng cao

### 3. **Format câu hỏi trắc nghiệm**
- Tình huống thực tế (scenario)
- Câu hỏi cụ thể
- 4 đáp án (A, B, C, D)
- Đáp án đúng
- Giải thích chi tiết

## 🔌 API Endpoints

### Generate Question (Tạo câu hỏi mới)
```http
POST http://localhost:1124/api/quiz/generate
Content-Type: application/json

{
  "type": "Phishing Email",  
  "difficulty": "cơ bản"
}
```

### Get Random Question (Lấy câu hỏi ngẫu nhiên)
```http
GET http://localhost:1124/api/quiz/random?type=Phishing%20Email
```

### Get All Questions (Lấy danh sách)
```http
GET http://localhost:1124/api/quiz?limit=10&page=1
```

### Get Question Types (Lấy các loại câu hỏi)
```http
GET http://localhost:1124/api/quiz/types
```

## 🏃 Chạy ứng dụng

### Terminal 1 - Backend
```bash
cd server
npm run dev
```

### Terminal 2 - Frontend
```bash
cd cyber-security-handbook
npm run dev
```

## ✨ Cách sử dụng

1. Mở trình duyệt: http://localhost:5173
2. Vào trang **"Luyện tập với AI"**
3. Click **"✨ Tạo tình huống mới"**
4. Đọc tình huống và chọn đáp án A, B, C hoặc D
5. Click **"✅ Kiểm tra đáp án"**
6. Xem kết quả và giải thích chi tiết

## 🎨 Giao diện

- ✅ Dark theme (tối màu)
- ✅ Chip hiển thị loại câu hỏi
- ✅ Radio buttons cho 4 đáp án
- ✅ Highlight đáp án đúng (màu xanh)
- ✅ Highlight đáp án sai (màu đỏ)
- ✅ Alert hiển thị kết quả
- ✅ Box giải thích chi tiết

## 📊 Database Schema

```javascript
{
  scenario: String,        // Tình huống
  question: String,        // Câu hỏi
  options: {
    A: String,
    B: String,
    C: String,
    D: String
  },
  correctAnswer: String,   // A, B, C, hoặc D
  explanation: String,     // Giải thích
  type: String,           // Loại câu hỏi
  difficulty: String,     // Mức độ
  createdAt: Date
}
```

## 🔒 Bảo mật

- API key được lưu trong `.env` (không commit lên Git)
- Backend làm trung gian gọi Gemini (không expose API key cho frontend)
- Validation input trước khi gọi Gemini
- Error handling đầy đủ

## 🎓 Ví dụ câu hỏi được tạo

```json
{
  "scenario": "Bạn nhận được email từ 'nganhangtechcombank@gmail.com' yêu cầu cập nhật thông tin tài khoản trong 24h, nếu không tài khoản sẽ bị khoá.",
  "question": "Email này có phải là lừa đảo không?",
  "options": {
    "A": "Không, vì có logo ngân hàng",
    "B": "Có, vì domain email không chính thức",
    "C": "Không, vì nội dung rất cấp bách",
    "D": "Không chắc, nên click vào link kiểm tra"
  },
  "correctAnswer": "B",
  "explanation": "Email lừa đảo vì domain '@gmail.com' không phải domain chính thức của Techcombank. Ngân hàng luôn dùng domain '@techcombank.com.vn'. Ngoài ra, ngân hàng không bao giờ yêu cầu cập nhật thông tin qua email."
}
```

## 🚨 Lưu ý

1. **Gemini API có giới hạn free tier**: ~15 requests/phút
2. **Thời gian phản hồi**: 2-5 giây mỗi câu hỏi
3. **Câu hỏi được lưu vào DB**: Không cần gọi API mỗi lần
4. **Chi phí**: Gemini 1.5 Flash miễn phí trong giới hạn

## 📚 Tài liệu tham khảo

- [Gemini API Documentation](https://ai.google.dev/docs)
- [Google AI Studio](https://aistudio.google.com)
- [MongoDB Schema Design](https://mongoosejs.com/docs/guide.html)

---

**Chúc bạn setup thành công! 🎉**
