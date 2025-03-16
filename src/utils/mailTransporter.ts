import nodemailer from "nodemailer"; 


export const mailTransporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVER_SERVICE,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});