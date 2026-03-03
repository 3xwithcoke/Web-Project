const { saveShippingDetails, getAllShippingEntries, getSavedShippingDetails } = require("../controllers/shippingController");
const authGuard = require("../helpers/authGuard");

const express = require("express").Router();


express.post("/saveShipping", authGuard,saveShippingDetails);


express.get("/getAllShipping",authGuard, getAllShippingEntries);
express.get("/getsavedshipping", authGuard, getSavedShippingDetails)

module.exports = express;