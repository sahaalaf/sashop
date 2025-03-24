import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaLock, FaUser } from 'react-icons/fa';
import axios from 'axios';
import placeholder from "../assets/placeholder.png";

const Login = ({ setToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            toast.error("Please enter both username and password.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/api/users/login", { username, password });
            const { token } = response.data;
            localStorage.setItem("token", token);
            setToken(token);
            toast.success("Login successful! Redirecting...");
            setTimeout(() => navigate("/"), 2000);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || "Login failed");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-6 py-8">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white shadow-xl rounded-2xl flex max-w-4xl w-full"
            >
                {/* Left Side - Form */}
                <div className="w-1/2 p-8 flex flex-col justify-center">
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-integralCF text-2xl font-semibold text-center text-gray-900 mb-2"
                    >
                        Log In
                    </motion.h2>
                    <p className="font-IntegralN text-gray-500 text-center mb-6">Welcome back! Please enter your details.</p>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="relative">
                            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                            />
                        </div>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                            />
                        </div>
                        <div className="text-right">
                            <a href="#" className="text-sm text-purple-600 hover:underline">Forgot password?</a>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all"
                        >
                            Log In
                        </motion.button>
                    </form>
                    <div className="mt-4 text-center">
                        <span className="text-gray-600 text-sm">Don't have an account? </span>
                        <a href="/register" className="text-purple-600 font-medium hover:underline">Sign up</a>
                    </div>
                </div>

                <div className="w-1/2 hidden md:flex items-center justify-center">
                    <img src={placeholder} alt="Login" className="w-96 object-fill" />
                </div>
            </motion.div>
        </div>
    );
};

export default Login;