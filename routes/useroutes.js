const express=require('express');
const { signUp, login, logout } = require('../controllers/userController');
const { coursePurchase } = require('../controllers/courseController');
const { userMiddleware } = require('../middlewares/userMIdddleware');
const userRouter=express.Router();

userRouter.post("/signup",signUp)
userRouter.post("/login",login);
userRouter.get("/logout",logout);
userRouter.get("/purchased",userMiddleware,coursePurchase);




exports.userRouter=userRouter;