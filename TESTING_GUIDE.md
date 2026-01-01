# HƯỚNG DẪN KIỂM THỬ URL CHECKER SAU KHI SỬA LỖI

## Chuẩn bị

### 1. Restart Backend Server
```bash
cd /Users/sonnguyen/Desktop/my-security-app/server
# Stop server hiện tại (Ctrl+C nếu đang chạy)
npm start
# hoặc
node server.js
```

### 2. Restart Frontend
```bash
cd /Users/sonnguyen/Desktop/my-security-app/cyber-security-handbook
npm run dev
```

## Test Cases

### ✅ TEST 1: Gmail Links (Trusted Domain)
**Input:**
```
https://mail.google.com/mail/u/0/#inbox/FMfcgzQdzwFzfjPvjpVgcKcLxsJRW
```

**Kết quả mong đợi:**
- ✅ Icon màu xanh lá (CheckCircle)
- ✅ Hiển thị badge "🛡️ TRANG WEB ĐÁNG TIN CẬY"
- ✅ Tiêu đề: "AN TOÀN TUYỆT ĐỐI"
- ✅ Message: "AN TOÀN: Đây là trang web đáng tin cậy..."
- ✅ Cơ sở dữ liệu: "Sạch (Clean)"
- ✅ VirusTotal: Độc hại = 0, Đáng ngờ = 0

---

### ✅ TEST 2: Google Search
**Input:**
```
https://www.google.com/search?q=cyber+security
```

**Kết quả mong đợi:**
- ✅ AN TOÀN TUYỆT ĐỐI
- ✅ Badge trusted domain
- ✅ Không có cảnh báo

---

### ✅ TEST 3: Facebook Profile
**Input:**
```
https://facebook.com/profile.php?id=123456
```

**Kết quả mong đợi:**
- ✅ AN TOÀN TUYỆT ĐỐI
- ✅ Badge trusted domain

---

