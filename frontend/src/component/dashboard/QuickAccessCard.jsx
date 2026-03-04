import React from "react";
import { FaUser, FaHeart, FaBoxOpen, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";

const QuickAccessCard = () => {
  const options = [
    { name: "Profile", icon: <FaUser />, link: "/profile" },
    { name: "Wishlist", icon: <FaHeart />, link: "/wishlist" },
    { name: "Orders", icon: <FaBoxOpen />, link: "/orders" },
    { name: "Cart", icon: <FaShoppingCart />, link: "/viewcart" },
  ];

  return (
    <div className="flex flex-wrap justify-around bg-black border border-gray-900 rounded-none p-8 gap-12">
      {options.map((opt) => (
        <Link
          key={opt.name}
          to={opt.link}
          className="group flex flex-col items-center gap-4 text-gray-500 hover:text-white transition-all duration-500"
        >
          <div className="w-16 h-16 border border-gray-800 flex items-center justify-center text-xl md:text-2xl group-hover:border-white group-hover:bg-white group-hover:text-black transition-all duration-700">
            {opt.icon}
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] font-medium">{opt.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default QuickAccessCard;
