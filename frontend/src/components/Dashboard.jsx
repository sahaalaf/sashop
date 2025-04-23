import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AddProductForm from "../components/AddProductForm";
import ProductsView from "../components/ProductsView";
import Orders from "../components/Orders";
import RevenueChart from "../components/RevenueChart";
import UsersManagement from "../components/UsersManagement"
import InventoryStatus from "../components/InventoryStatus";
import {
    FaSpinner, FaExclamationTriangle, FaChartLine, FaBoxOpen, FaUsers, FaShoppingCart
} from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [revenueData, setRevenueData] = useState({ labels: [], datasets: [] });
    const [newProduct, setNewProduct] = useState({
        name: "", brand: "", price: "", image: "", description: "", quantity: "",
        isNewArrival: false, isTopSelling: false, networkTechnology: "", displaySize: "",
        displayResolution: "", OS: "", CPU: "", RAM: "", internalMemory: "", primaryCamera: "",
        battery: "", approxPriceEUR: "", category: "smartphone", discount: 0, sku: ""
    });
    const [editingProduct, setEditingProduct] = useState(null);
    const [view, setView] = useState("dashboard");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return navigate("/login");
                const response = await axios.get("http://localhost:5000/api/users/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserRole(response.data.role);
                if (response.data.role !== "admin") navigate("/404-route");
                else {
                    fetchInitialData();
                }
            } catch (err) {
                console.error("Error fetching user role:", err);
                navigate("/login");
            }
        };
        fetchUserRole();
    }, [navigate]);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            await Promise.all([
                fetchProducts(),
                fetchOrders(),
                fetchUsers(),
                fetchRevenueData()
            ]);
        } catch (error) {
            setError("Failed to load initial data.");
            toast.error("Failed to load initial data");
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/products", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setProducts(response.data);
        } catch (error) {
            setError("Failed to load products.");
            toast.error("Failed to load products");
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/orders", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setOrders(response.data);
        } catch (error) {
            setError("Failed to load orders.");
            toast.error("Failed to load orders");
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/users", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setUsers(response.data);
        } catch (error) {
            setError("Failed to load users.");
            toast.error("Failed to load users");
        }
    };

    const fetchRevenueData = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/orders/revenue", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            const { labels, data } = response.data;
            setRevenueData({
                labels,
                datasets: [{
                    label: "Revenue (USD)",
                    data,
                    borderColor: "rgba(75, 192, 192, 1)",
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    fill: true,
                }],
            });
        } catch (error) {
            setError("Failed to load revenue data.");
            toast.error("Failed to load revenue data");
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5000/api/products/${productId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(products.filter(product => product._id !== productId));
            toast.success("Product deleted successfully");
        } catch (error) {
            setError("Failed to delete product.");
            toast.error("Failed to delete product");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            await axios.put(
                `http://localhost:5000/api/orders/${orderId}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setOrders(orders.map(order =>
                order._id === orderId ? { ...order, orderStatus: newStatus } : order
            ));
            toast.success("Order status updated successfully");
        } catch (error) {
            setError("Failed to update order status.");
            toast.error("Failed to update order status");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUserRole = async (userId, newRole) => {
        if (!window.confirm(`Change this user's role to ${newRole}?`)) return;

        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            await axios.put(
                `http://localhost:5000/api/users/${userId}/role`,
                { role: newRole },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUsers(users.map(user =>
                user._id === userId ? { ...user, role: newRole } : user
            ));
            toast.success("User role updated successfully");
        } catch (error) {
            setError("Failed to update user role.");
            toast.error("Failed to update user role");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5000/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(users.filter(user => user._id !== userId));
            toast.success("User deleted successfully");
        } catch (error) {
            setError("Failed to delete user.");
            toast.error("Failed to delete user");
        } finally {
            setLoading(false);
        }
    };

    const refreshData = () => {
        fetchInitialData();
    };

    const totalProducts = products.length;
    const totalOrders = orders.length;
    const revenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    const totalRevenue = revenue / 100;
    const totalUsers = users.length;

    if (userRole === null) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <FaSpinner className="animate-spin text-4xl text-blue-500" />
            </div>
        );
    }

    if (userRole !== "admin") return null;

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex">
                <Sidebar
                    view={view}
                    setView={setView}
                />

                <main className="flex-1 p-6 overflow-y-auto">
                    {loading && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                            <FaSpinner className="animate-spin text-4xl text-white" />
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded flex items-center">
                            <FaExclamationTriangle className="mr-2" />
                            <p>{error}</p>
                        </div>
                    )}

                    {view === "dashboard" && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <DashboardCard
                                    title="Total Products"
                                    value={totalProducts}
                                    icon={<FaBoxOpen className="text-blue-500" />}
                                    color="bg-blue-100"
                                />
                                <DashboardCard
                                    title="Total Orders"
                                    value={totalOrders}
                                    icon={<FaShoppingCart className="text-green-500" />}
                                    color="bg-green-100"
                                />
                                <DashboardCard
                                    title="Total Revenue"
                                    value={`$${totalRevenue.toLocaleString()}`}
                                    icon={<FaChartLine className="text-purple-500" />}
                                    color="bg-purple-100"
                                />
                                <DashboardCard
                                    title="Total Users"
                                    value={totalUsers}
                                    icon={<FaUsers className="text-orange-500" />}
                                    color="bg-orange-100"
                                />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                <div className="bg-white p-6 rounded-lg shadow">
                                    <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
                                    <RevenueChart revenueData={revenueData} />
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow">
                                    <h3 className="text-lg font-semibold mb-4">Inventory Status</h3>
                                    <InventoryStatus
                                        products={products}
                                        setEditingProduct={setEditingProduct}
                                        setView={setView} />
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
                                <Orders
                                    orders={orders.slice(0, 5)}
                                    handleUpdateOrderStatus={handleUpdateOrderStatus}
                                    isCompact={true}
                                />
                            </div>
                        </>
                    )}

                    {view === "add" && (
                        <AddProductForm
                            newProduct={newProduct}
                            setNewProduct={setNewProduct}
                            editingProduct={editingProduct}
                            setEditingProduct={setEditingProduct}
                            setProducts={setProducts}
                            products={products}
                            loading={loading}
                            setLoading={setLoading}
                            setError={setError}
                            refreshData={refreshData}
                            setView={setView}
                        />
                    )}

                    {view === "products" && (
                        <ProductsView
                            products={products}
                            setEditingProduct={setEditingProduct}
                            setView={setView}
                            handleDeleteProduct={handleDeleteProduct}
                            loading={loading}
                            refreshData={refreshData}
                        />
                    )}

                    {view === "orders" && (
                        <Orders
                            orders={orders}
                            handleUpdateOrderStatus={handleUpdateOrderStatus}
                        />
                    )}

                    {view === "users" && (
                        <UsersManagement
                            users={users}
                            handleUpdateUserRole={handleUpdateUserRole}
                            handleDeleteUser={handleDeleteUser}
                        />
                    )}

                    {view === "settings" && (
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-bold mb-6">Admin Settings</h2>
                            <div className="space-y-4">
                                <div className="p-4 border rounded-lg">
                                    <h3 className="font-semibold mb-2">System Configuration</h3>
                                    <p className="text-gray-600">Configure system settings here</p>
                                </div>
                                <div className="p-4 border rounded-lg">
                                    <h3 className="font-semibold mb-2">Backup & Restore</h3>
                                    <p className="text-gray-600">Manage database backups</p>
                                </div>
                                <div className="p-4 border rounded-lg">
                                    <h3 className="font-semibold mb-2">Email Templates</h3>
                                    <p className="text-gray-600">Customize system emails</p>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

const DashboardCard = ({ title, value, icon, color }) => {
    return (
        <div className={`${color} p-6 rounded-lg shadow transition-transform hover:scale-105`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <h3 className="text-2xl font-bold mt-1">{value}</h3>
                </div>
                <div className="text-3xl">
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;