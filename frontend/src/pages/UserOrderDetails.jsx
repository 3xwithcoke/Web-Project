import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getOrderDetailsApi } from "../services/api";
import HeaderCard from "../component/dashboard/HeaderCard";

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
          toast.error(res.data.message || "Archive not found");
        }
      } catch (err) {
        toast.error("Unable to fetch acquisition details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="w-8 h-8 border-t-2 border-white rounded-full animate-spin"></div>
        <p className="text-gray-600 text-[10px] uppercase tracking-[0.4em]">Retrieving Record...</p>
      </div>
    </div>
  );

  if (!order) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white italic font-serif">
      Acquisition record not found.
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-16">
        
        <div className="h-fit lg:sticky lg:top-20">
          <HeaderCard />
        </div>

        <main className="space-y-16">
          <div className="flex flex-col md:flex-row justify-between items-end border-b border-gray-900 pb-8 gap-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-serif font-light tracking-tight italic">Acquisition Details</h1>
              <div className="w-24 h-[1px] bg-gray-900"></div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-gray-600">Reference #{order.order_id}</p>
            </div>
            <div className="text-right space-y-2">
               <p className="text-[10px] uppercase tracking-widest text-gray-500">Status</p>
               <span className="text-sm font-serif italic text-white border border-gray-800 px-6 py-2 uppercase tracking-widest bg-gray-950">
                 {order.status}
               </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Summary */}
            <div className="bg-gray-950/20 border border-gray-900 p-10 space-y-8">
               <h2 className="text-xs uppercase tracking-[0.4em] text-gray-500 border-b border-gray-900 pb-4">Order Summary</h2>
               <div className="space-y-6">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-gray-600">Aggregate Value</p>
                    <p className="text-xl font-light text-white tracking-widest">₹{order.total_amount}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-gray-600">Settlement</p>
                    <p className="text-sm font-light text-white uppercase tracking-widest">{order.payment_method} — {order.payment_status}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-gray-600">Acquisition Date</p>
                    <p className="text-sm font-light text-white">{new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
               </div>
            </div>

            {/* Delivery */}
            <div className="bg-gray-950/20 border border-gray-900 p-10 space-y-8">
               <h2 className="text-xs uppercase tracking-[0.4em] text-gray-500 border-b border-gray-900 pb-4">Logistics</h2>
               <div className="space-y-6">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-gray-600">Recipient</p>
                    <p className="text-sm font-light text-white uppercase tracking-wide">{order.fullName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-gray-600">Residence</p>
                    <p className="text-sm font-light text-gray-400 italic leading-relaxed">{order.address}, {order.city}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-gray-600">Contact</p>
                    <p className="text-sm font-light text-white">{order.phone}</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Masterpiece Manifest */}
          <div className="space-y-8">
            <h2 className="text-xs uppercase tracking-[0.4em] text-gray-500 border-b border-gray-900 pb-4">Acquired Masterpieces</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-900">
                    <th className="py-6 text-[10px] uppercase tracking-widest text-gray-600 font-medium">Description</th>
                    <th className="py-6 text-[10px] uppercase tracking-widest text-gray-600 font-medium text-center">Price</th>
                    <th className="py-6 text-[10px] uppercase tracking-widest text-gray-600 font-medium text-center">Qty</th>
                    <th className="py-6 text-[10px] uppercase tracking-widest text-gray-600 font-medium text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-900/50">
                  {order.order_items.map((item, i) => (
                    <tr key={i} className="group">
                      <td className="py-8">
                        <p className="text-sm font-serif font-light text-white uppercase tracking-wide">{item.name}</p>
                        <p className="text-[9px] text-gray-600 uppercase tracking-widest mt-1">Ref ID: {item.product_id}</p>
                      </td>
                      <td className="py-8 text-center text-sm font-light text-gray-400">₹{item.price}</td>
                      <td className="py-8 text-center text-sm font-light text-gray-400">{item.quantity}</td>
                      <td className="py-8 text-right text-sm font-light text-white tracking-widest">₹{item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-12">
            <button
              onClick={() => navigate("/orders")}
              className="text-[10px] uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1"
            >
              ← Return to Acquisitions
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserOrderDetails;
