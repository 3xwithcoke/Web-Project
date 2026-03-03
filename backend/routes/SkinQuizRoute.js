
const express = require("express").Router();
const { submitQuiz, getResults, saveSkinQuiz} = require("../controllers/skinquizController");

express.post("/submit", submitQuiz);
express.get("/results", getResults);
express.post("/save", saveSkinQuiz);

module.exports = express;
