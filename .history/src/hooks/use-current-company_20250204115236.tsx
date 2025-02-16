import { PrismaClient, Company } from "@prisma/client";
import { useSession } from "next-auth/react";
const prisma= new PrismaClient()
export function useCurrentCompany() {
  const{data:session}= useSession()
  const email=session?.user?.email?session?.user?.email:"";

   async function getCompany(id: string): Promise<Company | null> {
    return await prisma.company.findUnique({
        where: {
          adminEmail: email,
        },
      });
  }
}
