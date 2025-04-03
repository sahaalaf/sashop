const express = require("express");
const Stripe = require("stripe");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-payment-intent", authenticateToken, async (req, res) => {
  const { amount, shippingInfo, paymentMethodId } = req.body;

  try {
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    if (shippingInfo?.country && !/^[A-Z]{2}$/.test(shippingInfo.country)) {
      return res.status(400).json({ error: "Invalid country code format" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method: paymentMethodId, // Attach the payment method
      automatic_payment_methods: { enabled: true }, // Still enable for flexibility
      shipping: shippingInfo
        ? {
            name: shippingInfo.name,
            address: {
              line1: shippingInfo.address,
              city: shippingInfo.city,
              postal_code: shippingInfo.postalCode,
              country: shippingInfo.country,
            },
            phone: shippingInfo.phone,
          }
        : undefined,
      metadata: {
        customer_email: shippingInfo?.email || "",
      },
      confirm: false, // Let client confirm
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({
      error: "Payment processing failed",
      details: error.message,
    });
  }
});

module.exports = router;
