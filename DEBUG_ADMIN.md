# 🔧 Khắc phục vấn đề Admin không vào được Dashboard

## 📋 Thông tin Admin Account

**Email:** `admin@gmail.com`  
**Password:** `admin123`  
**Role:** `admin`

## 🐛 Debug Steps

### 1. Mở Browser Console
- Truy cập: http://localhost:5174 (hoặc port Vite hiển thị)
- Nhấn F12 → Console tab

### 2. Test Login với Admin
1. Đi đến trang Login: http://localhost:5174/login
2. Điền thông tin:
   - Email: `admin@gmail.com`
   - Password: `admin123`
3. Click "Đăng nhập"
4. Quan sát Console để xem debug info

### 3. Kiểm tra localStorage
Trong Console, chạy:
```javascript
// Kiểm tra dữ liệu đã lưu
localStorage.getItem('token')
localStorage.getItem('user')

// Hoặc chạy debug function
debugAuth()
```

### 4. Test trực tiếp Dashboard
1. Sau khi login thành công, thử truy cập: http://localhost:5174/dashboard
2. Quan sát Console để xem debug info từ Dashboard component

## 🔍 Các vấn đề có thể xảy ra

### ❌ Vấn đề 1: User data không có role
**Dấu hiệu:** Console hiển thị `Role: undefined`  
**Nguyên nhân:** Backend không trả về role trong response  
**Khắc phục:** Đã kiểm tra - backend OK ✅

### ❌ Vấn đề 2: isAdmin() trả về false
**Dấu hiệu:** `isAdmin check: false`  
**Nguyên nhân:** Logic kiểm tra role sai  
**Khắc phục:** Đã kiểm tra - logic OK ✅

### ❌ Vấn đề 3: Token expired
**Dấu hiệu:** API calls fail với 401  
**Nguyên nhân:** JWT token hết hạn  
**Khắc phục:** Login lại

### ❌ Vấn đề 4: localStorage bị clear
**Dấu hiệu:** `No user data in localStorage`  
**Nguyên nhân:** localStorage bị xóa hoặc không lưu được  
**Khắc phục:** Login lại

## 🛠️ Quick Fix

Nếu vẫn không vào được Dashboard, thử:

1. **Clear localStorage:**
   ```javascript
   localStorage.clear()
   ```

2. **Login lại với admin account**

3. **Check Console output** để xem debug info

## 📞 Nếu vẫn không được

Chạy lệnh này trong terminal để kiểm tra database:
```bash
cd server
node check-admin.js
```

Nó sẽ hiển thị tất cả users và confirm admin account tồn tại.

## 🎯 Expected Behavior

Sau khi login thành công với admin:
1. ✅ Chuyển hướng đến `/dashboard`
2. ✅ Dashboard hiển thị (không redirect về home)
3. ✅ Console hiển thị: `✅ User is admin, loading reports`

## 📝 Logs cần check

Trong Console, bạn sẽ thấy:
```
🔍 Dashboard useEffect triggered
🔍 Debugging Authentication...
📦 localStorage: [token info]
👤 Parsed user object: [user info]
✅ isAdmin check: true
✅ User is admin, loading reports
```