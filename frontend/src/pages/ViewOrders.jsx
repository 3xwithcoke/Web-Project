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
          setOrders(res.data.orders);
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
    <div className="min-h-screen w-full bg-pink-50 flex flex-col md:flex-row items-start py-12 px-6 md:gap-8">

      <div className="mb-8 md:mb-0">
        <HeaderCard />
      </div>

      <div className="flex-1 bg-white rounded-[2.5rem] shadow-lg p-8 md:p-12 w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-pink-900 mb-2">
            My Orders
          </h1>
          <p className="text-pink-700 opacity-70">
            Track and manage your purchases
          </p>
        </div>

        <div className="flex space-x-6 border-b border-pink-100 mb-8 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`pb-3 text-lg font-medium transition-all whitespace-nowrap ${
                filter === tab
                  ? "text-pink-600 border-b-4 border-pink-600"
                  : "text-pink-300 hover:text-pink-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="min-h-[300px]">
          {loading ? (
            <p className="text-center text-pink-400 text-xl animate-pulse">
              Loading orders...
            </p>
          ) : filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map(order => (
                <div
                  key={order.order_id}
                  onClick={() => navigate(`/order/${order.order_id}`)}
                  className="cursor-pointer bg-pink-50 hover:bg-pink-100 transition p-6 rounded-2xl flex justify-between items-center border border-pink-100"
                >
                  <div>
                    <p className="font-bold text-pink-900 text-lg">
                      Order #{order.order_id}
                    </p>
                    <p className="text-pink-500 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-pink-700 font-medium">
                      Rs. {order.total_amount}
                    </p>
                  </div>

                  <span
                    className={`px-4 py-1 rounded-full text-sm font-semibold ${
                      order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "Shipped"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-2xl">🛒</p>
              <p className="text-pink-500 font-semibold mt-2">
                No orders found
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate("/viewproductlist")}
          className="mt-10 px-10 py-4 rounded-2xl bg-pink-100 text-pink-600 hover:bg-pink-200 font-semibold"
        >
          ← Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default ViewOrders;
