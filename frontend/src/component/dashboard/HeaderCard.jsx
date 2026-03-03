// HeaderCard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaHeart,
  FaBoxOpen,
  FaShoppingCart,
  FaTruck,
  FaSignOutAlt,
  FaTrash,
  FaKey,
} from "react-icons/fa";
import { getUser } from "../../protected/Auth";
import { logout } from "../../services/auth";

const HeaderCard = () => {
  const [user, setUser] = useState(() => getUser() || {
    username: "",
    email: "",
    profilePicture: "",
  });

  useEffect(() => {
    const handleUpdate = () => {
      setUser(getUser() || {
        username: "",
        email: "",
        profilePicture: "",
      });
    };

    window.addEventListener("userUpdated", handleUpdate);
    return () => window.removeEventListener("userUpdated", handleUpdate);
  }, []);

  const profileImage = user?.profilePicture
    ? `${import.meta.env.VITE_API_BASE_URL}${user.profilePicture}?t=${Date.now()}`
    : null;
    
  return (
    <div className="w-full md:w-80 bg-gradient-to-b from-white to-pink-50 rounded-2xl shadow-lg p-6 border border-pink-100 sticky top-6">

      {/* User Info */}
      <div className="flex flex-col items-center mb-8 pb-6 border-b border-pink-200"> 
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center overflow-hidden shadow-lg border-4 border-white"> 
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => (e.target.style.display = "none")}
            />
          ) : (
            <span className="text-3xl text-white font-bold">
              {user?.username?.charAt(0).toUpperCase()} 
            </span>
          )}
        </div> 
        <h2 className="mt-3 font-bold text-gray-900 text-lg">
          {user?.username}
        </h2> 
        <p className="text-sm text-gray-600 mt-1 break-all text-center">
          {user?.email}
        </p> 
        <Link to="/editprofile" className="mt-3 text-sm text-pink-600 font-semibold hover:text-pink-700 hover:underline transition">
          Edit Profile →
        </Link> 
      </div>

      {/* Menu Items */}
      <div className="flex flex-col gap-2">
        <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-pink-100 transition font-medium text-gray-700 hover:text-gray-900">
          <FaUser className="text-pink-600" /> Profile
        </Link>

        <Link to="/wishlist" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-pink-100 transition font-medium text-gray-700 hover:text-gray-900">
          <FaHeart className="text-pink-600" /> Wishlist
        </Link>

        <Link to="/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-pink-100 transition font-medium text-gray-700 hover:text-gray-900">
          <FaBoxOpen className="text-pink-600" /> Orders
        </Link>

        <Link to="/viewcart" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-pink-100 transition font-medium text-gray-700 hover:text-gray-900">
          <FaShoppingCart className="text-pink-600" /> Cart
        </Link>

        <Link to="/shipping" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-pink-100 transition font-medium text-gray-700 hover:text-gray-900">
          <FaTruck className="text-pink-600" /> Shipping
        </Link>

        <div className="border-t border-pink-200 my-2"></div>

        <Link to="/changepassword" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 transition font-medium text-red-600 hover:text-red-700">
          <FaKey /> Update Password
        </Link>

        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 transition font-medium text-red-600 hover:text-red-700 w-full text-left">
          <FaSignOutAlt /> Logout
        </button>

        <Link to="/deleteuser" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 transition font-medium text-red-600 hover:text-red-700">
          <FaTrash /> Delete Account
        </Link>
      </div>
    </div>
  );
};

export default HeaderCard;
