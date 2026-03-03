import React, { useState, useEffect } from "react";
import { getOrdersApi } from "../services/api"; // <-- user API

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("History");
  const [loading, setLoading] = useState(false);

  const tabs = ["History", "Pending", "Shipped", "Delivered", "Cancelled"];

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await getOrdersApi(); // <-- user-specific API
        let userOrders = res.data.orders || [];

        // Filter orders based on active tab
        if (activeTab === "History") {
          userOrders = userOrders.filter(o => o.status === "Delivered" || o.status === "Cancelled");
        } else if (activeTab !== "All") {
          userOrders = userOrders.filter(o => o.status === activeTab);
        }

        setOrders(userOrders);
      } catch (err) {
        console.error("User fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-800 font-sans selection:bg-rose-100 selection:text-rose-900">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-slate-900">
              Orders <span className="text-rose-400">Overview</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Track your orders and see your order history.
            </p>
          </div>

          <nav className="flex gap-1 bg-slate-100 p-1 rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  activeTab === tab
                    ? "bg-white text-rose-500 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </header>

        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="px-8 py-5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Order ID</th>
                  <th className="px-8 py-5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="px-8 py-5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-8 py-5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="py-20 text-center text-slate-300 animate-pulse">
                      Loading orders...
                    </td>
                  </tr>
                ) : orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <span className="text-sm font-medium text-slate-900">
                          #{order.id.toString().padStart(5, "0")}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-sm text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-8 py-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${
                            order.status === "Delivered"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : order.status === "Cancelled"
                              ? "bg-slate-50 text-slate-500 border-slate-200"
                              : order.status === "Shipped"
                              ? "bg-rose-50 text-rose-600 border-rose-100"
                              : "bg-amber-50 text-amber-700 border-amber-100"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right text-sm font-semibold text-slate-900">
                        Rs. {Number(order.total_amount).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-24 text-center text-slate-300 text-sm italic font-light">
                      No records found for "{activeTab}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
 