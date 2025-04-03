const express = require("express");
const Review = require("../models/reviewModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const router = express.Router();

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check for either _id or id in the decoded token
    const userId = decoded._id || decoded.id;
    if (!userId) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const userExists = await mongoose.model("User").exists({ _id: userId });
    if (!userExists) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = { id: userId };
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({
      message:
        error.name === "JsonWebTokenError"
          ? "Invalid token"
          : "Invalid or expired token",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

router.get("/products/:productId/reviews", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const reviews = await Review.find({ productId: req.params.productId })
      .populate("user", "username profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({
      message: "Failed to fetch reviews",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

router.post(
  "/products/:productId/reviews",
  authMiddleware,
  async (req, res) => {
    try {
      const { rating, comment } = req.body;
      const { productId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      if (typeof rating !== "number" || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be 1-5" });
      }

      if (!comment || comment.trim().length < 10) {
        return res
          .status(400)
          .json({ message: "Comment must be at least 10 characters" });
      }

      const review = new Review({
        productId,
        user: req.user.id,
        rating,
        comment: comment.trim(),
      });

      await review.save();
      const populatedReview = await Review.findById(review._id).populate(
        "user",
        "username profilePic"
      );

      res.status(201).json(populatedReview);
    } catch (error) {
      console.error("Submit review error:", error);
      res.status(500).json({
        message: "Failed to submit review",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
);

module.exports = router;
