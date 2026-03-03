const { Op } = require("sequelize");
const Product = require("../models/productModel");

class ProductServices {
  /**
   * Search products by keyword across multiple fields.
   * @param {string} keyword
   * @returns {Promise<Array>}
   */
  static async searchProducts(keyword) {
    if (!keyword) return []; // handles empty search
    return Product.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${keyword}%` } },
          { description: { [Op.iLike]: `%${keyword}%` } },
          { category: { [Op.iLike]: `%${keyword}%` } },
        ],
      },
      order: [["name", "ASC"]],
      limit: 100, 
    });
  }

  static async deleteProductById(id){
    return await Product.destroy({
      where: {id}
    })
  }
}

module.exports = ProductServices;
