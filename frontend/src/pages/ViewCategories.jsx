import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchCategories,
  fetchProducts
} from "../services/api";

const ViewCategories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetchCategories();
        if (res.data.success) {
          // backend returns [{ category: "Mascara" }]
          const cats = res.data.data.map(c => c.category);
          setCategories(cats);
        }
      } catch (err) {
        console.error("Fetch categories error:", err);
      }
    };
    loadCategories();
  }, []);

  // ✅ Load products & group by category
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetchProducts();
        if (res.data.success) {
          const grouped = res.data.results.reduce((acc, product) => {
            if (!acc[product.category]) acc[product.category] = [];
            acc[product.category].push(product);
            return acc;
          }, {});
          setProductsByCategory(grouped);
        }
      } catch (err) {
        console.error("Fetch products error:", err);
      }
    };
    loadProducts();
  }, []);

  // ✅ Product details - navigate to product page
  const handleDetails = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white via-pink-50 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-20 py-16">
        {/* Header Section */}
        <div className="mb-16">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-3">
            Shop Beauty Essentials
          </h1>
          <p className="text-gray-600 text-lg">
            Discover our curated collection of premium beauty products
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-12 max-w-md">
          <label className="block text-gray-800 font-semibold mb-3 text-sm uppercase tracking-wide">
            Filter by Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-4 bg-white border-2 border-pink-300 rounded-xl font-medium text-gray-800 focus:outline-none focus:border-pink-600 focus:ring-2 focus:ring-pink-200 transition-all"
          >
            <option value="">-- All Products --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Products Grid */}
        {selectedCategory && productsByCategory[selectedCategory] ? (
          <div>
            <p className="text-gray-600 mb-8 font-medium">
              Showing {productsByCategory[selectedCategory].length} products in {selectedCategory}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {productsByCategory[selectedCategory].map((product) => (
                <div
                  key={product.product_id}
                  onClick={() => handleDetails(product.product_id)}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer border border-gray-200 transition-all duration-300 hover:-translate-y-2"
                >
                  {/* Image Container */}
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    {product.thumbnail && (
                      <img
                        src={product.thumbnail}
                        alt={product.name}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    )}
                    {product.oldPrice && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Sale
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-pink-600 text-xs font-bold uppercase tracking-widest mb-2">
                      {product.category}
                    </p>
                    <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 text-lg group-hover:text-pink-600 transition-colors">
                      {product.name}
                    </h3>

                    {/* Price Section */}
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-pink-600">
                          ₹{product.price}
                        </p>
                        {product.oldPrice && (
                          <p className="text-lg line-through text-gray-400">
                            ₹{product.oldPrice}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Stock Status */}
                    <p className="text-xs font-semibold mb-4">
                      {product.stock > 0 ? (
                        <span className="text-green-600">✓ In Stock</span>
                      ) : (
                        <span className="text-red-600">Out of Stock</span>
                      )}
                    </p>

                    {/* Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDetails(product.product_id);
                      }}
                      className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-4 py-3 rounded-lg font-bold transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-4">
              👈 Select a category to view products
            </p>
          </div>
        )}

        {loading && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white px-8 py-4 rounded-2xl shadow-xl">
              <p className="text-gray-800 font-semibold">Loading...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCategories;
