const express = require("express");
const authenticateToken = require("../middleware/authenticateToken");
const User = require("../models/userModel");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Configure multer for profile picture uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profilePics/");
  },
  filename: (req, file, cb) => {
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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter,
});

// Get all users (admin only)
router.get("/", authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const users = await User.find()
      .select("username email role createdAt") // Select only needed fields
      .sort({ createdAt: -1 }); // Sort by creation date descending

    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Get current user details (for role checking)
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "username email role"
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Get user profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate(
        "orders",
        "itemsPrice shippingPrice totalPrice orderStatus createdAt items"
      );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log("Fetched user profile:", user);
    res.json(user);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Update user profile
router.put(
  "/profile",
  authenticateToken,
  upload.single("profilePic"),
  async (req, res) => {
    try {
      console.log("Uploaded file:", req.file);
      const { username, email } = req.body;
      const updates = {};

      if (username) updates.username = username;
      if (email) updates.email = email;
      if (req.file)
        updates.profilePic = `/uploads/profilePics/${req.file.filename}`;

      const user = await User.findByIdAndUpdate(req.user._id, updates, {
        new: true,
        runValidators: true,
      }).select("-password");

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      console.log("Updated user with profilePic:", user.profilePic);
      res.json(user);
    } catch (err) {
      console.error("Error updating profile:", err);
      if (err.code === 11000) {
        return res.status(400).json({
          error: "Username or email already exists",
          field: err.keyValue,
        });
      }
      res.status(500).json({ error: "Server error", details: err.message });
    }
  }
);

module.exports = router;
