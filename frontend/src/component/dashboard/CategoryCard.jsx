import React from "react";

const CategoryCard = ({ name, onClick }) => {
  return (
    <div onClick={onClick}className="min-w-[220px] bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all snap-start border border-gray-200 text-center cursor-pointer hover:border-purple-300">
      <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
    </div>
  );
};

export default CategoryCard;
