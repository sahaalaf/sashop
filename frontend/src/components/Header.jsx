import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaUser } from 'react-icons/fa';
import { useCart } from "../context/CartContext";

const Header = () => {
    const { cart } = useCart();
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.trim()) {
                navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
            } else if (searchQuery === '') {
                navigate('/');
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, navigate]);

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link to="/" className="font-integralCF text-2xl font-bold text-gray-800">
                    SaShop
                </Link>

                <nav className="hidden md:flex space-x-6">
                    <Link to="/" className="text-gray-700 hover:text-blue-500">
                        Home
                    </Link>
                    <Link to="/new-arrivals" className="text-gray-700 hover:text-blue-500">
                        New Arrivals
                    </Link>
                    <Link to="/on-sale" className="text-gray-700 hover:text-blue-500">
                        On Sale
                    </Link>
                </nav>

                <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2 w-1/3">
                    <FaSearch className="text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search for products..."
                        className="ml-2 bg-transparent outline-none w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>


                <div className="flex items-center space-x-6">
                    <Link to="/cart" className="relative">
                        <FaShoppingCart className="text-2xl text-gray-700 hover:text-blue-500" />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                    <Link to="/profile">
                        <FaUser className="text-2xl text-gray-700 hover:text-blue-500" />
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;