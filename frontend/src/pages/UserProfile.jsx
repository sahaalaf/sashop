import React, { useEffect, useState } from "react";
import axios from "axios";
import placeholder from "../assets/placeholder.png";
import { FaEdit, FaSave, FaTimes, FaSpinner, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Add this import for navigation

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        profilePic: null,
    });
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate(); // Add this for navigation

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token found");

            const response = await axios.get("http://localhost:5000/api/users/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(response.data);
            setFormData({
                username: response.data.username,
                email: response.data.email,
                profilePic: null,
            });
            console.log("Profile pic path:", response.data.profilePic);
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
            setError(error.response?.data?.error || "Failed to load user profile");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, profilePic: e.target.files[0] }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem("token");
            const formDataToSend = new FormData();
            formDataToSend.append("username", formData.username);
            formDataToSend.append("email", formData.email);
            if (formData.profilePic) {
                formDataToSend.append("profilePic", formData.profilePic);
            }

            const response = await axios.put(
                "http://localhost:5000/api/users/profile",
                formDataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setUser(response.data);
            setEditMode(false);
            console.log("Updated profile pic path:", response.data.profilePic);
        } catch (error) {
            console.error("Failed to update profile:", error);
            setError(error.response?.data?.error || "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    const toggleEditMode = () => {
        setEditMode(!editMode);
        setError(null);
    };

    const handleLogout = () => {
        // Clear the token from localStorage
        localStorage.removeItem("token");
        // Redirect to login page (adjust the route as needed)
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <FaSpinner className="animate-spin text-3xl text-purple-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-red-100 p-4 rounded-lg text-red-700 text-md">{error}</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-md text-gray-600">No user data found.</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto w-full">
                {/* Profile Section */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-600 to-gray-800 p-6 text-white relative">
                        <h2 className="text-3xl font-extrabold tracking-tight">
                            Welcome, <span className="text-white font-integralCF">{user.username}</span>! 🌟
                        </h2>
                        <p className="mt-1 text-md opacity-90">Your personal space awaits.</p>
                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="absolute top-4 right-4 flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-md transition-colors text-md"
                        >
                            <FaSignOutAlt className="mr-1" />
                            Logout
                        </button>
                    </div>
                    <div className="p-6">
                        <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-10">
                            {/* Profile Picture */}
                            <div className="flex-shrink-0">
                                {editMode ? (
                                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-purple-500 shadow-sm hover:shadow-md transition-shadow">
                                        <img
                                            src={
                                                formData.profilePic
                                                    ? URL.createObjectURL(formData.profilePic)
                                                    : user.profilePic
                                                        ? `http://localhost:5000${user.profilePic}`
                                                        : placeholder
                                            }
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                            onError={(e) => console.log("Image failed to load:", e.target.src)}
                                        />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-purple-500 shadow-sm hover:shadow-md transition-shadow">
                                        <img
                                            src={
                                                user.profilePic
                                                    ? `http://localhost:5000${user.profilePic}`
                                                    : placeholder
                                            }
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                            onError={(e) => console.log("Image failed to load:", e.target.src)}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* User Details */}
                            <div className="flex-1 space-y-4 w-full">
                                <div>
                                    <label className="text-gray-600 text-md font-medium">Username</label>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-md"
                                        />
                                    ) : (
                                        <p className="text-xl font-semibold text-gray-800 mt-1">{user.username}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="text-gray-600 text-md font-medium">Email</label>
                                    {editMode ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-md"
                                        />
                                    ) : (
                                        <p className="text-xl font-semibold text-gray-800 mt-1">{user.email}</p>
                                    )}
                                </div>

                                {/* Edit/Save Buttons */}
                                <div className="flex space-x-3 pt-3">
                                    {editMode ? (
                                        <>
                                            <button
                                                onClick={handleSave}
                                                disabled={isSaving}
                                                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 shadow-md transition-colors text-md"
                                            >
                                                {isSaving ? (
                                                    <FaSpinner className="animate-spin mr-1" />
                                                ) : (
                                                    <FaSave className="mr-1" />
                                                )}
                                                {isSaving ? "Saving..." : "Save"}
                                            </button>
                                            <button
                                                onClick={toggleEditMode}
                                                className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 shadow-md transition-colors text-md"
                                            >
                                                <FaTimes className="mr-1" />
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={toggleEditMode}
                                            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 shadow-md transition-colors text-md"
                                        >
                                            <FaEdit className="mr-1" />
                                            Edit Profile
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order History */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
                    <div className="bg-gradient-to-r from-gray-600 to-gray-800 p-6 text-white">
                        <h3 className="text-2xl font-integralCF">
                            Order History
                        </h3>
                        <p className="mt-1 text-md opacity-90">Explore your shopping adventures.</p>
                    </div>
                    <div className="p-6">
                        {user.orders && user.orders.length > 0 ? (
                            <div className="space-y-4">
                                {user.orders.map((order) => (
                                    <div
                                        key={order._id}
                                        className="p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row justify-between items-start sm:items-center"
                                    >
                                        <div className="space-y-1">
                                            <p className="text-gray-600 text-md font-medium">Order #{order._id}</p>
                                            <p className="text-xs text-gray-500">
                                                Placed on: {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Items: {order.items.length}
                                            </p>
                                        </div>
                                        <div className="text-right mt-3 sm:mt-0">
                                            <p className="text-lg font-semibold text-gray-800">
                                                ${order.totalPrice.toFixed(2) / 100}
                                            </p>
                                            <p
                                                className={`text-xs font-medium ${order.orderStatus === "processing"
                                                    ? "text-yellow-600"
                                                    : order.orderStatus === "shipped"
                                                        ? "text-blue-600"
                                                        : "text-green-600"
                                                    }`}
                                            >
                                                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 text-md">No orders yet—time to start exploring!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;