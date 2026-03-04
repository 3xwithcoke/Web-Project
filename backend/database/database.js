const { Sequelize } = require("sequelize") ;
const path = require('path');
require("dotenv").config({ path: path.join(__dirname, '../.env') });

const sequelize = new Sequelize (
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: "postgres" ,
        logging: false,
        port: process.env.DB_PORT || 5432,
    }
);


const connectDB = async () => {
    try{
        await sequelize.authenticate();
        console.log("PostgreSQL connected sucessfully.");
       } catch (error) {
        console.error("Unable to connect to teh database:", error);
       }
};

module.exports = { sequelize, connectDB};