import React, { useEffect, useState } from 'react'
import DashboardMain from '../component/dashboard/DashboardMain'
import toast, { Toaster } from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { fetchCategories, fetchProducts } from '../services/api'

const Landing = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const [productRes, categoryRes] = await Promise.all([
          fetchProducts(),
          fetchCategories()
        ]);
        console.log("Product Response:", productRes.data);
        console.log("Category Response:", categoryRes.data);
        setProducts(productRes.data.results || []);
        setCategories(categoryRes.data.data || []);
      } catch (error) {
        console.error("Dashboard API Error:", error.response || error);
        toast.error(`Connection Error: ${error.message}`);
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
      // Assuming getProductsByCategoryApi is available or use filtered state
      const filtered = products.filter(p => p.category === categoryName);
      setFilteredProducts(filtered);
    } catch (error) {
      console.error("Category filter error:", error.message);
      toast.error("Failed to filter by category");
    }
  };

  return (
    <div className="w-full bg-black min-h-screen text-white">
      <Toaster />

      {/* Hero Section */}
      <div className="relative h-[80vh] flex items-center justify-center overflow-hidden border-b border-gray-900">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1547996160-81dfa63595dd?q=80&w=2000&auto=format&fit=crop"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80"></div>
        </div>

        <div className="relative z-10 text-center space-y-8 px-4 max-w-4xl mx-auto">
          <div className="space-y-4">
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-gray-400 font-light animate-fade-in">
              The Essence of Timeless Elegance
            </p>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif font-light tracking-tighter leading-none animate-slide-up">
              Define Your <br />
              <span className="italic font-normal">Legacy</span>
            </h1>
          </div>
          <p className="text-gray-400 text-lg sm:text-xl font-light max-w-2xl mx-auto leading-relaxed animate-fade-in-delayed">
            Discover a curated collection of world-class timepieces, where precision meets unparalleled luxury.
          </p>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              to="/viewproductlist"
              className="border border-white text-white px-12 py-4 text-sm font-medium tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-500 rounded-none shadow-2xl"
            >
              Explore Collection
            </Link>
            <Link
              to="/about"
              className="border border-white/30 text-white px-12 py-4 text-sm font-medium tracking-widest uppercase hover:bg-white/10 transition-all duration-500 rounded-none"
            >
              Our Heritage
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-t-2 border-white rounded-full animate-spin"></div>
          </div>
        ) : (
          <DashboardMain
            products={products}
            categories={categories}
            filteredProducts={filteredProducts}
            onCategoryClick={handleCategoryClick}
          />
        )}
      </div>
    </div>
  )
}

export default Landing
