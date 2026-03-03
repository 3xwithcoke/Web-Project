
const { getAllProducts, getCategories,getProductDetails,getRelatedProducts, getProductsByCategory, updateProduct, deleteProduct, getSingleProduct, addProduct, getSuggestedProducts} = require("../controllers/productController");
const { searchProducts } = require("../controllers/searchController");

const express = require("express").Router();
const uploadProductImages = require("../helpers/multer");
const isAdmin = require("../helpers/isAdmin");
const authGuard = require("../helpers/authGuard");

express.get("/relatedproducts", getRelatedProducts);
express.post("/addproduct",authGuard,isAdmin,uploadProductImages,addProduct);
express.get("/productdetails/:id", getProductDetails);


express.get("/search", searchProducts)

express.get("/getallproducts", getAllProducts)
express.get("/getcategories", getCategories)
express.get("/getproductsbycategory/:category", getProductsByCategory);

express.put("/updateProduct/:id",authGuard,isAdmin,uploadProductImages,updateProduct);
express.delete("/deleteproduct/:id",authGuard,isAdmin, deleteProduct)

module.exports = express;