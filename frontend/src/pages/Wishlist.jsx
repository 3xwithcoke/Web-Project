import React from "react";
import HeaderCard from "../component/dashboard/HeaderCard";
import { Link, useNavigate } from "react-router-dom";
import { getWishListApi, moveToCartApi, removeFromWishListApi } from "../services/api";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";

const Wishlist = ({ user }) => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await getWishListApi();
      if (res.data.success) {
        setWishlist(res.data.wishlist || []);
      }
    } catch (error) {
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await removeFromWishListApi(productId);
      setWishlist((prev) => prev.filter(item => item.Product.product_id !== productId));
      toast.success("Removed from favorites");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const handleMoveToCart = async (productId) => {
    try {
      await moveToCartApi(productId);
      setWishlist((prev) => prev.filter(item => item.Product.product_id !== productId));
      toast.success("Added to collection");
    } catch (error) {
      toast.error("Failed to move to collection");
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white uppercase tracking-widest">Inquiring...</div>;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black py-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-16">
        <div className="lg:col-span-1">
          <HeaderCard />
        </div>

        <div className="lg:col-span-3 space-y-16">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-serif font-light tracking-tight italic">Your Favorites</h2>
            <div className="w-24 h-[1px] bg-gray-900"></div>
            <p className="text-xs text-gray-600 uppercase tracking-widest pt-2">Curated masterpieces awaiting your acquisition</p>
          </div>

          {wishlist.length === 0 ? (
            <div className="text-center py-20 space-y-8 border border-gray-900">
              <p className="text-gray-700 font-light text-sm uppercase tracking-widest italic">No favorites selected at this time</p>
              <Link to="/viewproductlist" className="inline-block text-white border-b border-white pb-1 text-[10px] uppercase tracking-widest hover:text-gray-400 hover:border-gray-400 transition-all">
                Discover the Collection
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              {wishlist.map((item) => {
                const product = item.Product;
                if (!product) return null; 
                return (
                  <div key={item.wishlist_id} className="group relative bg-black border border-gray-900 overflow-hidden transition-all duration-700 hover:border-gray-600">
                    <div className="aspect-[4/5] bg-gray-950 overflow-hidden">
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL}${product.thumbnail}`}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000"
                      />
                    </div>
                    <div className="p-8 space-y-6 bg-black">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-widest text-gray-600 font-medium">{product.brand || "Luxury Edition"}</p>
                        <h3 className="font-serif font-light text-white uppercase tracking-wide group-hover:text-gray-300 transition-colors">{product.name}</h3>
                        <p className="text-sm font-light text-gray-400 tracking-widest">₹{product.price}</p>
                      </div>

                      <div className="pt-6 border-t border-gray-900 flex gap-4">
                        <button 
                          onClick={() => navigate(`/product/${product.product_id}`)}
                          className="flex-1 border border-gray-800 text-[10px] uppercase tracking-widest py-3 hover:border-white transition-all"
                        >
                          Details
                        </button>
                        <button 
                          onClick={() => handleRemove(product.product_id)}
                          className="px-6 text-red-900 hover:text-red-500 transition-colors"
                        >
                          <FaTrash size={12}/>
                        </button>
                      </div>
                      
                      {product.stock > 0 && (
                        <button 
                          onClick={() => handleMoveToCart(product.product_id)}
                          className="w-full bg-white text-black py-4 text-[10px] uppercase tracking-[0.3em] font-medium hover:bg-gray-200 transition-all"
                        >
                          Move to Collection
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
