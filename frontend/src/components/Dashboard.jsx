import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaList } from "react-icons/fa"; // Icons for sidebar

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        name: "",
        price: "",
        image: "",
        description: "",
        quantity: "",
        isNewArrival: false,
        isTopSelling: false,
    });
    const [editingProduct, setEditingProduct] = useState(null);
    const [view, setView] = useState("add");

    // Fetch products from backend
    useEffect(() => {
        axios.get("http://localhost:5000/api/products")
            .then((response) => setProducts(response.data))
            .catch((error) => console.error("Error fetching products:", error));
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (editingProduct) {
            setEditingProduct({
                ...editingProduct,
                [name]: type === "checkbox" ? checked : value
            });
        } else {
            setNewProduct({
                ...newProduct,
                [name]: type === "checkbox" ? checked : value
            });
        }
    };

    // Remove background from image
    const removeImageBackground = async (imageUrl) => {
        const encodedParams = new URLSearchParams();
        encodedParams.set("image_url", imageUrl);

        const options = {
            method: "POST",
            url: "https://remove-background18.p.rapidapi.com/public/remove-background",
            headers: {
                "x-rapidapi-key": "6902e3bf33msh7eb784f595bcf80p11fabajsncaa1c57a21e0",
                "x-rapidapi-host": "remove-background18.p.rapidapi.com",
                "Content-Type": "application/x-www-form-urlencoded",
                accept: "application/json"
            },
            data: encodedParams,
        };

        try {
            const response = await axios.request(options);

            if (response.data && response.data.url) {
                return response.data.url;
            } else {
                console.error("Unexpected API Response:", response.data);
                return null;
            }
        } catch (error) {
            console.error("Background Removal API Error:", error.response?.data || error.message);
            return null;
        }
    };

    // Add product to backend
    const handleAddProduct = async (event) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.log("No token found. Please log in.");
                return;
            }

            // Ensure image background removal does not break the request
            let processedImage = await removeImageBackground(newProduct.image);
            if (!processedImage) {
                console.error("Background removal failed, using original image.");
                processedImage = newProduct.image; // Fallback to original
            }

            const productData = { ...newProduct, image: processedImage };

            const response = await axios.post(
                "http://localhost:5000/api/products",
                productData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Product added successfully:", response.data);
            setProducts([...products, response.data]);

            // Clear the form
            setNewProduct({
                name: "",
                price: "",
                image: "",
                description: "",
                quantity: "",
                isNewArrival: false,
                isTopSelling: false,
            });
        } catch (error) {
            console.error("Error adding product:", error.response?.data || error.message);
        }
    };

    // Edit product in backend
    const handleEditProduct = async (event) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.log("No token found. Please log in.");
                return;
            }

            // Ensure image background removal does not break the request
            let processedImage = await removeImageBackground(editingProduct.image);
            if (!processedImage) {
                console.error("Background removal failed, using original image.");
                processedImage = editingProduct.image;
            }

            const productData = { ...editingProduct, image: processedImage };

            const response = await axios.put(
                `http://localhost:5000/api/products/${editingProduct._id}`,
                productData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Product updated successfully:", response.data);

            // Update the products list
            setProducts(products.map(product =>
                product._id === editingProduct._id ? response.data : product
            ));

            // Clear the editing state
            setEditingProduct(null);
        } catch (error) {
            console.error("Error updating product:", error.response?.data || error.message);
        }
    };

    // Delete product from backend
    const handleDeleteProduct = async (productId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.log("No token found. Please log in.");
                return;
            }

            // Make the DELETE request to your backend API
            const response = await axios.delete(`http://localhost:5000/api/products/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // If the product was deleted successfully, update the state to remove the deleted product
            if (response.status === 200) {
                setProducts(products.filter(product => product._id !== productId));
                console.log("Product deleted successfully:", response.data);
            }
        } catch (error) {
            console.error("Error deleting product:", error.response?.data || error.message);
        }
    };

    // Handle edit button click
    const handleEditClick = (product) => {
        setEditingProduct(product);
        setView("add");
    };

    return (
        <div className="flex min-h-screen bg-white">
            <div className="w-64 bg-gray-50 p-6 border-r border-gray-200">
                <h2 className="text-xl font-bold mb-8 text-gray-800">Admin Dashboard</h2>
                <ul className="space-y-3">
                    <li
                        className={`flex items-center p-3 cursor-pointer rounded-lg transition-all ${view === "add" ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
                            }`}
                        onClick={() => setView("add")}
                    >
                        <FaPlus className="mr-3" />
                        Add Products
                    </li>
                    <li
                        className={`flex items-center p-3 cursor-pointer rounded-lg transition-all ${view === "show" ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
                            }`}
                        onClick={() => setView("show")}
                    >
                        <FaList className="mr-3" />
                        Show Products
                    </li>
                </ul>
            </div>

            <div className="flex-1 p-8 bg-gray-50">
                {view === "add" ? (
                    <form onSubmit={editingProduct ? handleEditProduct : handleAddProduct} className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
                        <h3 className="text-2xl font-bold mb-8 text-gray-800">
                            {editingProduct ? "Edit Product" : "Add New Product"}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editingProduct ? editingProduct.name : newProduct.name}
                                    onChange={handleChange}
                                    placeholder="Product Name"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={editingProduct ? editingProduct.price : newProduct.price}
                                    onChange={handleChange}
                                    placeholder="Price"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                                <input
                                    type="text"
                                    name="image"
                                    value={editingProduct ? editingProduct.image : newProduct.image}
                                    onChange={handleChange}
                                    placeholder="Image URL"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={editingProduct ? editingProduct.description : newProduct.description}
                                    onChange={handleChange}
                                    placeholder="Description"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="4"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={editingProduct ? editingProduct.quantity : newProduct.quantity}
                                    onChange={handleChange}
                                    placeholder="Quantity"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="flex items-center space-x-4">
                                <label className="flex items-center text-sm text-gray-700">
                                    <input
                                        type="checkbox"
                                        name="isNewArrival"
                                        checked={editingProduct ? editingProduct.isNewArrival : newProduct.isNewArrival}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    New Arrival
                                </label>
                                <label className="flex items-center text-sm text-gray-700">
                                    <input
                                        type="checkbox"
                                        name="isTopSelling"
                                        checked={editingProduct ? editingProduct.isTopSelling : newProduct.isTopSelling}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    Top Selling
                                </label>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full mt-6 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            {editingProduct ? "Update Product" : "Add Product"}
                        </button>
                        {editingProduct && (
                            <button
                                type="button"
                                onClick={() => setEditingProduct(null)}
                                className="w-full mt-4 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </form>
                ) : (
                    // Product List
                    <div className="max-w-7xl mx-auto">
                        <h3 className="text-2xl font-bold mb-8 text-gray-800">Products List</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <div
                                    key={product._id}
                                    className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                                >
                                    <img
                                        src={product.image || "https://via.placeholder.com/150"}
                                        alt={product.name}
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/150";
                                        }}
                                    />
                                    <h4 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h4>
                                    <p className="text-sm text-gray-600 mb-4">${(product.price / 100).toFixed(2)}</p>
                                    <div className="flex gap-2 mb-4">
                                        {product.isNewArrival && (
                                            <span className="bg-green-500 text-white px-2 py-1 text-xs rounded">
                                                New Arrival
                                            </span>
                                        )}
                                        {product.isTopSelling && (
                                            <span className="bg-yellow-500 text-white px-2 py-1 text-xs rounded">
                                                Top Selling
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEditClick(product)}
                                            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProduct(product._id)}
                                            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;