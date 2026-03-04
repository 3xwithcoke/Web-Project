import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderDetailsAdminApi, updateOrderStatusApi } from "../services/api";
import toast, { Toaster } from "react-hot-toast";
import AdminCard from "../component/dashboard/AdminCard";

const OrderDetailsAdmin = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const statusOptions = ["Pending", "Shipped", "Delivered", "Cancelled"]; 

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderDetailsAdminApi(id);
        if (res.data.success) {
          setOrder(res.data.data);
        } else {
          toast.error(res.data.message);
        }
      } catch (err) {
        console.error("Fetch Order Details Error:", err);
        toast.error("Failed to load order archives");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    setUpdatingStatus(true);
    const loadingToast = toast.loading(`Updating status to ${newStatus}...`, {
      style: { background: "#000", color: "#fff", border: "1px solid #333" }
    });

    try {
      const res = await updateOrderStatusApi(order.order_id, newStatus);
      if (res.data.success) {
        setOrder(prev => ({ ...prev, status: newStatus }));
        toast.success(`Acquisition status: ${newStatus}`, { id: loadingToast });
      } else {
        toast.error(res.data.message || "Failed to update status", { id: loadingToast });
      }
    } catch (err) {
      toast.error("Server synchronization error", { id: loadingToast });
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="w-8 h-8 border-t-2 border-white rounded-full animate-spin"></div>
        <p className="text-gray-600 text-[10px] uppercase tracking-[0.4em]">Retrieving Archive #{id}...</p>
      </div>
    </div>
  );

  if (!order) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white italic font-serif">
      Order archive not found.
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black py-20 px-6">
      <Toaster position="top-center" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-16">
        <div className="h-fit lg:sticky lg:top-20">
          <AdminCard />
        </div>

        <main className="space-y-16">
          <div className="flex flex-col md:flex-row justify-between items-end border-b border-gray-900 pb-8 gap-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-serif font-light tracking-tight italic">Acquisition Dossier</h1>
              <div className="w-24 h-[1px] bg-gray-900"></div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-gray-600">Reference Archive #{order.order_id}</p>
            </div>
            <div className="text-right space-y-2">
               <p className="text-[10px] uppercase tracking-widest text-gray-500">Current Status</p>
               <span className="text-sm font-serif italic text-white border border-gray-800 px-6 py-2 uppercase tracking-widest bg-gray-950">
                 {order.status}
               </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Client Info */}
            <div className="bg-gray-950/20 border border-gray-900 p-10 space-y-8">
               <h2 className="text-xs uppercase tracking-[0.4em] text-gray-500 border-b border-gray-900 pb-4">Client Identity</h2>
               <div className="space-y-6">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-gray-600">Full Name</p>
                    <p className="text-sm font-light text-white uppercase tracking-wide">{order.fullName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-gray-600">Authorized Email</p>
                    <p className="text-sm font-light text-white">{order.user?.email || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-gray-600">Direct Contact</p>
                    <p className="text-sm font-light text-white">{order.phone}</p>
                  </div>
               </div>
            </div>

            {/* Logistics Info */}
            <div className="bg-gray-950/20 border border-gray-900 p-10 space-y-8">
               <h2 className="text-xs uppercase tracking-[0.4em] text-gray-500 border-b border-gray-900 pb-4">Logistics Archive</h2>
               <div className="space-y-6">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-gray-600">Destination</p>
                    <p className="text-sm font-light text-white uppercase tracking-wide">{order.city}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-gray-600">Detailed Residence</p>
                    <p className="text-sm font-light text-gray-400 italic leading-relaxed">{order.address}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-gray-600">Settlement Method</p>
                    <p className="text-sm font-light text-white uppercase tracking-wide">{order.payment_method}</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Items Registry */}
          <div className="space-y-8">
            <h2 className="text-xs uppercase tracking-[0.4em] text-gray-500 border-b border-gray-900 pb-4">Masterpiece Manifest</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-900">
                    <th className="py-6 text-[10px] uppercase tracking-widest text-gray-600 font-medium">Description</th>
                    <th className="py-6 text-[10px] uppercase tracking-widest text-gray-600 font-medium text-center">Unit Price</th>
                    <th className="py-6 text-[10px] uppercase tracking-widest text-gray-600 font-medium text-center">Quantity</th>
                    <th className="py-6 text-[10px] uppercase tracking-widest text-gray-600 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-900/50">
                  {order.order_items.map((item, i) => (
                    <tr key={i} className="group hover:bg-gray-950/50 transition-colors">
                      <td className="py-8">
                        <p className="text-sm font-light text-white uppercase tracking-wide">{item.name}</p>
                        <p className="text-[9px] text-gray-600 uppercase tracking-widest mt-1">Ref ID: {item.product_id}</p>
                      </td>
                      <td className="py-8 text-center text-sm font-light text-gray-400">₹{item.price}</td>
                      <td className="py-8 text-center text-sm font-light text-gray-400">{item.quantity}</td>
                      <td className="py-8 text-right text-sm font-light text-white tracking-widest">₹{item.total}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="py-10 text-right text-[10px] uppercase tracking-[0.3em] text-gray-600">Aggregate Value</td>
                    <td className="py-10 text-right text-3xl font-serif font-light text-white tracking-tighter italic">₹{order.total_amount}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Action Suite */}
          <div className="bg-gray-950 border border-gray-900 p-12 space-y-10">
             <div className="space-y-2">
                <h2 className="text-xl font-serif font-light italic">Executive Directives</h2>
                <p className="text-[10px] uppercase tracking-widest text-gray-600">Update the status of this acquisition</p>
             </div>
             
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {statusOptions.map(status => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(status)}
                    disabled={updatingStatus || order.status === status}
                    className={`py-4 text-[10px] uppercase tracking-[0.2em] font-medium transition-all duration-500 border ${
                      order.status === status
                        ? "bg-white text-black border-white"
                        : "bg-transparent text-gray-500 border-gray-800 hover:border-white hover:text-white"
                    } disabled:opacity-20`}
                  >
                    {status}
                  </button>
                ))}
             </div>
          </div>

          <div className="pt-8">
            <button
              onClick={() => navigate("/viewadminorder")}
              className="text-[10px] uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1"
            >
              ← Return to Registry
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrderDetailsAdmin;
