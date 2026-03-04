const express = require("express");
const app = express();
const { sequelize, connectDB } = require("./database/database")
const cors = require("cors");

require("./models/relationModel")

app.use(cors({
    origin: true,
    credentials: true,
}));

// Manual CORS fallback for preflight
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json())
app.use("/uploads", express.static("uploads"));
app.use("/uploads/profile", express.static("uploads/profile"));

app.use("/api/user", require('./routes/userRoute'));
app.use("/api/product", require('./routes/productRoute'));
app.use("/api/shipping", require('./routes/shippingRoute'));
app.use("/api/order", require('./routes/orderRoute'));
app.use("/api/cart", require('./routes/cartRoute'));
app.use("/api/wishlist", require('./routes/wishlistRoute'));
app.use("/api/review", require('./routes/reviewRoute'));

app.get("/", (req, res) => {
    res.json({ message: "Welcome to Chronos Luxe API" });
});

const startServer = async () => {
    try {
        await connectDB();
        await sequelize.sync({ force: false });
        // Using port 8000 to avoid common macOS conflicts
        app.listen(8000, () => {
            console.log(`Server is running on port 8000`);
        });
    } catch (error) {
        console.error("Startup error:", error);
    }
};
startServer();
