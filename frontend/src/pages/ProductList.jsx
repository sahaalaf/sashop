import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search).get('search') || '';

    useEffect(() => {
        axios.get('http://localhost:5000/api/products')
            .then((response) => {
                setProducts(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (!searchQuery) {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter((product) =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
    }, [searchQuery, products]);

    return (
        <div className="container mx-auto p-4">
            <h2 className="font-integralCF text-4xl font-bold mb-6 mt-12 text-center">
                <span className='font-baloo boldonse-regular'>
                    {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
                </span>
            </h2>

            {loading ? (
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-600">
                    {searchQuery ? `No products found for "${searchQuery}".` : 'No products available.'}
                </p>
            )}
        </div>
    );
};

export default ProductList;