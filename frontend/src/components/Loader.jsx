import React from 'react';

const Loader = ({ size = 'medium', color = 'text-blue-600' }) => {
    const sizes = {
        small: 'h-5 w-5',
        medium: 'h-8 w-8',
        large: 'h-12 w-12'
    };

    return (
        <div className={`inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent ${sizes[size]} ${color}`}
            role="status">
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default Loader;