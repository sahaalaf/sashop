import React, { useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import placeholder from "../assets/placeholder.png";
import axios from "axios";
import ProductCard from "./ProductCard";
import { useCart } from "../context/CartContext";

const Hero = () => {
    const [products, setProducts] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    const [topSelling, setTopSelling] = useState([]);
    const { addToCart } = useCart();

    useEffect(() => {
        axios.get("http://localhost:5000/api/products")
            .then((response) => {
                setProducts(response.data);
                setNewArrivals(response.data.filter(product => product.isNewArrival));
                setTopSelling(response.data.filter(product => product.isTopSelling));
            })
            .catch((error) => console.error("Error fetching products:", error));
    }, []);

    const brands = ["iPhone", "Oppo", "Samsung", "OnePlus", "Vivo", "Xiaomi", "Sony", "Realme"];
    const repeatedBrands = Array(3).fill(brands).flat();

    return (
        <div className="bg-gray-50">
            {/* Hero Section */}
            <div className="flex items-center justify-center h-[400px] md:h-[500px] lg:h-[560px]">
                <div className="w-1/2 pr-6 pl-6 text-black">
                    <h1 className="font-integralCF text-4xl md:text-5xl lg:text-7xl font-bold">
                        Find the Perfect Phone Today
                    </h1>
                    <p className="mt-8 text-lg md:text-xl lg:text-xl">
                        Discover the latest trends and shop with confidence!
                    </p>
                    <button className="mt-6 bg-black text-white flex items-center px-6 py-3 rounded-lg hover:bg-gray-800 transition duration-300">
                        Shop Now <FaArrowRight className="ml-2" />
                    </button>
                </div>
                <img src={placeholder} alt="Hero Banner" className="w-1/3 object-cover" />
            </div>

            {/* Scrolling Brands */}
            <div className="bg-black text-white h-[60px] flex items-center overflow-hidden">
                <div className="animate-scroll flex gap-12 text-lg font-semibold tracking-wide whitespace-nowrap">
                    {repeatedBrands.map((brand, index) => (
                        <span key={index} className="font-sans">{brand}</span>
                    ))}
                </div>
            </div>

            {/* New Arrivals Section */}
            <section className="container mx-auto p-6 mt-12 border-b">
                <h2 className="font-integralCF text-4xl font-bold text-center mb-8">New Arrivals</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {newArrivals.length > 0 ? (
                        newArrivals.map((product) => (
                            <ProductCard key={product._id} product={product} addToCart={addToCart} />
                        ))
                    ) : (
                        <p className="text-center col-span-4">No new arrivals yet.</p>
                    )}
                </div>
            </section>

            {/* Top Selling Section */}
            <section className="container mx-auto p-6 mt-12 border-b">
                <h2 className="font-integralCF text-4xl font-bold text-center mb-8">Top Selling</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {topSelling.length > 0 ? (
                        topSelling.map((product) => (
                            <ProductCard key={product._id} product={product} addToCart={addToCart} />
                        ))
                    ) : (
                        <p className="text-center col-span-4">No top-selling products yet.</p>
                    )}
                </div>
            </section>

            {/* Our Products Section */}
            <section className="container mx-auto p-6 mt-12">
                <h2 className="font-integralCF text-4xl font-bold text-center mb-8">Our Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <ProductCard key={product._id} product={product} addToCart={addToCart} />
                        ))
                    ) : (
                        <p className="text-center col-span-4">No products available yet.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Hero;