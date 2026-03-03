const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const JWT_SECRET = process.env.JWT_SECRET;

const authGuard = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false,
            message: 'Authorization token missing' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Fetch full user from database
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(404).json({ success: false,
                message: 'User not found' });
        }
        
        // Attach user object and ensure both id and user_id are available
        req.user = user;
        req.user.id = user.user_id; // For backward compatibility with existing code
        next();
    } catch (error) {
        console.error('Auth guard error:', error);
        return res.status(401).json({ success: false,
            message: 'Invalid or expired token' });
    }
};

module.exports = authGuard;