import React, { useState } from "react";
import { FaTruck, FaCheckCircle, FaTimesCircle, FaMoneyBillWave } from "react-icons/fa";

const Orders = ({ orders: initialOrders, isCompact = false }) => {
    const [orders, setOrders] = useState(initialOrders);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        if (!window.confirm(`Are you sure you want to mark order #${orderId} as ${newStatus}?`)) {
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update order status');
            }

            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order._id === orderId
                        ? { ...order, orderStatus: data.order.orderStatus }
                        : order
                )
            );

        } catch (err) {
            setError(err.message);
            console.error('Error updating order status:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'processing':
                return <FaTruck className="text-yellow-500" />;
            case 'shipped':
                return <FaTruck className="text-blue-500" />;
            case 'delivered':
                return <FaCheckCircle className="text-green-500" />;
            case 'cancelled':
                return <FaTimesCircle className="text-red-500" />;
            default:
                return <FaMoneyBillWave className="text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const displayedOrders = isCompact ? orders.slice(0, 5) : orders;

    return (
        <div className="overflow-x-auto">
            {loading && <div className="text-center py-2">Updating order...</div>}
            {error && <div className="text-center py-2 text-red-500">{error}</div>}

            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        {!isCompact && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        )}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {displayedOrders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                #{order._id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {order.user?.username || order.user?.email || 'Unknown User'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {order.items.length}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                ${(order.totalPrice / 100).toLocaleString()}

                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    {getStatusIcon(order.orderStatus)}
                                    <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                                        {order.orderStatus}
                                    </span>
                                </div>
                            </td>
                            {!isCompact && (
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                        {order.orderStatus === 'processing' && (
                                            <>
                                                <button
                                                    onClick={() => handleUpdateOrderStatus(order._id, 'shipped')}
                                                    className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                                                    disabled={loading}
                                                >
                                                    Ship
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateOrderStatus(order._id, 'cancelled')}
                                                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                                    disabled={loading}
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        )}
                                        {order.orderStatus === 'shipped' && (
                                            <button
                                                onClick={() => handleUpdateOrderStatus(order._id, 'delivered')}
                                                className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                                disabled={loading}
                                            >
                                                Mark Delivered
                                            </button>
                                        )}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            {isCompact && displayedOrders.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                    No recent orders found
                </div>
            )}
            {!isCompact && displayedOrders.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                    No orders found
                </div>
            )}
            {isCompact && orders.length > 5 && (
                <div className="text-center py-2">
                    <button
                        onClick={() => window.location.href = '/admin/orders'}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                        View all orders
                    </button>
                </div>
            )}
        </div>
    );
};

export default Orders;