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
    <div className="flex flex-wrap justify-around bg-white rounded-2xl shadow-lg p-6 gap-6 md:gap-10">
      {options.map((opt) => (
        <Link
          key={opt.name}
          to={opt.link}
          className="flex flex-col items-center text-gray-700 hover:text-white transition-all duration-300 hover:scale-105"
        >
          <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-pink-400 to-pink-200 rounded-full flex items-center justify-center text-2xl md:text-3xl shadow-md hover:shadow-xl transition-all duration-300">
            {opt.icon}
          </div>
          <span className="mt-2 md:mt-3 text-sm md:text-base font-semibold">{opt.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default QuickAccessCard;
