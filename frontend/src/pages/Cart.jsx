import { useEffect } from "react";
import { useState } from "react";
import { clearCartApi, getCartByUserApi, removeCartItemApi, updateCartQuantity } from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const res = await getCartByUserApi();
        setCartItems(res.data.cartItems || []);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    }
    loadCart();
  }, []);

  const updateQty = async (cartId, change) => {
    const item = cartItems.find((i) => i.cart_id === cartId);
    if (!item) return;

    const newQty = item.quantity + change;
    if (newQty < 1) return;
    if (newQty > item.Product.stock) {
      toast.error(`Limited stock: ${item.Product.stock} available`);
      return;
    }

    try {
      await updateCartQuantity(item.Product.product_id, newQty);
      setCartItems((items) =>
        items.map((i) => i.cart_id === cartId ? { ...i, quantity: newQty } : i)
      );
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const removeItem = async (productId) => {
    try {
      await removeCartItemApi(productId);
      setCartItems((items) => items.filter((item) => item.Product.product_id !== productId));
      toast.success("Removed from bag");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.Product.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen w-full bg-black text-white selection:bg-white selection:text-black py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif font-light tracking-tight italic">Your Bag</h1>
          <div className="w-24 h-[1px] bg-gray-900 mx-auto"></div>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-32 space-y-8">
            <p className="text-gray-500 font-light text-lg uppercase tracking-widest">Your bag is currently empty</p>
            <button 
              onClick={() => navigate("/viewproductlist")}
              className="border border-white px-12 py-4 text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all"
            >
              Discover Masterpieces
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-8 space-y-12">
              {cartItems.map((item) => (
                <div
                  key={item.cart_id}
                  className="group flex flex-col md:flex-row gap-10 pb-12 border-b border-gray-900"
                >
                  <div className="w-full md:w-48 aspect-square bg-gray-950 overflow-hidden">
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}${item.Product.thumbnail}`}
                      alt={item.Product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                    />
                  </div>

                  <div className="flex flex-col justify-between flex-1 space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-widest text-gray-600">{item.Product.brand || "Luxury House"}</p>
                        <h2 className="text-xl font-serif font-light text-white uppercase tracking-wide">
                          {item.Product.name}
                        </h2>
                      </div>
                      <button
                        onClick={() => removeItem(item.Product.product_id)}
                        className="text-gray-700 hover:text-white transition-colors"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-4">
                      <div className="flex items-center border border-gray-900 p-1 w-fit">
                        <button
                          onClick={() => updateQty(item.cart_id, -1)}
                          className="p-3 text-gray-500 hover:text-white transition"
                        >
                          <FaMinus size={10} />
                        </button>
                        <span className="px-6 text-sm font-light">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.cart_id, 1)}
                          className="p-3 text-gray-500 hover:text-white transition"
                        >
                          <FaPlus size={10} />
                        </button>
                      </div>
                      <p className="text-lg font-light tracking-widest text-white">
                        ₹{item.Product.price * item.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-4 h-fit sticky top-32">
              <div className="bg-gray-950/50 border border-gray-900 p-10 space-y-10">
                <h2 className="text-xs uppercase tracking-[0.4em] text-gray-500 border-b border-gray-900 pb-4">
                  Summary
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-light">
                    <span className="text-gray-500 uppercase tracking-widest">Subtotal</span>
                    <span className="text-white">₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm font-light">
                    <span className="text-gray-500 uppercase tracking-widest">Delivery</span>
                    <span className="text-green-500 uppercase tracking-widest text-[10px] pt-1">Complimentary</span>
                  </div>
                </div>

                <div className="border-t border-gray-900 pt-6 flex justify-between items-end">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 pb-1">Total</span>
                  <span className="text-2xl font-light tracking-tighter text-white">₹{totalPrice}</span>
                </div>

                <button
                  onClick={() => navigate("/shippingdetails")}
                  className="w-full bg-white text-black py-5 text-xs font-medium uppercase tracking-[0.3em] hover:bg-gray-200 transition-all shadow-2xl"
                >
                  Proceed to Checkout
                </button>

                <p className="text-[10px] text-center text-gray-700 uppercase tracking-widest">
                  Secure Checkout • Fully Insured
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
