const Product = require("../models/productModel");
const { Op } = require("sequelize"); 

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await Product.findByPk(id);
    if (!entry) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    const product = entry.toJSON();
    const baseUrl = "http://localhost:8000";
    product.thumbnail = product.thumbnail ? `${baseUrl}${product.thumbnail}` : null;
    product.images = Array.isArray(product.images)
      ? product.images.map(img => `${baseUrl}${img}`)
      : [];

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getRelatedProducts = async (req, res) => {
  try {
    const { id, category } = req.query;
    console.log("HIT getRelatedProducts", req.query);

    if (!id || !category) {
      return res.status(400).json({
        success: false,
        message: "Product id and category are required",
      });
    }

    const products = await Product.findAll({
      where: {
        category,
        product_id: {
          [Op.ne]: Number(id), 
        },
      },
      limit: 8,
      order: [["createdAt", "DESC"]],
    });

    const baseUrl = "http://localhost:8000";
    const formattedProducts = products.map(p => {
      const product = p.toJSON();
      product.thumbnail = product.thumbnail
        ? `${baseUrl}${product.thumbnail}`
        : null;
      return product;
    });

    res.status(200).json({
      success: true,
      products: formattedProducts,
    });
  } catch (error) {
    console.error("Related products error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch related products",
    });
  }
};



//for dashboard
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      order: [["createdAt", "DESC"]],
    });

    const baseUrl = "http://localhost:8000"; 

    const formattedProducts = products.map(p => {
      const product = p.toJSON();
      product.thumbnail = product.thumbnail ? `${baseUrl}${product.thumbnail}` : null;
      return product;
    });

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      results: formattedProducts,
    });

  } catch (error) {
    console.error(" getAllProducts error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};



const getCategories = async (req, res) => {
  try {
    const categories = await Product.findAll({
      attributes: ['category'],
      group: ['category']
    });

    res.status(200).json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error("getCategories error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
}

const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!category) {
      return res.status(400).json({ success: false, message: "Category is required" });
    }

    const products = await Product.findAll({
      where: { category },
      order: [["createdAt", "DESC"]],
    });

    const baseUrl = "http://localhost:8000";
    const formattedProducts = products.map(p => {
      const product = p.toJSON();
      product.thumbnail = product.thumbnail ? `${baseUrl}${product.thumbnail}` : null;
      return product;
    });

    res.status(200).json({
      success: true,
      results: formattedProducts,
    });
  } catch (error) {
    console.error("getProductsByCategory error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const deleteProduct = async (req, res) => {
  try {

    const productId = req.params.id;
    const userRole = req.user.role;

    if (userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Admins only"
      })
    }

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      })
    }
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      })
    }

    await product.destroy();

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete product"
    })
  }
}

const addProduct = async (req, res) => {
  try {
    const { 
      name, category, description, price, oldPrice, stock, 
      brand, model, movement_type, case_material, water_resistance, warranty 
    } = req.body;

    if (!name || !description || !price || !stock || !brand || !model) {
      return res.status(400).json({
        success: false,
        message: "Name, description, price, stock, brand, and model are required"
      });
    }

    const thumbnail = `/uploads/${req.files.thumbnail[0].filename}`;
    const images = req.files?.images ? req.files.images.map(f => `/uploads/${f.filename}`) : [];

    const product = await Product.create({
      name,
      category: category || "Luxury Watches",
      description,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : null,
      stock: Number(stock),
      brand,
      model,
      movement_type,
      case_material,
      water_resistance,
      warranty,
      thumbnail,
      images,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product
    });
  } catch (error) {
    console.error("addProduct error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const thumbnail = req.files?.thumbnail
      ? `/uploads/${req.files.thumbnail[0].filename}`
      : product.thumbnail;

    const images = req.files?.images?.length
      ? req.files.images.map(file => `/uploads/${file.filename}`)
      : product.images;

    await product.update({
      ...req.body,
      thumbnail,
      images,
    });

    res.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("updateProduct error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};






module.exports = {
    getProductDetails,
    getRelatedProducts,
    getAllProducts,
    getCategories,
    
    

  addProduct,
  deleteProduct,
  updateProduct,
  getProductsByCategory
};
