const z=require('zod');//used for validation 
const { adminDB } = require('../models/adminDB');

const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const { JWT_ADMIN_PASSWORD } = require('../config');

const signUp=async(req,res)=>{
  try {
    const {firstName,lastName,email,password}=req.body;

    const adminSchema = z.object({//ye kch condition jo honi hi chahiye
      firstName: z
        .string()
        .min(3, { message: "firstName must be atleast 3 char long" }),
      lastName: z
        .string()
        .min(3, { message: "lastName must be atleast 3 char long" }),
      email: z.string().email(),
      password: z
        .string()
        .min(6, { message: "password must be atleast 6 char long" }),
    });

    //safeParse ek method hai jo check karta hai ki input(jo data user ne bhja hai)  data   userSchema ke rules ko follow karta hai ya nahi.
    const validateData=adminSchema.safeParse(req.body);

    if(!validateData.success){
      //validateData.error.issues ek array hota hai jisme har validation error ka ek object hota hai (with details).
      //map(err => err.message) ka matlab hai:
    //Har error object me se sirf uska error message nikaal lo


      return res.status(400).json({error:validateData.error.issues.map(err=>err.message)})
    }
    



    const ExistUser=await adminDB.findOne({email})
    if(ExistUser){
      return res.json({message:"User ALready Exist "})
    }

    const hashPassword=await bcrypt.hash(password,10);
    const signUpUser=await adminDB.create({...req.body,password:hashPassword})
    res.status(201).json({message:"signUP Sucessfully::",signUpUser})
    
  } catch (error) {
    res.json({message:error.message})
  }
}

exports.signUp=signUp


const login=async(req,res)=>{
  try {
    const {email,password}=req.body;
    const existUser=await adminDB.findOne({email});
    const matchPass=await bcrypt.compare(password,existUser.password)
    if(!existUser || !matchPass){
      res.status(403).json({error:"Invalid email or password"})
    }
    const token=jwt.sign({id:existUser._id,email:existUser.email},JWT_ADMIN_PASSWORD,{expiresIn:"1d"}); 

    const cookieExpires={
      expires:new Date(Date.now() + 24 * 60 * 60 * 1000),// 1 day
      httpOnly:true,//cant be access directly
      secure:process.env.NODE_ENV==="production",//true for all http only
      sameSite:"Strict" // protect CSRF attack
    }


    res.cookie("jwt",token,cookieExpires)// save token in cookie
    res.status(201).json({message:"login Sucessfully",existUser,token})
    
  } catch (error) {
    res.json({message:error.message})
  }
}



exports.login=login



const logout=async(req,res)=>{
  try {
    if(!req.cookies.jwt){
      return res.status(401).json({errors:"kindly LOgin first"})
    }
    res.clearCookie("jwt");
    res.status(200).json({message:"LOgged out Successfully.."})
  } catch (error) {
    res.json({message:error.message})
  }
}

exports.logout=logout;

