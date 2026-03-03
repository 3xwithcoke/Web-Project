import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUser } from "../../protected/Auth";
import { logout } from "../../services/auth";

const HeaderProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getUser()); 
  }, []);

  if (!user) {
    return (
      <Link to="/login" className="hover:text-purple-600 transition text-lg font-semibold px-4 py-2 rounded-lg hover:bg-gray-100">
        Login
      </Link>
    );
  }

  return (
    <div className="relative group">
      {/* Display user name */}
      <span className="cursor-pointer font-semibold text-gray-900 text-base hover:text-purple-600 transition px-4 py-2 rounded-lg hover:bg-gray-100">
        Hi, {user.username || user.name}
      </span>

      {/* Dropdown menu */}
      <div
        className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl opacity-0 invisible
                   group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50"
      >
        <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50">
          <p className="font-bold text-gray-900 text-sm">{user.username || user.name}</p>
          <p className="text-xs text-gray-600 mt-1">{user.email}</p>
        </div>
        
        <Link
          to="/profile"
          className="block px-5 py-3 hover:bg-gray-50 transition font-medium text-gray-700 hover:text-purple-600 border-b border-gray-100"
        >
          Profile
        </Link>
        <Link
          to="/wishlist"
          className="block px-5 py-3 hover:bg-gray-50 transition font-medium text-gray-700 hover:text-purple-600 border-b border-gray-100"
        >
          Wishlist
        </Link>
        <Link
          to="/orders"
          className="block px-5 py-3 hover:bg-gray-50 transition font-medium text-gray-700 hover:text-purple-600 border-b border-gray-100"
        >
          Orders
        </Link>
        <Link
          to="/viewcart"
          className="block px-5 py-3 hover:bg-gray-50 transition font-medium text-gray-700 hover:text-purple-600 border-b border-gray-100"
        >
          Cart
        </Link>
        <Link
          to="/shipping"
          className="block px-5 py-3 hover:bg-gray-50 transition font-medium text-gray-700 hover:text-purple-600 border-b border-gray-100"
        >
          Shipping
        </Link>

        <button
          onClick={logout}
          className="w-full text-left px-5 py-3 text-red-600 hover:bg-red-50 transition font-medium rounded-b-xl">
          Logout
        </button>
      </div>
    </div>
  );
};

export default HeaderProfile;
