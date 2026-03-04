import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaShoppingBag,
} from "react-icons/fa";
import HeaderProfile from './dashboard/HeaderProfile';
import { getUserRole } from '../protected/Auth';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = getUserRole();
    setIsLoggedIn(role === "user" || role === "admin");
    setIsAdmin(role === "admin");

    const handleLogin = () => {
      const newRole = getUserRole();
      setIsLoggedIn(true);
      setIsAdmin(newRole === "admin");
    };
    const handleLogout = () => {
      setIsLoggedIn(false);
      setIsAdmin(false);
    };

    window.addEventListener("userLogin", handleLogin);
    window.addEventListener("logout", handleLogout);

    return () => {
      window.removeEventListener("userLogin", handleLogin);
      window.removeEventListener("logout", handleLogout);
    };
  }, []);

  return (
    <header className="bg-black text-white border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 flex items-center justify-between">
        <Link to={isLoggedIn ? "/userdash" : "/"}
          className="text-2xl font-serif tracking-widest uppercase hover:text-gray-400 transition">
          Chronos Luxe
        </Link>

        {/* Navigation Links */}
        <nav className="hidden lg:flex space-x-6 text-sm uppercase tracking-wider font-light">
          <Link to="/category/men" className="hover:text-gray-400 transition">Men</Link>
          <Link to="/category/women" className="hover:text-gray-400 transition">Women</Link>
          <Link to="/category/smart-watches" className="hover:text-gray-400 transition">Smart Watches</Link>
          <Link to="/category/luxury" className="hover:text-gray-400 transition">Luxury</Link>
          <Link to="/category/limited-edition" className="hover:text-gray-400 transition">Limited Edition</Link>
          {isAdmin && (
            <Link to="/admindash" className="text-white font-medium hover:text-gray-400 transition border-l border-gray-800 pl-6">Admin</Link>
          )}
        </nav>

        {/* Icons */}
        <div className="flex items-center space-x-6">
          <Link to="/search" className="hover:text-gray-400 transition text-lg">
            <FaSearch />
          </Link>
          <Link to="/viewcart" className="hover:text-gray-400 transition text-lg relative">
            <FaShoppingBag />
          </Link>
          <HeaderProfile />
        </div>
      </div>
    </header>
  );
};

export default Header;
