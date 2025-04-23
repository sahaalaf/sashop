import React from "react";
import {
    FaTachometerAlt, FaChartBar, FaBox, FaShoppingCart,
    FaUser, FaCog, FaPlus, FaSignOutAlt
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar = ({ view, setView, stats }) => {
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <div className="w-64 bg-gray-800 text-white min-h-screen p-4 flex flex-col">
            <div className="mb-8 mt-4">
                <h1 className="text-2xl font-bold text-center">Admin Dashboard</h1>
            </div>

            <nav className="flex-1">
                <ul className="space-y-2">
                    <li>
                        <button
                            onClick={() => setView("dashboard")}
                            className={`w-full flex items-center p-3 rounded-lg transition-colors ${view === "dashboard" ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
                        >
                            <FaTachometerAlt className="mr-3" />
                            Dashboard
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setView("products")}
                            className={`w-full flex items-center p-3 rounded-lg transition-colors ${view === "products" ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
                        >
                            <FaBox className="mr-3" />
                            Products
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setView("add")}
                            className={`w-full flex items-center p-3 rounded-lg transition-colors ${view === "add" ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
                        >
                            <FaPlus className="mr-3" />
                            Add Product
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setView("orders")}
                            className={`w-full flex items-center p-3 rounded-lg transition-colors ${view === "orders" ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
                        >
                            <FaShoppingCart className="mr-3" />
                            Orders
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setView("users")}
                            className={`w-full flex items-center p-3 rounded-lg transition-colors ${view === "users" ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
                        >
                            <FaUser className="mr-3" />
                            Users
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setView("settings")}
                            className={`w-full flex items-center p-3 rounded-lg transition-colors ${view === "settings" ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
                        >
                            <FaCog className="mr-3" />
                            Settings
                        </button>
                    </li>
                </ul>
            </nav>

            <div className="mt-auto mb-4">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                    <FaSignOutAlt className="mr-3" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;