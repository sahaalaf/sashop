import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    // State for reviews
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [newReview, setNewReview] = useState({ rating: 0, comment: '', user: '' });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/products/${id}`);
                setProduct(response.data);
                setLoading(false);

                // Fetch reviews
                const fetchedReviews = await axios.get(`http://localhost:5000/api/products/${id}/reviews`);
                setReviews(fetchedReviews.data);
                const totalRating = fetchedReviews.data.reduce((sum, review) => sum + review.rating, 0);
                setAverageRating((totalRating / fetchedReviews.data.length).toFixed(1));
            } catch (error) {
                console.error('Error fetching product:', error);
                setError('Failed to load product details');
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        try {
            addToCart(product);
            toast.success('Product added to cart!', {
                position: 'bottom-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
            });
        } catch (error) {
            toast.error('Error adding to cart');
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!newReview.rating || !newReview.comment || !newReview.user) {
            toast.error('Please fill all fields');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:5000/api/products/${id}/reviews`, newReview);
            setReviews([...reviews, response.data]);
            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0) + newReview.rating;
            setAverageRating((totalRating / (reviews.length + 1)).toFixed(1));
            setNewReview({ rating: 0, comment: '', user: '' });
            toast.success('Review submitted successfully!');
        } catch (error) {
            toast.error('Error submitting review');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="spinner-border text-blue-500" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="text-center mt-12 text-red-600">{error}</div>;
    }

    if (!product) {
        return <div className="text-center mt-12">Product not found.</div>;
    }

    return (
        <div className="container mx-auto p-4 mt-4">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-gray-600 hover:text-gray-800 flex items-center text-sm font-medium"
            >
                <span className="mr-2">←</span> Back to Products
            </button>

            {/* Main Content: Image on Left, Details on Right */}
            <div className="flex flex-col md:flex-row gap-8">
                {/* Image Section */}
                <div className="w-full md:w-1/2">
                    <img
                        src={product.image || 'https://via.placeholder.com/300'}
                        alt={product.name || 'Product'}
                        className="w-full h-auto object-cover rounded-lg shadow-lg"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300';
                        }}
                    />
                </div>

                {/* Details Section */}
                <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
                    <p className="text-red-600 text-xl font-semibold mb-2">${(product.price / 100).toFixed(2)}</p>
                    <p className="text-gray-500 line-through mb-2">$260.00</p>
                    <p className="text-green-600 mb-4 font-medium">20% off</p>

                    {/* Color Option */}
                    <div className="mb-6">
                        <p className="text-sm text-gray-600 mb-2">Color: {product.color || 'Space Gray'}</p>
                        <div className="flex space-x-2">
                            <div className="w-6 h-6 bg-gray-800 rounded-full cursor-pointer border-2 border-gray-200 hover:border-gray-800"></div>
                            <div className="w-6 h-6 bg-gray-300 rounded-full cursor-pointer border-2 border-gray-200 hover:border-gray-800"></div>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 mb-6">
                        {product.description ||
                            'Experience the latest in smartphone technology with a stunning display, powerful processor, and long-lasting battery. Perfect for gaming, streaming, and productivity.'}
                    </p>

                    {/* Specifications */}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold mb-2">Specifications:</h3>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                            <li>Display: 6.1" OLED, 120Hz</li>
                            <li>Processor: Octa-core, 3.2GHz</li>
                            <li>Battery: 4500mAh</li>
                            <li>Camera: 48MP + 12MP</li>
                        </ul>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition-colors duration-300 font-medium"
                    >
                        ADD TO CART
                    </button>
                </div>
            </div>

            {/* Review Section */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                {reviews.length > 0 ? (
                    <>
                        <p className="text-lg font-semibold mb-2">
                            Average Rating: {averageRating} / 5
                        </p>
                        <div className="text-yellow-400 mb-4 flex">
                            {'★'.repeat(Math.round(averageRating))}
                            {'☆'.repeat(5 - Math.round(averageRating))}
                        </div>
                        {reviews.map((review) => (
                            <div key={review.id} className="mb-4 border-b pb-4">
                                <div className="flex items-center mb-2">
                                    <div className="text-yellow-400 flex">
                                        {'★'.repeat(review.rating)}
                                        {'☆'.repeat(5 - review.rating)}
                                    </div>
                                    <p className="text-sm text-gray-600 ml-2">by <strong>{review.user}</strong></p>
                                </div>
                                <p className="text-sm text-gray-600">{review.comment}</p>
                            </div>
                        ))}
                    </>
                ) : (
                    <p className="text-gray-600">No reviews yet.</p>
                )}

                {/* Review Submission Form */}
                <form onSubmit={handleReviewSubmit} className="mt-6">
                    <h3 className="text-xl font-bold mb-4">Leave a Review</h3>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                        <input
                            type="text"
                            value={newReview.user}
                            onChange={(e) => setNewReview({ ...newReview, user: e.target.value })}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                        <select
                            value={newReview.rating}
                            onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                            required
                        >
                            <option value={0}>Select Rating</option>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <option key={star} value={star}>{star} Star</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                        <textarea
                            value={newReview.comment}
                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                            rows="4"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition-colors duration-300 font-medium"
                    >
                        Submit Review
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProductDetails;