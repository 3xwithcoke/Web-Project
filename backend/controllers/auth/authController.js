const User = require("../../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const OTP = require("../../models/otpModel.js");
const sendEmail = require("../../helpers/emailUtils.js");

const loginUser = async (req, res) => {
    console.log("Login request body");; 
    try {
        const { email, password } = req.body;
        //validating user input
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const user = await User.findOne({ where: { email } });  
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        if (!user.is_active) {   //checks user account was deleted or not
            return res.status(403).json({
                message: "User account is deactivated"
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);  //Compares password
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        //Generating token 
        const token = jwt.sign(
            {
                id: user.user_id,
                role: user.role,
                email: user.email,
                username: user.username,
                profilePicture: user.profilePicture
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token,
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture
            }
        });

    } catch (error) {
        console.error("Login error: ", error)
        return res.status(500).json({
            success: false,
            message: "Server error while logging in"
        });
    }
};

const registerUser = async (req, res) => {
    try {
        console.log("REQUEST BODY:", req.body);
        const { username, email, password, confirmPassword, address, phoneNumber, } = req.body;

        if (!username || !email || !password || !phoneNumber) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long"
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
        }

        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            address: address || null,
            phoneNumber,
            role: "user",
            is_verified: false,
            is_active: true
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user.user_id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Register error",error.error ? error.errors.map(e=> e.message):error.message);
        return res.status(500).json({
            success: false,
            message: error.errors ? error.errors.map(e => e.message).join(","): error.message
        });
    }
};

const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email)
            return res.status(400).json({ message: "Email required" });

        const user = await User.findOne({ where: { email } });
        if (!user)
            return res.status(404).json({ message: "User not found" });

        await OTP.destroy({ where: { email } });

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

        await OTP.create({
            email,
            otp: otpCode,
            expiresAt,
            verified: false
        });

        await sendEmail(
            email,
            "Password Reset OTP",
            `Your OTP is ${otpCode}. It expires in 2 minutes.`
        );

        res.json({ message: "OTP sent successfully" });
    } catch (err) {
        console.error("SEND OTP ERROR:", err); 
        res.status(500).json({ message: "Failed to send OTP" });
    }
};



const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const record = await OTP.findOne({ where: { email, otp } });
        if (!record)
            return res.status(400).json({ message: "Invalid OTP" });

        if (record.expiresAt < new Date())
            return res.status(400).json({ message: "OTP expired" });

        await record.update({ verified: true });

        res.json({ message: "OTP verified successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};



const resetPassword = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;

        if (!email || !password || !confirmPassword)
            return res.status(400).json({ message: "All fields required" });

        if (password !== confirmPassword)
            return res.status(400).json({ message: "Passwords do not match" });

        if (password.length < 8)
            return res.status(400).json({ message: "Password too short" });

        const otpRecord = await OTP.findOne({
            where: { email, verified: true }
        });

        if (!otpRecord)
            return res.status(403).json({ message: "OTP not verified" });

        const hashed = await bcrypt.hash(password, 10);

        await User.update(
            { password: hashed },
            { where: { email } }
        );

        await OTP.destroy({ where: { email } });

        res.json({ message: "Password reset successful" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};


module.exports = {
    loginUser, registerUser, sendOtp, verifyOtp, resetPassword
};
