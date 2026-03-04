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
          setOrders(res.data.orders || res.data.data || res.data.results || []);
        } else {
          toast.error(res.data.message || "Failed to retrieve ledger");
        }
      } catch (err) {
        console.error("Ledger Fetch Error:", err);
        toast.error("Failed to retrieve ledger: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [statusFilter]);

  return (
    <div className="min-h-screen bg-black text-white py-20 px-6 selection:bg-white selection:text-black">
      <Toaster position="top-center" />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
        <div className="lg:w-80 flex-shrink-0">
          <AdminCard />
        </div>

        <div className="flex-1 space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl font-serif font-light tracking-tight italic">Acquisition Ledger</h1>
            <div className="w-24 h-[1px] bg-gray-900"></div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-600">Global Order Registry</p>
          </div>

          <div className="flex gap-12 border-b border-gray-900 overflow-x-auto pb-4">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`text-[10px] uppercase tracking-[0.3em] transition-all whitespace-nowrap pb-2 ${
                  statusFilter === tab
                    ? "text-white border-b border-white"
                    : "text-gray-600 hover:text-gray-400"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center gap-4 py-20 text-gray-600">
              <div className="w-4 h-4 border-t border-gray-600 rounded-full animate-spin"></div>
              <span className="text-[10px] uppercase tracking-widest">Inquiring...</span>
            </div>
          ) : orders.length ? (
            <div className="space-y-6">
              {orders.map(order => (
                <div
                  key={order.order_id}
                  onClick={() => navigate(`/admin/order/${order.order_id}`)}
                  className="group bg-gray-950/20 border border-gray-900 hover:border-gray-600 transition-all duration-700 p-8 flex justify-between items-center cursor-pointer"
                >
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-widest text-gray-600 font-medium">Reference #{order.order_id}</p>
                    <p className="font-serif font-light text-lg text-white group-hover:text-gray-300 transition-colors">
                      {order.fullName}
                    </p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">{order.city} — {order.user?.email}</p>
                  </div>

                  <div className="text-right space-y-4">
                    <p className="text-xl font-light tracking-tighter text-white">₹{order.total_amount}</p>
                    <span className="text-[9px] uppercase tracking-[0.2em] px-4 py-1 border border-gray-800 text-gray-500">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border border-gray-900 border-dashed">
              <p className="text-[10px] uppercase tracking-[0.4em] text-gray-700 italic">No acquisition records found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewAdminOrders;
