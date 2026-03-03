import { useState, useEffect } from "react";
import { addToWishListApi, fetchProducts } from "../services/api";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const ViewProductList = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [view, setView] = useState("grid");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const limit = 8;

  useEffect(() => {
    fetchProductsList();
  }, [page]);

  const fetchProductsList = async () => {
    setLoading(true);
    try {
      const res = await fetchProducts(); 
      const allProducts = res.data.results || [];

      // Pagination logic
      const startIndex = (page - 1) * limit;
      const paginatedProducts = allProducts.slice(startIndex, startIndex + limit);
      setProducts(paginatedProducts);
      setTotalPages(Math.ceil(allProducts.length / limit));
    } catch (error) {
      console.error("Failed to load products:", error);
      setProducts([]);
      setTotalPages(1);
    }
    setLoading(false);
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.product_id}`);
  };

  const handleAddToWishlist = async (e, product) => {
    e.stopPropagation(); 
    try {
      const res = await addToWishListApi({ productId: product.product_id });
      if (res.data.success) {
        toast.success("Added to wishlist!");
      } else {
        toast.error(res.data.message || "Failed to add to wishlist");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to wishlist.");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Toaster />
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <div className="space-x-2">
          <button
            onClick={() => setView("grid")}
            className={`px-4 py-2 rounded ${view === "grid" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Grid
          </button>
          <button
            onClick={() => setView("list")}
            className={`px-4 py-2 rounded ${view === "list" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            List
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && <p className="text-center text-gray-500">Loading products...</p>}

      {/* Empty */}
      {!loading && products.length === 0 && <p className="text-center text-gray-500">No products found.</p>}

      {/* Products */}
      {!loading && products.length > 0 && (
        <div className="relative z-10">
        <div className={`grid gap-6 ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-1"}`}>
          {products.map((product) => (
            <div
              key={product.product_id}
              onClick={() => handleProductClick(product)}
              className="border rounded-lg p-4 hover:shadow-lg cursor-pointer relative bg-white"
            >
              <img
                src={product.thumbnail}
                alt={product.name}
                className="w-full h-48 object-cover rounded mb-4"
              />

              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-700 mt-1">${product.price}</p>

              {product.stock === 0 && (
                <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  Out of Stock
                </span>
              )}

              {view === "list" && (
                <>
                  <p className="mt-2 text-gray-600">Stock: {product.stock}</p>
                  <p className="mt-1 text-gray-500 text-sm">{product.description}</p>
                </>
              )}

              {/* Wishlist button */}
              <button
                onClick={(e) => handleAddToWishlist(e, product)}
                className="absolute top-3 left-3 bg-white text-pink-600 p-1 rounded-full shadow hover:bg-pink-100"
              >
                ❤️
              </button>
            </div>
          ))}
        </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 border rounded ${page === i + 1 ? "bg-blue-600 text-white" : "bg-white"}`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewProductList;
