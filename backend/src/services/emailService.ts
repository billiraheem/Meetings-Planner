// import nodemailer from "nodemailer";
// import * as dotenv from 'dotenv'; 

// dotenv.config();

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port:587,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// export const sendVerificationEmail = async (email: string, token: string) => {
//   const link = `${process.env.FRONTEND_URL}/verify/${token}`;

//   await transporter.sendMail({
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: "Verify Your Email",
//     html: `<h3>Click <a href="${link}">here</a> to verify your email.</h3>`,
//   });
// };