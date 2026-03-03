const { DataTypes } = require("sequelize");
const {sequelize} = require("../database/database");

const OTP = sequelize.define("OTP", {
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: false
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = OTP;
