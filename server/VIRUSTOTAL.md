# VirusTotal Integration

Đã tích hợp VirusTotal API vào backend server.

## Cấu hình

1. Lấy API key từ: https://www.virustotal.com/gui/my-apikey
2. Thêm vào file `.env`:
```
VIRUSTOTAL_API_KEY=your_actual_api_key_here
```

## API Endpoints mới

### 1. Check URL Safety
```bash
POST /api/url-checker/check
Content-Type: application/json

{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "success": true,
  "source": "virustotal",
  "data": {
    "safe": true,
    "message": "AN TOÀN: Các công cụ bảo mật đánh giá tốt.",
    "details": {
      "malicious": 0,
      "suspicious": 0,
      "harmless": 82,
      "undetected": 3,
      "total": 85,
      "percentage": 0
    },
    "url": "https://example.com"
  }
}
```

### 2. Submit URL for Scanning
```bash
POST /api/url-checker/submit
Content-Type: application/json

{
  "url": "https://newsite.com"
}
```

### 3. Get Public Blacklist
```bash
GET /api/url-checker/blacklist
```

## Tính năng

✅ **Kiểm tra URL với VirusTotal**: Phân tích độ an toàn của URL
✅ **Kiểm tra Blacklist**: Tự động check database trước
✅ **Submit URL mới**: Gửi URL chưa được quét để VirusTotal phân tích
✅ **Auto-check khi Report**: Tự động kiểm tra VirusTotal khi user submit report
✅ **Error handling**: Xử lý lỗi 404, timeout, invalid API key

## Cách sử dụng trong Frontend

```javascript
// Check URL
const checkUrl = async (url) => {
  const response = await fetch('http://localhost:1124/api/url-checker/check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url })
  });
  
  const data = await response.json();
  return data;
};

// Submit report (tự động check VirusTotal)
const submitReport = async (url, reason, token) => {
  const response = await fetch('http://localhost:1124/api/reports', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ url, reason })
  });
  
  const data = await response.json();
  // data.data.virusTotalCheck chứa kết quả quét
  return data;
};
```

## Files đã tạo/cập nhật

- [services/virusTotalService.js](server/services/virusTotalService.js) - Logic VirusTotal
- [controllers/urlCheckerController.js](server/controllers/urlCheckerController.js) - URL checker endpoints
- [routes/urlCheckerRoutes.js](server/routes/urlCheckerRoutes.js) - Routes
- [controllers/reportController.js](server/controllers/reportController.js) - Tích hợp auto-check
- [server.js](server/server.js) - Thêm routes mới
- [.env](server/.env) - Thêm VIRUSTOTAL_API_KEY

## Lưu ý

- API key miễn phí có giới hạn: 4 requests/minute
- URL phải được mã hóa Base64 theo chuẩn VirusTotal
- Backend sử dụng Node.js Buffer thay vì btoa()
- Không cần CORS proxy vì chạy server-side
