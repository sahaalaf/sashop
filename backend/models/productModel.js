const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  isNewArrival: { type: Boolean, required: true, default: false },
  isTopSelling: { type: Boolean, required: true, default: false },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
