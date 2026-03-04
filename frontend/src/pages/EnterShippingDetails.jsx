import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { saveShippingApi, getSavedShippingApi } from "../services/api";
import HeaderCard from "../component/dashboard/HeaderCard";

const EnterShippingDetails = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [shippingLoaded, setShippingLoaded] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
  });

  useEffect(() => {
    const fetchShipping = async () => {
      try {
        const response = await getSavedShippingApi();
        if (response.data.success && response.data.data) {
          setFormData(response.data.data);
          setShippingLoaded(true);
        }
      } catch (err) {
        console.error("Failed to fetch saved shipping:", err);
      }
    };
    fetchShipping();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Processing your request...", {
      style: { background: "#000", color: "#fff", border: "1px solid #333" }
    });

    try {
      const response = await saveShippingApi(formData);
      if (response.data.success) {
        toast.success("Shipping details secured", { id: loadingToast });
        setTimeout(() => navigate("/placeorders"), 1200);
      } else {
        toast.error(response.data.message || "Failed to save details", { id: loadingToast });
      }
    } catch (err) {
      toast.error("An error occurred during preservation", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-white selection:bg-white selection:text-black py-20">
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif font-light tracking-tight italic">Delivery Residence</h1>
          <div className="w-24 h-[1px] bg-gray-900 mx-auto"></div>
          <p className="text-xs text-gray-600 uppercase tracking-widest pt-2">Specify where your acquisitions should be delivered</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
          <div className="lg:col-span-1">
            <HeaderCard />
          </div>

          <div className="lg:col-span-3">
            <div className="bg-gray-950 border border-gray-900 p-10 md:p-16">
              <form onSubmit={handleSaveDetails} className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {[
                    { id: "fullName", label: "Full Identity", type: "text" },
                    { id: "phone", label: "Primary Contact", type: "tel" },
                    { id: "city", label: "Locality", type: "text" },
                  ].map(field => (
                    <div key={field.id} className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-gray-600">
                        {field.label} <span className="text-gray-800 ml-1">*</span>
                      </label>
                      <input
                        name={field.id}
                        value={formData[field.id]}
                        onChange={handleChange}
                        type={field.type}
                        required
                        className="w-full bg-transparent border-b border-gray-900 py-4 text-sm font-light focus:border-white transition-all outline-none"
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-600">
                    Detailed Residence Address <span className="text-gray-800 ml-1">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    required
                    className="w-full bg-transparent border-b border-gray-900 py-4 text-sm font-light focus:border-white transition-all outline-none resize-none"
                  />
                </div>

                <div className="pt-12 border-t border-gray-900">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-white text-black py-5 text-xs font-medium uppercase tracking-[0.3em] hover:bg-gray-200 transition-all shadow-2xl disabled:opacity-20"
                  >
                    {loading ? "Preserving..." : "Confirm & Proceed to Checkout"}
                  </button>
                </div>

                {shippingLoaded && (
                  <p className="text-[10px] uppercase tracking-widest text-gray-700 text-center">
                    Authenticated residence records loaded
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterShippingDetails;
