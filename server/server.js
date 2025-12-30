require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reportRoutes = require('./routes/reportRoutes');
const urlCheckerRoutes = require('./routes/urlCheckerRoutes');
const quizRoutes = require('./routes/quizRoutes');
const postRoutes = require('./routes/postRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const eventRoutes = require('./routes/eventRoutes');
const blacklistRoutes = require('./routes/blacklistRoutes');
const searchRoutes = require('./routes/searchRoutes');
const statsRoutes = require('./routes/statsRoutes');
const newsfeedRoutes = require('./routes/newsfeedRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));

// Tăng giới hạn payload size cho việc upload hình ảnh base64
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Security App API',
    version: '1.0.0'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/url-checker', urlCheckerRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/blacklist', blacklistRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/newsfeed', newsfeedRoutes);
app.use('/api/upload', uploadRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 1124;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
