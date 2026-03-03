const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/database");
const Product = require("./productModel");

const Cart = sequelize.define(
  "Cart",
  {
    cart_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: "cart_details",
    timestamps: true, 
  }
);

module.exports = Cart;