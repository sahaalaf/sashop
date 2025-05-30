import React from "react";
import axios from "axios";
import { FaSpinner, FaPlus, FaUpload } from "react-icons/fa";
import Papa from "papaparse";

const AddProductForm = ({
    newProduct,
    setNewProduct,
    editingProduct,
    setEditingProduct,
    setProducts,
    products,
    loading,
    setLoading,
    setError,
    onSuccess,
    setView,
}) => {
    const [csvFile, setCsvFile] = React.useState(null);
    const [csvLoading, setCsvLoading] = React.useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (editingProduct) {
            setEditingProduct({ ...editingProduct, [name]: type === "checkbox" ? checked : value });
        } else {
            setNewProduct({ ...newProduct, [name]: type === "checkbox" ? checked : value });
        }
    };

    const removeImageBackground = async (imageUrl) => {
        const encodedParams = new URLSearchParams();
        encodedParams.set("image_url", imageUrl);

        const options = {
            method: "POST",
            url: "https://remove-background18.p.rapidapi.com/public/remove-background",
            headers: {
                "x-rapidapi-key": "32b989b859msh31b48af0a4716b5p16f232jsn80cd3746cc99",
                "x-rapidapi-host": "remove-background18.p.rapidapi.com",
                "Content-Type": "application/x-www-form-urlencoded",
                accept: "application/json",
            },
            data: encodedParams,
        };

        try {
            const response = await axios.request(options);
            return response.data?.url;
        } catch (error) {
            console.error("Background Removal API Error:", error.response?.data || error.message);
            return null;
        }
    };

    const handleAddProduct = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token found. Please log in.");
            const processedImage = await removeImageBackground(newProduct.image);
            const productData = { ...newProduct, image: processedImage || newProduct.image };
            const response = await axios.post(
                "http://localhost:5000/api/products",
                productData,
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );
            setProducts([...products, response.data]);
            setNewProduct({
                name: "", brand: "", price: "", image: "", description: "", quantity: "",
                isNewArrival: false, isTopSelling: false, networkTechnology: "", displaySize: "",
                displayResolution: "", OS: "", CPU: "", RAM: "", internalMemory: "", primaryCamera: "",
                battery: "", approxPriceEUR: "",
            });
            if (onSuccess) onSuccess();
            setView("view");
        } catch (error) {
            console.error("Error adding product:", error.response?.data || error.message);
            setError(error.response?.data?.error || "Failed to add product.");
        } finally {
            setLoading(false);
        }
    };

    const handleEditProduct = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token found. Please log in.");
            let processedImage = editingProduct.image;
            if (editingProduct.image && editingProduct.image !== editingProduct.originalImage) {
                processedImage = await removeImageBackground(editingProduct.image) || editingProduct.image;
            }
            const productData = { ...editingProduct, image: processedImage };
            const response = await axios.put(
                `http://localhost:5000/api/products/${editingProduct._id}`,
                productData,
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );
            setProducts(products.map(product => product._id === editingProduct._id ? response.data : product));
            setEditingProduct(null);
            if (onSuccess) onSuccess();
            setView("view");
        } catch (error) {
            console.error("Error updating product:", error.response?.data || error.message);
            setError(error.response?.data?.error || "Failed to update product.");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        setCsvFile(e.target.files[0]);
    };

    const parseCSV = (file) => {
        return new Promise((resolve, reject) => {
            Papa.parse(file, {
                header: true,
                complete: (results) => {
                    resolve(results.data);
                },
                error: (error) => {
                    reject(error);
                }
            });
        });
    };

    const uploadProductsFromCSV = async () => {
        if (!csvFile) {
            setError("Please select a CSV file first");
            return;
        }

        setCsvLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token found. Please log in.");

            // Parse CSV file
            const csvData = await parseCSV(csvFile);

            // Filter out empty rows and validate required fields
            const validProducts = csvData.filter(product =>
                product.name && product.brand && product.price && product.image
            ).map(product => ({
                ...product,
                price: parseInt(product.price) || 0,
                quantity: parseInt(product.quantity) || 0,
                isNewArrival: product.isNewArrival === "true",
                isTopSelling: product.isTopSelling === "true",
                approxPriceEUR: parseInt(product.approxPriceEUR) || 0
            }));

            if (validProducts.length === 0) {
                throw new Error("No valid products found in CSV");
            }

            // Upload each product sequentially
            const uploadedProducts = [];
            for (const product of validProducts) {
                try {
                    const processedImage = await removeImageBackground(product.image);
                    const productData = { ...product, image: processedImage || product.image };

                    const response = await axios.post(
                        "http://localhost:5000/api/products",
                        productData,
                        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
                    );

                    uploadedProducts.push(response.data);
                } catch (error) {
                    console.error(`Error uploading product ${product.name}:`, error.message);
                    // Continue with next product even if one fails
                }
            }

            if (uploadedProducts.length > 0) {
                setProducts([...products, ...uploadedProducts]);
                setCsvFile(null);
                if (onSuccess) onSuccess();
                setView("view");
            } else {
                throw new Error("No products were successfully uploaded");
            }
        } catch (error) {
            console.error("Error uploading products from CSV:", error.message);
            setError(error.message || "Failed to upload products from CSV");
        } finally {
            setCsvLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                    {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                    onClick={() => {
                        setEditingProduct(null);
                        setView("view");
                    }}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                    <FaPlus className="mr-2 transform rotate-45" />
                    Back to Products
                </button>
            </div>

            {/* Add CSV Upload Section */}
            {!editingProduct && (
                <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h3 className="text-lg font-medium text-gray-700 mb-3">Bulk Upload from CSV</h3>
                    <div className="flex items-center space-x-4">
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-gray-100 file:text-gray-700
                hover:file:bg-gray-200"
                            disabled={loading || csvLoading}
                        />
                        <button
                            type="button"
                            onClick={uploadProductsFromCSV}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                            disabled={!csvFile || loading || csvLoading}
                        >
                            {csvLoading ? (
                                <>
                                    <FaSpinner className="animate-spin mr-2 h-4 w-4" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <FaUpload className="mr-2 h-4 w-4" />
                                    Upload CSV
                                </>
                            )}
                        </button>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                        CSV should include: name, brand, price, image, description, quantity, isNewArrival, isTopSelling, and other product fields.
                    </p>
                </div>
            )}

            <form onSubmit={editingProduct ? handleEditProduct : handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Product Name</label>
                        <input
                            type="text"
                            name="name"
                            value={editingProduct ? editingProduct.name : newProduct.name}
                            onChange={handleChange}
                            placeholder="Product Name"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                            required
                            disabled={loading || csvLoading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Brand</label>
                        <input
                            type="text"
                            name="brand"
                            value={editingProduct ? editingProduct.brand : newProduct.brand}
                            onChange={handleChange}
                            placeholder="Brand"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                            required
                            disabled={loading || csvLoading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price (cents)</label>
                        <input
                            type="number"
                            name="price"
                            value={editingProduct ? editingProduct.price : newProduct.price}
                            onChange={handleChange}
                            placeholder="Price in cents"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                            required
                            disabled={loading || csvLoading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Approx. Price (EUR)</label>
                        <input
                            type="number"
                            name="approxPriceEUR"
                            value={editingProduct ? editingProduct.approxPriceEUR : newProduct.approxPriceEUR}
                            onChange={handleChange}
                            placeholder="Approx. Price in EUR"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                            disabled={loading || csvLoading}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Image URL</label>
                        <input
                            type="text"
                            name="image"
                            value={editingProduct ? editingProduct.image : newProduct.image}
                            onChange={handleChange}
                            placeholder="Image URL"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                            required
                            disabled={loading || csvLoading}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            value={editingProduct ? editingProduct.description : newProduct.description}
                            onChange={handleChange}
                            placeholder="Description"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                            rows="3"
                            required
                            disabled={loading || csvLoading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Quantity</label>
                        <input
                            type="number"
                            name="quantity"
                            value={editingProduct ? editingProduct.quantity : newProduct.quantity}
                            onChange={handleChange}
                            placeholder="Quantity"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                            required
                            disabled={loading || csvLoading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Network Technology</label>
                        <input
                            type="text"
                            name="networkTechnology"
                            value={editingProduct ? editingProduct.networkTechnology : newProduct.networkTechnology}
                            onChange={handleChange}
                            placeholder="e.g., 5G"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                            disabled={loading || csvLoading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Display Size</label>
                        <input
                            type="text"
                            name="displaySize"
                            value={editingProduct ? editingProduct.displaySize : newProduct.displaySize}
                            onChange={handleChange}
                            placeholder="e.g., 6.5 inches"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                            disabled={loading || csvLoading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Display Resolution</label>
                        <input
                            type="text"
                            name="displayResolution"
                            value={editingProduct ? editingProduct.displayResolution : newProduct.displayResolution}
                            onChange={handleChange}
                            placeholder="e.g., 1080x2400"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                            disabled={loading || csvLoading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">OS</label>
                        <input
                            type="text"
                            name="OS"
                            value={editingProduct ? editingProduct.OS : newProduct.OS}
                            onChange={handleChange}
                            placeholder="e.g., Android 13"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                            disabled={loading || csvLoading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">CPU</label>
                        <input
                            type="text"
                            name="CPU"
                            value={editingProduct ? editingProduct.CPU : newProduct.CPU}
                            onChange={handleChange}
                            placeholder="e.g., Snapdragon 8 Gen 1"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                            disabled={loading || csvLoading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">RAM</label>
                        <input
                            type="text"
                            name="RAM"
                            value={editingProduct ? editingProduct.RAM : newProduct.RAM}
                            onChange={handleChange}
                            placeholder="e.g., 8GB"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                            disabled={loading || csvLoading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Internal Memory</label>
                        <input
                            type="text"
                            name="internalMemory"
                            value={editingProduct ? editingProduct.internalMemory : newProduct.internalMemory}
                            onChange={handleChange}
                            placeholder="e.g., 256GB"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                            disabled={loading || csvLoading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Primary Camera</label>
                        <input
                            type="text"
                            name="primaryCamera"
                            value={editingProduct ? editingProduct.primaryCamera : newProduct.primaryCamera}
                            onChange={handleChange}
                            placeholder="e.g., 48MP"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                            disabled={loading || csvLoading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Battery</label>
                        <input
                            type="text"
                            name="battery"
                            value={editingProduct ? editingProduct.battery : newProduct.battery}
                            onChange={handleChange}
                            placeholder="e.g., 5000mAh"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                            disabled={loading || csvLoading}
                        />
                    </div>
                    <div className="md:col-span-2 flex items-center space-x-4">
                        <label className="flex items-center text-sm text-gray-700">
                            <input
                                type="checkbox"
                                name="isNewArrival"
                                checked={editingProduct ? editingProduct.isNewArrival : newProduct.isNewArrival}
                                onChange={handleChange}
                                className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                                disabled={loading || csvLoading}
                            />
                            <span className="ml-2">New Arrival</span>
                        </label>
                        <label className="flex items-center text-sm text-gray-700">
                            <input
                                type="checkbox"
                                name="isTopSelling"
                                checked={editingProduct ? editingProduct.isTopSelling : newProduct.isTopSelling}
                                onChange={handleChange}
                                className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                                disabled={loading || csvLoading}
                            />
                            <span className="ml-2">Top Selling</span>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={() => {
                            setEditingProduct(null);
                            setView("view");
                        }}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        disabled={loading || csvLoading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                        disabled={loading || csvLoading}
                    >
                        {loading ? (
                            <>
                                <FaSpinner className="animate-spin mr-2 h-4 w-4" />
                                Processing...
                            </>
                        ) : editingProduct ? (
                            "Update Product"
                        ) : (
                            "Add Product"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProductForm;