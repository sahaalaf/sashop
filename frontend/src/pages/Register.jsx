import { useState } from 'react';
import { motion } from "framer-motion";
import { FaUser, FaLock, FaEnvelope, FaImage } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import placeholder from "../assets/placeholder.png";

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profilePic, setProfilePic] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }

        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('profilePic', profilePic);

        try {
            await axios.post('http://localhost:5000/api/users/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success('User registered successfully!');
        } catch (err) {
            toast.error('Failed to register. Try again!');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-white rounded-lg shadow-lg flex w-full max-w-4xl"
            >
                {/* Left Image Section */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="hidden lg:flex items-center justify-center w-1/2  rounded-l-lg"
                >
                    <img src={placeholder} alt="Register" className="w-96 object-fill" />
                </motion.div>

                {/* Right Form Section */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full lg:w-1/2 p-8"
                >
                    <h2 className="font-integralCF text-3xl font-semibold text-center text-gray-800 mb-6">Register</h2>
                    <p className="text-gray-500 text-center mb-6">
                        Create an account to get started!
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username Input */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="flex items-center border border-gray-300 rounded-lg p-3"
                        >
                            <FaUser className="text-gray-500 mr-2" />
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full focus:outline-none"
                                required
                            />
                        </motion.div>

                        {/* Email Input */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex items-center border border-gray-300 rounded-lg p-3"
                        >
                            <FaEnvelope className="text-gray-500 mr-2" />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full focus:outline-none"
                                required
                            />
                        </motion.div>

                        {/* Password Input */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex items-center border border-gray-300 rounded-lg p-3"
                        >
                            <FaLock className="text-gray-500 mr-2" />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full focus:outline-none"
                                required
                            />
                        </motion.div>

                        {/* Confirm Password Input */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex items-center border border-gray-300 rounded-lg p-3"
                        >
                            <FaLock className="text-gray-500 mr-2" />
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full focus:outline-none"
                                required
                            />
                        </motion.div>

                        {/* Profile Picture Input */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex items-center border border-gray-300 rounded-lg p-3"
                        >
                            <FaImage className="text-gray-500 mr-2" />
                            <input
                                type="file"
                                onChange={(e) => setProfilePic(e.target.files[0])}
                                className="w-full focus:outline-none"
                                required
                            />
                        </motion.div>

                        {/* Submit Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition duration-300"
                        >
                            Register
                        </motion.button>
                    </form>

                    {/* Redirect to Login */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mt-4 text-center"
                    >
                        <p className="text-gray-500">
                            Already have an account? <a href="/login" className="text-purple-600 font-semibold hover:underline">Log in</a>
                        </p>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Register;