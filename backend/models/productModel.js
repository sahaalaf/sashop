const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  isNewArrival: { type: Boolean, default: false },
  isTopSelling: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },

  networkTechnology: { type: String },
  displaySize: { type: String },
  displayResolution: { type: String },
  OS: { type: String },
  CPU: { type: String },
  RAM: { type: String },
  internalMemory: { type: String },
  primaryCamera: { type: String },
  battery: { type: String },
  approxPriceEUR: { type: Number },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
