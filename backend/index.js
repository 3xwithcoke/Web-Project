const express = require('express');
const app = express();
const {squelize, connectDB, sequelize} = require('./database/database');
const cors = require("cors")
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,

}));
app.use(express.json());

app.use("/api/user/", require("./routes/route"));

app.get('/', (req, res) => {
    res.json('Welcome to the home page');
});

// app.listen(3000, () => {
//     console.log('Server is running on http://localhost:3000');
// });

const startServer = async () => {
    await connectDB();
    await sequelize.sync({ alter: true }); // Sync models with the database
    app.listen(3000, () => {
        console.log('Server is running on http://localhost:3000');
    });
}
startServer();