import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-12 px-6 mt-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

                <div>
                    <h2 className="text-2xl font-bold mb-4">SASHOP</h2>
                    <p className="text-gray-400">
                        Providing quality products since 2025. Shop with confidence.
                    </p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="text-gray-400 hover:text-white transition">Home</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white transition">Shop</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white transition">About Us</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white transition">Contact</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                    <p className="text-gray-400">Email: support@sashop.com</p>
                    <p className="text-gray-400">Phone: (123) 456-7890</p>
                    <p className="text-gray-400">Address: 123 Commerce St, Web City</p>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-700 mt-8 pt-6 text-center">
                <p className="text-gray-400 text-sm">
                    © 2025 SASHOP. All Rights Reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;