"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/use-auth";

export default function DashboardPage() {
  const data = useAuth();
  const router = useRouter();

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !data.isAuthenticated) {
      router.push("/login");
    }
  }, [hydrated, data, router]);

  return <div>DashboardPage isAuthenticated: {data?.user.name}</div>;
}
