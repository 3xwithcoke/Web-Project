import React, { useState, useEffect } from "react";
import { getAllOrdersAdminApi } from "../services/api";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import AdminCard from "../component/dashboard/AdminCard";

const ViewAdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const tabs = ["All", "Pending", "Shipped", "Delivered"];

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await getAllOrdersAdminApi(statusFilter);
        if (res.data.success) {
          setOrders(res.data.orders);
        } else {
          toast.error(res.data.message || "Failed to fetch orders");
        }
      } catch {
        toast.error("Server error while fetching orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [statusFilter]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <AdminCard />
        </div>

        {/* Orders List */}
        <div className="lg:w-3/4 bg-white rounded-3xl shadow-lg p-8">
          <h1 className="text-3xl font-semibold mb-6">All Orders</h1>
          <div className="flex gap-6 border-b mb-6 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`pb-2 font-medium ${
                  statusFilter === tab
                    ? "text-blue-600 border-b-4 border-blue-600"
                    : "text-gray-400"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Orders */}
          {loading ? (
            <p className="text-center text-gray-400 mt-4">Loading orders…</p>
          ) : orders.length ? (
            <div className="space-y-4">
              {orders.map(order => (
                <div
                  key={order.order_id}
                  onClick={() => navigate(`/admin/order/${order.order_id}`)}
                  className="p-5 border rounded-xl flex justify-between items-center cursor-pointer hover:bg-gray-50 transition"
                >
                  <div>
                    <p className="font-bold">Order #{order.order_id}</p>
                    <p className="text-sm text-gray-500">
                      {order.fullName} — {order.user?.email}
                    </p>
                    <p className="text-sm text-gray-500">City: {order.city}</p>
                  </div>

                  <span className="px-4 py-1 rounded-full text-sm font-semibold bg-gray-100">
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 mt-4">No orders found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewAdminOrders;
