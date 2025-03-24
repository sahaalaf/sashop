const express = require("express");
const Stripe = require("stripe");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-payment-intent", authenticateToken, async (req, res) => {
  const { amount } = req.body;

  console.log("Received request to create payment intent. Amount:", amount);

  try {
    if (!amount || amount <= 0) {
      console.error("Invalid amount:", amount);
      return res.status(400).json({ error: "Invalid amount" });
    }

    console.log("Creating payment intent with Stripe...");
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    console.log("Payment Intent Created:", paymentIntent);

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Stripe Error:", error.message);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
