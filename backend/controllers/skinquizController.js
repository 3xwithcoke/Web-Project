const SkinQuiz = require("../models/skinquizModel.js");


const submitQuiz = async (req, res) => {
  try {
    const { skinType, answers } = req.body;

    if (!skinType || !answers) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const result = await SkinQuiz.create({
      skinType,
      answers,
    });

    res.status(201).json({
      message: "Quiz submitted successfully",
      result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getResults = async (req, res) => {
  try {
    const results = await SkinQuiz.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const saveSkinQuiz = async (req, res) => {
  try {
    const { skinType } = req.body;

    const quiz = await SkinQuiz.create({
      user: req.user._id,
      skinType,
    });

    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Failed to save skin quiz" });
  }
};


module.exports = { submitQuiz, getResults, saveSkinQuiz };