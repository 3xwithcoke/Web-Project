import React from "react";
import HeaderCard from "../component/dashboard/HeaderCard"; // adjust path
import { Link } from "react-router-dom";
import { getWishListApi, moveToCartApi, removeFromWishListApi } from "../services/api";
import toast from "react-hot-toast";
import { useState } from "react";
import { useEffect } from "react";

const Wishlist = ({ user }) => {

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetching wishlist
  const fetchWishlist = async () => {
    try {
      const res = await getWishListApi();
      if (res.data.success) {
        setWishlist(res.data.wishlist);
      }
    } catch (error) {
      toast.error("Failed to load wishlist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // Removing products from wishlist
  const handleRemove = async (productId) => {
    try {
      const res = await removeFromWishListApi(productId);
      if (res.data.success) {
        setWishlist((prev) => prev.filter(item => item.Product.product_id !== productId));
        toast.success("Product removed from wishlist.");
        window.location.reload()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove product from wishlist.");
    }
  };

  // Move to cart, product will be removed from wishlist
  const handleMoveToCart = async (productId) => {
    try {
      const res = await moveToCartApi(productId);
      if (res.data.success) {
        setWishlist((prev) => prev.filter(item => item.Product.product_id !== productId));
        toast.success("Moved to cart!");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Move to cart error:", error);
      toast.error(error.response?.data?.message || "Failed to move product to cart.");
    }
  };

  if (loading) return <p className="p-6 text-gray-600">Loading wishlist...</p>;

  return (
    <div className="min-h-screen bg-white px-6 lg:px-20 py-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar - HeaderCard */}
        <div className="lg:col-span-1">
          <HeaderCard user={user} />
        </div>

        {/* Wishlist Area */}
        <div className="lg:col-span-3">
          <div className="mb-12">
            <h2 className="text-5xl font-bold text-gray-900">My Wishlist</h2>
            <p className="mt-2 text-gray-600">Items you love and want to remember</p>
          </div>

          {wishlist.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-gray-600 mb-6">Your wishlist is empty.</p>
              <Link to="/shop" className="text-pink-600 hover:text-pink-700 font-semibold">
                Continue Shopping →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {wishlist.map((item) => {
                const product = item.Product;
                if (!product) return null; 
                return (
                <div
                  key={item.wishlist_id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200"
                >
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}${product.thumbnail}`}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">{product.name}</h3>
                    <p className="text-pink-600 font-bold text-xl mt-3">
                      ${product.price}
                    </p>

                    <p
                      className={`text-sm font-semibold mt-3 ${product.stock > 0 ? "text-green-600" : "text-red-500"
                        }`}
                    >
                      {product.stock > 0 ? "✓ In Stock" : "Out of Stock"}
                    </p>

                    <div className="mt-6 space-y-3">
                      <Link
                        to={`/product/${product.product_id}`}
                        className="block text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                      >
                        View Details
                      </Link>
                      <div className="grid grid-cols-2 gap-3">
                        <button className="border-2 border-red-500 text-red-500 hover:bg-red-50 font-semibold py-2 px-3 rounded-lg transition-colors duration-200"
                          onClick={() => handleRemove(product.product_id)}>
                          Remove
                        </button>
                        {product.stock > 0 && (
                          <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors duration-200"
                            onClick={() => handleMoveToCart(product.product_id)}>
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
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
