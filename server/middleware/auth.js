const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - JWT verification
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        const error = new Error('User not found');
        error.statusCode = 401;
        return next(error);
      }

      next();
    } catch (error) {
      console.error(error);
      const err = new Error('Not authorized, token failed');
      err.statusCode = 401;
      return next(err);
    }
  }

  if (!token) {
    const error = new Error('Not authorized, no token');
    error.statusCode = 401;
    return next(error);
  }
};

// Admin only middleware - RBAC
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    const error = new Error('Not authorized as admin');
    error.statusCode = 403;
    next(error);
  }
};

module.exports = { protect, admin };
