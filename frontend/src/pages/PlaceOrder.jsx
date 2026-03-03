import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  getSavedShippingApi,
  saveShippingApi,
  getCartByUserApi,
  placeOrderApi,
  clearCartApi,
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

  // Load saved shipping & cart
  useEffect(() => {
    const fetchData = async () => {
      try {
        //  Fetch shipping
        const shippingRes = await getSavedShippingApi();
        if (shippingRes.data.success && shippingRes.data.data) {
          setFormData(prev => ({ ...prev, ...shippingRes.data.data }));
          setShippingLoaded(true);
        }

        //  Fetch cart
        const cartRes = await getCartByUserApi();
        if (cartRes.data.success) {
          setCartItems(cartRes.data.cartItems);
          const total = cartRes.data.cartItems.reduce(
            (acc, item) => acc + item.quantity * item.Product.price,
            0
          );
          setTotalAmount(total);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        toast.error("Failed to load checkout data");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!cartItems.length) return toast.error("Your cart is empty!");
    const { fullName, phone, address, city } = formData;
    if (!fullName || !phone || !address || !city)
      return toast.error("Complete all shipping details");

    setLoading(true);
    const loadingToast = toast.loading("Processing your order...");

    try {
      // Save shipping if not loaded
      if (!shippingLoaded) {
        await saveShippingApi(formData);
      }

      // Prepare order payload
      const orderData = {
        ...formData,
        total_amount: totalAmount,
        order_items: cartItems.map(ci => ({
          productId: ci.product_id,
          quantity: ci.quantity,
        })),
      };

      // Place order
      const response = await placeOrderApi(orderData);
      if (response.data.success) {
        // Clear cart
        toast.success("Order placed successfully! 🛒", { id: loadingToast });
        setTimeout(() => navigate("/orders"), 1500);
      } else {
        toast.error(response.data.message || "Order failed", { id: loadingToast });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Order failed", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-pink-50/50 flex flex-col items-center py-12 px-6">
      <Toaster position="top-right" />
      <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-sm p-10 md:p-14 border border-pink-100">
        <h1 className="text-3xl font-semibold text-pink-800 mb-4 text-center">Checkout</h1>
        <p className="text-pink-400 text-sm font-medium tracking-wide uppercase text-center mb-8">
          Confirm your purchase
        </p>

        <form onSubmit={handlePlaceOrder} className="space-y-6">
          <div className="space-y-4">
            {["fullName", "phone", "address", "city"].map(field => (
              <div key={field}>
                <label className="block text-pink-800 text-sm font-medium mb-2 ml-1">
                  {field === "fullName" ? "Full Name" : field === "phone" ? "Phone Number" : field === "address" ? "Street Address" : "City"}
                </label>
                {field === "address" ? (
                  <textarea
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-6 py-4 rounded-2xl border border-pink-100 bg-pink-50/20 focus:bg-white focus:border-pink-200 outline-none"
                  />
                ) : (
                  <input
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full px-6 py-4 rounded-2xl border border-pink-100 bg-pink-50/20 focus:bg-white focus:border-pink-200 outline-none"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="p-4 bg-pink-50/50 border border-pink-100 rounded-2xl flex items-center justify-between">
            <span className="text-pink-700 text-sm font-medium">Payment Method:</span>
            <span className="text-pink-500 font-bold text-sm">💵 {formData.payment_method}</span>
          </div>

          <div className="bg-pink-50/50 p-4 rounded-2xl border border-pink-100 mb-4">
            <h2 className="font-semibold text-pink-700 mb-2">Cart Summary</h2>
            {cartItems.length > 0 ? (
              <ul className="space-y-1">
                {cartItems.map(item => (
                  <li key={item.cart_id} className="flex justify-between text-sm text-pink-800">
                    <span>{item.Product.name} x {item.quantity}</span>
                    <span>Rs. {item.Product.price * item.quantity}</span>
                  </li>
                ))}
                <li className="flex justify-between font-bold mt-2 text-pink-900">
                  <span>Total</span>
                  <span>Rs. {totalAmount}</span>
                </li>
              </ul>
            ) : (
              <p className="text-pink-400 text-sm">Cart is empty</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-2xl text-lg font-bold transition-all duration-300
              ${loading ? "bg-pink-100 text-pink-300 cursor-not-allowed" : "bg-pink-200 text-pink-800 hover:bg-pink-300"}`}
          >
            {loading ? "Processing..." : `Place Order (Rs. ${totalAmount})`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlaceOrder;
