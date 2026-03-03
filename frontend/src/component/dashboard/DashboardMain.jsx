import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import CategoryCard from "./CategoryCard";
import { FaExchangeAlt, FaShieldAlt, FaTruck } from "react-icons/fa";

const DashboardMain = ({
  products,
  categories,
  filteredProducts,
  handleAddToCart,
  handleAddToWishlist,
  onCategoryClick,
}) => {
  const navigate = useNavigate();
  return (
    <div className="space-y-20">
      {/* Featured Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 items-center bg-white rounded-2xl p-6 md:p-10 shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex justify-center lg:justify-start order-last lg:order-first">
          <div className="w-full max-w-sm aspect-square rounded-2xl overflow-hidden shadow-xl">
            <img
              src="/src/assets/dash2.png"
              alt="Featured"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            Premium <span className="text-pink-600">Skincare</span> Collection
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-md leading-relaxed">
            Explore our curated range of skincare essentials that nourish, protect, and enhance your natural beauty with premium ingredients.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-6 md:px-8 py-3 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Shop Now 
            <span className="text-lg">→</span>
          </Link>
        </div>
      </section>

      {/* Products Section */}
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Trending Products</h2>
          <Link
            to="/viewproductlist"
            className="text-pink-600 font-semibold hover:text-pink-700 hover:underline flex items-center gap-1 transition-colors"
          >
            View All 
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {products.slice(0, 10).map((p) => (
            <ProductCard
              key={p.product_id}
              name={p.name}
              description={p.description}
              price={p.price}
              imageUrl={p.thumbnail}
              onAddToCart={() => handleAddToCart(p.product_id)}
              onAddToWishlist={() => handleAddToWishlist(p.product_id)}
              onClick={()=> navigate(`/product/${p.product_id}`)}
              className="transition-all duration-300 hover:shadow-xl hover:scale-105 rounded-xl"
            />
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow">
        <img
          src="/src/assets/Bellezebanner.png"
          alt="Full Width Promo"
          className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
        />
      </section>

      {/* Categories */}
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Shop by Category</h2>
          <Link
            to="/viewcategories"
            className="text-pink-600 font-semibold hover:text-pink-700 hover:underline flex items-center gap-1 transition-colors"
          >
            View All 
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((cat, i) => (
            <CategoryCard
              key={i}
              name={cat.category}
              onClick={() => onCategoryClick(cat.category)}
              className="transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
            />
          ))}
        </div>
      </section>

      {/* Filtered Products by Category */}
      {filteredProducts.length > 0 && (
        <section className="bg-gradient-to-r from-pink-50 to-red-50 rounded-2xl p-6 md:p-10">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
            ✨ Products in <span className="text-pink-600">Category</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {filteredProducts.slice(0, 10).map((p) => (
              <ProductCard
                key={p.product_id}
                name={p.name}
                description={p.description}
                price={p.price}
                imageUrl={p.thumbnail}
                onAddToCart={() => handleAddToCart(p.product_id)}
                onAddToWishlist={() => handleAddToWishlist(p.product_id)}
                onClick={()=> navigate(`/product/${p.product_id}`)}
                className="transition-all duration-300 hover:shadow-xl hover:scale-105 rounded-xl"
              />
            ))}
          </div>
        </section>
      )}

      {/* UX Info Section */}
      <section className="bg-gradient-to-br from-pink-600 via-pink-500 to-red-500 rounded-2xl shadow-2xl overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-12 md:py-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-4">
            Shopping Made Simple & Secure
          </h2>
          <p className="text-pink-100 text-center mb-12 max-w-2xl mx-auto">
            Experience the best in beauty shopping with our customer-first approach
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white/95 backdrop-blur rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-center">
              <div className="flex justify-center mb-4 text-4xl text-pink-600">
                <FaTruck />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Pay After Delivery
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Pay only once your order arrives at your doorstep with complete peace of mind
              </p>
            </div>

            <div className="bg-white/95 backdrop-blur rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-center">
              <div className="flex justify-center mb-4 text-4xl text-pink-600">
                <FaShieldAlt />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Safe & Confidential
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Your personal information stays protected with industry-leading security
              </p>
            </div>

            <div className="bg-white/95 backdrop-blur rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-center">
              <div className="flex justify-center mb-4 text-4xl text-pink-600">
                <FaExchangeAlt />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Easy Replacement
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Quick and stress-free replacement on eligible products with no hassle
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardMain;
