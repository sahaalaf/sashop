import path from "path";
import React from "react";
import { FaBoxes, FaExclamationTriangle } from "react-icons/fa";

const InventoryStatus = ({ products, setView, setEditingProduct }) => {

    const totalProducts = products.length;
    const outOfStock = products.filter(p => p.quantity <= 0).length;
    const lowStock = products.filter(p => p.quantity > 0 && p.quantity <= 10).length;
    const inStock = products.filter(p => p.quantity > 10).length;

    const inventoryData = {
        labels: ['Out of Stock', 'Low Stock', 'In Stock'],
        datasets: [{
            data: [outOfStock, lowStock, inStock],
            backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
        }]
    };

    // Get low stock items
    const lowStockItems = products
        .filter(p => p.quantity > 0 && p.quantity <= 10)
        .sort((a, b) => a.quantity - b.quantity)
        .slice(0, 5);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                            <FaExclamationTriangle size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Out of Stock</p>
                            <p className="text-xl font-bold">{outOfStock}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                            <FaExclamationTriangle size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Low Stock</p>
                            <p className="text-xl font-bold">{lowStock}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                            <FaBoxes size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">In Stock</p>
                            <p className="text-xl font-bold">{inStock}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold mb-3">Low Stock Items (Top 5)</h4>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {lowStockItems.map(product => (
                                <tr key={product._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${product.quantity <= 5 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {product.quantity} left
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                        <button onClick={() => {
                                            setView("add");
                                            setEditingProduct(product);

                                        }}

                                            className="text-blue-600 hover:text-blue-900" > Restock</button>
                                    </td>
                                </tr>
                            ))}
                            {lowStockItems.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="px-4 py-4 text-center text-sm text-gray-500">
                                        No low stock items found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
};

export default InventoryStatus;