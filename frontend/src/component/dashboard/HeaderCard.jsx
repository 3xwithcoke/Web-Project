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
    <div className="w-full md:w-80 bg-black text-white rounded-none shadow-2xl p-8 border border-gray-900 sticky top-24">

      {/* User Info */}
      <div className="flex flex-col items-center mb-10 pb-8 border-b border-gray-900"> 
        <div className="w-24 h-24 rounded-full bg-gray-900 flex items-center justify-center overflow-hidden shadow-2xl border border-gray-800"> 
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              onError={(e) => (e.target.style.display = "none")}
            />
          ) : (
            <span className="text-4xl text-gray-500 font-serif font-light">
              {user?.username?.charAt(0).toUpperCase()} 
            </span>
          )}
        </div> 
        <h2 className="mt-6 font-serif font-light text-white text-xl tracking-wide uppercase">
          {user?.username}
        </h2> 
        <p className="text-xs text-gray-500 mt-2 tracking-widest uppercase">
          {user?.email}
        </p> 
        <Link to="/editprofile" className="mt-6 text-[10px] text-gray-400 font-medium hover:text-white transition uppercase tracking-[0.2em] underline underline-offset-8">
          Edit Profile
        </Link> 
      </div>

      {/* Menu Items */}
      <div className="flex flex-col gap-1">
        {[
          { to: "/profile", icon: <FaUser />, label: "Profile" },
          { to: "/wishlist", icon: <FaHeart />, label: "Wishlist" },
          { to: "/orders", icon: <FaBoxOpen />, label: "Orders" },
          { to: "/viewcart", icon: <FaShoppingCart />, label: "Cart" },
          { to: "/shipping", icon: <FaTruck />, label: "Shipping" },
        ].map((item) => (
          <Link 
            key={item.label}
            to={item.to} 
            className="flex items-center gap-4 px-4 py-4 rounded-none hover:bg-gray-900 transition font-light text-sm text-gray-400 hover:text-white uppercase tracking-widest"
          >
            <span className="text-gray-600 group-hover:text-white">{item.icon}</span> {item.label}
          </Link>
        ))}

        <div className="border-t border-gray-900 my-4"></div>

        <Link to="/changepassword" className="flex items-center gap-4 px-4 py-4 rounded-none hover:bg-red-950/20 transition font-light text-sm text-red-500/80 hover:text-red-500 uppercase tracking-widest">
          <FaKey /> Update Password
        </Link>

        <button
          onClick={logout}
          className="flex items-center gap-4 px-4 py-4 rounded-none hover:bg-red-950/20 transition font-light text-sm text-red-500/80 hover:text-red-500 uppercase tracking-widest w-full text-left"
        >
          <FaSignOutAlt /> Logout
        </button>

        <Link to="/deleteuser" className="flex items-center gap-4 px-4 py-4 rounded-none hover:bg-red-950/20 transition font-light text-xs text-red-900 hover:text-red-600 uppercase tracking-widest">
          <FaTrash /> Delete Account
        </Link>
      </div>
    </div>
  );
};

export default HeaderCard;
