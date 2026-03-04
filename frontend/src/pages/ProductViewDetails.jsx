import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { addToCartApi, addToWishListApi, getProductDetailsApi, getRelatedProductsApi, } from "../services/api";
import ViewReview from "./ViewReview";

const ProductViewDetails = () => {
  const { id } = useParams();
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
        const res = await getRelatedProductsApi(id, product.category);
        if (res.data.success) {
          setRelatedProducts(res.data.products || []);
        }
      } catch (error) {
        console.error("Failed to load related products:", error);
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
          style: { background: "#000", color: "#fff", border: "1px solid #333" },
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
          style: { background: "#000", color: "#fff", border: "1px solid #333" },
        });
      }
    } catch (error) {
      toast.error("Please login to add to wishlist");
      navigate("/login");
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white uppercase tracking-widest">Loading Masterpiece...</div>;
  if (!product) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Product not found</div>;

  const stockCount = product.stock;
  const images = (Array.isArray(product.images) && product.images.length > 0) 
    ? product.images.map(img => img.startsWith('http') ? img : `${import.meta.env.VITE_API_BASE_URL}${img}`) 
    : [product.thumbnail.startsWith('http') ? product.thumbnail : `${import.meta.env.VITE_API_BASE_URL}${product.thumbnail}`];

  const specs = [
    { label: "Brand", value: product.brand },
    { label: "Model", value: product.model },
    { label: "Movement", value: product.movement_type },
    { label: "Case Material", value: product.case_material },
    { label: "Water Resistance", value: product.water_resistance },
    { label: "Warranty", value: product.warranty },
  ].filter(s => s.value);

  return (
    <div className="min-h-screen w-full bg-black text-white font-sans selection:bg-white selection:text-black">
      <Toaster />

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          
          {/* IMAGE GALLERY */}
          <div className="space-y-8 sticky top-32">
            <div className="aspect-[4/5] bg-gray-950 border border-gray-900 overflow-hidden group">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover transition duration-1000 group-hover:scale-110 opacity-90"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setMainImage(img)}
                  className={`aspect-square cursor-pointer border transition-all duration-500 overflow-hidden ${
                    mainImage === img ? "border-white" : "border-gray-900 grayscale opacity-50 hover:opacity-100 hover:grayscale-0"
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`View ${i}`} />
                </div>
              ))}
            </div>
          </div>

          {/* DETAILS */}
          <div className="space-y-12">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-900 pb-4">
                <span className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-light">{product.category}</span>
                <span className={`text-[10px] uppercase tracking-widest font-medium ${stockCount > 0 ? "text-green-500" : "text-red-500"}`}>
                  {stockCount > 0 ? "Available for order" : "Out of stock"}
                </span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl font-serif font-light tracking-tight leading-none text-white">{product.name}</h1>
              <p className="text-2xl font-light tracking-widest text-gray-400">₹{product.price}</p>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs uppercase tracking-[0.3em] text-gray-500 border-b border-gray-900 pb-2">The Story</h3>
              <p className="text-gray-400 text-lg font-light leading-relaxed">{product.description}</p>
            </div>

            {/* TECHNICAL SPECIFICATIONS */}
            <div className="space-y-6">
              <h3 className="text-xs uppercase tracking-[0.3em] text-gray-500 border-b border-gray-900 pb-2">Specifications</h3>
              <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                {specs.map((spec) => (
                  <div key={spec.label} className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-gray-600">{spec.label}</p>
                    <p className="text-sm font-light text-white tracking-wide">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ACTION AREA */}
            <div className="pt-12 space-y-8">
              <div className="flex items-center gap-12">
                <div className="flex items-center gap-6 border-b border-gray-800 pb-2">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-500 hover:text-white transition">-</button>
                  <span className="text-sm font-light w-4 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(stockCount, quantity + 1))} className="text-gray-500 hover:text-white transition">+</button>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-gray-600">Select Quantity</p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={stockCount === 0}
                  className="flex-1 bg-white text-black text-xs font-medium uppercase tracking-[0.3em] py-5 hover:bg-gray-200 transition-all disabled:opacity-20"
                >
                  Acquire Now
                </button>
                <button
                  onClick={handleAddToWishlist}
                  className="px-8 border border-gray-800 hover:border-white transition-all text-xl"
                >
                  ❤️
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* REVIEWS SECTION */}
        <div className="mt-40 border-t border-gray-900 pt-20">
          <ViewReview productId={product.product_id} />
        </div>

        {/* RELATED MASTERPIECES */}
        {relatedProducts.length > 0 && (
          <div className="mt-40">
            <h2 className="text-3xl font-serif font-light text-white mb-16 tracking-tight">Similar Masterpieces</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
              {relatedProducts.map((p) => (
                <div
                  key={p.product_id}
                  onClick={() => navigate(`/product/${p.product_id}`)}
                  className="group cursor-pointer space-y-4"
                >
                  <div className="aspect-[4/5] bg-gray-950 border border-gray-900 overflow-hidden">
                    <img
                      src={p.thumbnail}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000"
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs uppercase tracking-widest text-white font-light group-hover:text-gray-300 transition-colors">{p.name}</h3>
                    <p className="text-[10px] text-gray-600 tracking-widest uppercase">₹{p.price}</p>
                  </div>
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
