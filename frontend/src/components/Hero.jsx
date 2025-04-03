import React, { useState, useEffect } from "react";
import { FaArrowRight, FaChevronDown } from "react-icons/fa";
import placeholder from "../assets/placeholder.png";
import axios from "axios";
import ProductCard from "./ProductCard";
import { useCart } from "../context/CartContext";

const Hero = () => {
    const [products, setProducts] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    const [topSelling, setTopSelling] = useState([]);
    const [visibleNewArrivals, setVisibleNewArrivals] = useState(4);
    const [visibleTopSelling, setVisibleTopSelling] = useState(4);
    const [visibleProducts, setVisibleProducts] = useState(4);
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

    const backgroundStyle = {
        backgroundImage: `
            linear-gradient(158deg, rgba(84, 84, 84, 0.03) 0%, rgba(84, 84, 84, 0.03) 20%,rgba(219, 219, 219, 0.03) 20%, rgba(219, 219, 219, 0.03) 40%,rgba(54, 54, 54, 0.03) 40%, rgba(54, 54, 54, 0.03) 60%,rgba(99, 99, 99, 0.03) 60%, rgba(99, 99, 99, 0.03) 80%,rgba(92, 92, 92, 0.03) 80%, rgba(92, 92, 92, 0.03) 100%),
            linear-gradient(45deg, rgba(221, 221, 221, 0.02) 0%, rgba(221, 221, 221, 0.02) 14.286%,rgba(8, 8, 8, 0.02) 14.286%, rgba(8, 8, 8, 0.02) 28.572%,rgba(52, 52, 52, 0.02) 28.572%, rgba(52, 52, 52, 0.02) 42.858%,rgba(234, 234, 234, 0.02) 42.858%, rgba(234, 234, 234, 0.02) 57.144%,rgba(81, 81, 81, 0.02) 57.144%, rgba(81, 81, 81, 0.02) 71.42999999999999%,rgba(239, 239, 239, 0.02) 71.43%, rgba(239, 239, 239, 0.02) 85.71600000000001%,rgba(187, 187, 187, 0.02) 85.716%, rgba(187, 187, 187, 0.02) 100.002%),
            linear-gradient(109deg, rgba(33, 33, 33, 0.03) 0%, rgba(33, 33, 33, 0.03) 12.5%,rgba(147, 147, 147, 0.03) 12.5%, rgba(147, 147, 147, 0.03) 25%,rgba(131, 131, 131, 0.03) 25%, rgba(131, 131, 131, 0.03) 37.5%,rgba(151, 151, 151, 0.03) 37.5%, rgba(151, 151, 151, 0.03) 50%,rgba(211, 211, 211, 0.03) 50%, rgba(211, 211, 211, 0.03) 62.5%,rgba(39, 39, 39, 0.03) 62.5%, rgba(39, 39, 39, 0.03) 75%,rgba(55, 55, 55, 0.03) 75%, rgba(55, 55, 55, 0.03) 87.5%,rgba(82, 82, 82, 0.03) 87.5%, rgba(82, 82, 82, 0.03) 100%),
            linear-gradient(348deg, rgba(42, 42, 42, 0.02) 0%, rgba(42, 42, 42, 0.02) 20%,rgba(8, 8, 8, 0.02) 20%, rgba(8, 8, 8, 0.02) 40%,rgba(242, 242, 242, 0.02) 40%, rgba(242, 242, 242, 0.02) 60%,rgba(42, 42, 42, 0.02) 60%, rgba(42, 42, 42, 0.02) 80%,rgba(80, 80, 80, 0.02) 80%, rgba(80, 80, 80, 0.02) 100%),
            linear-gradient(120deg, rgba(106, 106, 106, 0.03) 0%, rgba(106, 106, 106, 0.03) 14.286%,rgba(67, 67, 67, 0.03) 14.286%, rgba(67, 67, 67, 0.03) 28.572%,rgba(134, 134, 134, 0.03) 28.572%, rgba(134, 134, 134, 0.03) 42.858%,rgba(19, 19, 19, 0.03) 42.858%, rgba(19, 19, 19, 0.03) 57.144%,rgba(101, 101, 101, 0.03) 57.144%, rgba(101, 101, 101, 0.03) 71.42999999999999%,rgba(205, 205, 205, 0.03) 71.43%, rgba(205, 205, 205, 0.03) 85.71600000000001%,rgba(53, 53, 53, 0.03) 85.716%, rgba(53, 53, 53, 0.03) 100.002%),
            linear-gradient(45deg, rgba(214, 214, 214, 0.03) 0%, rgba(214, 214, 214, 0.03) 16.667%,rgba(255, 255, 255, 0.03) 16.667%, rgba(255, 255, 255, 0.03) 33.334%,rgba(250, 250, 250, 0.03) 33.334%, rgba(250, 250, 250, 0.03) 50.001000000000005%,rgba(231, 231, 231, 0.03) 50.001%, rgba(231, 231, 231, 0.03) 66.668%,rgba(241, 241, 241, 0.03) 66.668%, rgba(241, 241, 241, 0.03) 83.33500000000001%,rgba(31, 31, 31, 0.03) 83.335%, rgba(31, 31, 31, 0.03) 100.002%),
            linear-gradient(59deg, rgba(224, 224, 224, 0.03) 0%, rgba(224, 224, 224, 0.03) 12.5%,rgba(97, 97, 97, 0.03) 12.5%, rgba(97, 97, 97, 0.03) 25%,rgba(143, 143, 143, 0.03) 25%, rgba(143, 143, 143, 0.03) 37.5%,rgba(110, 110, 110, 0.03) 37.5%, rgba(110, 110, 110, 0.03) 50%,rgba(34, 34, 34, 0.03) 50%, rgba(34, 34, 34, 0.03) 62.5%,rgba(155, 155, 155, 0.03) 62.5%, rgba(155, 155, 155, 0.03) 75%,rgba(249, 249, 249, 0.03) 75%, rgba(249, 249, 249, 0.03) 87.5%,rgba(179, 179, 179, 0.03) 87.5%, rgba(179, 179, 179, 0.03) 100%),
            linear-gradient(241deg, rgba(58, 58, 58, 0.02) 0%, rgba(58, 58, 58, 0.02) 25%,rgba(124, 124, 124, 0.02) 25%, rgba(124, 124, 124, 0.02) 50%,rgba(254, 254, 254, 0.02) 50%, rgba(254, 254, 254, 0.02) 75%,rgba(52, 52, 52, 0.02) 75%, rgba(52, 52, 52, 0.02) 100%),
            linear-gradient(90deg, #ffffff, #ffffff)
        `,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
    };

    const showMoreNewArrivals = () => {
        setVisibleNewArrivals(prev => prev + 4);
    };

    const showMoreTopSelling = () => {
        setVisibleTopSelling(prev => prev + 4);
    };

    const showMoreProducts = () => {
        setVisibleProducts(prev => prev + 4);
    };

    return (
        <div style={backgroundStyle}>
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
            <section className="container mx-auto px-6 py-12">
                <h2 className="font-integralCF text-4xl font-bold text-center mb-8">New Arrivals</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {newArrivals.length > 0 ? (
                        newArrivals.slice(0, visibleNewArrivals).map((product) => (
                            <ProductCard key={product._id} product={product} addToCart={addToCart} />
                        ))
                    ) : (
                        <p className="text-center col-span-4">No new arrivals yet.</p>
                    )}
                </div>
                {newArrivals.length > visibleNewArrivals && (
                    <div className="text-center mt-8">
                        <button
                            onClick={showMoreNewArrivals}
                            className="flex items-center justify-center mx-auto px-6 py-2 border border-black rounded-lg hover:bg-gray-100 transition duration-300"
                        >
                            Show More <FaChevronDown className="ml-2" />
                        </button>
                    </div>
                )}
            </section>

            <div className="border-t border-gray-200 mx-auto w-11/12"></div>

            {/* Top Selling Section */}
            <section className="container mx-auto px-6 py-12">
                <h2 className="font-integralCF text-4xl font-bold text-center mb-8">Top Selling</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {topSelling.length > 0 ? (
                        topSelling.slice(0, visibleTopSelling).map((product) => (
                            <ProductCard key={product._id} product={product} addToCart={addToCart} />
                        ))
                    ) : (
                        <p className="text-center col-span-4">No top-selling products yet.</p>
                    )}
                </div>
                {topSelling.length > visibleTopSelling && (
                    <div className="text-center mt-8">
                        <button
                            onClick={showMoreTopSelling}
                            className="flex items-center justify-center mx-auto px-6 py-2 border border-black rounded-lg hover:bg-gray-100 transition duration-300"
                        >
                            Show More <FaChevronDown className="ml-2" />
                        </button>
                    </div>
                )}
            </section>

            <p class="relative flex items-center justify-center">
                <span class="grow border-t border-gray-300"></span>
                <span class="mx-4 shrink-0 text-[28px]">✧</span>
                <span class="grow border-t border-gray-300"></span>
            </p>

            {/* Our Products Section */}
            <section className="container mx-auto px-6 py-12">
                <h2 className="font-integralCF text-4xl font-bold text-center mb-8">Our Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.length > 0 ? (
                        products.slice(0, visibleProducts).map((product) => (
                            <ProductCard key={product._id} product={product} addToCart={addToCart} />
                        ))
                    ) : (
                        <p className="text-center col-span-4">No products available yet.</p>
                    )}
                </div>
                {products.length > visibleProducts && (
                    <div className="text-center mt-8">
                        <button
                            onClick={showMoreProducts}
                            className="flex items-center justify-center mx-auto px-6 py-2 border border-black rounded-lg hover:bg-gray-100 transition duration-300"
                        >
                            Show More <FaChevronDown className="ml-2" />
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Hero;