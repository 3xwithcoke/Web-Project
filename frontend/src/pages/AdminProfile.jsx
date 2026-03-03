import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import AdminCard from "../component/dashboard/AdminCard";
import { getProfileApi } from "../services/api";

const AdminProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    address: "",
    dob: "",
    gender: "",
    profilePicture: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getProfileApi();
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      } catch (error) {
        toast.error("Failed to load profile");
        console.error("PROFILE LOAD ERROR:", error.response?.data);
      }
    };
    fetchProfile();
  }, []);
  useEffect(() => {
    const handleUserUpdate = () => {
      const localUser = localStorage.getItem("user");
      if (localUser) setUser(JSON.parse(localUser));
    };

    window.addEventListener("userUpdated", handleUserUpdate);
    return () =>
      window.removeEventListener("userUpdated", handleUserUpdate);
  }, []);


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">

        <div className="md:w-1/4">
          <AdminCard />
        </div>

        <div className="md:w-3/4 space-y-6">
          <div className="bg-gradient-to-r from-pink-400 to-purple-400 rounded-2xl p-8 text-white flex items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-white/30 relative">
              <img
                src={
                  user.profilePicture
                    ? `${import.meta.env.VITE_API_BASE_URL}${user.profilePicture}?t=${Date.now()}`
                    : "/src/assets/user.png"
                }
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{user.username || "Full Name"}</h1>
              <p className="opacity-90">{user.email || "Email Address"}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-semibold">Personal Information</h2>
              <button
                onClick={() => navigate("/admineditprofile")}
                className="text-pink-500 font-medium hover:underline"
              >
                Edit
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Username", icon: "👤", value: user.username },
                { label: "Email", icon: "📧", value: user.email },
                { label: "Phone Number", icon: "📞", value: user.phoneNumber },
                { label: "Date of Birth", icon: "🎂", value: user.dob },
                { label: "Gender", icon: "⚧", value: user.gender },
              ].map(({ label, icon, value }) => (
                <div key={label}>
                  <label className="text-gray-500 text-sm flex items-center gap-2 mb-1">
                    {icon} {label}
                  </label>
                  <input
                    type="text"
                    value={value || "-"}
                    readOnly
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-gray-50 focus:outline-none"
                  />
                </div>
              ))}

              <div className="md:col-span-2">
                <label className="text-gray-500 text-sm flex items-center gap-2 mb-1">
                  📍 Address
                </label>
                <input
                  type="text"
                  value={user.address || "-"}
                  readOnly
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-gray-50 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
