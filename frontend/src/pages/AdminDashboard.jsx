import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminCard from "../component/dashboard/AdminCard";
import axios from "axios";

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
        // Fetch all products count
        const productsRes = await axios.get("/api/product/getallproducts");
        const ordersRes = await axios.get("/api/order/getallorders");
        const usersRes = await axios.get("/api/user/getallusers");

        setStats({
          products: productsRes.data.results?.length || 0,
          orders: ordersRes.data.results?.length || 0,
          users: usersRes.data.results?.length || 0,
        });
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-8 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10">
        {/* Sidebar */}
        <AdminCard />

        {/* Main Dashboard */}
        <main>
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            Admin Overview
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div
              className="bg-white rounded-lg p-6 shadow cursor-pointer hover:shadow-lg transition"
              onClick={() => navigate("/addproduct")}
            >
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-3xl font-bold text-pink-400">{stats.products}</p>
              <p className="text-green-500 mt-1 text-sm">
                ▲ 10.23% than last month
              </p>
            </div>

            <div
              className="bg-white rounded-lg p-6 shadow cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate("/viewadminorder")}
            >
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-3xl font-bold text-pink-400">{stats.orders}</p>
              <p className="text-green-500 mt-1 text-sm">
                ▲ 20.50% than last month
              </p>
            </div>

            <div
              className="bg-white rounded-lg p-6 shadow cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate("/viewallusers")}
            >
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-3xl font-bold text-pink-400">{stats.users}</p>
              <p className="text-green-500 mt-1 text-sm">
                ▲ 30.33% than last month
              </p>
            </div>

            <div
              className="bg-white rounded-lg p-6 shadow cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate("/addproduct")}
            >
              <p className="text-sm text-gray-500">Add Product</p>
              <p className="text-3xl font-bold text-pink-400">+</p>
              <p className="text-gray-500 mt-1 text-sm">Quickly add new products</p>
            </div>
          </div>

          {/* Optionally: add a table or list of recent orders/products */}
        </main>
      </div>
    </div>
  );
}
