import React from 'react';
import { Link } from 'react-router-dom';

const InvalidRoute = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-between relative overflow-hidden">
            {/* Scattered shapes */}
            <div className="absolute top-10 left-10 text-gray-300 text-3xl transform rotate-45">△</div>
            <div className="absolute top-20 right-10 text-gray-300 text-3xl transform -rotate-45">△</div>
            <div className="absolute bottom-20 left-20 text-gray-300 text-3xl transform rotate-90">△</div>
            <div className="absolute bottom-10 right-20 text-gray-300 text-3xl transform -rotate-90">△</div>
            <div className="absolute top-1/3 left-1/4 text-gray-300 text-4xl">⌒</div>
            <div className="absolute top-1/2 right-1/4 text-gray-300 text-4xl transform rotate-180">⌒</div>
            <div className="absolute bottom-1/3 left-1/3 text-gray-300 text-4xl transform rotate-90">⌒</div>
            <div className="absolute bottom-1/4 right-1/3 text-gray-300 text-4xl transform -rotate-90">⌒</div>



            {/* Main 404 content */}
            <div className="flex flex-col items-center justify-center flex-grow">
                <h1 className="text-9xl font-bold text-black">404</h1>
                <p className="mt-4 text-lg text-gray-600">
                    Oops! The page you're looking for doesn't exist.
                </p>
                <Link
                    to="/"
                    className="mt-6 bg-black text-white py-2 px-6 rounded hover:bg-gray-800 transition"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
};

export default InvalidRoute;