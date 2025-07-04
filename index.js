const express=require('express')
const app=express();
const dotenv=require('dotenv')
dotenv.config();
const mongoose=require("mongoose");
const cloudinary = require('cloudinary').v2;
const { Router } = require('./routes/courseroutes');
const fileUpload = require('express-fileupload');
const { userRouter } = require('./routes/useroutes');
const { CourseDB } = require('./models/CourseDb');
const { adminRouter } = require('./routes/adminroutes');
const cookieParser=require('cookie-parser')
const cors=require('cors');
const { orderRouter } = require('./routes/orderroutes');
const port=process.env.PORT || 8010
const db_url=process.env.MONGO_URL

app.use(express.json())
app.use(cookieParser())// ye check karega ki user k pass token(jwt) tabhi token clear krke user ko logout karega har baar logout nhi karega...




//express fileUpload
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));




const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];


app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));










app.use("/api",Router);  // course router h naam glt rakha hai 
app.use("/user",userRouter);
app.use("/admin",adminRouter)
app.use("/api/order",orderRouter)






// cloudinary Configuration code
cloudinary.config({ 
  cloud_name: process.env.cloud_name, 
  api_key:process.env.api_key, 
  api_secret: process.env.api_secret // Click 'View API Keys' above to copy your API secret
});


console.log(process.env.MONGO_URL);


mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database Connected Successfully");
  
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch(() => {
    console.log("Database Connection Failed");
  });

  