import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderDetailsAdminApi, updateOrderStatusApi } from "../services/api";
import toast from "react-hot-toast";

const OrderDetailsAdmin = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const statusOptions = ["Pending", "Shipped", "Delivered"]; 

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderDetailsAdminApi(id);
        if (res.data.success) {
          setOrder(res.data.data);
        } else {
          toast.error(res.data.message);
        }
      } catch {
        toast.error("Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setUpdatingStatus(true);

    try {
      const res = await updateOrderStatusApi(order.order_id, newStatus);
      if (res.data.success) {
        setOrder(prev => ({ ...prev, status: newStatus }));
        toast.success("Order status updated!");
      } else {
        toast.error(res.data.message || "Failed to update status");
      }
    } catch (err) {
      toast.error("Server error while updating status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading…</p>;
  if (!order) return <p className="text-center text-red-500">Order not found</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Order #{order.order_id}</h1>

      <div className="bg-white p-6 rounded-2xl shadow mb-8">
        <p><strong>Status:</strong> 
          <select
            value={order.status}
            onChange={handleStatusChange}
            disabled={updatingStatus}
            className="ml-2 px-3 py-1 border rounded"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </p>
        <p><strong>Total:</strong> Rs. {order.total_amount}</p>
        <p><strong>Payment:</strong> {order.payment_method} ({order.payment_status})</p>
        <p><strong>User:</strong> {order.fullName} ({order.user?.email})</p>
        <p><strong>Address:</strong> {order.address}, {order.city}</p>
        <p><strong>Phone:</strong> {order.phone}</p>
        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Items</h2>
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3">Price</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.order_items.map((item, i) => (
              <tr key={i} className="border-b">
                <td className="p-3">{item.name}</td>
                <td className="p-3 text-center">{item.price}</td>
                <td className="p-3 text-center">{item.quantity}</td>
                <td className="p-3 text-center">{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => navigate("/viewadminorder")}
        className="mt-6 px-6 py-3 bg-gray-900 text-white rounded-xl"
      >
        ← Back to Orders
      </button>
    </div>
  );
};

export default OrderDetailsAdmin;