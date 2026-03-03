import React from "react";

const ProductCard = ({ name, description, price, imageUrl, onAddToCart, onAddToWishlist, onClick }) => {
    return (
        <div onClick={onClick} className="min-w-[260px] bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 snap-start">
            <img src={imageUrl || "/placeholder.png"} alt={name}
                className="h-56 w-full object-cover rounded-t-2xl"
            />
            <div className="p-5 text-center space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-800">{name}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{description}</p>
                <p className="text-purple-600 font-semibold text-lg">₹{price}</p>
                <div className="flex justify-center gap-3 mt-3">
                    <button
                        onClick={onAddToCart}
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-md text-xs font-semibold transition">
                        Add to Cart
                    </button>
                    <button
                        onClick={onAddToWishlist}
                        className="px-3 py-2 border-2 border-purple-300 text-purple-600 rounded-md text-sm hover:bg-purple-50 transition font-semibold">
                        ❤️
                    </button>
                </div>
            </div>
        </div>
    );
};
export default ProductCard;
