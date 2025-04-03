import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import {
    FaStar,
    FaStarHalfAlt,
    FaRegStar,
    FaShoppingCart,
    FaArrowLeft,
    FaMobileAlt,
    FaDesktop,
    FaMicrochip,
    FaMemory,
    FaCamera,
    FaBatteryFull,
    FaBox
} from "react-icons/fa";
import { IoStarSharp, IoStarHalfSharp, IoStarOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import placeholder from "../assets/placeholder.png";

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
    const [hoverRating, setHoverRating] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchUserProfile();
        fetchProductAndReviews();
    }, [id]);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await axios.get("http://localhost:5000/api/users/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(response.data);
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
            localStorage.removeItem("token");
        }
    };

    const fetchProductAndReviews = async () => {
        try {
            setLoading(true);
            const [productRes, reviewsRes] = await Promise.all([
                axios.get(`http://localhost:5000/api/products/${id}`),
                axios.get(`http://localhost:5000/api/review/products/${id}/reviews`)
            ]);

            setProduct(productRes.data);
            setReviews(reviewsRes.data);

            const total = reviewsRes.data.reduce((sum, r) => sum + r.rating, 0);
            setAverageRating(reviewsRes.data.length ? (total / reviewsRes.data.length).toFixed(1) : 0);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.response?.data?.message || "Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!product || product.quantity === 0) return;

        try {
            addToCart(product);
            toast.success("Added to cart!", {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
            });
        } catch (err) {
            toast.error("Failed to add to cart");
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please log in to review");
                navigate("/login");
                return;
            }

            const response = await axios.post(
                `http://localhost:5000/api/review/products/${id}/reviews`,
                {
                    rating: Number(newReview.rating),
                    comment: newReview.comment.trim()
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const newReviewData = response.data;
            setReviews([...reviews, newReviewData]);
            setNewReview({ rating: 0, comment: "" });
            const total = [...reviews, newReviewData].reduce((sum, r) => sum + r.rating, 0);
            setAverageRating(reviews.length + 1 ? (total / (reviews.length + 1)).toFixed(1) : 0);
            toast.success("Review submitted successfully!");

        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setUser(null);
                toast.error("Session expired. Please log in again.");
                navigate("/login");
            } else {
                toast.error(err.response?.data?.message || "Failed to submit review");
                console.error("Review submission error:", err);
            }
        }
    };

    const renderStars = (rating, interactive = false) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalf = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(
                    <IoStarSharp
                        key={`full-${i}`}
                        className="text-[#ffd427] text-2xl"
                        onClick={() => interactive && setNewReview({ ...newReview, rating: i })}
                        onMouseEnter={() => interactive && setHoverRating(i)}
                    />
                );
            } else if (i === fullStars + 1 && hasHalf) {
                stars.push(
                    <IoStarHalfSharp
                        key="half"
                        className="text-[#ffd427] text-2xl"
                        onClick={() => interactive && setNewReview({ ...newReview, rating: i - 0.5 })}
                        onMouseEnter={() => interactive && setHoverRating(i - 0.5)}
                    />
                );
            } else {
                stars.push(
                    <IoStarOutline
                        key={`empty-${i}`}
                        className="text-black text-2xl"
                        onClick={() => interactive && setNewReview({ ...newReview, rating: i })}
                        onMouseEnter={() => interactive && setHoverRating(i)}
                    />
                );
            }
        }

        return (
            <div
                className={`flex ${interactive ? "cursor-pointer" : ""}`}
                onMouseLeave={() => interactive && setHoverRating(0)}
            >
                {stars}
            </div>
        );
    };

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

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={backgroundStyle}>
            <div className="text-base text-gray-700">Loading product details...</div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center" style={backgroundStyle}>
            <div className="bg-red-100 p-6 rounded-lg shadow-lg text-red-700 text-base">
                {error}
            </div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen flex items-center justify-center" style={backgroundStyle}>
            <div className="text-base text-gray-700">Product not found</div>
        </div>
    );

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={backgroundStyle}>
            <div className="max-w-7xl mx-auto w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl shadow-lg overflow-hidden"
                    style={{
                        backgroundImage: containerGradient,
                        backdropFilter: 'blur(8px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                >
                    <div className="bg-gradient-to-r from-gray-600 to-gray-800 p-8 text-white">
                        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
                            <FaMobileAlt /> {product.name}
                        </h1>
                        <p className="mt-2 text-base opacity-90">Product Details</p>
                    </div>

                    <div className="p-8">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-800 transition-colors text-base"
                        >
                            <FaArrowLeft className="text-sm" /> Back
                        </button>

                        {/* Product details section */}
                        <div className="flex flex-col md:flex-row gap-10 mb-12">
                            <div className="w-full md:w-1/2 relative">
                                <div className="absolute top-0 left-0 bg-gray-600 text-white text-xs font-bold px-2 py-1 rounded">
                                    OFFICIAL STORE
                                </div>
                                <img
                                    src={`http://localhost:5000${product.image}`}
                                    alt={product.name}
                                    className="w-full h-[400px] object-contain rounded-lg border-2 border-gray-400 shadow-md"
                                    onError={(e) => (e.target.src = placeholder)}
                                />
                            </div>

                            <div className="w-full md:w-1/2 space-y-6">
                                <div className="flex items-center gap-4">
                                    {renderStars(averageRating)}
                                    <span className="text-black text-sm font-semibold">
                                        {averageRating} ({reviews.length} reviews)
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-2xl font-bold text-gray-800">${(product.price / 100).toFixed(2)}</p>
                                    <p className="text-gray-700 text-base">{product.description}</p>
                                    <p className={`text-sm ${product.quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                                        {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                                        {product.quantity > 0 && product.quantity <= 5 && (
                                            <span className="text-orange-600"> (Only {product.quantity} left)</span>
                                        )}
                                    </p>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleAddToCart}
                                    disabled={product.quantity === 0}
                                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-semibold text-base shadow-md ${product.quantity > 0
                                        ? "bg-gray-600 hover:bg-gray-700"
                                        : "bg-gray-400 cursor-not-allowed"
                                        } transition-colors duration-300`}
                                >
                                    <FaShoppingCart className="text-sm" /> Add to Cart
                                </motion.button>
                            </div>
                        </div>

                        {/* Product Specifications Box */}
                        <div
                            className="mt-12 p-6 rounded-lg shadow-md"
                            style={{
                                backgroundImage: containerGradient,
                                backdropFilter: 'blur(8px)',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                        >
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <FaBox className="text-xl" /> Product Specifications
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {product.brand && (
                                    <div className="p-4 rounded-lg shadow-sm" style={{ backgroundImage: containerGradient }}>
                                        <h4 className="text-base font-semibold text-gray-700 flex items-center gap-2">
                                            <FaMobileAlt className="text-xl text-gray-600" /> Brand
                                        </h4>
                                        <p className="text-gray-700 mt-1 text-base">{product.brand}</p>
                                    </div>
                                )}
                                {product.description && (
                                    <div className="p-4 rounded-lg shadow-sm md:col-span-2" style={{ backgroundImage: containerGradient }}>
                                        <h4 className="text-base font-semibold text-gray-700 flex items-center gap-2">
                                            <FaMobileAlt className="text-xl text-gray-600" /> Description
                                        </h4>
                                        <p className="text-gray-700 mt-1 text-base">{product.description}</p>
                                    </div>
                                )}
                                {product.displaySize && (
                                    <div className="p-4 rounded-lg shadow-sm" style={{ backgroundImage: containerGradient }}>
                                        <h4 className="text-base font-semibold text-gray-700 flex items-center gap-2">
                                            <FaDesktop className="text-xl text-gray-600" /> Display Size
                                        </h4>
                                        <p className="text-gray-700 mt-1 text-base">{product.displaySize}</p>
                                    </div>
                                )}
                                {product.displayResolution && (
                                    <div className="p-4 rounded-lg shadow-sm" style={{ backgroundImage: containerGradient }}>
                                        <h4 className="text-base font-semibold text-gray-700 flex items-center gap-2">
                                            <FaDesktop className="text-xl text-gray-600" /> Display Resolution
                                        </h4>
                                        <p className="text-gray-700 mt-1 text-base">{product.displayResolution}</p>
                                    </div>
                                )}
                                {product.OS && (
                                    <div className="p-4 rounded-lg shadow-sm" style={{ backgroundImage: containerGradient }}>
                                        <h4 className="text-base font-semibold text-gray-700 flex items-center gap-2">
                                            <FaMicrochip className="text-xl text-gray-600" /> OS
                                        </h4>
                                        <p className="text-gray-700 mt-1 text-base">{product.OS}</p>
                                    </div>
                                )}
                                {product.CPU && (
                                    <div className="p-4 rounded-lg shadow-sm" style={{ backgroundImage: containerGradient }}>
                                        <h4 className="text-base font-semibold text-gray-700 flex items-center gap-2">
                                            <FaMicrochip className="text-xl text-gray-600" /> CPU
                                        </h4>
                                        <p className="text-gray-700 mt-1 text-base">{product.CPU}</p>
                                    </div>
                                )}
                                {product.RAM && (
                                    <div className="p-4 rounded-lg shadow-sm" style={{ backgroundImage: containerGradient }}>
                                        <h4 className="text-base font-semibold text-gray-700 flex items-center gap-2">
                                            <FaMemory className="text-xl text-gray-600" /> RAM
                                        </h4>
                                        <p className="text-gray-700 mt-1 text-base">{product.RAM}</p>
                                    </div>
                                )}
                                {product.internalMemory && (
                                    <div className="p-4 rounded-lg shadow-sm" style={{ backgroundImage: containerGradient }}>
                                        <h4 className="text-base font-semibold text-gray-700 flex items-center gap-2">
                                            <FaMemory className="text-xl text-gray-600" /> Storage
                                        </h4>
                                        <p className="text-gray-700 mt-1 text-base">{product.internalMemory}</p>
                                    </div>
                                )}
                                {product.primaryCamera && (
                                    <div className="p-4 rounded-lg shadow-sm" style={{ backgroundImage: containerGradient }}>
                                        <h4 className="text-base font-semibold text-gray-700 flex items-center gap-2">
                                            <FaCamera className="text-xl text-gray-600" /> Camera
                                        </h4>
                                        <p className="text-gray-700 mt-1 text-base">{product.primaryCamera}</p>
                                    </div>
                                )}
                                {product.battery && (
                                    <div className="p-4 rounded-lg shadow-sm" style={{ backgroundImage: containerGradient }}>
                                        <h4 className="text-base font-semibold text-gray-700 flex items-center gap-2">
                                            <FaBatteryFull className="text-xl text-gray-600" /> Battery
                                        </h4>
                                        <p className="text-gray-700 mt-1 text-base">{product.battery}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Reviews section */}
                        <div className="mt-12 border-t pt-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <FaStar className="text-xl" /> Customer Reviews
                            </h2>

                            {reviews.length > 0 ? (
                                <div className="space-y-6">
                                    {reviews.map((review) => (
                                        <motion.div
                                            key={review._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="p-4 rounded-lg flex gap-4"
                                            style={{ backgroundImage: containerGradient }}
                                        >
                                            <img
                                                src={review.user?.profilePic
                                                    ? `http://localhost:5000${review.user.profilePic}`
                                                    : placeholder}
                                                alt={review.user?.username || "User"}
                                                className="w-12 h-12 rounded-full object-cover border-2 border-gray-400 shadow-md"
                                            />
                                            <div>
                                                <p className="font-semibold text-base text-gray-800">{review.user?.username || "Anonymous"}</p>
                                                {renderStars(review.rating)}
                                                <p className="text-gray-700 mt-2 text-base">{review.comment}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600 text-base">No reviews yet. Be the first to review!</p>
                            )}

                            {user ? (
                                <form
                                    onSubmit={handleReviewSubmit}
                                    className="mt-10 p-6 rounded-lg"
                                    style={{ backgroundImage: containerGradient }}
                                >
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <FaStar className="text-xl" /> Write a Review
                                    </h3>

                                    <div className="mb-4">
                                        <label className="block mb-2 font-semibold text-base text-gray-700">Rating</label>
                                        <div className="flex items-center gap-2">
                                            {renderStars(hoverRating || newReview.rating, true)}
                                            <span className="text-base text-gray-700">
                                                {hoverRating || newReview.rating || "Select rating"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block mb-2 font-semibold text-base text-gray-700">Comment</label>
                                        <textarea
                                            value={newReview.comment}
                                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                            className="w-full bg-transparent p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 text-base"
                                            rows="4"
                                            minLength="10"
                                            required
                                        />
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300 font-semibold text-base shadow-md"
                                    >
                                        Submit Review
                                    </motion.button>
                                </form>
                            ) : (
                                <div className="mt-8 text-center">
                                    <button
                                        onClick={() => navigate("/login")}
                                        className="text-gray-600 hover:text-gray-800 transition-colors text-base"
                                    >
                                        Log in
                                    </button> to leave a review
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProductDetails;