const { loginUser, registerUser, sendOtp, verifyOtp, resetPassword } = require("../controllers/auth/authController");
const { getUserProfile, updateUserProfile, changePassword, deleteMyAccount, getAllUsers } = require("../controllers/userController");
const authGuard = require("../helpers/authGuard");
const isAdmin = require("../helpers/isAdmin");
const protect = require("../helpers/protect");
const express = require("express").Router();
const uploadProfileImage = require("../helpers/uploadProfile");

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

express.post("/login", loginUser)
express.post("/register", registerUser)
express.get("/profile", protect, getUserProfile);
express.put("/profile", protect, uploadProfileImage, updateUserProfile);

express.post("/forgotpassword/sendotp", sendOtp);
express.post("/forgotpassword/verifyotp", verifyOtp);
express.put("/forgotpassword/resetpassword", resetPassword);

express.delete("/deleteuser", asyncHandler(authGuard), deleteMyAccount);
express.put("/changepassword", asyncHandler(authGuard), changePassword);
express.get("/viewallusers", authGuard, isAdmin, getAllUsers);

module.exports = express;