import React, { useState } from "react";
import {
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Swal from "sweetalert2";

const Checkout = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("card"); // Default to card payment
    const [buyerDetails, setBuyerDetails] = useState({
        name: "",
        address: "",
        phone: "",
        email: "",
    });
    const navigate = useNavigate();
    const { cart, setCart } = useCart();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBuyerDetails({ ...buyerDetails, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (paymentMethod === "cod") {
            // Handle COD payment
            setLoading(true);
            try {
                // Validate buyer details
                if (!buyerDetails.name || !buyerDetails.address || !buyerDetails.phone || !buyerDetails.email) {
                    setError("Please fill in all buyer details.");
                    setLoading(false);
                    return;
                }

                // Simulate a successful COD order placement
                await axios.post(
                    "http://localhost:5000/api/orders/create",
                    {
                        items: cart,
                        paymentMethod: "cod",
                        buyerDetails: buyerDetails,
                    },
                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                );

                setCart([]);
                Swal.fire({
                    title: "Success!",
                    text: "Your order has been placed successfully!",
                    icon: "success",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#3085d6",
                }).then(() => {
                    navigate("/");
                });
            } catch (err) {
                console.error("COD Order Failed:", err);
                setError("Order placement failed. Please try again.");
            } finally {
                setLoading(false);
            }
        } else {
            // Handle Stripe payment
            if (!stripe || !elements) {
                console.error("Stripe or Elements not loaded.");
                return;
            }
            setLoading(true);
            setError(null);

            try {
                const { paymentMethod: stripePaymentMethod, error: paymentMethodError } = await stripe.createPaymentMethod({
                    type: "card",
                    card: elements.getElement(CardNumberElement),
                });

                if (paymentMethodError) {
                    console.error("Payment Method Error:", paymentMethodError);
                    setError(paymentMethodError.message);
                    setLoading(false);
                    return;
                }

                const amount = cart.reduce((sum, item) => sum + item.price, 0) * 100;

                const response = await axios.post(
                    "http://localhost:5000/api/stripe/create-payment-intent",
                    {
                        paymentMethodId: stripePaymentMethod.id,
                        amount: amount,
                    },
                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                );

                const { clientSecret } = response.data;
                const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: stripePaymentMethod.id,
                });

                if (confirmError) {
                    console.error("Confirm Payment Error:", confirmError);
                    setError(confirmError.message);
                    setLoading(false);
                    return;
                }

                if (paymentIntent.status === "succeeded") {
                    setCart([]);
                    Swal.fire({
                        title: "Success!",
                        text: "Your order has been placed successfully!",
                        icon: "success",
                        confirmButtonText: "OK",
                        confirmButtonColor: "#3085d6",
                    }).then(() => {
                        navigate("/");
                    });
                }
            } catch (err) {
                console.error("Payment Failed:", err);
                setError("Payment failed. Please try again.");
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-3xl font-bold text-center mb-6">Checkout</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Payment Method Selection */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                        <div className="flex items-center space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="card"
                                    checked={paymentMethod === "card"}
                                    onChange={() => setPaymentMethod("card")}
                                    className="form-radio h-4 w-4 text-blue-600"
                                />
                                <span className="ml-2">Credit/Debit Card</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="cod"
                                    checked={paymentMethod === "cod"}
                                    onChange={() => setPaymentMethod("cod")}
                                    className="form-radio h-4 w-4 text-blue-600"
                                />
                                <span className="ml-2">Cash on Delivery (COD)</span>
                            </label>
                        </div>
                    </div>

                    {/* Buyer Details (Only shown if payment method is COD) */}
                    {paymentMethod === "cod" && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">Buyer Details</h3>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={buyerDetails.name}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={buyerDetails.address}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                    placeholder="Enter your address"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={buyerDetails.phone}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                    placeholder="Enter your phone number"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={buyerDetails.email}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {/* Card Details (Only shown if payment method is card) */}
                    {paymentMethod === "card" && (
                        <>
                            {/* Card Number */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Card Number</label>
                                <div className="p-3 border border-gray-300 rounded-lg">
                                    <CardNumberElement
                                        options={{
                                            style: {
                                                base: {
                                                    fontSize: "16px",
                                                    color: "#424770",
                                                    "::placeholder": {
                                                        color: "#aab7c4",
                                                    },
                                                },
                                                invalid: {
                                                    color: "#9e2146",
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Expiration Date and CVC */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Expiration Date</label>
                                    <div className="p-3 border border-gray-300 rounded-lg">
                                        <CardExpiryElement
                                            options={{
                                                style: {
                                                    base: {
                                                        fontSize: "16px",
                                                        color: "#424770",
                                                        "::placeholder": {
                                                            color: "#aab7c4",
                                                        },
                                                    },
                                                    invalid: {
                                                        color: "#9e2146",
                                                    },
                                                },
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">CVC</label>
                                    <div className="p-3 border border-gray-300 rounded-lg">
                                        <CardCvcElement
                                            options={{
                                                style: {
                                                    base: {
                                                        fontSize: "16px",
                                                        color: "#424770",
                                                        "::placeholder": {
                                                            color: "#aab7c4",
                                                        },
                                                    },
                                                    invalid: {
                                                        color: "#9e2146",
                                                    },
                                                },
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Pay Now Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        {loading ? "Processing..." : paymentMethod === "cod" ? "Place Order (COD)" : "Pay Now"}
                    </button>
                </form>

                {/* Error Message */}
                {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
            </div>
        </div>
    );
};

export default Checkout;