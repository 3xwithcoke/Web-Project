import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getOrderDetailsApi } from "../services/api";

const UserOrderDetails = () => {
  const { id: orderId } = useParams(); 
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderDetailsApi(orderId);
        if (res.data.success) {
          setOrder(res.data.data);
        } else {
          toast.error(res.data.message);
        }
      } catch (err) {
        toast.error("Unable to fetch order details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading)
    return <p className="text-center mt-10 text-pink-500">Loading...</p>;

  if (!order)
    return (
      <p className="text-center mt-10 text-red-500">
        Order not found
      </p>
    );

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-pink-900">
        Order Details
      </h1>

      {/* Order Summary */}
      <div className="bg-white p-6 rounded-2xl shadow mb-8">
        <p><strong>Order ID:</strong> #{order.order_id}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Total Amount:</strong> Rs. {order.total_amount}</p>
        <p>
          <strong>Payment:</strong> {order.payment_method} ({order.payment_status})
        </p>
        <p>
          <strong>Shipping:</strong> {order.address}, {order.city}
        </p>
        <p><strong>Phone:</strong> {order.phone}</p>
        <p className="text-sm text-gray-500">
          Placed on: {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Items */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-4">Items</h2>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-pink-50 text-left">
              <th className="p-3">Product</th>
              <th className="p-3">Price</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.order_items.map((item, i) => (
              <tr key={i} className="border-b">
                <td className="p-3">{item.name}</td>
                <td className="p-3">Rs. {item.price}</td>
                <td className="p-3">{item.quantity}</td>
                <td className="p-3">
                  Rs. {item.price * item.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => navigate("/orders")}
        className="mt-6 px-6 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700"
      >
        ← Back to Orders
      </button>
    </div>
  );
};

export default UserOrderDetails;
