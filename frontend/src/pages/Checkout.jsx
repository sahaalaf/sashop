import React, { useState, useEffect } from "react";
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
import ShippingForm from "../components/ShippingForm";
import { FaSpinner, FaShoppingBag, FaBox, FaArrowRight, FaCreditCard, FaMoneyBillWave } from "react-icons/fa";

const stripeStyles = `
  :root {
    --colorIconCardCvc: #6b7280;
  }
  .StripeElement {
    background-color: #e5e7eb; /* gray-200 */
    padding: 12px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 16px;
    color: #6b7280;
  }
  .StripeElement--focus {
    border-color: #a1a1aa;
    outline: none;
  }
  .StripeElement--invalid {
    border-color: #ef4444;
    color: #ef4444;
  }
  .card-logos {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    gap: 4px;
  }
  .card-logos img {
    height: 20px;
  }
  .cvc-container {
    position: relative;
  }
  .cvc-icon {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
  }
  .cvc-icon svg {
    width: 24px;
    height: 24px;
  }
  .label {
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  .disclaimer {
    font-size: 12px;
    color: #6b7280;
    margin-top: 16px;
  }
`;

const Checkout = () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const { cart, clearCart } = useCart();

    const [state, setState] = useState({
        loading: false,
        error: null,
        paymentMethod: "stripe",
        shippingInfo: null,
        step: "shipping",
        stockStatus: null,
    });

    const [orderSummary, setOrderSummary] = useState({
        itemsPrice: 0,
        shippingPrice: 5.0,
        totalPrice: 0,
    });

    const backgroundStyle = {
        backgroundImage: `
            linear-gradient(158deg, rgba(84, 84, 84, 0.03) 0%, rgba(84, 84, 84, 0.03) 20%,rgba(219, 219, 219, 0.03) 20%, rgba(219, 219, 219, 0.03) 40%,rgba(54, 54, 54, 0.03) 40%, rgba(54, 54, 54, 0.03) 60%,rgba(99, 99, 99, 0.03) 60%, rgba(99, 99, 99, 0.03) 80%,rgba(92, 92, 92, 0.03) 80%, rgba(92, 92, 92, 0.03) 100%),
            linear-gradient(45deg, rgba(221, 221, 221, 0.02) 0%, rgba(221, 221, 221, 0.02) 14.286%,rgba(8, 8, 8, 0.02) 14.286%, rgba(8, 8, 8, 0.02) 28.572%,rgba(52, 52, 52, 0.02) 28.572%, rgba(52, 52, 52, 0.02) 42.858%,rgba(234, 234, 234, 0.02) 42.858%, rgba(234, 234, 234, 0.02) 57.144%,rgba(81, 81, 81, 0.02) 57.144%, rgba(81, 81, 81, 0.02) 71.42999999999999%,rgba(239, 239, 239, 0.02) 71.43%, rgba(239, 239, 239, 0.02) 85.71600000000001%,rgba(187, 187, 187, 0.02) 85.716%, rgba(187, 187, 187, 0.02) 100.002%),
            linear-gradient(109deg, rgba(33, 33, 33, 0.03) 0%, rgba(33, 33, 33, 0.03) 12.5%,rgba(147, 147, 147, 0.03) 12.5%, rgba(147, 147, 147, 0.03) 25%,rgba(131, 131, 131, 0.03) 25%, rgba(131, 131, 131, 0.03) 37.5%,rgba(151, 151, 151, 0.03) 37.5%, rgba(151, 151, 151, 0.03) 50%,rgba(211, 211, 211, 0.03) 50%, rgba(211, 211, 211, 0.03) 62.5%,rgba(39, 39, 39, 0.03) 62.5%, rgba(39, 39, 39, 0.03) 75%,rgba(55, 55, 55, 0.03) 75%, rgba(55, 55, 55, 0.03) 87.5%,rgba(82, 82, 82, 0.03) 87.5%, rgba(82, 82, 82, 0.03) 100%),
            linear-gradient(348deg, rgba(42, 42, 42, 0.02) 0%, rgba(42, 42, 42, 0.02) 20%,rgba(8, 8, 8, 0.02) 20%, rgba(8, 8, 8, 0.02) 40%,rgba(242, 242, 242, 0.02) 40%, rgba(242, 242, 242, 0.02) 60%,rgba(42, 42, 42, 0.02) 60%, rgba(42, 42, 42, 0.02) 80%,rgba(80, 80, 80, 0.02) 80%, rgba(80, 80, 80, 0.02) 100%),
            linear-gradient(120deg, rgba(106, 106, 106, 0.03) 0%, rgba(106, 106, 106, 0.03) 14.286%,rgba(67, 67, 67, 0.03) 14.286%, rgba(67, 67, 67, 0.03) 28.572%,rgba(134, 134, 134, 0.03) 28.572%, rgba(134, 134, 134, 0.03) 42.858%,rgba(19, 19, 19, 0.03) 42.858%, rgba(19, 19, 19, 0.03) 57.144%,rgba(101, 101, 101, 0.03) 57.144%, rgba(101, 101, 101, 0.03) 71.42999999999999%,rgba(205, 205, 205, 0.03) 71.43%, rgba(205, 205, 205, 0.03) 85.71600000000001%,rgba(53, 53, 53, 0.03) 85.716%, rgba(53, 53, 53, 0.03) 100.002%),
            linear-gradient(45deg, rgba(214, 214, 214, 0.03) 0%, rgba(214, 214, 214, 0.03) 16.667%,rgba(255, 255, 255, 0.03) 16.667%, rgba(255, 255, 255, 0.03) 33.334%,rgba(250, 250, 250, 0.03) 33.334%, rgba(250, 250, 250, 0.03) 50.001000000000005%,rgba(231, 231, 231, 0.03) 50.001%, rgba(231, 231, 231, 0.03) 66.668%,rgba(241, 241, 241, 0.03) 66.668%, rgba(241, 241, 241, 0.03) 83.33500000000001%,rgba(31, 31, 31, 0.03) 83.335%, rgba(31, 31, 31, 0.03) 100.002%),
            linear-gradient(59deg, rgba(224, 224, 224, 0.03) 0%, rgba(224, 224, 224, 0.03) 12.5%,rgba(97, 97, 97, 0.03) 12.5%, rgba(97, 97, 97, 0.03) 25%,rgba(143, 143, 143, 0.03) 25%, rgba(143, 143, 143, 0.03) 37.5%,rgba(110, 110, 110, 0.03) 37.5%, rgba(110, 110, 110, 0.03) 50%,rgba(34, 34, 34, 0.03) 50%, rgba(34, 34, 34, 0.03) 62.5%,rgba(155, 155, 155, 0.03) 62.5%, rgba(155, 155, 155, 0.03) 75%,rgba(249, 249, 249, 0.03) 75%, rgba(249, 249, 249, 0.03) 87.5%,rgba(179, 179, 179, 0.03) 87.5%, rgba(179, 179, 179, 0.03) 100%),
            linear-gradient(241deg, rgba(58, 58, 58, 0.02) 0%, rgba(58, 58, 58, 0.02) 25%,rgba(124, 124, 124, 0.02) 25%, rgba(124, 124, 124, 0.02) 50%,rgba(254, 254, 254, 0.02) 50%, rgba(254, 254, 254, 0.02) 75%,rgba(52, 52, 52, 0.02) 75%, rgba(52, 52, 52, 0.02) 100%),
            linear-gradient(90deg, #ffffff, #ffffff)
        `,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
    };

    const containerGradient = 'linear-gradient(135deg, rgba(159, 159, 159, 0.46) 0%, rgba(159, 159, 159, 0.46) 14.286%,rgba(165, 165, 165, 0.46) 14.286%, rgba(165, 165, 165, 0.46) 28.572%,rgba(171, 171, 171, 0.46) 28.572%, rgba(171, 171, 171, 0.46) 42.858%,rgba(178, 178, 178, 0.46) 42.858%, rgba(178, 178, 178, 0.46) 57.144%,rgba(184, 184, 184, 0.46) 57.144%, rgba(184, 184, 184, 0.46) 71.43%,rgba(190, 190, 190, 0.46) 71.43%, rgba(190, 190, 190, 0.46) 85.716%,rgba(196, 196, 196, 0.46) 85.716%, rgba(196, 196, 196, 0.46) 100.002%),linear-gradient(45deg, rgb(252, 252, 252) 0%, rgb(252, 252, 252) 14.286%,rgb(246, 246, 246) 14.286%, rgb(246, 246, 246) 28.572%,rgb(241, 241, 241) 28.572%, rgb(241, 241, 241) 42.858%,rgb(235, 235, 235) 42.858%, rgb(235, 235, 235) 57.144%,rgb(229, 229, 229) 57.144%, rgb(229, 229, 229) 71.43%,rgb(224, 224, 224) 71.43%, rgb(224, 224, 224) 85.716%,rgb(218, 218, 218) 85.716%, rgb(218, 218, 218) 100.002%)';

    useEffect(() => {
        window.scrollTo(0, 0);
        const checkStock = async () => {
            if (cart.length === 0) return;

            try {
                const response = await axios.post(
                    "http://localhost:5000/api/products/check-stock",
                    { items: cart },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                setState((prev) => ({
                    ...prev,
                    stockStatus: response.data,
                }));

                if (!response.data.inStock) {
                    Swal.fire({
                        title: "Stock Warning",
                        html: `
              <p>Some items in your cart have insufficient stock:</p>
              <ul class="text-left mt-2">
                ${response.data.outOfStockItems
                                .map(
                                    (item) => `
                  <li>
                    ${item.name} (Available: ${item.availableQuantity})
                  </li>
                `
                                )
                                .join("")}
              </ul>
            `,
                        icon: "warning",
                    });
                }
            } catch (err) {
                console.error("Stock check failed:", err);
            }
        };

        checkStock();
    }, [cart]);

    useEffect(() => {
        const itemsPriceInCents = cart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
        const itemsPrice = itemsPriceInCents / 100;
        const totalPrice = itemsPrice + orderSummary.shippingPrice;

        setOrderSummary({
            itemsPrice,
            shippingPrice: orderSummary.shippingPrice,
            totalPrice,
        });
    }, [cart]);

    const handleShippingSubmit = (info) => {
        setState((prev) => ({ ...prev, shippingInfo: info, step: "payment" }));
    };

    const createOrder = async (paymentData = {}) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Authentication required");

            const orderData = {
                items: cart.map((item) => ({
                    _id: item._id,
                    productId: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image,
                })),
                shippingInfo: state.shippingInfo,
                paymentMethod: state.paymentMethod,
                itemsPrice: orderSummary.itemsPrice * 100,
                shippingPrice: orderSummary.shippingPrice * 100,
                totalPrice: orderSummary.totalPrice * 100,
                ...paymentData,
            };

            const response = await axios.post(
                "http://localhost:5000/api/orders",
                orderData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            return response.data.order;
        } catch (err) {
            if (err.response?.data?.error?.includes("Not enough stock")) {
                throw new Error(err.response.data.error);
            }
            throw err;
        }
    };

    const handleCODOrder = async () => {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        try {
            const order = await createOrder();
            clearCart();
            await Swal.fire({
                title: "Order Placed!",
                text: `Your order #${order._id} has been placed successfully`,
                icon: "success",
                confirmButtonColor: "#3085d6",
            });
            navigate(`/order-confirmation/${order._id}`);
        } catch (err) {
            setState((prev) => ({ ...prev, error: err.message }));
            await Swal.fire({
                title: "Order Failed",
                text: err.message,
                icon: "error",
            });
        } finally {
            setState((prev) => ({ ...prev, loading: false }));
        }
    };

    const handleStripePayment = async () => {
        if (!stripe || !elements) {
            setState((prev) => ({
                ...prev,
                error: "Payment system not initialized",
            }));
            return;
        }

        setState((prev) => ({ ...prev, loading: true, error: null }));
        try {
            const { paymentMethod, error: paymentMethodError } =
                await stripe.createPaymentMethod({
                    type: "card",
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: state.shippingInfo.name,
                        email: state.shippingInfo.email,
                        phone: state.shippingInfo.phone,
                        address: {
                            line1: state.shippingInfo.address,
                            city: state.shippingInfo.city,
                            postal_code: state.shippingInfo.postalCode,
                            country: state.shippingInfo.country,
                        },
                    },
                });

            if (paymentMethodError) throw paymentMethodError;

            const amount = Math.round(orderSummary.totalPrice * 100);
            const response = await axios.post(
                "http://localhost:5000/api/stripe/create-payment-intent",
                {
                    paymentMethodId: paymentMethod.id,
                    amount,
                    shippingInfo: state.shippingInfo,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const { error: confirmError, paymentIntent } =
                await stripe.confirmCardPayment(response.data.clientSecret, {
                    payment_method: paymentMethod.id,
                });

            if (confirmError) throw confirmError;
            if (paymentIntent.status !== "succeeded")
                throw new Error("Payment failed");

            const order = await createOrder({
                stripePaymentId: paymentIntent.id,
                paymentResult: {
                    id: paymentIntent.id,
                    status: paymentIntent.status,
                    update_time: new Date().toISOString(),
                    email_address: state.shippingInfo.email,
                },
            });

            clearCart();
            await Swal.fire({
                title: "Payment Successful!",
                text: `Your order #${order._id} has been placed`,
                icon: "success",
                confirmButtonColor: "#3085d6",
            });
            navigate(`/order-confirmation/${order._id}`);
        } catch (err) {
            setState((prev) => ({ ...prev, error: err.message }));
            await Swal.fire({
                title: "Payment Failed",
                text: err.message,
                icon: "error",
            });
        } finally {
            setState((prev) => ({ ...prev, loading: false }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!state.shippingInfo) {
            setState((prev) => ({
                ...prev,
                error: "Please provide shipping information",
            }));
            return;
        }

        if (state.stockStatus && !state.stockStatus.inStock) {
            await Swal.fire({
                title: "Out of Stock",
                text: "Some items in your cart are no longer available. Please update your cart.",
                icon: "error",
            });
            return;
        }

        try {
            if (state.paymentMethod === "cod") {
                await handleCODOrder();
            } else {
                await handleStripePayment();
            }
        } catch (err) {
            setState((prev) => ({ ...prev, error: err.message }));
        }
    };

    const stripeElementOptions = {
        style: {
            base: {
                fontSize: "16px",
                color: "#6b7280",
                fontFamily: "Arial, sans-serif",
                "::placeholder": {
                    color: "#6b7280",
                },
            },
            invalid: {
                color: "#ef4444",
            },
        },
    };

    if (state.step === "shipping") {
        return (
            <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={backgroundStyle}>
                <div className="max-w-7xl mx-auto w-full">
                    <div
                        className="rounded-xl shadow-lg overflow-hidden"
                        style={{
                            backgroundImage: containerGradient,
                            backdropFilter: 'blur(8px)',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                        }}
                    >
                        <div className="bg-gradient-to-r from-gray-600 to-gray-800 p-8 text-white">
                            <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
                                <FaShoppingBag /> Checkout
                            </h2>
                            <p className="mt-2 text-base opacity-90">
                                Complete your purchase below.
                            </p>
                        </div>
                        <div className="p-8 flex flex-col lg:flex-row gap-8">
                            {/* Shipping Form */}
                            <div className="lg:w-2/3">
                                <ShippingForm
                                    onSubmit={handleShippingSubmit}
                                    onFormChange={(info) => setState(prev => ({ ...prev, shippingInfo: info }))}
                                />
                            </div>

                            {/* Order Summary */}
                            <div
                                className="lg:w-1/3 p-6 rounded-lg shadow-sm"
                                style={{
                                    backgroundImage: containerGradient,
                                    backdropFilter: 'blur(8px)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                }}
                            >
                                <h3 className="text-xl font-bold mb-6 text-gray-800 font-integralCF flex items-center gap-2">
                                    <FaBox /> Order Summary
                                </h3>
                                <div className="space-y-4 text-gray-700">
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-base">Items {cart.length}</span>
                                        <span>${orderSummary.itemsPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-base">Shipping</span>
                                        <span>${orderSummary.shippingPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-gray-800 text-base">
                                        <span>TOTAL COST</span>
                                        <span>${orderSummary.totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Stock Warning */}
                                {state.stockStatus && !state.stockStatus.inStock && (
                                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <h4 className="font-medium text-red-800 text-base">
                                            Stock Warning
                                        </h4>
                                        <ul className="mt-1 text-sm text-red-600">
                                            {state.stockStatus.outOfStockItems.map(
                                                (item, index) => (
                                                    <li key={index}>
                                                        {item.name} - Available:{" "}
                                                        {item.availableQuantity}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={() => {
                                        // Validate the form before proceeding
                                        const form = document.querySelector('form');
                                        const isValid = form.checkValidity();
                                        if (!isValid) {
                                            // Trigger validation messages
                                            form.reportValidity();
                                            return;
                                        }
                                        handleShippingSubmit(state.shippingInfo);
                                    }}
                                    className="w-full mt-6 flex items-center justify-center px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:opacity-50 shadow-md transition-colors text-base"
                                >
                                    Continue to Payment <FaArrowRight className="ml-2" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={backgroundStyle}>
            <style>{stripeStyles}</style>
            <div className="max-w-7xl mx-auto w-full">
                <div
                    className="rounded-xl shadow-lg overflow-hidden"
                    style={{
                        backgroundImage: containerGradient,
                        backdropFilter: 'blur(8px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                >
                    <div className="bg-gradient-to-r from-gray-600 to-gray-800 p-8 text-white">
                        <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
                            <FaShoppingBag /> Checkout
                        </h2>
                        <p className="mt-2 text-base opacity-90">
                            Complete your purchase below.
                        </p>
                    </div>
                    <div className="p-8 flex flex-col lg:flex-row gap-8">
                        {/* Order Summary */}
                        <div
                            className="lg:w-1/3 p-6 rounded-lg shadow-sm"
                            style={{
                                backgroundImage: containerGradient,
                                backdropFilter: 'blur(8px)',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                        >
                            <h3 className="text-xl font-bold mb-6 text-gray-800 font-integralCF flex items-center gap-2">
                                <FaBox /> Order Summary
                            </h3>
                            <div className="space-y-4 text-gray-700">
                                <div className="flex justify-between">
                                    <span className="font-semibold text-base">Items {cart.length}</span>
                                    <span>${orderSummary.itemsPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold text-base">Shipping</span>
                                    <span>${orderSummary.shippingPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-gray-800 text-base">
                                    <span>TOTAL COST</span>
                                    <span>${orderSummary.totalPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Stock Warning */}
                            {state.stockStatus && !state.stockStatus.inStock && (
                                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <h4 className="font-medium text-red-800 text-base">
                                        Stock Warning
                                    </h4>
                                    <ul className="mt-1 text-sm text-red-600">
                                        {state.stockStatus.outOfStockItems.map(
                                            (item, index) => (
                                                <li key={index}>
                                                    {item.name} - Available:{" "}
                                                    {item.availableQuantity}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Payment Form */}
                        <div className="lg:w-2/3">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="text-gray-600 text-base font-semibold flex items-center gap-2">
                                        <FaCreditCard /> Payment Method
                                    </label>
                                    <div className="flex flex-col sm:flex-row sm:space-x-6 mt-2">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="stripe"
                                                checked={
                                                    state.paymentMethod === "stripe"
                                                }
                                                onChange={() =>
                                                    setState((prev) => ({
                                                        ...prev,
                                                        paymentMethod: "stripe",
                                                    }))
                                                }
                                                className="form-radio h-5 w-5 text-gray-600"
                                            />
                                            <span className="text-base text-gray-800 flex items-center gap-1">
                                                <FaCreditCard className="text-sm" /> Credit/Debit Card
                                            </span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="cod"
                                                checked={state.paymentMethod === "cod"}
                                                onChange={() =>
                                                    setState((prev) => ({
                                                        ...prev,
                                                        paymentMethod: "cod",
                                                    }))
                                                }
                                                className="form-radio h-5 w-5 text-gray-600"
                                            />
                                            <span className="text-base text-gray-800 flex items-center gap-1">
                                                <FaMoneyBillWave className="text-sm" /> Cash on Delivery (COD)
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                {state.paymentMethod === "stripe" && (
                                    <div className="space-y-6">
                                        {/* Card Number */}
                                        <div className="relative">
                                            <label className="label">
                                                Card Number
                                            </label>
                                            <div className="relative">
                                                <CardNumberElement
                                                    options={{
                                                        ...stripeElementOptions,
                                                        placeholder:
                                                            "1234 1234 1234 1234",
                                                    }}
                                                />
                                                <div className="card-logos">
                                                    <img
                                                        src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                                                        alt="Mastercard"
                                                    />
                                                    <img
                                                        src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                                                        alt="Visa"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expiration Date and CVC */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="label">
                                                    Expiration Date
                                                </label>
                                                <CardExpiryElement
                                                    options={{
                                                        ...stripeElementOptions,
                                                        placeholder: "MM / YY",
                                                    }}
                                                />
                                            </div>
                                            <div className="cvc-container">
                                                <label className="label">
                                                    Security Code
                                                </label>
                                                <CardCvcElement
                                                    options={{
                                                        ...stripeElementOptions,
                                                        placeholder: "CVC",
                                                    }}
                                                />
                                                <div className="cvc-icon mt-3">
                                                    <svg
                                                        className="p-CardCvcIcons-svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="var(--colorIconCardCvc)"
                                                        role="img"
                                                        aria-labelledby="cvcDesc"
                                                    >
                                                        <path
                                                            opacity=".2"
                                                            fillRule="evenodd"
                                                            clipRule="evenodd"
                                                            d="M15.337 4A5.493 5.493 0 0013 8.5c0 1.33.472 2.55 1.257 3.5H4a1 1 0 00-1 1v1a1 1 0 001 1h16a1 1 0 001-1v-.6a5.526 5.526 0 002-1.737V18a2 2 0 01-2 2H3a2 2 0 01-2-2V6a2 2 0 012-2h12.337zm6.707.293c.239.202.46.424.662.663a2.01 2.01 0 00-.662-.663z"
                                                        ></path>
                                                        <path
                                                            opacity=".4"
                                                            fillRule="evenodd"
                                                            clipRule="evenodd"
                                                            d="M13.6 6a5.477 5.477 0 00-.578 3H1V6h12.6z"
                                                        ></path>
                                                        <path
                                                            fillRule="evenodd"
                                                            clipRule="evenodd"
                                                            d="M18.5 14a5.5 5.5 0 110-11 5.5 5.5 0 010 11zm-2.184-7.779h-.621l-1.516.77v.786l1.202-.628v3.63h.943V6.22h-.008zm1.807.629c.448 0 .762.251.762.613 0 .393-.37.668-.904.668h-.235v.668h.283c.565 0 .95.282.95.691 0 .393-.377.66-.911.66-.393 0-.786-.126-1.194-.37v.786c.44.189.88.291 1.312.291 1.029 0 1.736-.526 1.736-1.288 0-.535-.33-.967-.88-1.14.472-.157.778-.573.778-1.045 0-.738-.652-1.241-1.595-1.241a3.143 3.143 0 00-1.234.267v.77c.378-.212.763-.33 1.132-.33zm3.394 1.713c.574 0 .974.338.974.778 0 .463-.4.785-.974.785-.346 0-.707-.11-1.076-.337v.809c.385.173.778.26 1.163.26.204 0 .392-.032.573-.08a4.313 4.313 0 00.644-2.262l-.015-.33a1.807 1.807 0 00-.967-.252 3 3 0 00-.448.032V6.944h1.132a4.423 4.423 0 00-.362-.723h-1.587v2.475a3.9 3.9 0 01.943-.133z"
                                                        ></path>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="disclaimer">
                                            By providing your card information,
                                            you allow Coursera, Inc. to charge
                                            your card for future payments in
                                            accordance with their terms.
                                        </p>
                                    </div>
                                )}

                                {state.error && (
                                    <div className="p-4 text-red-700 bg-red-100 rounded-lg text-center text-base">
                                        {state.error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={
                                        state.loading ||
                                        (state.stockStatus &&
                                            !state.stockStatus.inStock)
                                    }
                                    className="w-full flex items-center justify-center px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:opacity-50 shadow-md transition-colors text-base"
                                >
                                    {state.loading ? (
                                        <FaSpinner className="animate-spin mr-2" />
                                    ) : state.paymentMethod === "cod" ? (
                                        <>Place Order (COD) <FaArrowRight className="ml-2" /></>
                                    ) : (
                                        <>Pay Now <FaArrowRight className="ml-2" /></>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;