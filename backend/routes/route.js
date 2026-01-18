const express = require('express').Router();
const multer = require('multer');
const upload = multer();

const {addUser,getActiveUsers,getAllUsers,getUserById, updateUser, deleteUser, loginUser} = require('../controllers/userController');

express.post('/register', upload.none(), addUser);
express.get('/all', getAllUsers);
express.get('/getactiveusers', getActiveUsers);
express.get('/id/:id', getUserById);
express.put('/update/:id',updateUser); 
express.delete('/delete/:id',deleteUser);
express.post('/login',loginUser);

module.exports = express;
