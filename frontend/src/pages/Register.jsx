import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaEnvelope, FaImage, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import placeholder from '../assets/placeholder.png';

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
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                const { token, username, _id, email, profilePic } = response.data.data;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify({ _id, username, email, profilePic }));
                setToken(token);
                toast.success(`Welcome, ${username}! Account created successfully`);
                navigate('/');
            } else {
                toast.error(response.data.error || 'Registration failed. Please try again.');
            }
        } catch (err) {
            if (err.response) {
                const errorMsg = err.response.data?.error || err.response.data?.message || 'Registration failed. Please try again.';
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
                        Create Account
                    </motion.h2>
                    <p className="text-gray-300 text-center mb-6">
                        Join Sashop today! Start shopping.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full pl-10 pr-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
                                autoComplete="username"
                                required
                            />
                        </div>
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
                                autoComplete="email"
                                required
                            />
                        </div>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
                                autoComplete="new-password"
                                minLength="8"
                                required
                            />
                        </div>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full pl-10 pr-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
                                autoComplete="new-password"
                                required
                            />
                        </div>
                        <div className="relative">
                            <FaImage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setProfilePic(e.target.files[0])}
                                className="w-full pl-10 pr-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-500 file:text-white hover:file:bg-gray-600 transition-all"
                            />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-gray-600 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-gray-700/80 transition-all flex items-center justify-center border border-white/20"
                        >
                            {isLoading ? (
                                <>
                                    <FaSpinner className="animate-spin mr-2" />
                                    Creating account...
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </motion.button>
                    </form>
                    <div className="mt-6 text-center">
                        <span className="text-gray-300 text-sm">Already have an account? </span>
                        <a href="/login" className="text-gray-400 font-medium hover:underline">
                            Log in
                        </a>
                    </div>
                </div>
                <div className="w-full md:w-1/2 hidden md:flex items-center justify-center bg-white/10 backdrop-blur-lg rounded-r-2xl order-1 md:order-2 border-l border-white/20">
                    <img
                        src={placeholder}
                        alt="Register"
                        className="w-4/5 max-w-md object-contain p-8 filter drop-shadow-lg"
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default Register;