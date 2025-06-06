const mongoose=require('mongoose');

const adminSchema=mongoose.Schema({
//firsName lastName email password
firstName:{
  type:String,
  require:true
},
lastName:{
  type:String,
  require:true
},
email:{
  type:String,
  require:true,
  union:true
},
password:{
  type:String,
  require:true
},


})

const adminDB=mongoose.model("admin",adminSchema)
exports.adminDB=adminDB

