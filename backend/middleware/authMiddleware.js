const jwt = require("jsonwebtoken");

const JWT_SECRET = "exitease_secret_key";

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        message: "Authentication token is required",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

const requireEmployee = (req, res, next) => {
  if (req.user.role !== "employee") {
    return res.status(403).json({
      message: "Employee access required",
    });
  }

  next();
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required",
    });
  }

  next();
};

module.exports = {
  authenticate,
  requireEmployee,
  requireAdmin,
};