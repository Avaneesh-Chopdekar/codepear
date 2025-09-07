"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useAuth from "@/hooks/use-auth";

//* Demo Session Page: /sessions/ky1zsz

export default function SessionPage() {
  const { id: sessionId } = useParams();
  const router = useRouter();
  const auth = useAuth();

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !auth.isAuthenticated) {
      router.push("/login");
    }
  }, [hydrated, auth, router]);

  return <div>Session {sessionId}</div>;
}
