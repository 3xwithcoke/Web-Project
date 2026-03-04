import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUser } from "../../protected/Auth";
import { logout } from "../../services/auth";

const HeaderProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = () => setUser(getUser());
    loadUser();
    window.addEventListener("userUpdated", loadUser);
    return () => window.removeEventListener("userUpdated", loadUser);
  }, []);

  if (!user) {
    return (
      <Link to="/login" className="text-white text-xs uppercase tracking-widest hover:text-gray-400 transition font-light">
        Sign In
      </Link>
    );
  }

  return (
    <div className="relative group">
      <span className="cursor-pointer text-xs uppercase tracking-widest text-white hover:text-gray-400 transition font-light">
        {user.username || "Member"}
      </span>

      {/* Luxury Dropdown */}
      <div
        className="absolute right-0 mt-4 w-64 bg-black border border-gray-900 shadow-2xl opacity-0 invisible
                   group-hover:opacity-100 group-hover:visible transition-all duration-500 z-50 p-2"
      >
        <div className="px-6 py-6 border-b border-gray-900 mb-2">
          <p className="font-serif font-light text-white text-base tracking-tight italic">{user.username}</p>
          <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-1">{user.email}</p>
        </div>
        
        <Link
          to="/profile"
          className="block px-6 py-3 text-[10px] uppercase tracking-widest text-gray-400 hover:text-white hover:bg-gray-950 transition-all"
        >
          My Profile
        </Link>
        <Link
          to="/wishlist"
          className="block px-6 py-3 text-[10px] uppercase tracking-widest text-gray-400 hover:text-white hover:bg-gray-950 transition-all"
        >
          My Favorites
        </Link>
        <Link
          to="/orders"
          className="block px-6 py-3 text-[10px] uppercase tracking-widest text-gray-400 hover:text-white hover:bg-gray-950 transition-all"
        >
          Acquisitions
        </Link>
        <Link
          to="/viewcart"
          className="block px-6 py-3 text-[10px] uppercase tracking-widest text-gray-400 hover:text-white hover:bg-gray-950 transition-all"
        >
          My Bag
        </Link>

        <div className="border-t border-gray-900 mt-2 pt-2">
          <button
            onClick={logout}
            className="w-full text-left px-6 py-4 text-[10px] uppercase tracking-widest text-red-900 hover:text-red-600 hover:bg-red-950/10 transition-all"
          >
            Terminate Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderProfile;
