import { useEffect } from "react";
import { useState } from "react";
import { clearCartApi, getCartByUserApi, removeCartItemApi, updateCartQuantity } from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const res = await getCartByUserApi();
        setCartItems(res.data.cartItems);
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

    if (newQty < 1) {
      toast.error("Quantity cannot be less than 1");
      return;
    }

    if (newQty > item.Product.stock) {
      toast.error(`Only ${item.Product.stock} items in stock`);
      return;
    }

    try {
      await updateCartQuantity(item.Product.product_id, newQty);

      setCartItems((items) =>
        items.map((i) =>
          i.cart_id === cartId ? { ...i, quantity: newQty } : i
        )
      );
      toast.success("Cart updated successfully");
    } catch (error) {
      console.error("Failed to update cart quantity:", error);
      toast.error(error.response?.data?.message || "Failed to update cart quantity");
    }
  };

  const removeItem = async (productId) => {   //ritu
    try {
      await removeCartItemApi(productId);

      setCartItems((items) =>
        items.filter((item) => item.Product.product_id !== productId)
      );

      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Remove cart item error:", error);
      toast.error(
        error.response?.data?.message || "Failed to remove item"
      );
    }
  };

  const clearCart = async () => {
    try {
      await clearCartApi();

      // Clear cart state
      setCartItems([]);

      toast.success("Cart cleared successfully");
    } catch (error) {
      console.error("Clear cart error:", error);
      toast.error(
        error.response?.data?.message || "Failed to clear cart"
      );
    }
  };


  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.Product.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen w-full bg-pink-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <h1 className="text-4xl font-semibold text-pink-900 mb-12 text-center">
          🛒 Your Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <p className="text-center text-pink-700 text-lg">Your cart is empty</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              {cartItems.map((item) => (
                <div
                  key={item.cart_id}
                  className="flex gap-8 bg-pink-100 p-8 rounded-[2.5rem] shadow-lg"
                >
                  <img
                    src={item.Product.thumbnail}
                    alt={item.Product.name}
                    className="w-40 h-40 object-cover rounded-3xl"
                  />

                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <h2 className="text-2xl font-semibold text-pink-900">
                        {item.Product.name}
                      </h2>
                      <p className="text-pink-600 mt-2">Rs. {item.Product.price}</p>
                      <p className="text-sm mt-1 text-gray-500">
                        Stock: {item.Product.stock}
                      </p>
                    </div>

                    <div className="flex items-center gap-5 mt-4">
                      <span className="text-pink-900 font-medium">Quantity</span>
                      <div className="flex border-2 border-pink-300 rounded-2xl overflow-hidden">
                        <button
                          onClick={() => updateQty(item.cart_id, -1)}
                          className="px-5 py-3 hover:bg-pink-200"
                        >
                          −
                        </button>
                        <span className="px-6 py-3 font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.cart_id, 1)}
                          className="px-5 py-3 hover:bg-pink-200"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <p className="mt-4 text-pink-800 font-semibold">
                      Subtotal: Rs. {item.Product.price * item.quantity}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      removeItem(item.Product.product_id)
                    }
                    className="ml-6 p-2 rounded-full hover:bg-pink-300 transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-pink-700"

                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-pink-100 p-10 rounded-[2.5rem] shadow-lg h-fit">
              <h2 className="text-2xl font-semibold text-pink-900 mb-8">
                Order Summary
              </h2>

              <div className="flex justify-between text-pink-800 mb-4">
                <span>Items</span>
                <span>{cartItems.length}</span>
              </div>

              <div className="flex justify-between text-pink-800 mb-4">
                <span>Delivery</span>
                <span>Free</span>
              </div>

              <div className="border-t border-pink-300 my-6"></div>

              <div className="flex justify-between text-2xl font-bold text-pink-900 mb-8">
                <span>Total</span>
                <span>Rs. {totalPrice}</span>
              </div>

              <button
                onClick={clearCart}
                className="w-full bg-pink-200 text-pink-900 py-3 rounded-2xl text-lg font-semibold hover:bg-pink-300 transition mb-4"
              >
                Clear Cart
              </button>




              <button
                onClick={() => navigate("/shippingdetails")}
                className="w-full bg-pink-600 text-white py-4 rounded-2xl text-lg font-semibold hover:bg-pink-700 transition"
              >
                Proceed to Checkout
              </button>


              <p className="text-sm text-pink-700 mt-6 text-center">
                ✔ Secure Payment • ✔ Fast Delivery
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}