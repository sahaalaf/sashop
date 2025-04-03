import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaLinkedinIn, FaGithub } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-12 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Contact Info Section */}
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-3">
                        <FaMapMarkerAlt className="text-gray-400" />
                        <p className="text-gray-400">Attock, Pakistan</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <FaPhone className="text-gray-400" />
                        <p className="text-gray-400">+92 3149466389</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <FaEnvelope className="text-gray-400" />
                        <a href="mailto:sahaal@sashop.com" className="text-blue-500 hover:underline">
                            sahaal@sashop.com
                        </a>
                    </div>
                </div>

                {/* About the Company Section */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">About the Company</h3>
                    <p className="text-gray-400 mb-6">
                        SASHOP is an e-commerce platform dedicated to selling a wide range of phones, offering the latest models with competitive prices and reliable service.
                    </p>
                    {/* Social Media Icons */}
                    <div className="flex space-x-4">
                        <a href="https://www.linkedin.com/in/sahal-sajeed-aa736721b/" className="bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition">
                            <FaLinkedinIn className="text-white" />
                        </a>
                        <a href="https://github.com/sahaalaf" className="bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition">
                            <FaGithub className="text-white" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;