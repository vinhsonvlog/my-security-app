# Security App Backend

A complete Express.js backend server with MongoDB, JWT authentication, and admin features for managing security reports.

## Features

✅ **Task 1**: Express.js project with CORS, body-parser, and MVC structure
✅ **Task 2**: MongoDB connection with Mongoose and Global Error Handler
✅ **Task 3**: User Schema (Username, Email, hashed Password, Role)
✅ **Task 4**: Register API with bcryptjs password encryption
✅ **Task 5**: Login API with JWT token generation
✅ **Task 6**: JWT authentication middleware
✅ **Task 7**: RBAC middleware for admin-only routes
✅ **Task 8**: Get pending reports API
✅ **Task 9**: Approve/Reject reports API (moves to Blacklist)
✅ **Task 10**: Get admin profile API

## Project Structure

```
server/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── adminController.js   # Admin operations
│   └── reportController.js  # Report management
├── middleware/
│   ├── auth.js             # JWT & RBAC middleware
│   └── errorHandler.js     # Global error handler
├── models/
│   ├── User.js             # User schema
│   ├── Report.js           # Report schema
│   └── Blacklist.js        # Blacklist schema
├── routes/
│   ├── authRoutes.js       # Auth endpoints
│   ├── adminRoutes.js      # Admin endpoints
│   └── reportRoutes.js     # Report endpoints
├── utils/
│   └── generateToken.js    # JWT token generator
├── .env                    # Environment variables
├── server.js               # Main application
└── package.json
```

## Installation

1. Make sure MongoDB is installed and running locally
2. Install dependencies (already done):
   ```bash
   npm install
   ```

## Environment Variables

Update `.env` file with your configurations:
```
NODE_ENV=development
PORT=1124
MONGODB_URI=mongodb://localhost:27017/security-app
JWT_SECRET=your_jwt_secret_key_change_this_in_production_12345
```

## Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login user |
| GET | `/api/auth/profile` | Private | Get user profile |

### Report Routes (`/api/reports`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/reports` | Private | Submit new report |
| GET | `/api/reports/my-reports` | Private | Get user's reports |

### Admin Routes (`/api/admin`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/admin/reports/pending` | Admin | Get pending reports |
| GET | `/api/admin/reports` | Admin | Get all reports |
| POST | `/api/admin/reports/:id/approve` | Admin | Approve report |
| POST | `/api/admin/reports/:id/reject` | Admin | Reject report |
| GET | `/api/admin/blacklist` | Admin | Get blacklist |
| DELETE | `/api/admin/blacklist/:id` | Admin | Remove from blacklist |

## API Usage Examples

### 1. Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@example.com",
  "password": "password123",
  "role": "admin"
}
```

### 2. Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

Response includes JWT token:
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Get Profile (Protected Route)
```bash
GET /api/auth/profile
Authorization: Bearer <your_jwt_token>
```

### 4. Submit Report
```bash
POST /api/reports
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "url": "https://malicious-site.com",
  "reason": "Phishing attempt"
}
```

### 5. Get Pending Reports (Admin Only)
```bash
GET /api/admin/reports/pending
Authorization: Bearer <admin_jwt_token>
```

### 6. Approve Report (Admin Only)
```bash
POST /api/admin/reports/:reportId/approve
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

{
  "adminNote": "Verified as malicious",
  "severity": "high"
}
```

### 7. Reject Report (Admin Only)
```bash
POST /api/admin/reports/:reportId/reject
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

{
  "adminNote": "False positive"
}
```

## Database Models

### User Model
- `username` (String, unique, required)
- `email` (String, unique, required)
- `password` (String, hashed, required)
- `role` (String: 'user' or 'admin')
- `createdAt` (Date)

### Report Model
- `url` (String, required)
- `reportedBy` (ObjectId → User)
- `reporterEmail` (String)
- `reason` (String, required)
- `status` (String: 'pending', 'approved', 'rejected')
- `reviewedBy` (ObjectId → User)
- `reviewedAt` (Date)
- `adminNote` (String)
- `createdAt` (Date)

### Blacklist Model
- `url` (String, unique, required)
- `reportId` (ObjectId → Report)
- `reportedBy` (ObjectId → User)
- `reason` (String)
- `approvedBy` (ObjectId → User)
- `approvedAt` (Date)
- `severity` (String: 'low', 'medium', 'high', 'critical')
- `createdAt` (Date)

## Security Features

- Password hashing using bcryptjs (10 salt rounds)
- JWT token-based authentication
- Role-Based Access Control (RBAC)
- Protected routes requiring authentication
- Admin-only routes for sensitive operations
- Global error handling
- Input validation

## Notes

- Default JWT token expiration: 30 days
- MongoDB connection uses Mongoose
- CORS enabled for cross-origin requests
- Body parser for JSON and URL-encoded data
- Error responses include stack trace in development mode only

## Next Steps

1. Start MongoDB: `mongod` (or use MongoDB Atlas)
2. Run the server: `npm run dev`
3. Test the API endpoints using Postman or similar tool
4. Create an admin user first to access admin routes
5. Connect your frontend application
