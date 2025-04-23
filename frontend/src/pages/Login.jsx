import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaLock, FaUser, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import placeholder from '../assets/placeholder.png';

const Login = ({ setToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const backgroundStyle = {
        'background-image': `
          radial-gradient(
            circle 5px at top left,
            rgba(226, 226, 226, 0.1) 0%,
            rgba(226, 226, 226, 0.1) 50%,
            rgba(201, 201, 201, 0.1) 50%,
            rgba(201, 201, 201, 0.1) 30%,
            transparent 30%,
            transparent 50%
          ),
          linear-gradient(
            90deg,
            rgb(51, 51, 51),
            rgb(51, 51, 51)
          )
        `,
        'background-size': '11px 11px'
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post(
                'http://localhost:5000/api/auth/login',
                { username, password },
                { headers: { 'Content-Type': 'application/json' } }
            );

            const { token, username: userUsername, _id, email, profilePic } = response.data;

            if (!token) {
                throw new Error('No token received from server');
            }

            const user = { _id, username: userUsername, email, profilePic };

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setToken(token);

            toast.success(`Welcome back, ${userUsername}`);
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={backgroundStyle} className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-8">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white/10 backdrop-blur-lg shadow-lg rounded-2xl flex flex-col md:flex-row max-w-4xl w-full border border-white/20"
            >
                <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-center order-2 md:order-1">
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-2xl font-bold text-center text-white mb-2"
                    >
                        Log In
                    </motion.h2>
                    <p className="text-gray-300 text-center mb-6">
                        Welcome back! Please enter your details.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-10 pr-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
                                autoComplete="username"
                            />
                        </div>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
                                autoComplete="current-password"
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    className="mr-2 rounded bg-white/10 border-white/20 text-gray-500 focus:ring-gray-500"
                                />
                                <label htmlFor="rememberMe" className="text-sm text-gray-300">
                                    Remember me
                                </label>
                            </div>
                            <a href="/forgot-password" className="text-sm text-gray-400 hover:underline">
                                Forgot password?
                            </a>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-gray-600/80 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-gray-700/80 transition-all flex items-center justify-center border border-white/20"
                        >
                            {isLoading ? (
                                <>
                                    <FaSpinner className="animate-spin mr-2" />
                                    Logging in...
                                </>
                            ) : (
                                'Log In'
                            )}
                        </motion.button>
                    </form>
                    <div className="mt-6 text-center">
                        <span className="text-gray-300 text-sm">Don't have an account? </span>
                        <a href="/register" className="text-gray-400 font-medium hover:underline">
                            Sign up
                        </a>
                    </div>
                </div>
                <div className="w-full md:w-1/2 hidden md:flex items-center justify-center bg-white/10 backdrop-blur-lg rounded-r-2xl order-1 md:order-2 border-l border-white/20">
                    <img
                        src={placeholder}
                        alt="Login"
                        className="w-4/5 max-w-md object-contain p-8 filter drop-shadow-lg"
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default Login;