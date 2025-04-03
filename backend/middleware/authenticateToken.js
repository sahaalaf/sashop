const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authenticateToken = async (req, res, next) => {
  try {
    console.log("Auth headers:", req.headers);

    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      console.log("No Bearer token found");
      return res.status(401).json({
        error: "Authorization header missing or invalid",
        received: authHeader,
      });
    }

    const token = authHeader.split(" ")[1];
    console.log("Token received:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      console.log("User not found for ID:", decoded._id);
      return res.status(404).json({ error: "User not found" });
    }

    console.log("Authenticated user:", {
      username: user.username,
      role: user.role,
    });
    req.user = user;
    next();
  } catch (err) {
    console.error("Authentication error:", err);

    if (err.name === "TokenExpiredError") {
      return res.status(403).json({ error: "Token expired" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(403).json({ error: "Invalid token" });
    }
    res.status(500).json({
      error: "Authentication failed",
      details: err.message,
    });
  }
};

module.exports = authenticateToken;
