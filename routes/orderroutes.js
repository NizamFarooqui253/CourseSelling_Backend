const express=require('express');
const { orderData } = require('../controllers/orderController');
const { userMiddleware } = require('../middlewares/userMIdddleware');

const orderRouter=express.Router();


orderRouter.post("/",userMiddleware,orderData);


exports.orderRouter=orderRouter