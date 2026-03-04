import React from "react";

const ProductCard = ({ name, description, price, imageUrl, onAddToCart, onAddToWishlist, onClick, className }) => {
    return (
        <div onClick={onClick} className={`group relative bg-black border border-gray-900 overflow-hidden cursor-pointer transition-all duration-700 hover:border-gray-500 ${className}`}>
            <div className="aspect-[4/5] w-full overflow-hidden">
                <img 
                    src={imageUrl || "/placeholder.png"} 
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <button 
                    onClick={(e) => { e.stopPropagation(); onAddToWishlist(); }}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 backdrop-blur-md border border-white/10 text-white rounded-none opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:text-black"
                >
                    ❤️
                </button>
            </div>
            
            <div className="p-6 space-y-4 bg-black">
                <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-light">{description || "Luxury Edition"}</p>
                    <h3 className="text-sm font-serif font-light tracking-wide text-white uppercase group-hover:text-gray-300 transition-colors">{name}</h3>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-900">
                    <p className="text-white font-light text-sm tracking-widest">₹{price}</p>
                    <button
                        onClick={(e) => { e.stopPropagation(); onAddToCart(); }}
                        className="text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors underline underline-offset-4"
                    >
                        Add to Bag
                    </button>
                </div>
            </div>
        </div>
    );
};
export default ProductCard;
