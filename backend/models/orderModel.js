const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  name: { type: String, required: true },
  image: { type: String, required: true },
});

const shippingInfoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
});

const paymentInfoSchema = new mongoose.Schema({
  paymentMethod: { type: String, enum: ["stripe", "cod"], required: true },
  stripePaymentId: { type: String },
  status: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    shippingInfo: shippingInfoSchema,
    paymentInfo: paymentInfoSchema,
    itemsPrice: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true, default: 0 },
    orderStatus: {
      type: String,
      enum: ["processing", "shipped", "delivered", "cancelled"],
      default: "processing",
    },
    deliveredAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Calculate prices before saving
orderSchema.pre("save", function (next) {
  this.itemsPrice = this.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  this.totalPrice = this.itemsPrice + this.shippingPrice;
  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
