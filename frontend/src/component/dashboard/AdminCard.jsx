import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaPlusCircle,
  FaShoppingCart,
  FaSignOutAlt,
  FaUser,
  FaTrash,
  FaChartLine
} from "react-icons/fa";
import { logout } from "../../services/auth";

const AdminCard = () => {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState({
    username: "",
    email: "",
    profilePicture: "",
  });

  useEffect(() => {
    const loadUser = () => {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          setAdmin(JSON.parse(stored));
        } catch {
          localStorage.removeItem("user");
        }
      }
    };

    loadUser();
    window.addEventListener("userUpdated", loadUser);
    return () => window.removeEventListener("userUpdated", loadUser);
  }, []);

  const profileImage = admin.profilePicture
    ? `${import.meta.env.VITE_API_BASE_URL}${admin.profilePicture}`
    : null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-full bg-black border border-gray-900 p-8 min-h-[600px] flex flex-col selection:bg-white selection:text-black">
      <div className="flex flex-col items-center mb-12 pb-8 border-b border-gray-900">
        <div className="w-20 h-24 bg-gray-950 border border-gray-800 flex items-center justify-center overflow-hidden mb-6">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Admin"
              className="w-full h-full object-cover grayscale"
            />
          ) : (
            <span className="text-3xl text-gray-700 font-serif">
              {admin.username?.charAt(0)?.toUpperCase() || "A"}
            </span>
          )}
        </div>

        <h2 className="text-xl font-serif font-light text-white tracking-tight italic">
          {admin.username || "Executive"}
        </h2>
        <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em] mt-1">
          {admin.email || "System Administrator"}
        </p>

        <Link
          to="/admineditprofile"
          className="mt-6 text-[10px] text-white hover:text-gray-400 uppercase tracking-widest underline underline-offset-8 transition-colors"
        >
          Edit Identity
        </Link>
      </div>

      <div className="flex flex-col gap-1">
        {[
          { to: "/admindash", icon: <FaChartLine />, label: "Overview" },
          { to: "/addproduct", icon: <FaPlusCircle />, label: "Registry" },
          { to: "/adminprofile", icon: <FaUser />, label: "Profile" },
          { to: "/viewadminorder", icon: <FaShoppingCart />, label: "Orders" },
          { to: "/viewallusers", icon: <FaUsers />, label: "Members" },
        ].map((item) => (
          <Link 
            key={item.label}
            to={item.to} 
            className="flex items-center gap-4 px-4 py-4 hover:bg-gray-950 transition-all text-gray-500 hover:text-white text-xs uppercase tracking-widest font-light"
          >
            <span className="text-gray-700">{item.icon}</span> {item.label}
          </Link>
        ))}

        <div className="border-t border-gray-900 my-6"></div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-4 hover:bg-red-950/10 transition-all text-red-900 hover:text-red-600 text-xs uppercase tracking-widest font-light text-left"
        >
          <FaSignOutAlt /> Terminate Session
        </button>

        <Link
          to="/deleteuser"
          className="flex items-center gap-4 px-4 py-4 hover:bg-red-950/10 transition-all text-red-950 text-[10px] uppercase tracking-widest font-light"
        >
          <FaTrash /> Purge Records
        </Link>
      </div>
    </div>
  );
};

export default AdminCard;
