import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaPlusCircle,
  FaShoppingCart,
  FaSignOutAlt,
  FaUser,
  FaTrash,
} from "react-icons/fa";
import { logout } from "../../services/auth";

const AdminCard = () => {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState({
    username: "",
    email: "",
    profilePicture: "",
  });

  /* =========================
     Load from localStorage
  ========================== */
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

    return () => {
      window.removeEventListener("userUpdated", loadUser);
    };
  }, []);

  const profileImage = admin.profilePicture
    ? `${import.meta.env.VITE_API_BASE_URL}${admin.profilePicture}`
    : null;

  const handleLogout = () => {
    logout();
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="w-72 bg-white rounded-lg shadow-md p-5 min-h-[600px] flex flex-col">
      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl text-gray-500 font-semibold">
              {admin.username?.charAt(0)?.toUpperCase() || "A"}
            </span>
          )}
        </div>

        <h2 className="mt-2 font-semibold text-gray-800">
          {admin.username || "Admin"}
        </h2>
        <p className="text-sm text-gray-500">
          {admin.email || "-"}
        </p>

        <Link
          to="/admineditprofile"
          className="mt-1 text-sm text-pink-500 hover:underline"
        >
          Edit Profile →
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        <Link to="/addproduct" className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded">
          <FaPlusCircle /> Add Product
        </Link>

        <Link to="/adminprofile" className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded">
          <FaUser /> Profile
        </Link>

        <Link to="/viewadminorder" className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded">
          <FaShoppingCart /> Orders
        </Link>

        <Link to="/viewallusers" className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded">
          <FaUsers /> Users
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded text-red-500"
        >
          <FaSignOutAlt /> Logout
        </button>

        <Link
          to="/deleteuser"
          className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded text-red-600"
        >
          <FaTrash /> Delete Account
        </Link>
      </div>
    </div>
  );
};

export default AdminCard;
