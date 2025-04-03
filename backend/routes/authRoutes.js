const express = require("express");
const multer = require("multer");
const path = require("path");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profilePics/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter,
});

// Helper function to handle errors
const handleError = (res, err) => {
  console.error("Error:", err);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, error: err.message });
  }
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((el) => el.message);
    return res.status(400).json({ success: false, error: errors.join(", ") });
  }
  res.status(500).json({
    success: false,
    error: err.message || "An unexpected error occurred",
  });
};

// Register endpoint
router.post("/register", upload.single("profilePic"), async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const profilePic = req.file
      ? `/uploads/profilePics/${req.file.filename}`
      : "";

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User already exists",
        field: existingUser.email === email ? "email" : "username",
      });
    }

    const user = await User.create({
      username,
      email,
      password,
      profilePic,
      role: "user",
    });

    const token = jwt.sign(
      { _id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        role: user.role,
        token,
      },
    });
  } catch (err) {
    handleError(res, err);
  }
});

// Login endpoint
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: "Username and password are required",
      });
    }

    const user = await User.findOne({ username }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      success: true,
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
      role: user.role,
      token,
    });
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;
