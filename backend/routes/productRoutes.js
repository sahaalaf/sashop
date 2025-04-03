const express = require("express");
const Product = require("../models/productModel");
const authenticateToken = require("../middleware/authenticateToken"); // Updated path to match your naming
const restrictToAdmin = require("../middleware/restrictToAdmin"); // New middleware
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Serve static files from the uploads directory
router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// 📦 Fetch All Products (Public)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📦 Fetch Single Product (Public)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🛍️ Add Product (Admin Only)
router.post("/", authenticateToken, restrictToAdmin, async (req, res) => {
  try {
    const {
      name,
      brand,
      price,
      image,
      description,
      quantity,
      isNewArrival,
      isTopSelling,
      networkTechnology,
      displaySize,
      displayResolution,
      OS,
      CPU,
      RAM,
      internalMemory,
      primaryCamera,
      battery,
      approxPriceEUR,
    } = req.body;

    if (!image) {
      return res.status(400).json({ error: "Image URL is required" });
    }

    // Download the image
    const imageResponse = await axios({
      url: image,
      method: "GET",
      responseType: "stream",
    }).catch((err) => {
      throw new Error("Failed to fetch image: " + err.message);
    });

    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Save the image locally
    const imagePath = `/uploads/${Date.now()}-product-image.png`;
    const fullPath = path.join(__dirname, "..", imagePath);
    const writer = fs.createWriteStream(fullPath);
    imageResponse.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", (err) =>
        reject(new Error("Failed to save image: " + err.message))
      );
    });

    const newProduct = new Product({
      name,
      brand,
      price,
      image: imagePath,
      description,
      quantity,
      isNewArrival: isNewArrival === "true" || isNewArrival === true,
      isTopSelling: isTopSelling === "true" || isTopSelling === true,
      networkTechnology,
      displaySize,
      displayResolution,
      OS,
      CPU,
      RAM,
      internalMemory,
      primaryCamera,
      battery,
      approxPriceEUR,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✏️ Update Product (Admin Only)
router.put("/:id", authenticateToken, restrictToAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      brand,
      price,
      image,
      description,
      quantity,
      isNewArrival,
      isTopSelling,
      networkTechnology,
      displaySize,
      displayResolution,
      OS,
      CPU,
      RAM,
      internalMemory,
      primaryCamera,
      battery,
      approxPriceEUR,
    } = req.body;

    // Fetch the existing product to preserve the old image if not updated
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    let imagePath = existingProduct.image; // Default to existing image
    if (image && image !== existingProduct.image) {
      // Only process if image is new
      const imageResponse = await axios({
        url: image,
        method: "GET",
        responseType: "stream",
      }).catch((err) => {
        throw new Error("Failed to fetch image: " + err.message);
      });

      const uploadsDir = path.join(__dirname, "../uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      imagePath = `/uploads/${Date.now()}-product-image.png`;
      const fullPath = path.join(__dirname, "..", imagePath);
      const writer = fs.createWriteStream(fullPath);
      imageResponse.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", (err) =>
          reject(new Error("Failed to save image: " + err.message))
        );
      });

      // Delete the old image if it exists and is local
      if (
        existingProduct.image &&
        existingProduct.image.startsWith("/uploads")
      ) {
        const oldImagePath = path.join(__dirname, "..", existingProduct.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    const updatedProduct = {
      name,
      brand,
      price,
      image: imagePath,
      description,
      quantity,
      isNewArrival: isNewArrival === "true" || isNewArrival === true,
      isTopSelling: isTopSelling === "true" || isTopSelling === true,
      networkTechnology,
      displaySize,
      displayResolution,
      OS,
      CPU,
      RAM,
      internalMemory,
      primaryCamera,
      battery,
      approxPriceEUR,
    };

    const product = await Product.findByIdAndUpdate(id, updatedProduct, {
      new: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🗑️ Delete Product (Admin Only)
router.delete("/:id", authenticateToken, restrictToAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete the associated image file if it exists
    if (product.image && product.image.startsWith("/uploads")) {
      const imagePath = path.join(__dirname, "..", product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// 📦 Check Stock (Authenticated Users)
router.post("/check-stock", authenticateToken, async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: "Items array is required" });
    }

    const results = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item._id || item.productId);
        if (!product) {
          return {
            productId: item._id || item.productId,
            available: false,
            message: "Product not found",
          };
        }
        return {
          productId: item._id || item.productId,
          name: product.name,
          brand: product.brand,
          available: product.quantity >= item.quantity,
          availableQuantity: product.quantity,
          requestedQuantity: item.quantity,
          image: product.image,
          price: product.price,
          approxPriceEUR: product.approxPriceEUR,
        };
      })
    );

    const outOfStockItems = results.filter((item) => !item.available);
    const inStock = outOfStockItems.length === 0;

    res.json({
      success: true,
      inStock,
      results,
      outOfStockItems,
      message: inStock
        ? "All items are in stock"
        : "Some items are out of stock",
    });
  } catch (err) {
    console.error("Stock check error:", err);
    res.status(500).json({
      error: "Stock check failed",
      details: err.message,
    });
  }
});

module.exports = router;
