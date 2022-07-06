import dotenv from "dotenv"; // enviroment file for security purpose
dotenv.config()
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    // host:process.env.EMAIL_HOST,
    // port: process.env.EMAIL_PORT,
    // secure: false, // true for 465, false for other ports
    service:"hotmail",
    auth: {
      user: process.env.EMAIL_FROM, // generated ethereal user
      pass: process.env.EMAIL_PASS, // generated ethereal password
    },
})
export default transporter;