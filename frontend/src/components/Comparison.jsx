import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";

const Comparison = () => {
    const { state } = useLocation();
    const { selectedProducts = [] } = state || {};
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const handleAddToCart = (product) => {
        if (!product || product.quantity === 0) return;
        try {
            addToCart(product);
            toast.success("Added to cart!", {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
            });
        } catch (error) {
            toast.error("Error adding to cart");
        }
    };

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <div className="flex">
                {[...Array(fullStars)].map((_, i) => (
                    <FaStar key={`full-${i}`} className="text-yellow-400 text-sm" />
                ))}
                {hasHalfStar && <FaStarHalfAlt className="text-yellow-400 text-sm" />}
                {[...Array(emptyStars)].map((_, i) => (
                    <FaRegStar key={`empty-${i}`} className="text-gray-300 text-sm" />
                ))}
            </div>
        );
    };

    if (selectedProducts.length === 0) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-lg text-gray-600">No products selected for comparison.</div>
        </div>
    );

    const attributes = [
        {
            label: "Image", key: "image", render: (value) => (
                <img
                    src={`http://localhost:5000${value}`}
                    alt="Product"
                    className="w-24 h-24 object-contain mx-auto"
                    onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                />
            )
        },
        { label: "Name", key: "name" },
        { label: "Brand", key: "brand" },
        { label: "Price", key: "price", render: (value) => `$${(value / 100).toFixed(2)}` },
        { label: "Approx. Price (EUR)", key: "approxPriceEUR", render: (value) => value ? `€${value}` : "N/A" },
        {
            label: "Availability", key: "quantity", render: (value) => (
                <span className={value > 0 ? "text-green-600" : "text-red-600"}>
                    {value > 0 ? "In Stock" : "Out of Stock"}
                </span>
            )
        },
        { label: "Rating", key: "rating", render: (_, product) => renderStars(product.rating || 0) },
        { label: "Network Technology", key: "networkTechnology", render: (value) => value || "N/A" },
        { label: "Display Size", key: "displaySize", render: (value) => value || "N/A" },
        { label: "Display Resolution", key: "displayResolution", render: (value) => value || "N/A" },
        { label: "OS", key: "OS", render: (value) => value || "N/A" },
        { label: "CPU", key: "CPU", render: (value) => value || "N/A" },
        { label: "RAM", key: "RAM", render: (value) => value || "N/A" },
        { label: "Storage", key: "internalMemory", render: (value) => value || "N/A" },
        { label: "Camera", key: "primaryCamera", render: (value) => value || "N/A" },
        { label: "Battery", key: "battery", render: (value) => value || "N/A" },
        { label: "Status", key: "isNewArrival", render: (value) => (value ? "New Arrival" : "N/A") },
        { label: "Popularity", key: "isTopSelling", render: (value) => (value ? "Top Selling" : "N/A") },
        {
            label: "Action", key: "action", render: (_, product) => (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddToCart(product)}
                    disabled={product.quantity === 0}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white font-medium ${product.quantity > 0 ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-400 cursor-not-allowed"}`}
                >
                    <FaShoppingCart /> Add to Cart
                </motion.button>
            )
        },
    ];

    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-6xl mx-auto"
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Compare Products</h2>
                    <button
                        onClick={() => navigate(-1)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        Back to Product Details
                    </button>
                </div>

                {/* Comparison Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="w-1/4 p-4 text-left text-sm font-medium text-gray-600 bg-gray-50 border-b border-gray-200">Attribute</th>
                                {selectedProducts.map((product) => (
                                    <th key={product._id} className="p-4 text-center text-sm font-medium text-gray-600 bg-gray-50 border-b border-gray-200">
                                        {product.name}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {attributes.map((attr, index) => (
                                <tr key={attr.label} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                    <td className="p-4 text-sm font-medium text-gray-800 border-b border-gray-200">{attr.label}</td>
                                    {selectedProducts.map((product) => (
                                        <td key={product._id} className="p-4 text-sm text-gray-600 border-b border-gray-200 text-center">
                                            {attr.render ? attr.render(product[attr.key], product) : (product[attr.key] || "N/A")}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default Comparison;