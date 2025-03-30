const jwt = require("jsonwebtoken");

const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      req.user = decoded;

      // Kiểm tra vai trò người dùng
      if (allowedRoles.includes(req.user.role)) {
        next();
      } else {
        return res.status(403).json({ 
          message: `Access denied: Requires one of roles [${allowedRoles.join(', ')}]` 
        });
      }
    });
  };
};

module.exports = roleMiddleware;