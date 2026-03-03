const { placeOrder, getOrders, getAllOrdersAdmin, getOrderDetails, getOrderDetailsAdmin, updateOrderStatus } = require("../controllers/orderController");
const express = require("express").Router();
const authGuard = require("../helpers/authGuard");


express.post("/place",authGuard,placeOrder);  //userplaceorder
express.get("/get_allorders",authGuard, getOrders); //usergetallorders
express.get("/getorder",authGuard,getOrderDetails); //usergetorderdetails
express.get("/get-all",authGuard,  getAllOrdersAdmin); //admin gets all users order
express.get("/getorder-admin", authGuard, getOrderDetailsAdmin  ) //admin gets users order details
express.put("/update-status/:orderId", authGuard, updateOrderStatus);

module.exports = express;