import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-20 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
        <div className="space-y-6">
          <h2 className="text-2xl font-serif font-light tracking-tighter italic">Chronos Luxe</h2>
          <p className="text-gray-500 text-sm font-light leading-relaxed">
            Crafting excellence in every second. Our curated collection of world-class timepieces represents the pinnacle of precision and legacy.
          </p>
        </div>

        <div className="space-y-6">
          <h3 className="text-xs uppercase tracking-[0.3em] text-white">Collections</h3>
          <ul className="space-y-3 text-gray-500 text-sm font-light">
            <li className="hover:text-white transition-colors cursor-pointer">Men</li>
            <li className="hover:text-white transition-colors cursor-pointer">Women</li>
            <li className="hover:text-white transition-colors cursor-pointer">Limited Edition</li>
            <li className="hover:text-white transition-colors cursor-pointer">Accessories</li>
          </ul>
        </div>

        <div className="space-y-6">
          <h3 className="text-xs uppercase tracking-[0.3em] text-white">The House</h3>
          <ul className="space-y-3 text-gray-500 text-sm font-light">
            <li className="hover:text-white transition-colors cursor-pointer">Our Heritage</li>
            <li className="hover:text-white transition-colors cursor-pointer">Craftsmanship</li>
            <li className="hover:text-white transition-colors cursor-pointer">Boutiques</li>
            <li className="hover:text-white transition-colors cursor-pointer">Contact</li>
          </ul>
        </div>

        <div className="space-y-6">
          <h3 className="text-xs uppercase tracking-[0.3em] text-white">Concierge</h3>
          <ul className="space-y-3 text-gray-500 text-sm font-light">
            <li>concierge@chronosluxe.com</li>
            <li>+1 (800) CHRONOS</li>
            <li className="pt-4 flex gap-4 text-white">
              {/* Icons could go here */}
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-gray-900/50 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[10px] uppercase tracking-widest text-gray-700">© 2026 Chronos Luxe. All rights reserved.</p>
        <div className="flex gap-8 text-[10px] uppercase tracking-widest text-gray-700">
           <span className="hover:text-gray-400 cursor-pointer">Privacy Policy</span>
           <span className="hover:text-gray-400 cursor-pointer">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
