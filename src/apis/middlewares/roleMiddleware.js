const jwt = require('jsonwebtoken');

const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // Lấy role của user từ req.user (đã được set bởi authMiddleware)
      const userRole = req.user.role;
      
      if (!userRole || !allowedRoles.includes(userRole)) {
        return res.status(403).json({ 
          message: `Forbidden: Required roles [${allowedRoles.join(', ')}]` 
        });
      }
      
      next();
    } catch (error) {
      return res.status(403).json({ 
        message: 'Forbidden: Role check failed' 
      });
    }
  };
};

module.exports = roleMiddleware;