require("dotenv").config();
const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "kuverse69@gmail.com",
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});



module.exports={transporter};