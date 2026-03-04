import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  getSavedShippingApi,
  saveShippingApi,
  getCartByUserApi,
  placeOrderApi,
} from "../services/api";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [shippingLoaded, setShippingLoaded] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    payment_method: "Cash on Delivery",
  });

  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const shippingRes = await getSavedShippingApi();
        if (shippingRes.data.success && shippingRes.data.data) {
          setFormData(prev => ({ ...prev, ...shippingRes.data.data }));
          setShippingLoaded(true);
        }

        const cartRes = await getCartByUserApi();
        if (cartRes.data.success) {
          setCartItems(cartRes.data.cartItems || []);
          const total = (cartRes.data.cartItems || []).reduce(
            (acc, item) => acc + item.quantity * (item.Product?.price || 0),
            0
          );
          setTotalAmount(total);
        }
      } catch (err) {
        console.error("Failed to fetch checkout data:", err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!cartItems.length) return toast.error("Your bag is currently empty");
    
    setLoading(true);
    const loadingToast = toast.loading("Finalizing acquisition...", {
      style: { background: "#000", color: "#fff", border: "1px solid #333" }
    });

    try {
      if (!shippingLoaded) {
        await saveShippingApi(formData);
      }

      const orderData = {
        ...formData,
        total_amount: totalAmount,
        order_items: cartItems.map(ci => ({
          productId: ci.Product?.product_id,
          quantity: ci.quantity,
        })),
      };

      const response = await placeOrderApi(orderData);
      if (response.data.success) {
        toast.success("Acquisition successful", { id: loadingToast });
        setTimeout(() => navigate("/orders"), 1500);
      } else {
        toast.error(response.data.message || "Acquisition failed", { id: loadingToast });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Internal registry error", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-white selection:bg-white selection:text-black py-24 px-6">
      <Toaster position="top-center" />
      
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        
        {/* Checkout Form */}
        <div className="space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl font-serif font-light tracking-tight italic">Checkout</h1>
            <div className="w-12 h-[1px] bg-gray-900"></div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-600">Final Verification</p>
          </div>

          <form onSubmit={handlePlaceOrder} className="space-y-10">
            <div className="space-y-8">
              {[
                { name: "fullName", label: "Recipient Identity" },
                { name: "phone", label: "Primary Contact" },
                { name: "city", label: "Locality" },
              ].map(field => (
                <div key={field.name} className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-600">{field.label}</label>
                  <input
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent border-b border-gray-900 py-3 text-sm font-light focus:border-white transition-all outline-none"
                  />
                </div>
              ))}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-600">Detailed Residence</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="2"
                  required
                  className="w-full bg-transparent border-b border-gray-900 py-3 text-sm font-light focus:border-white transition-all outline-none resize-none"
                />
              </div>
            </div>

            <div className="p-6 bg-gray-950 border border-gray-900 flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-widest text-gray-600">Settlement Method</span>
              <span className="text-xs font-light text-white uppercase tracking-widest italic">{formData.payment_method}</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black py-5 text-[10px] uppercase tracking-[0.4em] font-medium hover:bg-gray-200 transition-all shadow-2xl disabled:opacity-20"
            >
              {loading ? "Authenticating..." : `Place Order — ₹${totalAmount}`}
            </button>
          </form>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-12">
          <div className="space-y-4">
            <h2 className="text-xs uppercase tracking-[0.4em] text-gray-500 border-b border-gray-900 pb-4">Acquisition Summary</h2>
            <div className="space-y-8 max-h-[400px] overflow-y-auto pr-4 scrollbar-hide">
              {cartItems.map((item) => (
                <div key={item.cart_id} className="flex gap-6 items-center">
                  <div className="w-16 h-20 bg-gray-950 border border-gray-900 overflow-hidden flex-shrink-0">
                    {item.Product?.thumbnail && (
                      <img src={item.Product.thumbnail} className="w-full h-full object-cover grayscale" alt={item.Product.name} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-serif font-light text-white truncate uppercase tracking-wide">{item.Product?.name}</p>
                    <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-1">Quantity: {item.quantity}</p>
                  </div>
                  <p className="text-xs font-light text-white">₹{(item.Product?.price || 0) * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-gray-900 space-y-4">
            <div className="flex justify-between text-[10px] uppercase tracking-widest">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-white font-light">₹{totalAmount}</span>
            </div>
            <div className="flex justify-between text-[10px] uppercase tracking-widest">
              <span className="text-gray-600">Insurance & Delivery</span>
              <span className="text-green-900 italic">Complimentary</span>
            </div>
            <div className="flex justify-between pt-4 items-end">
              <span className="text-xs uppercase tracking-[0.3em] text-white">Grand Total</span>
              <span className="text-3xl font-serif font-light tracking-tighter text-white">₹{totalAmount}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PlaceOrder;
