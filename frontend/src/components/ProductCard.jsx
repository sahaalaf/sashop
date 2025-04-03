import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { FaCartPlus, FaInfoCircle, FaMemory, FaDollarSign, FaApple, FaGoogle } from 'react-icons/fa';
import { SiSamsung } from 'react-icons/si';

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

    const getBrandIcon = (brand) => {
        switch (brand?.toLowerCase()) {
            case 'samsung':
                return <SiSamsung className="text-gray-500" />;
            case 'iphone':
            case 'apple':
                return <FaApple className="text-gray-500" />;
            case 'google':
                return <FaGoogle className="text-gray-500" />;
            default:
                return <FaInfoCircle className="text-gray-500" />;
        }
    };

    return (
        <div
            className="w-72 m-6 shadow-lg rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-xl"
            onClick={handleCardClick}
            style={{
                backgroundImage: 'linear-gradient(135deg, rgba(159, 159, 159, 0.46) 0%, rgba(159, 159, 159, 0.46) 14.286%,rgba(165, 165, 165, 0.46) 14.286%, rgba(165, 165, 165, 0.46) 28.572%,rgba(171, 171, 171, 0.46) 28.572%, rgba(171, 171, 171, 0.46) 42.858%,rgba(178, 178, 178, 0.46) 42.858%, rgba(178, 178, 178, 0.46) 57.144%,rgba(184, 184, 184, 0.46) 57.144%, rgba(184, 184, 184, 0.46) 71.43%,rgba(190, 190, 190, 0.46) 71.43%, rgba(190, 190, 190, 0.46) 85.716%,rgba(196, 196, 196, 0.46) 85.716%, rgba(196, 196, 196, 0.46) 100.002%),linear-gradient(45deg, rgb(252, 252, 252) 0%, rgb(252, 252, 252) 14.286%,rgb(246, 246, 246) 14.286%, rgb(246, 246, 246) 28.572%,rgb(241, 241, 241) 28.572%, rgb(241, 241, 241) 42.858%,rgb(235, 235, 235) 42.858%, rgb(235, 235, 235) 57.144%,rgb(229, 229, 229) 57.144%, rgb(229, 229, 229) 71.43%,rgb(224, 224, 224) 71.43%, rgb(224, 224, 224) 85.716%,rgb(218, 218, 218) 85.716%, rgb(218, 218, 218) 100.002%)',
                backdropFilter: 'blur(8px)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
        >
            <div className="h-2 bg-gray-800 rounded-t-lg -mx-4 -mt-4 mb-4"></div>

            <div
                className="border-gray-500 rounded-2xl p-4 text-center font-sans mb-4"
                style={{
                    backgroundImage: 'linear-gradient(135deg, transparent 0%, transparent 6%,rgba(71, 71, 71,0.04) 6%, rgba(71, 71, 71,0.04) 22%,transparent 22%, transparent 100%),linear-gradient(45deg, transparent 0%, transparent 20%,rgba(71, 71, 71,0.04) 20%, rgba(71, 71, 71,0.04) 47%,transparent 47%, transparent 100%),linear-gradient(135deg, transparent 0%, transparent 24%,rgba(71, 71, 71,0.04) 24%, rgba(71, 71, 71,0.04) 62%,transparent 62%, transparent 100%),linear-gradient(45deg, transparent 0%, transparent 73%,rgba(71, 71, 71,0.04) 73%, rgba(71, 71, 71,0.04) 75%,transparent 75%, transparent 100%),linear-gradient(90deg, rgb(255,255,255),rgb(255,255,255))',
                    backdropFilter: 'blur(5px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                }}
            >
                <img
                    src={`http://localhost:5000${product.image}` || 'https://via.placeholder.com/150'}
                    alt={product.name}
                    className="h-64 object-cover bg-transparent rounded-lg mb-4 transition-transform duration-300 hover:scale-110"
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
                />
            </div>

            <div className="text-lg font-bold mb-2 flex items-center gap-2">
                {product.name}
            </div>
            <div className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                {getBrandIcon(product.brand)} {product.brand}
            </div>
            <div className="flex justify-start items-center gap-2 mb-2">
                <FaDollarSign className="text-gray-700" />
                <span className="text-lg font-bold">${(product.price / 100).toFixed(2)}</span>
            </div>
            {product.RAM && product.internalMemory && (
                <div className="text-sm text-gray-600 flex items-center gap-2">
                    <FaMemory className="text-gray-500" /> {`${product.RAM} RAM | ${product.internalMemory}`}
                </div>
            )}
            <button
                onClick={handleAddToCart}
                className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-1 rounded-lg  transition-colors duration-300 mt-2 flex items-center gap-2 backdrop-blur-[5px]"
            >
                <FaCartPlus /> Add to Cart
            </button>
        </div>
    );
};

export default ProductCard;