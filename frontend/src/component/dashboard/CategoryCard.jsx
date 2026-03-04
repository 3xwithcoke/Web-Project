import React from "react";

const CategoryCard = ({ name, onClick, className }) => {
  return (
    <div 
      onClick={onClick}
      className={`group relative bg-black border border-gray-900 p-10 cursor-pointer transition-all duration-700 hover:border-gray-400 text-center ${className}`}
    >
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      <h3 className="relative z-10 text-xs font-serif font-light tracking-[0.4em] uppercase text-gray-400 group-hover:text-white transition-colors">
        {name}
      </h3>
    </div>
  );
};

export default CategoryCard;
