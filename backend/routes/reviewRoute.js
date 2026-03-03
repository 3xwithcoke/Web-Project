const { createReview, deleteReview, getReviewsByProduct, getReviewById, updateReview } = require('../controllers/reviewController');
const authGuard = require('../helpers/authGuard');

const express = require('express').Router();

express.post("/createreview",authGuard, createReview);
express.delete("/deletereview/:id", authGuard, deleteReview);
express.get("/getreview/:productId", getReviewsByProduct);
express.get("/getreview-by-id/:reviewId", authGuard, getReviewById);
express.put("/updatereview/:id", authGuard, updateReview);

module.exports = express;