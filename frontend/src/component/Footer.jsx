import React from "react";
import { FaTwitter, FaInstagram, FaFacebookF } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-100 px-8 py-16">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">

        {/* BRAND + SOCIAL */}
        <div className="col-span-2 md:col-span-1 space-y-4">
          <h2 className="text-xl font-semibold">Belleze.</h2>
          <p className="text-sm">FOLLOW US</p>
          <div className="flex gap-4 text-lg">
            <FaTwitter className="hover:text-pink-400 cursor-pointer" />
            <FaInstagram className="hover:text-pink-400 cursor-pointer" />
            <FaFacebookF className="hover:text-pink-400 cursor-pointer" />
          </div>
        </div>

        <div>
          <ul className="space-y-4 text-sm">
            <li>
              <Link
                to="/shop"
                className="font-semibold uppercase text-gray-400 hover:text-white"
              >
                Shop
              </Link>
            </li>

            <li>
              <Link
                to="/viewproductlist"
                className="font-semibold uppercase text-gray-400 hover:text-white"
              >
                Products
              </Link>
            </li>

            <li>
              <Link
                to="/skinquiz"
                className="font-semibold uppercase text-gray-400 hover:text-white"
              >
                Take Skin Quiz
              </Link>
            </li>
          </ul>
        </div>

        {/* COMPANY */}
        <div>
          <h3 className="text-sm font-semibold uppercase mb-4">Company</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <Link to="/about" className="hover:text-white">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-sm font-semibold uppercase mb-4">Contact</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>support@belleze.com</li>
            <li>Kathmandu, Nepal</li>
          </ul>
        </div>
      </div>

      <div className="mt-12 text-xs text-gray-400 text-center">
        © 2026 Belleze. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
