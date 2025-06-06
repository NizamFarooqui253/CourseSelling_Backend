const express=require('express');
const { signUp, login, logout } = require('../controllers/adminController');
const adminRouter=express.Router();





adminRouter.post("/signup",signUp) 
adminRouter.post("/login",login);
adminRouter.get("/logout",logout);





exports.adminRouter=adminRouter