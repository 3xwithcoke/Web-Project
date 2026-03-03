
const ProductService = require("../services/productServices");


const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword || !keyword.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search keyword is required",
        results: [],
      });
    }

    const products = await ProductService.searchProducts(keyword);

    if (products.length === 0) {
      return res.status(404).json({
        success: true,
        message: "No products found",
        results: [],
      });
    }

    res.status(200).json({
      success: true,
      message: `${products.length} products found`,
      results: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error while searching",
      results: [],
    });
  }
};

module.exports = { searchProducts };
