const express = require("express");
const app = express();
const { sequelize, connectDB } = require("./database/database")

require("./models/relationModel")
const cors= require("cors")
app.use(cors({
    origin:["http://localhost:5173","http://localhost:5174"] ,
    credentials:true

}));

app.use(express.json())
app.use("/uploads",express.static("uploads"));

app.use("/api/user/", require('./routes/userRoute'));
app.use("/api/product", require('./routes/productRoute'));

app.use("/api/shipping", require('./routes/shippingRoute'));

app.use("/api/order", require('./routes/orderRoute'));

app.use("/api/cart", require('./routes/cartRoute'));

app.use("/api/wishlist", require('./routes/wishlistRoute'));
app.use("/api/review", require('./routes/reviewRoute'));


app.use("/api/quiz", require('./routes/SkinQuizRoute'));

app.get("/", (req, res) => {
    res.json({ message: "Welcome to our App!!"});
});

const startServer = async () => {
    await connectDB();
    await sequelize.sync({alter:true});
    app.listen(5000, () => {
        console.log(`Server is running on port ${5000}`);
    });
};
startServer();