import React from 'react';

const TopStrip = () => {
    return (
        <div className="bg-black text-white text-center py-2">
            <p className="text-sm">
                Sign up and get <span className="font-bold">20% off</span> your first order.{" "}
                <a href="/register" className="underline hover:text-yellow-300">
                    Shop Now
                </a>
            </p>
        </div>
    );
};

export default TopStrip;