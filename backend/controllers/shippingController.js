const Shipping = require("../models/shippingModel.js");

const saveShippingDetails = async (req, res) => {
  try {
    const user_id = req.user.id; 
    const { fullName, phone, address, city } = req.body;

    if (!fullName || !phone || !address || !city) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if user already has a saved shipping entry
    let shipping = await Shipping.findOne({ where: { user_id } });

    if (shipping) {
      // Update existing shipping
      shipping.fullName = fullName;
      shipping.phone = phone;
      shipping.address = address;
      shipping.city = city;
      await shipping.save();
    } else {
      // Create new shipping
      shipping = await Shipping.create({
        user_id,
        fullName,
        phone,
        address,
        city,
      });
    }

    return res.status(200).json({
      success: true,
      data: shipping, 
      message: "Shipping details saved successfully",
    });
  } catch (error) {
    console.error("Save Shipping Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const getAllShippingEntries = async (req, res) => {
  try {
    const entries = await Shipping.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: entries.length,
      data: entries,
    });
  } catch (error) {
    console.error("Get All Shipping Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getSavedShippingDetails = async (req, res) => {
  try {
    const userId = req.user.id; 

    const shipping = await Shipping.findOne({
      where: { user_id:userId },       
      order: [["createdAt", "DESC"]],
    });

    if (!shipping) {
      return res.status(404).json({
        success: false,
        message: "No saved shipping details found",
      });
    }

    return res.status(200).json({
      success: true,
      data: shipping,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


module.exports = {
  saveShippingDetails,
  getAllShippingEntries,
  getSavedShippingDetails
};