const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/database");
const Product = require("./productModel");
const User = require("./userModel");

const Wishlist = sequelize.define(
    "Wishlist",
    {
        wishlist_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'user_id',
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'products',
                key: 'product_id',
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
    },
    {
        tableName: "wishlist",
        timestamps: true,
    }
);

module.exports = Wishlist;