### ✅ TEST 4: YouTube Video
**Input:**
```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

**Kết quả mong đợi:**
- ✅ AN TOÀN TUYỆT ĐỐI
- ✅ Badge trusted domain

---

### ✅ TEST 5: GitHub Repository
**Input:**
```
https://github.com/user/repo
```

**Kết quả mong đợi:**
- ✅ AN TOÀN TUYỆT ĐỐI
- ✅ Badge trusted domain

---

### ✅ TEST 6: Google Drive Link
**Input:**
```
https://drive.google.com/file/d/1ABC123/view
```

**Kết quả mong đợi:**
- ✅ AN TOÀN TUYỆT ĐỐI
- ✅ Badge trusted domain (vì là subdomain của google.com)

---

### ✅ TEST 7: Subdomain của Trusted Domain
**Input:**
```
https://accounts.google.com/signin
```

**Kết quả mong đợi:**
- ✅ AN TOÀN TUYỆT ĐỐI
- ✅ Badge trusted domain

---

### ⚠️ TEST 8: URL không rõ (không có trong database)
**Input:**
```
https://example-unknown-site.com
```

**Kết quả mong đợi:**
- ℹ️ Tùy thuộc vào VirusTotal
- Nếu VirusTotal chưa quét: "Chưa có dữ liệu về trang này"
- Nếu VirusTotal đã quét và sạch: "AN TOÀN"
- Không có badge trusted domain

---

### ❌ TEST 9: URL giả mạo (nếu có trong blacklist)
**Lưu ý:** Cần có URL này trong blacklist để test

**Input:**
```
https://fake-phishing-site.com
```

**Kết quả mong đợi:**
- ❌ Icon màu đỏ (Warning)
- ❌ Tiêu đề: "PHÁT HIỆN NGUY HIỂM!"
- ❌ Message: "Cảnh báo: URL này đã được xác nhận là lừa đảo"
- ❌ Hiển thị loại scam và mức độ nguy hiểm

---

### ✅ TEST 10: URL không có protocol
**Input:**
```
google.com
```

**Kết quả mong đợi:**
- ✅ AN TOÀN TUYỆT ĐỐI
- ✅ Badge trusted domain
- ✅ Tự động thêm https://

---

### ✅ TEST 11: URL có www
**Input:**
```
www.facebook.com
```

**Kết quả mong đợi:**
- ✅ AN TOÀN TUYỆT ĐỐI
- ✅ Badge trusted domain

---

### ✅ TEST 12: URL với nhiều query params
**Input:**
```
https://google.com/search?q=test&hl=vi&safe=active
```

**Kết quả mong đợi:**
- ✅ AN TOÀN TUYỆT ĐỐI
- ✅ Query params được giữ nguyên, không bị xóa

---

## Kiểm tra Console

### Backend Console
Mở terminal backend và kiểm tra:
- ✅ Không có error
- ✅ Log hiển thị "trusted domain" khi check Gmail/Google
- ✅ Request được xử lý nhanh (< 1s)

### Frontend Console (Browser DevTools)
Mở F12 trong browser:
- ✅ Không có error màu đỏ
- ✅ API calls thành công (status 200)
- ✅ Response có field `trusted: true` cho trusted domains

## Test Response Structure

### Trusted Domain Response
```json
{
  "success": true,
  "source": "trusted",
  "data": {
    "safe": true,
    "trusted": true,
    "message": "AN TOÀN: Đây là trang web đáng tin cậy...",
    "details": {
      "malicious": 0,
      "suspicious": 0,
      "harmless": 0
    }
  }
}
```

### Blacklist Response
```json
{
  "success": true,
  "source": "blacklist",
  "data": {
    "safe": false,
    "message": "CẢNH BÁO: URL này đã bị đưa vào danh sách đen!",
    "details": {
      "reason": "...",
      "severity": "...",
      "blacklisted": true
    }
  }
}
```

### VirusTotal Response
```json
{
  "success": true,
  "source": "virustotal",
  "data": {
    "safe": true/false,
    "message": "...",
    "details": {
      "malicious": 0,
      "suspicious": 0,
      "harmless": 85,
      "undetected": 5,
      "total": 90,
      "percentage": 0
    }
  }
}
```

## Checklist Hoàn Chỉnh

- [ ] Backend server đã restart
- [ ] Frontend dev server đã restart
- [ ] Test Gmail link → ✅ AN TOÀN
- [ ] Test Google link → ✅ AN TOÀN
- [ ] Test Facebook link → ✅ AN TOÀN
- [ ] Test YouTube link → ✅ AN TOÀN
- [ ] Test subdomain (accounts.google.com) → ✅ AN TOÀN
- [ ] Test URL có query params → ✅ Không bị lỗi
- [ ] Test URL có hash → ✅ Không bị lỗi
- [ ] Badge "TRANG WEB ĐÁNG TIN CẬY" hiển thị đúng
- [ ] Không có error trong console
- [ ] Response time < 2s

## Troubleshooting

### Vấn đề: Vẫn báo nguy hiểm cho Gmail
**Giải pháp:**
1. Kiểm tra server đã restart chưa
2. Clear cache browser (Ctrl+Shift+R)
3. Kiểm tra file `urlNormalizer.js` đã có `gmail.com` trong whitelist chưa

### Vấn đề: Badge không hiển thị
**Giải pháp:**
1. Kiểm tra `virusTotalApi.js` đã return `trusted: true` chưa
2. Kiểm tra `UrlChecker.jsx` đã có code hiển thị badge chưa
3. Clear cache và reload

### Vấn đề: Error "isTrustedDomain is not defined"
**Giải pháp:**
1. Kiểm tra export trong `urlNormalizer.js`
2. Kiểm tra import trong các controller
3. Restart server

---

**Lưu ý:** Nếu tất cả test cases đều pass, bug đã được sửa hoàn toàn! 🎉
