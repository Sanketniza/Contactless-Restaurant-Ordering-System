const jwt = require('jsonwebtoken');
const User = require('../models/User');
const createError = require('http-errors');

// Protect routes - only authenticated users can access
exports.protect = async (req, res, next) => {
  let token;
  
  // Check if token exists in Authorization header or in cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Get token from header
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    // Get token from cookie
    token = req.cookies.token;
  }

  // Check if token exists
  if (!token) {
    return next(createError(401, 'Not authorized to access this route'));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user to request object
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      return next(createError(404, 'User not found'));
    }
    
    next();
  } catch (error) {
    return next(createError(401, 'Not authorized to access this route'));
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(createError(401, 'Not authorized to access this route'));
    }
    
    if (!roles.includes(req.user.role)) {
      return next(createError(403, `User role ${req.user.role} is not authorized to access this route`));
    }
    
    next();
  };
};
