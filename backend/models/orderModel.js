const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/database");
const User = require("./userModel");

const Order = sequelize.define(
  "Order",
  {
    order_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true, 
      }
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^[0-9+ ]+$/i, 
      }
    },

    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    city: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Kathmandu",
    },

    status: {
      type: DataTypes.ENUM("Pending", "Shipped", "Delivered", "Cancelled"),
      defaultValue: "Pending",
      allowNull: false,
    },

    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      validate: {
        isDecimal: true,
        min: 0,
      },
    },

    order_items: {
      type: DataTypes.JSON,
      allowNull: false, 
    },

    payment_method: {
      type: DataTypes.STRING,
      defaultValue: "Cash on Delivery",
    },

    payment_status: {
      type: DataTypes.ENUM("Unpaid", "Paid", "Refunded"), 
      defaultValue: "Unpaid",
    },

    tracking_number: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    tableName: "orders",
    timestamps: true, 
  }
);

module.exports = Order;