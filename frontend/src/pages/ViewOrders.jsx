import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getOrdersApi } from "../services/api";
import HeaderCard from "../component/dashboard/HeaderCard";

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const tabs = ["ALL", "Pending", "Shipped", "Delivered"];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getOrdersApi();
        if (res.data.success) {
          setOrders(res.data.orders || []);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders =
    filter === "ALL"
      ? orders
      : orders.filter(order => order.status === filter);

  return (
    <div className="min-h-screen w-full bg-black text-white selection:bg-white selection:text-black py-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-16">
        <div className="lg:col-span-1">
          <HeaderCard />
        </div>

        <div className="lg:col-span-3 space-y-16">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-serif font-light tracking-tight italic">Your Acquisitions</h1>
            <div className="w-24 h-[1px] bg-gray-900"></div>
            <p className="text-xs text-gray-600 uppercase tracking-widest pt-2">Track and manage your horological history</p>
          </div>

          <div className="flex space-x-12 border-b border-gray-900 overflow-x-auto pb-4">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`text-[10px] uppercase tracking-[0.3em] transition-all whitespace-nowrap pb-2 ${
                  filter === tab
                    ? "text-white border-b border-white"
                    : "text-gray-600 hover:text-gray-400"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="min-h-[400px]">
            {loading ? (
              <div className="flex items-center gap-4 py-20 text-gray-600">
                <div className="w-4 h-4 border-t border-gray-600 rounded-full animate-spin"></div>
                <span className="text-[10px] uppercase tracking-widest">Consulting Ledgers...</span>
              </div>
            ) : filteredOrders.length > 0 ? (
              <div className="space-y-6">
                {filteredOrders.map(order => (
                  <div
                    key={order.order_id}
                    onClick={() => navigate(`/order/${order.order_id}`)}
                    className="cursor-pointer group bg-gray-950/20 border border-gray-900 hover:border-gray-600 transition-all duration-700 p-8 flex justify-between items-center"
                  >
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase tracking-widest text-gray-600">Archive Reference</p>
                      <p className="font-serif font-light text-lg text-white">#{order.order_id}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                        {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>

                    <div className="text-right space-y-4">
                      <p className="text-xl font-light tracking-tighter text-white">
                        ₹{order.total_amount}
                      </p>
                      <span
                        className={`text-[9px] uppercase tracking-[0.2em] px-4 py-1 border ${
                          order.status === "Pending"
                            ? "border-yellow-900 text-yellow-600"
                            : order.status === "Shipped"
                            ? "border-blue-900 text-blue-600"
                            : "border-green-900 text-green-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-32 border border-gray-900 border-dashed">
                <p className="text-[10px] uppercase tracking-[0.4em] text-gray-700 italic">No acquisition records found</p>
              </div>
            )}
          </div>

          <div className="pt-12">
            <button
              onClick={() => navigate("/viewproductlist")}
              className="text-[10px] uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1"
            >
              ← Return to Collection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOrders;
