require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const stripeRoutes = require("./routes/stripeRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();
connectDB();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api", reviewRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🌐 Server running on http://localhost:${PORT}`)
);
