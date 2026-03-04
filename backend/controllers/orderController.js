const { sequelize } = require("../database/database.js");
const Cart = require("../models/cartModel.js");
const Order = require("../models/orderModel.js");
const Product = require("../models/productModel.js");
const Shipping = require("../models/shippingModel.js");
const User = require("../models/userModel.js");

const placeOrder = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const { fullName, phone, address, city, payment_method } = req.body;

    const cartItems = await Cart.findAll({
      where: { user_id: userId },
      include: [{ model: Product }],
      transaction: t,
    });

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Your cart is empty!" });
    }

    // Validate stock
    for (const item of cartItems) {
      const product = item.Product;
      if (!product) {
        await t.rollback();
        return res.status(404).json({ success: false, message: `Product not found in DB` });
      }
      if (item.quantity > product.stock) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: `${product.name} is out of stock! Only ${product.stock} left.`,
        });
      }

      // Reduce stock
      product.stock -= item.quantity;
      await product.save({ transaction: t });
    }

    // Save shipping info
    const shipping = await Shipping.create(
      { user_id: userId, fullName, phone, address, city },
      { transaction: t }
    );

    // Prepare order items array for order table
    const order_items = cartItems.map(item => ({
      product_id: item.product_id,
      name: item.Product.name,
      quantity: item.quantity,
      price: item.Product.price,
      total: item.quantity * item.Product.price,
    }));

    // Calculate total amount
    const total_amount = order_items.reduce((acc, item) => acc + item.total, 0);

    // Create order
    const newOrder = await Order.create(
      {
        user_id: userId,
        fullName,
        phone,
        address,
        city,
        payment_method: payment_method || "Cash on Delivery",
        total_amount,
        order_items,
        status: "Pending",
        payment_status: "Unpaid",
      },
      { transaction: t }
    );

    // Clear cart
    await Cart.destroy({ where: { user_id: userId }, transaction: t });

    await t.commit();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order: newOrder,
      shipping,
    });
  } catch (error) {
    if (t) await t.rollback();
    console.error("Place Order Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.findAll({
      where: { user_id: userId },
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};



const getAllOrdersAdmin = async (req, res) => {
  
  try {
    if (req.user.role !== "admin") return res.status(403).json({ success: false, message: "Access denied" });

    const { status } = req.query;
    const query = {};
    if (status && status.toLowerCase() !== "all") query.status = status;

    const orders = await Order.findAll({
      where: query,
      include: [{ model: User, as: "user", attributes: ["user_id", "email", "username"] }],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};




const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.query; 
    const userId = req.user.id;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "orderId is required",
      });
    }

    const order = await Order.findOne({
      where: {
        order_id: orderId,
        user_id: userId, // user can access only their own order
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        order_id: order.order_id,
        fullName: order.fullName,
        phone: order.phone,
        address: order.address,
        city: order.city,
        status: order.status,
        total_amount: order.total_amount,
        order_items: order.order_items,
        payment_method: order.payment_method,
        payment_status: order.payment_status,
        tracking_number: order.tracking_number,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error("Get Order Details Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get Order Details (Admin)
const getOrderDetailsAdmin = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ success: false, message: "Access denied" });

    const { orderId } = req.query;
    if (!orderId) return res.status(400).json({ success: false, message: "orderId is required" });

    const order = await Order.findOne({
      where: { order_id: orderId },
      include: [{ model: User, as: "user", attributes: ["user_id", "email", "username"] }],
    });

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Access denied" });

    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByPk(orderId);
    if (!order)
      return res.status(404).json({ success: false, message: "Order not found" });

    order.status = status;
    await order.save();

    return res.json({ success: true, message: "Order status updated", order });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


module.exports = { placeOrder, getOrders, getAllOrdersAdmin, getOrderDetails, getOrderDetailsAdmin, updateOrderStatus};