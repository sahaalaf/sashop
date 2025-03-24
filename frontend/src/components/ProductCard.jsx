import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const handleAddToCart = (e) => {
        e.stopPropagation();
        addToCart(product);
        toast.success('Product added to cart!', {
            position: 'bottom-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
        });
    };

    const handleCardClick = () => {
        navigate(`/products/${product._id}`);
    };

    return (
        <div
            className="w-72 m-6 bg-white shadow-lg rounded-lg p-4 cursor-pointer"
            onClick={handleCardClick}
        >
            <div className="bg-gray-200 border-gray-500 rounded-2xl p-4 text-center font-sans mb-4">
                <img
                    src={product.image || 'https://via.placeholder.com/150'}
                    alt={product.name}
                    className="h-64 object-cover bg-transparent rounded-lg mb-4 transition-transform duration-300 hover:scale-110"
                    onError={(e) => {

                    }}
                />
            </div>

            <div className="text-lg font-bold mb-2">{product.name}</div>
            <div className="text-yellow-400 mb-2">
                ★ ★ ★ ☆ ☆ <span className="text-black ml-1">3.5/5</span>
            </div>
            <div className="flex justify-start items-center gap-2">
                <span className="text-lg font-bold">${(product.price / 100).toFixed(2)}</span>
                <span className="text-sm text-gray-500 line-through">$260</span>
                <span className="text-sm text-red-600 font-bold">-20%</span>
            </div>
            <button
                onClick={handleAddToCart}
                className="bg-gray-800 text-white px-4 py-1 rounded-lg hover:bg-gray-900 transition-colors duration-300 mt-2"
            >
                Add to Cart
            </button>
        </div>
    );
};

export default ProductCard;