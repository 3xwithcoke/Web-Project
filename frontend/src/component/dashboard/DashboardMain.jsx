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
    <div className="space-y-32">
      {/* Featured Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center bg-black border border-gray-900 rounded-none p-12 transition-all">
        <div className="flex justify-center order-last lg:order-first">
          <div className="w-full max-w-md aspect-square rounded-none overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop"
              alt="Featured"
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 opacity-80"
            />
          </div>
        </div>
        <div className="space-y-8">
          <div className="space-y-2">
            <p className="text-gray-500 uppercase tracking-widest text-xs">Exquisite Craftsmanship</p>
            <h2 className="text-4xl sm:text-5xl font-serif font-light text-white leading-tight">
              Masterpieces <span className="italic">in Motion</span>
            </h2>
          </div>
          <p className="text-gray-400 text-lg max-w-md leading-relaxed font-light">
            Each timepiece in our collection represents a legacy of precision and design. From mechanical marvels to modern smart-watches.
          </p>
          <Link
            to="/viewproductlist"
            className="inline-block border border-white text-white px-10 py-4 font-medium uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all duration-700 shadow-2xl"
          >
            View Masterpieces
          </Link>
        </div>
      </section>

      {/* Trending Products */}
      <section>
        <div className="flex justify-between items-end mb-16 border-b border-gray-900 pb-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-serif font-light text-white">Trending Timepieces</h2>
            <p className="text-gray-500 text-xs uppercase tracking-widest">Most sought after models</p>
          </div>
          <Link
            to="/viewproductlist"
            className="text-gray-400 text-xs uppercase tracking-widest hover:text-white transition-colors"
          >
            View Entire Collection <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
          {products.slice(0, 8).map((p) => (
            <ProductCard
              key={p.product_id}
              name={p.name}
              description={p.brand || "Luxury Brand"}
              price={p.price}
              imageUrl={p.thumbnail ? `${import.meta.env.VITE_API_BASE_URL}${p.thumbnail}` : null}
              onAddToCart={() => handleAddToCart(p.product_id)}
              onAddToWishlist={() => handleAddToWishlist(p.product_id)}
              onClick={()=> navigate(`/product/${p.product_id}`)}
              className="bg-black border border-gray-900 p-4 transition-all duration-500 hover:border-gray-500"
            />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-950 py-24 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center mb-16 space-y-4">
            <h2 className="text-4xl font-serif font-light text-white text-center">Curated Collections</h2>
            <div className="w-24 h-[1px] bg-gray-700"></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
            {categories.map((cat, i) => (
              <CategoryCard
                key={i}
                name={cat.category}
                onClick={() => onCategoryClick(cat.category)}
                className="group cursor-pointer text-center"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Markers */}
      <section className="border-y border-gray-900 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="text-center space-y-4">
            <div className="flex justify-center text-3xl text-gray-400">
              <FaTruck />
            </div>
            <h3 className="text-sm font-medium uppercase tracking-widest text-white">White-Glove Delivery</h3>
            <p className="text-gray-500 text-sm font-light leading-relaxed">Secure, insured shipping to your doorstep, handled with the utmost care.</p>
          </div>

          <div className="text-center space-y-4">
            <div className="flex justify-center text-3xl text-gray-400">
              <FaShieldAlt />
            </div>
            <h3 className="text-sm font-medium uppercase tracking-widest text-white">Authenticity Guaranteed</h3>
            <p className="text-gray-500 text-sm font-light leading-relaxed">Every timepiece comes with an official certificate of authenticity and warranty.</p>
          </div>

          <div className="text-center space-y-4">
            <div className="flex justify-center text-3xl text-gray-400">
              <FaExchangeAlt />
            </div>
            <h3 className="text-sm font-medium uppercase tracking-widest text-white">Luxury Exchange</h3>
            <p className="text-gray-500 text-sm font-light leading-relaxed">Upgrade or exchange your timepiece with our exclusive concierge service.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardMain;
