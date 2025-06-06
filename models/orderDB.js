const mongoose=require('mongoose');

const orderSchema=mongoose.Schema({

  email:String,    
  userId:String,
  courseId:String,
  paymentId:String,
  amount: Number,
  status: String,



})

const orderDB=mongoose.model("Order",orderSchema)
exports.orderDB=orderDB

