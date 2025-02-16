import { prisma } from "@/utils/prismaDB";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";

export async function useCurrentCompany() {


    const session = await getServerSession(authOptions);
           if (!session?.user?.email) {
             return { error: "Unauthorized" }
           }
        const company = await prisma.company.findUnique({
               where: { adminEmail: session.user.email },
             });
         
             if (!company) {
               return { error: "Company not found" };
             }

   

  return { company };
}
