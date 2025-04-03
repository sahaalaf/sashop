import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaArrowRight, FaBox } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const shippingCost = 5.00;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
                            <FaShoppingBag /> Your Bag <span className="font-IntegralN"></span>({cart.length} items)
                        </h2>
                        <p className="mt-2 text-base opacity-90">Review your shopping selections</p>
                    </div>
                    <div className="p-8">
                        {cart.length === 0 ? (
                            <p className="text-gray-600 text-base flex items-center gap-2">
                                <FaShoppingBag className="text-gray-600" /> Your cart is empty.{' '}
                                <Link to="/" className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-1">
                                    Continue shopping <FaArrowRight className="text-sm" />
                                </Link>
                            </p>
                        ) : (
                            <div className="flex flex-col lg:flex-row gap-8">
                                <div className="lg:w-2/3 space-y-6">
                                    <div className="grid grid-cols-5 gap-4 font-semibold text-gray-700 border-b pb-4 text-sm">
                                        <span className="col-span-2">PRODUCT DETAILS</span>
                                        <span>QUANTITY</span>
                                        <span>PRICE</span>
                                        <span>TOTAL</span>
                                    </div>
                                    {cart.map((item, index) => (
                                        <div
                                            key={index}
                                            className="grid grid-cols-5 gap-4 items-center border-b pb-4 rounded-lg p-2 transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
                                            style={{
                                                backgroundImage: containerGradient,
                                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                            }}
                                        >
                                            <div className="col-span-2 flex items-center">
                                                <img
                                                    src={`http://localhost:5000${item.image}`}
                                                    alt={item.name}
                                                    className="w-20 h-20 object-cover rounded-lg mr-4 border-2 border-gray-400 shadow-md"
                                                />
                                                <h3 className="text-base font-semibold text-gray-800">{item.name}</h3>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => decreaseQuantity(item._id, item.quantity - 1)}
                                                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <FaMinus className="text-xs text-gray-600" />
                                                </button>
                                                <span className="text-base text-gray-700">{item.quantity}</span>
                                                <button
                                                    onClick={() => increaseQuantity(item._id, item.quantity + 1)}
                                                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                                                >
                                                    <FaPlus className="text-xs text-gray-600" />
                                                </button>
                                            </div>
                                            <p className="text-base text-gray-700">${(item.price / 100).toFixed(2)}</p>
                                            <div className="flex items-center justify-between">
                                                <p className="text-base text-gray-700">
                                                    ${(item.price * item.quantity / 100).toFixed(2)}
                                                </p>
                                                <FaTrash
                                                    onClick={() => removeFromCart(item._id)}
                                                    className="text-lg text-gray-600 cursor-pointer hover:text-red-600 transition-colors duration-200"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div
                                    className="lg:w-1/3 p-6 rounded-lg shadow-md"
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
                                            <span>${(totalPrice / 100).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-base">Shipping</span>
                                            <span>${shippingCost.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-gray-800 text-base">
                                            <span>TOTAL COST</span>
                                            <span>${((totalPrice / 100) + shippingCost).toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <Link
                                        to="/checkout"
                                        className="w-full mt-6 flex items-center justify-center px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:opacity-50 shadow-md transition-colors text-base"
                                    >
                                        Checkout <FaArrowRight className="ml-2" />
                                    </Link>
                                    <div className="mt-4 text-center">
                                        <Link
                                            to="/"
                                            className="text-gray-600 hover:text-gray-800 transition-colors text-base flex items-center justify-center gap-1"
                                        >
                                            <FaShoppingBag className="text-sm" /> Continue Shopping
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;