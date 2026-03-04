import React, { useState, useEffect } from "react";
import DashboardMain from "../component/dashboard/DashboardMain";
import QuickAccessCard from "../component/dashboard/QuickAccessCard";
import { fetchProducts, fetchCategories, addToCartApi, addToWishListApi, getProductsByCategoryApi } from "../services/api";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const UserDashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const [productRes, categoryRes] = await Promise.all([
          fetchProducts(),
          fetchCategories()
        ]);
        setProducts(productRes.data.results || []);
        setCategories(categoryRes.data.data || []);
      } catch (error) {
        console.error("Dashboard API Error:", error.message);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const handleCategoryClick = async (categoryName) => {
    try {
      if (!categoryName) return setFilteredProducts(products);
      const filtered = products.filter(p => p.category === categoryName);
      setFilteredProducts(filtered);
    } catch (error) {
      console.error("Category filter error:", error.message);
      toast.error("Failed to filter by category");
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCartApi({ productId, quantity: 1 });
      toast.success("Added to collection", {
        style: { background: "#000", color: "#fff", border: "1px solid #333" }
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleAddToWishlist = async (productId) => {
    try {
      await addToWishListApi({ productId });
      toast.success("Added to favorites", {
        style: { background: "#000", color: "#fff", border: "1px solid #333" }
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to wishlist");
    }
  };

  return (
    <div className="w-full bg-black min-h-screen text-white px-4 sm:px-6 md:px-12 py-8 md:py-16 selection:bg-white selection:text-black">
      <Toaster/>

      {/* Welcome Section */}
      <div className="max-w-7xl mx-auto mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
          <div className="space-y-10">
            <div className="space-y-4">
              <p className="text-[10px] uppercase tracking-[0.5em] text-gray-500 font-medium">
                The Horology Boutique
              </p>
              <h1 className="text-5xl sm:text-7xl font-serif font-light text-white leading-tight tracking-tighter">
                Welcome to <br />
                <span className="italic font-normal">Chronos Luxe</span>
              </h1>
            </div>
            <p className="text-gray-400 text-lg sm:text-xl font-light max-w-lg leading-relaxed italic">
              "Time is the only luxury we cannot buy, but we can certainly measure it with elegance."
            </p>
            <div className="pt-4">
              <Link 
                to="/viewproductlist" 
                className="inline-block border border-white text-white px-12 py-5 text-xs font-medium uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-700"
              >
                View Collection
              </Link>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 border border-gray-900 group-hover:inset-0 transition-all duration-700"></div>
            <div className="w-full aspect-[4/5] overflow-hidden group-hover:opacity-100 transition-all duration-1000">
              <img 
                src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1000&auto=format&fit=crop" 
                alt="Luxury Watch Hero" 
                className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Simplified Quick Access */}
      <div className="max-w-7xl mx-auto mb-32 border-y border-gray-900 py-12">
        <QuickAccessCard />
      </div>

      {/* Main Dashboard */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="flex flex-col items-center gap-6">
              <div className="w-8 h-8 border-t-2 border-white rounded-full animate-spin"></div>
              <p className="text-gray-600 text-[10px] uppercase tracking-[0.4em]">Acquiring Archives...</p>
            </div>
          </div>
        ) : (
          <DashboardMain
            products={products}
            categories={categories}
            filteredProducts={filteredProducts}
            handleAddToCart={handleAddToCart}
            handleAddToWishlist={handleAddToWishlist}
            onCategoryClick={handleCategoryClick}
          />
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
