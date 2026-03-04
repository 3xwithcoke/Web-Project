import { useState, useEffect } from "react";
import { addToWishListApi, fetchProducts, getProductsByCategoryApi } from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { FaThLarge, FaList, FaHeart, FaStar } from "react-icons/fa";

const ViewProductList = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [view, setView] = useState("grid");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const limit = 8;

  useEffect(() => {
    fetchProductsList();
  }, [page, category]);

  const fetchProductsList = async () => {
    setLoading(true);
    try {
      let res;
      if (category) {
        // Normalize category names from URL (e.g., 'smart-watches' -> 'Smart Watches')
        const normalized = category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        res = await getProductsByCategoryApi(normalized);
      } else {
        res = await fetchProducts();
      }
      
      const allProducts = res.data.results || [];

      // Pagination logic
      const startIndex = (page - 1) * limit;
      const paginatedProducts = allProducts.slice(startIndex, startIndex + limit);
      setProducts(paginatedProducts);
      setTotalPages(Math.ceil(allProducts.length / limit) || 1);
    } catch (error) {
      console.error("Failed to load products:", error);
      setProducts([]);
      setTotalPages(1);
    }
    setLoading(false);
  };

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  const handleAddToWishlist = async (e, productId) => {
    e.stopPropagation(); 
    try {
      const res = await addToWishListApi({ productId });
      if (res.data.success) {
        toast.success("Added to favorites", {
          style: { background: "#000", color: "#fff", border: "1px solid #333" }
        });
      }
    } catch (error) {
      toast.error("Please login to add to wishlist");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black py-20 px-6">
      <Toaster position="top-center" />
      
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-gray-900 pb-8 gap-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-serif font-light tracking-tight italic">
              {category ? `${category.split('-').join(' ')} Collection` : "The Entire Collection"}
            </h1>
            <div className="w-24 h-[1px] bg-gray-900"></div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-600">
              {products.length} Masterpieces Available
            </p>
          </div>

          <div className="flex items-center gap-8 text-gray-500">
            <button
              onClick={() => setView("grid")}
              className={`p-2 transition-colors ${view === "grid" ? "text-white" : "hover:text-gray-300"}`}
            >
              <FaThLarge size={18} />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 transition-colors ${view === "list" ? "text-white" : "hover:text-gray-300"}`}
            >
              <FaList size={18} />
            </button>
          </div>
        </div>

        {/* Loading / Empty States */}
        {loading ? (
          <div className="flex items-center gap-4 py-32 justify-center text-gray-600">
             <div className="w-4 h-4 border-t border-gray-600 rounded-full animate-spin"></div>
             <span className="text-[10px] uppercase tracking-widest">Scanning Registry...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="py-32 text-center border border-gray-900 border-dashed">
            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-700 italic">No masterpieces found in this classification</p>
          </div>
        ) : (
          <div className={view === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12" 
            : "space-y-12"
          }>
            {products.map((product) => (
              <div
                key={product.product_id}
                onClick={() => handleProductClick(product.product_id)}
                className={`group relative bg-black border border-gray-900 overflow-hidden cursor-pointer transition-all duration-700 hover:border-gray-500 ${
                  view === "list" ? "flex flex-col md:flex-row gap-12 p-8" : ""
                }`}
              >
                <div className={`${view === "list" ? "w-full md:w-72" : "aspect-[4/5]"} overflow-hidden bg-gray-950`}>
                  <img
                    src={product.thumbnail ? `${import.meta.env.VITE_API_BASE_URL}${product.thumbnail}` : "/placeholder.png"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000"
                  />
                </div>

                <div className={`flex-1 ${view === "grid" ? "p-8 space-y-6" : "flex flex-col justify-center space-y-6"}`}>
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-widest text-gray-600">{product.brand || "Luxury Edition"}</p>
                    <h2 className="text-lg font-serif font-light text-white uppercase tracking-wide group-hover:text-gray-300 transition-colors">
                      {product.name}
                    </h2>
                    {view === "list" && (
                      <p className="text-gray-500 text-sm font-light leading-relaxed max-w-2xl line-clamp-2">
                        {product.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-900">
                    <p className="text-white font-light tracking-widest italic">₹{product.price}</p>
                    {product.stock === 0 && (
                      <span className="text-[9px] uppercase tracking-widest text-red-900 border border-red-950 px-2 py-1">
                        Reserved
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <button
                  onClick={(e) => handleAddToWishlist(e, product.product_id)}
                  className="absolute top-6 left-6 p-2 bg-black/50 backdrop-blur-md border border-white/10 text-white rounded-none opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:text-black z-10"
                >
                  <FaHeart size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-8 pt-20 border-t border-gray-900">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="text-[10px] uppercase tracking-widest text-gray-600 hover:text-white disabled:opacity-20 transition-colors"
            >
              Previous
            </button>

            <div className="flex gap-6">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`text-[10px] font-medium transition-all ${
                    page === i + 1 ? "text-white border-b border-white pb-1" : "text-gray-700 hover:text-gray-400"
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </button>
              ))}
            </div>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="text-[10px] uppercase tracking-widest text-gray-600 hover:text-white disabled:opacity-20 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewProductList;
