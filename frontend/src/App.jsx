import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CartProvider } from "./context/CartContext";
import ProductList from "./pages/ProductList";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import TopStrip from "./components/TopStrip";
import Cart from "./pages/Cart";
import Dashboard from "./components/Dashboard";
import UserProfile from "./pages/UserProfile";
import { ToastContainer } from "react-toastify";
import ProductDetails from "./pages/ProductDetails";
import ErrorBoundary from "./components/ErrorBoundary";

const stripePromise = loadStripe("pk_test_51Q04MDLO5gygt3jeimeUtRAVcgfc0fjcyPjU6WYa87auNIyM0rX0VFqtM4TDq5oXOR6Ub8XWuyJ8wpvZo4h5ryol00uHV9Awc4");

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  return (
    <Router>
      <CartProvider>
        <AppContent setToken={setToken} />
      </CartProvider>
    </Router>
  );
}

function AppContent({ setToken }) {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";
  const isLogin = location.pathname === "/login";
  const isRegister = location.pathname === "/register";

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {!isDashboard && !isLogin && !isRegister && (
        <>
          <TopStrip />
          <Header />
        </>
      )}

      <main className="flex-grow">
        <Routes>

          <Route path="/" element={<Hero />} />
          {/* Product List Route with Live Search */}
          <Route path="/products" element={<ProductList />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/checkout"
            element={
              <Elements stripe={stripePromise}>
                <Checkout />
              </Elements>
            }
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route
            path="/products/:id"
            element={
              <ErrorBoundary>
                <ProductDetails />
              </ErrorBoundary>
            }
          />
        </Routes>
      </main>

      {!isDashboard && !isLogin && !isRegister && <Footer />}
      <ToastContainer />
    </div>
  );
}

export default App;