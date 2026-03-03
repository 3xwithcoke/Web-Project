const { addToWishlist, getWishlistByUser, removeFromWishlist, moveToCart } = require('../controllers/wishlistController');
const authGuard = require('../helpers/authGuard');

const express = require('express').Router();


express.post("/addwishlist", authGuard, addToWishlist);
express.get("/getwishlist", authGuard, getWishlistByUser);
express.delete("/removewishlist/:productId", authGuard, removeFromWishlist);
express.post("/movetocart/:productId", authGuard, moveToCart); 

module.exports = express;