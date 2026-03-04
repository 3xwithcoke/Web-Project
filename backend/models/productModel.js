const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/database");
const Cart = require("./cartModel");

const Product = sequelize.define(
  "Product",
  {
    product_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    category: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Beauty & Cosmetics",
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0,
      },
    },

    oldPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        isDecimal: true,
        min: 0,
      },
    },
//single image path
    thumbnail: {
      type:DataTypes.STRING,
      allowNull: true,
    },
//multiple image paths
    images: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    rating: {
      type: DataTypes.DECIMAL(2, 1),
      defaultValue: 5.0,
      validate: {
        min: 0,
        max: 5,
      },
    },

    reviewsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 50,
    },

    brand: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Classic House",
    },

    model: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Heritage Edition",
    },

    movement_type: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Automatic",
    },

    case_material: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Stainless Steel",
    },

    water_resistance: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "50m",
    },

    warranty: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "2 Years",
    },
  },
  {
    tableName: "products",
    timestamps: true,
  }
);

module.exports = Product;

