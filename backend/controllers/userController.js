const User = require("../models/userModel.js");
const bcrypt = require('bcrypt');
const { Op } = require("sequelize");

const changePassword = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const { search } = req.query;

    let filter = {};

    if (search) {
      filter[Op.or] = [
        { username: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const users = await User.findAll({
      where: filter,
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve users",
    });
  }
};

const getUserProfile = async (req, res) => {
    try{
  res.json({
    username: req.user.username,
    email: req.user.email,
    phoneNumber: req.user.phoneNumber,
    address: req.user.address,
    dob: req.user.dob,
    gender: req.user.gender,
    profilePicture: req.user.profilePicture, 
  });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// const updateUserProfile = async (req, res) => {
//   try {
//     const user = req.user; 
//     const { username, email, phoneNumber, address, dob, gender } = req.body;

//     user.username = username ?? user.username;
//     user.email = email ?? user.email;
//     user.phoneNumber = phoneNumber ?? user.phoneNumber;
//     user.address = address ?? user.address;
//     user.dob = dob ?? user.dob;
//     user.gender = gender ?? user.gender;

//     if (req.file) {
//       user.profilePicture = `/uploads/profile/${req.file.filename}`;
//       console.log("Uploaded file path:", user.profilePicture);
//     }

//     await user.save();

//     res.json({
//       message: "Profile updated successfully",
//       username: user.username,
//       email: user.email,
//       phoneNumber: user.phoneNumber,
//       address: user.address,
//       dob: user.dob,
//       gender: user.gender,
//       profilePicture: user.profilePicture, 
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
const updateUserProfile = async (req, res) => {
  try {
    console.log("REQ.USER:", req.user);
    console.log("REQ.BODY:", req.body);
    console.log("REQ.FILE:", req.file);

    const user = req.user;
    const { username, email, phoneNumber, address, dob, gender } = req.body;

    if (username) user.username = username;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (address) user.address = address;
    // Only update dob if provided and not empty
    if (dob && dob.trim()) {
      user.dob = dob;
    }
    if (gender) user.gender = gender;
    if (req.file) user.profilePicture = `/uploads/profile/${req.file.filename}`;

    await user.save();
    res.status(200).json({ success: true, message: "Profile updated successfully", user });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err.message);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};




const deleteMyAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    await user.destroy(); // PERMANENT DELETE

    return res.status(200).json({ 
      success: true,
      message: "Account deleted permanently" 
    });
  } catch (error) {
    console.error("Delete account error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Server error deleting account" 
    });
  }
};


module.exports = { getUserProfile, updateUserProfile, changePassword, deleteMyAccount, getAllUsers};