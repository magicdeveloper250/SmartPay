 
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation'
 
 

export default function LoginRRequiredLayout({
  children,
}: {
  children: React.ReactNode;
}) {
   
  const{data:session}= useSession()
  const router = useRouter()
  if(! session?.user){
    router.push("/signin")
  }

  return (
   <>
             
      {children}
   </>
             
  );
}
