const { addToCart, getCartByUser, updateCartQuantity, clearCart, removeCartItem } = require("../controllers/cartController");
const authGuard = require("../helpers/authGuard");

const express = require("express").Router();

// Route to add an item to the cart
express.post("/add", authGuard,addToCart);

// Route to get all cart items for a specific user
express.get("/getCart",authGuard, getCartByUser,);

express.put("/updatecart/:productId",authGuard, updateCartQuantity);
express.delete("/clearcart",authGuard, clearCart);
express.delete("/removecartitem/:productId",authGuard, removeCartItem);  //ritu
module.exports = express;