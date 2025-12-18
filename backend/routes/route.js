const express = require('express').Router();

const {addUser}= require('../controllers/userController');

express.post('/register', addUser);


module.exports = express;
