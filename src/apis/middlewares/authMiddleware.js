const jwt = require('jsonwebtoken');
const User = require('../../models/User');

const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // Find user by id
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }

    // Add user to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      isAdmin: user.role === 'admin' // Add a convenience flag for admin checks
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  next();
};

const isManager = (req, res, next) => {
  if (!req.user || (req.user.role !== 'manager' && req.user.role !== 'admin')) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Manager privileges required.'
    });
  }
  next();
};

module.exports = {
  authenticate,
  isAdmin,
  isManager
};