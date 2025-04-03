const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const authenticateToken = require("../middleware/authenticateToken");
const restrictToAdmin = require("../middleware/restrictToAdmin");
const router = express.Router();

// Order creation (accessible to all authenticated users)
router.post("/", authenticateToken, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      items,
      shippingInfo,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      stripePaymentId,
    } = req.body;

    if (!items?.length) {
      await session.abortTransaction();
      return res.status(400).json({ error: "Items are required" });
    }
    if (!shippingInfo) {
      await session.abortTransaction();
      return res.status(400).json({ error: "Shipping info is required" });
    }
    if (!["stripe", "cod"].includes(paymentMethod)) {
      await session.abortTransaction();
      return res.status(400).json({ error: "Invalid payment method" });
    }

    for (const item of items) {
      const product = await Product.findById(
        item._id || item.productId
      ).session(session);
      if (!product) {
        await session.abortTransaction();
        return res
          .status(400)
          .json({ error: `Product ${item._id || item.productId} not found` });
      }
      if (product.quantity < item.quantity) {
        await session.abortTransaction();
        return res.status(400).json({
          error: `Not enough stock for ${product.name}. Available: ${product.quantity}`,
        });
      }
    }

    const order = new Order({
      user: req.user._id,
      items: items.map((item) => ({
        productId: item._id || item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      shippingInfo,
      paymentInfo: {
        paymentMethod,
        status: paymentMethod === "cod" ? "pending" : "paid",
        ...(paymentMethod === "stripe" && { stripePaymentId }),
      },
      itemsPrice,
      shippingPrice,
      totalPrice,
      orderStatus: "processing",
    });

    const createdOrder = await order.save({ session });

    for (const item of items) {
      await Product.findByIdAndUpdate(
        item._id || item.productId,
        { $inc: { quantity: -item.quantity } },
        { session }
      );
    }

    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { orders: createdOrder._id } },
      { session }
    );

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      order: createdOrder,
    });
  } catch (err) {
    await session.abortTransaction();
    console.error("Order creation error:", err);
    res.status(500).json({
      error: "Order creation failed",
      details: err.message,
    });
  } finally {
    session.endSession();
  }
});

// Fetch all orders (admin only)
router.get("/", authenticateToken, restrictToAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch orders", details: err.message });
  }
});

// Fetch revenue data (admin only)
router.get("/revenue", authenticateToken, restrictToAdmin, async (req, res) => {
  try {
    const revenue = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const labels = revenue.map((item) => item._id);
    const data = revenue.map((item) => item.total / 100);

    res.status(200).json({ labels, data });
  } catch (err) {
    console.error("Error fetching revenue:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch revenue", details: err.message });
  }
});

// Update order status (admin only)
router.put(
  "/:id/status",
  authenticateToken,
  restrictToAdmin,
  async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { status } = req.body;
      const validStatuses = ["processing", "shipped", "delivered", "cancelled"];

      if (!validStatuses.includes(status)) {
        await session.abortTransaction();
        return res.status(400).json({ error: "Invalid status value" });
      }

      const order = await Order.findById(req.params.id).session(session);

      if (!order) {
        await session.abortTransaction();
        return res.status(404).json({ error: "Order not found" });
      }

      if (status === "cancelled" && order.orderStatus !== "cancelled") {
        for (const item of order.items) {
          await Product.findByIdAndUpdate(
            item.productId,
            { $inc: { quantity: item.quantity } },
            { session }
          );
        }
      }

      order.orderStatus = status;
      order.updatedAt = Date.now();

      const updatedOrder = await order.save({ session });

      await session.commitTransaction();

      res.status(200).json({
        success: true,
        order: updatedOrder,
      });
    } catch (err) {
      await session.abortTransaction();
      console.error("Order status update error:", err);
      res.status(500).json({
        error: "Failed to update order status",
        details: err.message,
      });
    } finally {
      session.endSession();
    }
  }
);

module.exports = router;
