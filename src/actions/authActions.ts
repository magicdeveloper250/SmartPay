"use server"
import { prisma } from "@/utils/prismaDB";
 
import { handleActionsPrismaError } from "@/lib/error-handler";
import { sendOTP } from "@/utils/sendOTPCode";
import bcrypt from "bcryptjs";
 


export async function verifyCredintials(email:string, password:string) {
 
  try {
   

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user || !user?.password) {
      return {"error":"Invalid email or password"};
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password,
    );


    if (!passwordMatch) {
      return {"error":"Invalid email or password"};;
    }
     
      sendOTP(email, user.phoneNumber || "250791105800")
      return user
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}

export async function verifyOTP(email:string, otp:string) {
 
  try {
   

    if (!email || !otp) {
      return { error: "Email and OTP are required" };
    }
 
    const user = await prisma.user.findUnique({
      where: { email },
     
    });
  
    if (!user || !user.otp || !user.otp) {
      return {error: "Invalid or expired OTP" };
    }
  
    const now = new Date();
    if (user.otp !== otp || user.expires! < now) {
      return { error: "Invalid or expired OTP" }
    }
   
    await prisma.user.update({
      where: { email },
      data: { otp: null, expires: null },
    });
 
    return user
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}



export async function resendOTP(email:string) {
 
  try {
    const user = await prisma.user.findUnique({
      where: { email },
     
    });
    if (!user || !user.otp || !user.otp) {
      return {error: "Invalid or expired OTP" };
    }

    await sendOTP(email, user.phoneNumber || "250791105800")
 
    return { message: "OTP Code sent successfully." };
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}





 