import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const shippingCost = 5.00;

    return (
        <div className="container mx-auto p-4">
            <h2 className="font-integralCF text-3xl font-bold mb-6 mt-12">Your Bag <span className='font-IntegralN text-lg text-gray-500'>({cart.length} items)</span></h2>
            {cart.length === 0 ? (
                <p className="text-gray-600">Your cart is empty. <Link to="/" className="text-blue-500 hover:text-blue-600 transition-colors">Continue shopping</Link></p>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Shopping Cart Items */}
                    <div className="lg:w-2/3 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <div className="grid grid-cols-5 gap-4 font-bold border-b pb-4 mb-4 text-gray-700">
                            <span className="col-span-2">PRODUCT DETAILS</span>
                            <span>QUANTITY</span>
                            <span>PRICE</span>
                            <span>TOTAL</span>
                            <span></span> {/* Empty column for the delete button */}
                        </div>
                        {cart.map((item, index) => (
                            <div key={index} className="grid grid-cols-5 gap-4 items-center border-b pb-4 mb-4 hover:bg-gray-50 transition-colors duration-200 rounded-lg p-2">
                                <div className="col-span-2 flex items-center">
                                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg mr-4 shadow-sm" />
                                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => decreaseQuantity(item._id, item.quantity - 1)}
                                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                                        disabled={item.quantity <= 1}
                                    >
                                        <FaMinus className="text-sm text-gray-600" />
                                    </button>
                                    <span className="text-lg text-gray-700">{item.quantity}</span>
                                    <button
                                        onClick={() => increaseQuantity(item._id, item.quantity + 1)}
                                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                                    >
                                        <FaPlus className="text-sm text-gray-600" />
                                    </button>
                                </div>
                                <p className="text-lg text-gray-700">${(item.price / 100).toFixed(2)}</p>
                                <p className="flex items-center justify-between text-lg text-gray-700">
                                    ${(item.price * item.quantity / 100).toFixed(2)}
                                    <FaTrash
                                        onClick={() => removeFromCart(item._id)}
                                        className="text-xl text-gray-500 cursor-pointer hover:text-red-600 transition-colors duration-200"
                                    />
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-1/3 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold mb-6 text-gray-800">Order Summary</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between text-gray-700">
                                <span>ITEMS {cart.length}</span>
                                <span>${(totalPrice / 100).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>SHIPPING</span>
                                <span>£{shippingCost.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>PROMO CODE</span>
                                <input
                                    type="text"
                                    placeholder="Enter your code"
                                    className="border p-2 rounded-lg w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex justify-between font-bold text-gray-800">
                                <span>TOTAL COST</span>
                                <span>${((totalPrice / 100) + shippingCost).toFixed(2)}</span>
                            </div>
                        </div>
                        <Link
                            to="/checkout"
                            className="w-full bg-gray-800 text-white py-3 rounded-lg text-center block hover:bg-gray-900 transition-colors duration-300 mt-6 font-semibold"
                        >
                            CHECKOUT
                        </Link>
                        <div className="mt-4 text-center">
                            <Link to="/" className="text-blue-500 hover:text-blue-600 transition-colors">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;