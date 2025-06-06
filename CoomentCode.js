const { CourseDB } = require("../models/CourseDb")
const cloudinary = require('cloudinary').v2;

const CourseCreated=async(req,res)=>{
    try {
      console.log(req.body);
      const {title,description,price}=req.body;
      if(!title || !description  || !price){
        return res.status(400).json({errors:"All fileds is Nesccessary"})
      }


      //req.file image ki saari info rakhta hai..

      const {image}=req.files// ye jo middlware lgya h wahi se aa rhi hai req.files 
      if(!image){
        return res.status(400).json({message:"no image Uploaded"})
      }
      

      const alloweFomat=["image/png","image/jpeg"];

      if(!alloweFomat.includes(image.mimetype)){
        return res.status(400).json({error:"Invalid Foramt of Iamge"})
      }

/// isi se sidhe image uplaod hoggi aur tempFilePath jo humne express uploader me diya ussi path pr image upload ho jayegi...

// aue cloudinary ek response bhejega usme url aur public id hoggi jo hum apne db me save kr lenge
      const cloud_response=await cloudinary.uploader.upload(image.tempFilePath)
// jaise hi cloduinary pr image 

      if(!cloud_response || cloud_response.error){
        return res.status(400).json({error:"Error uploading file in cloudinary..."})
      }

    const course=await CourseDB.create({
      
      ...req.body,
      image:{
        public_id:cloud_response.public_id,
        url:cloud_response.url
      }
    
    
    });
    res.json({message:"User Created Sucessfully",course})

    } catch (error) {
      res.status(500).json({message:error.message})
    }
 
}

exports.CourseCreated=CourseCreated

const updateCourse=async(req,res)=>{
  try {
    
  } catch (error) {
    res.status(500).json({message:error.message})
  }
}

exports.updateCourse=updateCourse