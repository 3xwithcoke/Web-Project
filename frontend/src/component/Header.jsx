import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import {
  FaSearch,
} from "react-icons/fa";
import HeaderProfile from './dashboard/HeaderProfile';
import { getUserRole } from '../protected/Auth';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const role = getUserRole();
    setIsLoggedIn(role === "user" || role === "admin");

    const handleLogin = () => setIsLoggedIn(true);
    const handleLogout = () => setIsLoggedIn(false);

    window.addEventListener("userLogin", handleLogin);
    window.addEventListener("logout", handleLogout);

    return () => {
      window.removeEventListener("userLogin", handleLogin);
      window.removeEventListener("logout", handleLogout);
    };
  }, []);
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 flex items-center justify-between">
        <Link to={isLoggedIn ? "/userdash" : "/"}
          className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          Belleze
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">
          <Link to={isLoggedIn ? "/userdash" : "/"} className="hover:text-purple-600 transition duration-300">Home</Link>
          <Link to="/shop" className="hover:text-purple-600 transition duration-300">Shop</Link>
          <Link to="/viewproductlist" className="hover:text-purple-600 transition duration-300">Products</Link>
          <Link to="/about" className="hover:text-purple-600 transition duration-300">About</Link>
          <Link to="/contact" className="hover:text-purple-600 transition duration-300">Contact</Link>
        </nav>

        {/* Icons */}
        <div className="flex items-center space-x-4 text-gray-700">
          <Link to="/search" className="hover:text-purple-600 transition duration-300 text-lg p-2 hover:bg-gray-100 rounded-lg">
            <FaSearch />
          </Link>

          <HeaderProfile />
        </div>
      </div>
    </header>
  );
};

export default Header;