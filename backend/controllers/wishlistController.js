const Wishlist = require("../models/wishlistModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");


const addToWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        const exists = await Wishlist.findOne({
            where: { user_id: userId, product_id: productId },
        });

        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Product already in wishlist",
            });
        }

        await Wishlist.create({
            user_id: userId,
            product_id: productId,
        });

        res.status(201).json({
            success: true,
            message: "Product added to wishlist",
        });
    } catch (error) {
        console.error("Add wishlist error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


const getWishlistByUser = async (req, res) => {
    try {
        const userId = req.user.id;

        const wishlist = await Wishlist.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: Product,
                    attributes: [
                        "product_id",
                        "name",
                        "price",
                        "thumbnail",
                        "stock",
                    ],
                },
            ],
        });

        res.status(200).json({
            success: true,
            wishlist,
        });
    } catch (error) {
        console.error("Get wishlist error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        const removed = await Wishlist.destroy({
            where: { user_id: userId, product_id: productId },
        });

        if (!removed) {
            return res.status(404).json({
                success: false,
                message: "Item not found in wishlist",
            });
        }

        res.status(200).json({
            success: true,
            message: "Product removed from wishlist",
        });
    } catch (error) {
        console.error("Remove wishlist error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


const moveToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        const product = await Product.findByPk(productId);

        if (!product || product.stock < 1) {
            return res.status(400).json({
                success: false,
                message: "Product out of stock",
            });
        }

        const cartItem = await Cart.findOne({
            where: { user_id: userId, product_id: productId },
        });

        if (cartItem) {
            cartItem.quantity += 1;
            await cartItem.save();
        } else {
            await Cart.create({
                user_id: userId,
                product_id: productId,
                quantity: 1,
            });
        }

        await Wishlist.destroy({
            where: { user_id: userId, product_id: productId },
        });

        res.status(200).json({
            success: true,
            message: "Moved from wishlist to cart",
        });
    } catch (error) {
        console.error("Move to cart error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = {
    addToWishlist,
    getWishlistByUser,
    removeFromWishlist,
    moveToCart,
};
