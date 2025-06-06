const { orderDB } = require("../models/orderDB");
const { purchaseDB } = require("../models/purchaseCourseDB");

const orderData=async(req,res)=>{
  try {
    const orderInfo=await orderDB.create(req.body);
    const userId=req.body.userId; // or orderInfo.userId
    const courseId=req.body.courseId; // or orderInfo.courseId
    res.status(201).json({message:"Order Details:",orderInfo})
    if(orderInfo){
      const newPurchase=await purchaseDB.create({ userId: userId, courseId: courseId })
    }
  } catch (error) {
    res.status(401).json({errors:"Erros in order creations."})
  }
}
exports.orderData=orderData