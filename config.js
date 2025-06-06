const dotenv=require('dotenv')
dotenv.config();
// require('dotenv').config(); 

const JWT_PASSWORD=process.env.JWT_PASSWORD

exports.JWT_PASSWORD=JWT_PASSWORD




const JWT_ADMIN_PASSWORD=process.env.JWT_ADMIN_PASSWORD

exports.JWT_ADMIN_PASSWORD=JWT_ADMIN_PASSWORD


// const STRIPE_SECRET_KEY=process.env.STRIPE_SECRET_KEY

// exports.STRIPE_SECRET_KEY=STRIPE_SECRET_KEY

