const User = require("./userModel");
const Product = require("./productModel");
const Cart = require("./cartModel");
const Wishlist = require("./wishlistModel");
const Review = require("./reviewModel");
const Order = require("./orderModel");

// User Relations
User.hasMany(Cart, { foreignKey: "user_id" });
Cart.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Wishlist, { foreignKey: "user_id" });
Wishlist.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Review, { foreignKey: "user_id" });
Review.belongsTo(User, { foreignKey: "user_id" });

// Product Relations
Product.hasMany(Cart, { foreignKey: "product_id" });
Cart.belongsTo(Product, { foreignKey: "product_id" });

Product.hasMany(Wishlist, { foreignKey: "product_id" });
Wishlist.belongsTo(Product, { foreignKey: "product_id" });

Product.hasMany(Review, { foreignKey: "product_id" });
Review.belongsTo(Product, { foreignKey: "product_id" });


// User → Orders
User.hasMany(Order, { foreignKey: "user_id", as: "orders",});

// Order → User
Order.belongsTo(User, { foreignKey: "user_id", as: "user",});

module.exports = {
  User,
  Product,
  Cart,
  Wishlist,
  Review,
};
