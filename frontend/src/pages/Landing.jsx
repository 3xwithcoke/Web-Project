import React, { useEffect, useState } from 'react'
import HeaderCard from '../component/dashboard/HeaderCard'
import DashboardMain from '../component/dashboard/DashboardMain'
import toast, { Toaster } from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { fetchCategories, fetchProducts } from '../services/api'

const Landing = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Fetch products and categories on mount
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

      const res = await getProductsByCategoryApi(categoryName);
      setFilteredProducts(res.data.results || []);
    } catch (error) {
      console.error("Category filter error:", error.message);
      toast.error("Failed to filter by category");
    }
  };
  return (
    <div className="w-full bg-gradient-to-b from-pink-50 via-white to-pink-50 min-h-screen px-4 sm:px-6 md:px-12 py-8 md:py-16">
      <Toaster />

      {/* Welcome Section */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 md:gap-12 mb-16">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs sm:text-sm uppercase tracking-widest text-pink-600 font-semibold">
                ✨ Unleash Your Natural Beauty
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Welcome Back! <br className="hidden sm:block" />
                <span className="text-pink-600">Shine Bright</span> Today
              </h1>
            </div>
            <p className="text-gray-600 text-base sm:text-lg max-w-md leading-relaxed">
              Discover our premium makeup and skincare collection designed to make you feel confident and beautiful every day.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-6 md:px-8 py-3 text-sm font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Explore Now
              <span className="text-lg">→</span>
            </Link>
          </div>
          <div className="flex justify-center lg:justify-end order-first lg:order-last">
            <div className="w-full max-w-sm aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/src/assets/dashpic.jpg"
                alt="Hero"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Main Dashboard */}
      <div className="max-w-7xl mx-auto mt-16">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
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
