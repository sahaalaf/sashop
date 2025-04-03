import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaEnvelope, FaImage, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import placeholder from "../assets/placeholder.png";

const Register = ({ setToken }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [profilePic, setProfilePic] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match!');
            setIsLoading(false);
            return;
        }

        const data = new FormData();
        data.append('username', formData.username.trim());
        data.append('email', formData.email.trim().toLowerCase());
        data.append('password', formData.password);
        if (profilePic) {
            data.append('profilePic', profilePic);
        }

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                const { token, username, _id, email, profilePic } = response.data.data;

                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify({
                    _id,
                    username,
                    email,
                    profilePic
                }));
                setToken(token);

                toast.success(`Welcome, ${username}! Account created successfully`);
                navigate("/");
            } else {
                toast.error(response.data.error || 'Registration failed. Please try again.');
            }
        } catch (err) {
            if (err.response) {
                const errorMsg = err.response.data?.error ||
                    err.response.data?.message ||
                    'Registration failed. Please try again.';
                toast.error(errorMsg);
            } else if (err.request) {
                toast.error('No response from server. Please check your connection.');
            } else {

                toast.error('An error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 py-8 bg-gray-50">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white shadow-xl rounded-2xl flex flex-col md:flex-row max-w-4xl w-full"
            >
                <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-center order-2 md:order-1">
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-integralCF text-2xl font-semibold text-center text-gray-900 mb-2"
                    >
                        Create Account
                    </motion.h2>
                    <p className="font-IntegralN text-gray-500 text-center mb-6">
                        Join our community today!
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                                autoComplete="username"
                                required
                            />
                        </div>
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                                autoComplete="email"
                                required
                            />
                        </div>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                                autoComplete="new-password"
                                minLength="8"
                                required
                            />
                        </div>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                                autoComplete="new-password"
                                required
                            />
                        </div>
                        <div className="relative">
                            <FaImage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setProfilePic(e.target.files[0])}
                                className="w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                            />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <FaSpinner className="animate-spin mr-2" />
                                    Creating account...
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </motion.button>
                    </form>
                    <div className="mt-6 text-center">
                        <span className="text-gray-600 text-sm">Already have an account? </span>
                        <a href="/login" className="text-gray-600 font-medium hover:underline">
                            Log in
                        </a>
                    </div>
                </div>
                <div className="w-full md:w-1/2 hidden md:flex items-center justify-center bg-gradient-to-br from-gray-500 to-gray-800 rounded-r-2xl order-1 md:order-2">
                    <img
                        src={placeholder}
                        alt="Register"
                        className="w-4/5 max-w-md object-contain p-8"
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default Register;