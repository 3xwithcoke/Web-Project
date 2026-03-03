const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/database");

const SkinQuiz = sequelize.define("SkinQuiz", {
  skinType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  answers: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  result: {
      type: DataTypes.STRING, 
      allowNull: false,
  }
});

module.exports = SkinQuiz;

