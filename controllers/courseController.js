const { config } = require("dotenv");
const { CourseDB } = require("../models/CourseDb");
const { purchaseDB } = require("../models/purchaseCourseDB");
const { STRIPE_SECRET_KEY } = require("../config");
const cloudinary = require("cloudinary").v2;

require('dotenv').config();



const CourseCreated = async (req, res) => {
  try {
    const adminId=req.user.id;
    const { title, description, price } = req.body;
    if (!title || !description || !price) {
      return res.status(400).json({ errors: "All fileds is Nesccessary" });
    }

    const { image } = req.files;

    if (!image) {
      return res.status(400).json({ message: "no image Uploaded" });
    }

    const alloweFomat = ["image/png", "image/jpeg"];

    if (!alloweFomat.includes(image.mimetype)) {
      return res.status(400).json({ error: "Invalid Foramt of Iamge" });
    }



    

    const cloud_response = await cloudinary.uploader.upload(image.tempFilePath);

    if (!cloud_response || cloud_response.error) {
      return res
        .status(400)
        .json({ error: "Error uploading file in cloudinary..." });
    }

    const course = await CourseDB.create({
      ...req.body,
      image: {
        public_id: cloud_response.public_id,
        url: cloud_response.url,
      },
      creatorId:adminId // jo admin create kare uski id mil db me save ho jaaye
    });
    res.json({ message: "User Created Sucessfully", course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.CourseCreated = CourseCreated;










const updateCourse = async (req, res) => {
  try {
    const adminId=req.user.id;
   const {courseId}=req.params; 

   const courseExist=await CourseDB.findById(courseId)
   if(!courseExist){
    return res.json({Message:"You can't update bcz course not found in db"})
   }


   
    

    // jisne course create kiya hai sirf wahi course update kr skte hai
    const updateCourse=await CourseDB.findOneAndUpdate({
      _id:courseId,  // agar ye dono condition theek ho tabhi update hogga...
      creatorId:adminId 
    },{$set:req.body})
    if(!updateCourse){
      res.status(404).json({message:"can't updated,create by another admin"})
    }

    res.status(201).json({message:"Course UPdated Sucessfully::",updateCourse})
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCourse = updateCourse;




const deleteCourse=async(req,res)=>{
  try { 
    const {courseId}=req.params;//course id 
    console.log("courseID",courseId);
    const adminId=req.user.id; // adminID
    console.log("admin id",adminId);
    const deleteCourse=await CourseDB.findOneAndDelete({
      _id:courseId, // db se id match karo aur phir delete krdo..
      creatorId:adminId
    })
    if(!deleteCourse){
      return res.status(404).json({error:"can't deleted,create by another admin"})
    }

    res.status(201).json({message:"Course deleted Sucessfully::",deleteCourse})

  } catch (error) {
    // res.json({messsage:error.message})
    res.status(500).json({ message: error.message });
  }
}

exports.deleteCourse=deleteCourse


const getCourses=async(req,res)=>{
  try {
    const getCourse=await CourseDB.find({});
    res.status(201).json({message:"Here Your Courses",getCourse})
  } catch (error) {
    res.json({message:error.message})
  }
}

exports.getCourses=getCourses;


const getCourseDetail=async(req,res)=>{
  try {
    const {courseId}=req.params; 

    const getCourseDetail=await CourseDB.findById(courseId);
    if(!getCourseDetail){
      return res.json({message:"user not found in db"})
    }
    res.status(201).json({message:"Here YOur Course",getCourseDetail})
    
  } catch (error) {
    res.json({message:error.message})
  }
}

exports.getCourseDetail=getCourseDetail;  





const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
console.log(process.env.STRIPE_SECRET_KEY);


const buyCourses=async(req,res)=>{
 
  try {
    const userId=req.user.id;
    const {courseId}=req.params;
    
    const course=await CourseDB.findById(courseId);
    if(!course){
      return res.status(404).json({message:"Course is not found in db"})
    }

    

    

    const existingPurchase=await purchaseDB.findOne({userId: userId, courseId: courseId})//alag ki wajah se itni khatram krni padhi myDB.find({email})

    
  // agar id(userid) aur courseid present hai toh course already purchase hai...
    if(existingPurchase){
      return res.status(404).json({message:"You Already Purchase the course..."})
    }



    // stripe payment code goes here!!!

    const amount=course.price;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types:["card"],
      


    });









    // jaise hi koi puchase krega course toh user ki id aur purchase id db me save ho jayegi

    // kis user ne liya aur kab liya
    // const newPurchase=await purchaseDB.create({ userId: userId, courseId: courseId })
    res.status(201).json({message:"course purchase sucessfully...",course,clientSecret: paymentIntent.client_secret})


  } catch (error) {
    res.json({message:error.message})
  }
}

exports.buyCourses=buyCourses;

const coursePurchase=async(req,res)=>{
  try {

    const userId=req.user.id;
    console.log(userId);
    const purchased=await purchaseDB.find({userId:userId}) // yaha se unn sabhi  purchase courses ki id mil jayegi jo courses user ne purchase kiye hai  isi purchaseid se hum courseDB se apne course find krenge..
    //bht saaare courses ho skte hai isliye
    console.log(purchased);
    //  const purchasesId=[];//saari couses ki id yaha store kr denge


    const purchasesId=purchased.map(puchassedId=>puchassedId.courseId)
     
     





 

    //  for(let i=0;i<purchased.length;i++){
    //   //purchased.courseId har  course ki toh jitne course unn sabki purchasedId me push krdo
    //   purchasesId.push(purchased[i].courseId);
    //  }

     const viewpuchaseCousre=await CourseDB.find({_id:{$in:purchasesId}})

     res.status(200).json({purchased,viewpuchaseCousre})
    

  } catch (error) {
    console.error("Error in coursePurchase:", error.message);
    res.json({message:error.message})
  }
}

exports.coursePurchase=coursePurchase;

