import { PrismaClient } from "@prisma/client";
import { useSession } from "next-auth/react";
const prisma= new PrismaClient()
export async function useCurrentCompany() {
  const{data:session}= useSession()
  const email=session?.user?.email?session?.user?.email:"";
  return  await prisma.company.findUnique({
    where: {
      adminEmail: email,
    },
  });
}
