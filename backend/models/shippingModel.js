const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/database");

const Shipping = sequelize.define(
  "Shipping",
  {
    shipping_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: "shipping_details",
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

module.exports = Shipping;