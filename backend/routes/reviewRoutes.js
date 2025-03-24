const express = require("express");
const Review = require("../models/reviewModel");
const router = express.Router();

// Get all reviews for a specific product
router.get("/products/:productId/reviews", async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error });
  }
});

// Submit a new review for a product
router.post("/products/:productId/reviews", async (req, res) => {
  try {
    const { user, rating, comment } = req.body;
    const newReview = new Review({
      productId: req.params.productId,
      user,
      rating,
      comment,
    });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: "Error submitting review", error });
  }
});

module.exports = router;
