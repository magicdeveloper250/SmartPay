import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function useCurrentCompany() {
  const { data: session, status } = useSession();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch("/api/company")  
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            setCompany(data);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [session, status]);

  return { company, loading };
}
