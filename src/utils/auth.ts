import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prismaDB";
import type { Adapter } from "next-auth/adapters";
 
 

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/signin",
  },
  adapter: PrismaAdapter(prisma) as Adapter,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge:600
    
  },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Jhondoe" },
        otp: { label: "Password", type: "password" },
        username: { label: "Username", type: "text", placeholder: "Jhon Doe" },
      },

      async authorize(credentials, req) {
        if (!credentials?.email || !credentials.otp) {
          throw new Error("Invalid OTP code.")
        }

        const user = await prisma.user.findUnique({
          where: { email:credentials.email },
         
        });
      
        if (!user || !user.otp || !user.otp) {
        throw new Error("Invalid or expired OTP" )
        }
      
        const now = new Date();
        if (user.otp !== credentials.otp || user.expires! < now) {
          throw new Error("Invalid or expired OTP")
        }
       
        await prisma.user.update({
          where: { email:credentials.email },
          data: { otp: null, expires: null },
        });
     

        return user;
      },
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],

  callbacks: {
    jwt: async (payload: any) => {
      const { token } = payload;
      const user = payload.user;

      if (user) {
        return {
          ...token,
          id: user.id,
        };
      }
      return token;
    },

    session: async ({ session, token }) => {
      if (session?.user) {
        return {
          ...session,
          user: {
            ...session.user,
            id: token?.id,
            email:token.email,
            name: token.name,
          },
        };
      }
      return session;
    },
    
  },

  // debug: process.env.NODE_ENV === "developement",
};







 
