import { prisma } from "@/lib/prisma";
import { mailTransporter } from "./mailTransporter";
export async function sendOTP(email:string, phoneNumber:string){
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await prisma.user.update({
    where: { email: email },
    data: { otp: otp, expires: new Date(Date.now() + 5 * 60 * 1000) },  
  });
 const[smsResp]=await Promise.all([ 
//   await fetch(process.env.SMS_API_URL || "https://api.httpsms.com/v1/messages/send", {
//   method: 'POST',
//   headers: {
//     "x-api-Key":process.env.SMS_API_KEY || "fiSCXP2z7irr6ZGHKKxLBrjyZexn0p52j4UCP-qM9OevyJXxEA69o_j7lVf-TwVR",
//     "Content-Type": "application/json"
//   },
//   body: JSON.stringify({
//     "content": `Your OTP code is: ${otp}`,
//     "encrypted": false,
//     "from": "+250791105800",
//     "send_at": new Date().toISOString(),
//     "to": `+${phoneNumber}`
//   })
// }),
await mailTransporter.sendMail({
  from: process.env.EMAIL_FROM,
  to: email,
  subject: "Your OTP Code",
  text: `Your OTP code is: ${otp}`,
})])
// console.log(await smsResp.json())
}