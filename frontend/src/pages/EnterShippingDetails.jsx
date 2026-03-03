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

  // Load saved shipping if available
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
    const loadingToast = toast.loading("Saving shipping details...");

    try {
      // Save shipping details
      const response = await saveShippingApi(formData);

      if (response.data.success) {
        toast.success(response.data.message || "Details saved! ✨", { id: loadingToast });
        setTimeout(() => navigate("/placeorders"), 1200);
      } else {
        toast.error(response.data.message || "Failed to save shipping", { id: loadingToast });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Failed to save shipping", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-pink-50 via-white to-pink-50 px-4 sm:px-6 md:px-8 py-8 md:py-12">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            📦 Shipping <span className="text-pink-600">Details</span>
          </h1>
          <p className="text-gray-600 mt-2">Enter your delivery address</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 h-fit">
            <HeaderCard />
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-10">
              <form onSubmit={handleSaveDetails} className="space-y-6">
                {["fullName", "phone", "address", "city"].map(field => (
                  <div key={field} className="space-y-2">
                    <label className="block text-gray-900 font-bold text-lg">
                      {field === "fullName" ? "👤 Full Name" : field === "phone" ? "📞 Phone Number" : field === "address" ? "🏠 Street Address" : "🏙️ City"}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    {field === "address" ? (
                      <textarea
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        rows="3"
                        required
                        placeholder={`Enter ${field}`}
                        className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none bg-gray-50 hover:bg-white transition font-medium"
                      />
                    ) : (
                      <input
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        type={field === "phone" ? "tel" : "text"}
                        required
                        placeholder={`Enter ${field}`}
                        className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none bg-gray-50 hover:bg-white transition font-medium"
                      />
                    )}
                  </div>
                ))}

                <div className="pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 rounded-xl text-lg font-bold transition transform active:scale-95 ${
                      loading
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-pink-600 to-pink-700 text-white hover:from-pink-700 hover:to-pink-800 shadow-lg hover:shadow-xl"
                    }`}
                  >
                    {loading ? "⏳ Saving..." : "✓ Save & Continue"}
                  </button>
                </div>

                {shippingLoaded && (
                  <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                    <p className="text-green-700 font-semibold flex items-center gap-2">
                      ✓ Previous details loaded. Update if needed.
                    </p>
                  </div>
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
