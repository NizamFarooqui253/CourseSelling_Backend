const mongoose=require('mongoose');


const purchaseSchema=mongoose.Schema({
  userId:{
    type:mongoose.Types.ObjectId,
    ref:"user"
  },
  courseId:{
    type:mongoose.Types.ObjectId,
    ref:"Course"
  }
})

const purchaseDB=mongoose.model("purchase",purchaseSchema);
exports.purchaseDB=purchaseDB
