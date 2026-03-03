import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { addToCartApi, addToWishListApi, getProductDetailsApi, getRelatedProductsApi, } from "../services/api";
import ViewReview from "./ViewReview";

const ProductViewDetails = () => {
  const { id } = useParams();
  console.log("PRODUCT ID:", id)
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (!id) return;
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!product?.category) return;

    const fetchRelated = async () => {
      try {
        console.log("Fetching related products for:", { id, category: product.category });
        const res = await getRelatedProductsApi(id, product.category);
        console.log("Related products response:", res.data);

        if (res.data.success) {
          setRelatedProducts(res.data.products || []);
        } else {
          console.error("Backend returned failure:", res.data.message);
        }
      } catch (error) {
        console.error("Failed to load related products:", error.response?.data || error.message);
      }
    };

    fetchRelated();
  }, [product?.category, id]);



  const fetchProduct = async () => {
    try {
      const res = await getProductDetailsApi(id);
      if (res.data.success) {
        setProduct(res.data.product);
        setMainImage(res.data.product.thumbnail);
      } else {
        toast.error(res.data.message || "Product not found");
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load product");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      const res = await addToCartApi({ productId: product.product_id, quantity });
      if (res.data.success) {
        toast.success(res.data.message, {
          position: "bottom-right",
          style: { background: "#db2777", color: "#fff", borderRadius: "15px" },
        });
      } else {
        toast.error(res.data.message, {
          position: "bottom-right",
          style: { background: "#db2777", color: "#fff", borderRadius: "15px" },
        });
      }
    } catch (error) {
      toast.error("Please login to add to cart");
      navigate("/login");
    }
  };

  const handleAddToWishlist = async () => {
    try {
      const res = await addToWishListApi({ productId: product.product_id });
      if (res.data.success) {
        toast.success(res.data.message, {
          position: "bottom-right",
          style: { background: "#db2777", color: "#fff", borderRadius: "15px" },
        });
      } else {
        toast.error(res.data.message || "Failed to add to wishlist");
      }
    } catch (error) {
      console.error("Wishlist error:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        toast.error("Please login to add to wishlist");
        navigate("/login");
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.message || "Bad Request");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (!product) return <p className="text-center mt-20">Product not found</p>;

  const stockCount = product.stock;
  const images = product.images?.length ? [product.thumbnail, ...product.images] : [product.thumbnail];

  return (
    <div className="min-h-screen w-full bg-pink-50 font-sans">
      <Toaster />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 bg-white rounded-[2.5rem] shadow-xl p-8 md:p-12 border border-pink-100">
          <div className="flex flex-col gap-6">
            <div className="overflow-hidden rounded-3xl bg-white-50 aspect-square lg:aspect-auto lg:h-[600px]">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-contain transition duration-500 hover:scale-105"
              />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setMainImage(img)}
                  className={`w-24 h-24 rounded-2xl object-cover cursor-pointer border-2 transition ${mainImage === img ? "border-pink-600 shadow-md" : "border-transparent"
                    }`}
                  alt={`Product ${i}`}
                />
              ))}
            </div>
          </div>

          {/* DETAILS */}
          <div className="flex flex-col gap-6">
            <div className="flex justify-between">
              <span className="text-pink-600 font-bold uppercase text-sm">{product.category}</span>
              {stockCount > 0 ? (
                <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold">● In Stock</span>
              ) : (
                <span className="text-red-600 bg-red-50 px-3 py-1 rounded-full text-xs font-bold">● Out of Stock</span>
              )}
            </div>

            <h1 className="text-5xl font-bold text-pink-950 leading-tight">{product.name}</h1>

            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-extrabold text-pink-700">${product.price}</span>
              {product.oldPrice && (
                <span className="text-pink-300 line-through text-xl">${product.oldPrice}</span>
              )}
            </div>

            <h3 className="text-3xl font-bold text-pink-900 mb-2">
              Description
            </h3>
            <p className="text-pink-900/80 text-lg leading-relaxed">{product.description}</p>

            {/* ingrediats */}
            {product.ingredients && (
              <div className="bg-pink-50 border border-pink-100 rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-pink-900 mb-2">
                  Ingredients
                </h3>
                <p className="text-pink-800/80 leading-relaxed">
                  {product.ingredients}
                </p>
              </div>
            )}

            {/* how to use*/}
            {product.howToUse && (
              <div className="bg-pink-50 border border-pink-100 rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-pink-900 mb-2">
                  How to Use
                </h3>
                <p className="text-pink-800/80 leading-relaxed">
                  {product.howToUse}
                </p>
              </div>
            )}


            <div className="flex items-center gap-6 py-4">
              <div className="flex items-center border-2 border-pink-100 rounded-2xl bg-white p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 text-pink-600 font-bold"
                >
                  -
                </button>
                <span className="w-12 text-center font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(stockCount, quantity + 1))}
                  className="w-10 h-10 text-pink-600 font-bold"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={stockCount === 0}
                className="flex-1 bg-pink-600 text-white font-bold py-4 rounded-2xl hover:bg-pink-700 disabled:opacity-50"
              >
                Add to Cart
              </button>

              <button
                onClick={handleAddToWishlist}
                className="text-pink-600 hover:text-pink-900"
              >
                ❤️
              </button>
            </div>
          </div>
        </div>
        <ViewReview productId={product.product_id} />
        {relatedProducts.length > 0 && (
          <div className="mt-24">
            <h2 className="text-4xl font-bold text-pink-950 mb-8">
              Related Products
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <div
                  key={p.product_id}
                  onClick={() => navigate(`/product/${p.product_id}`)}
                  className="bg-white rounded-2xl p-4 cursor-pointer hover:shadow-lg transition"
                >
                  <img
                    src={p.thumbnail}
                    alt={p.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-semibold text-pink-900">{p.name}</h3>
                  <p className="text-pink-600 font-bold">₹{p.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ProductViewDetails;