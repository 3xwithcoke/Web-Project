import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminCard from "../component/dashboard/AdminCard";
import { fetchProducts, getAllOrdersAdminApi, getAllUsersApi } from "../services/api";
import toast, { Toaster } from "react-hot-toast";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [productsRes, ordersRes, usersRes] = await Promise.all([
          fetchProducts(),
          getAllOrdersAdminApi("All"),
          getAllUsersApi("user")
        ]);

        console.log("Admin Dashboard Data Sync:", {
          products: productsRes.data,
          orders: ordersRes.data,
          users: usersRes.data
        });

        setStats({
          products: productsRes.data.results?.length || 0,
          orders: ordersRes.data.orders?.length || ordersRes.data.data?.length || 0,
          users: usersRes.data.data?.length || usersRes.data.users?.length || 0,
        });
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
        toast.error("Failed to sync archives");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-8 h-8 border-t-2 border-white rounded-full animate-spin"></div>
          <p className="text-gray-600 text-[10px] uppercase tracking-[0.4em]">Accessing Secure Vault...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black py-20 px-6">
      <Toaster />
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-16">
        {/* Sidebar */}
        <div className="h-fit lg:sticky lg:top-20">
          <AdminCard />
        </div>

        {/* Main Dashboard */}
        <main className="space-y-16">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-serif font-light tracking-tight italic">
              Executive Overview
            </h1>
            <div className="w-24 h-[1px] bg-gray-900"></div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-600">Chronos Luxe Management Suite</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div
              className="group bg-gray-950/20 border border-gray-900 p-10 cursor-pointer hover:border-gray-600 transition-all duration-700"
              onClick={() => navigate("/addproduct")}
            >
              <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-4 group-hover:text-gray-400 transition-colors">Catalog Inventory</p>
              <div className="flex justify-between items-end">
                <p className="text-5xl font-light tracking-tighter text-white">{stats.products}</p>
                <span className="text-[10px] text-gray-700 uppercase tracking-widest pb-1">Masterpieces</span>
              </div>
            </div>

            <div
              className="group bg-gray-950/20 border border-gray-900 p-10 cursor-pointer hover:border-gray-600 transition-all duration-700"
              onClick={() => navigate("/viewadminorder")}
            >
              <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-4 group-hover:text-gray-400 transition-colors">Client Acquisitions</p>
              <div className="flex justify-between items-end">
                <p className="text-5xl font-light tracking-tighter text-white">{stats.orders}</p>
                <span className="text-[10px] text-gray-700 uppercase tracking-widest pb-1">Confirmed Orders</span>
              </div>
            </div>

            <div
              className="group bg-gray-950/20 border border-gray-900 p-10 cursor-pointer hover:border-gray-600 transition-all duration-700"
              onClick={() => navigate("/viewallusers")}
            >
              <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-4 group-hover:text-gray-400 transition-colors">Member Registry</p>
              <div className="flex justify-between items-end">
                <p className="text-5xl font-light tracking-tighter text-white">{stats.users}</p>
                <span className="text-[10px] text-gray-700 uppercase tracking-widest pb-1">Active Collectors</span>
              </div>
            </div>

            <div
              className="group bg-white text-black p-10 cursor-pointer hover:bg-gray-200 transition-all duration-700"
              onClick={() => navigate("/addproduct")}
            >
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-4">Registry Access</p>
              <div className="flex justify-between items-end">
                <p className="text-4xl font-serif font-light tracking-tight italic">New Arrival</p>
                <span className="text-2xl pb-1">+</span>
              </div>
            </div>
          </div>

          <div className="border border-gray-900 p-12 space-y-8">
             <h2 className="text-xs uppercase tracking-[0.4em] text-gray-500 border-b border-gray-900 pb-4">Security Protocol</h2>
             <p className="text-sm font-light text-gray-600 leading-relaxed max-w-2xl">
                As an administrator of Chronos Luxe, you have been granted access to the global archives. Please ensure all modifications to the masterpiece registry are authenticated and verified against physical stock.
             </p>
          </div>
        </main>
      </div>
    </div>
  );
}
