const express=require("express");
const { CourseCreated, updateCourse, deleteCourse, getCourses, getCourseDetail, buyCourses } = require("../controllers/courseController");
const { userMiddleware } = require("../middlewares/userMIdddleware");
const { adminMiddleware } = require("../middlewares/adminController");
const Router=express.Router();


Router.post("/create",adminMiddleware,CourseCreated); 
Router.put("/update/:courseId",adminMiddleware,updateCourse);
Router.delete("/delete/:courseId",adminMiddleware,deleteCourse);
Router.get("/getCourses",getCourses) 
Router.get("/:courseId",getCourseDetail);



Router.post("/buy/:courseId",userMiddleware,buyCourses)// couse buy krne se phle ek middleware se token check krenge






exports.Router=Router;
