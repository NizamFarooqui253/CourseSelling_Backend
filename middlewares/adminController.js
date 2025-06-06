const jwt=require('jsonwebtoken'); 
const {  JWT_ADMIN_PASSWORD } = require('../config');



const adminMiddleware=async(req,res,next)=>{
  try {
    const header=req.headers.authorization;
    if(!header || !header.startsWith("Bearer")){
      return res.status(401).json({errors:"No token provided"})
    }

    const token=header.split(" ")[1]
    const user=jwt.verify(token,JWT_ADMIN_PASSWORD);//return payload 
    req.user=user;
    next();
    
  } catch (error) {
    res.json({message:error.message})
  }
}

exports.adminMiddleware=adminMiddleware;