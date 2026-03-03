const Cart = require('../models/cartModel');
const Product = require('../models/productModel');


const addToCart = async (req, res) => {
    try {
        const { productId, quantity} = req.body;
        const userId = req.user.id;
        
        let item = await Cart.findOne({ where: { user_id: userId, product_id: productId } });
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not logged in"
            })
        }

        if (item) {
            item.quantity += quantity;
            await item.save();
        } else {
            item = await Cart.create({ user_id: userId, product_id: productId, quantity });
        }

        res.status(200).json({ success: true, message: "Item added to cart!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getCartByUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const cartItems = await Cart.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: Product,
                    attributes: ["product_id", "name", "price", "thumbnail", "stock"],
                },
            ],
        });

        // Format thumbnail URLs with base URL
        const baseUrl = "http://localhost:5000";
        const formattedCartItems = cartItems.map(item => {
            const cartItem = item.toJSON();
            if (cartItem.Product && cartItem.Product.thumbnail) {
                cartItem.Product.thumbnail = `${baseUrl}${cartItem.Product.thumbnail}`;
            }
            return cartItem;
        });

        res.status(200).json({
            success: true,
            cartItems: formattedCartItems,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateCartQuantity = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1"
            })
        }
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        if (quantity > product.productStock) {
            return res.status(400).json({
                success: false,
                message: `Only ${product.productStock} items in stock`
            })
        }

        const cartItem = await Cart.findOne({
            where: { user_id: userId, product_id: productId }
        });
        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            })
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        return res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            cartItem
        });
    } catch (error) {
        console.error("Update cart error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

const clearCart = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Unauthorized: Please log in to claer cart"
            });
        }

        const userCartItems = await Cart.findAll({
            where: { user_id: userId }
        });

        if (userCartItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is already empty"
            });
        }

        await Cart.destroy({ where: { user_id: userId } });

        return res.status(200).json({
            success: true,
            message: "Cart cleared successfully"
        });
    } catch (error) {
        console.error("Clear cart error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const cartItem = await Cart.findOne({
      where: { user_id: userId, product_id: productId },
    });

    if (!cartItem) {
      return res.status(200).json({
        success: true,
        message: "Item not found in cart",
      });
    }

    await cartItem.destroy();

    return res.status(200).json({
      success: true,
      message: "Item removed from cart successfully",
    });

  } catch (error) {
    console.error("Remove cart item error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while removing cart item",
    });
  }
};

module.exports = {
    getCartByUser,
    updateCartQuantity,
    clearCart,
    removeCartItem,
    addToCart
};