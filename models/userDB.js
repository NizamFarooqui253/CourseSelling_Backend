const mongoose=require('mongoose');

const userSchema=mongoose.Schema({
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

const UserDB=mongoose.model("user",userSchema)
exports.UserDB=UserDB

