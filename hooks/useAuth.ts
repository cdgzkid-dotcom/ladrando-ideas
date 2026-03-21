"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if studio-auth cookie exists
    const cookies = document.cookie.split(";").map((c) => c.trim());
    const authCookie = cookies.find((c) => c.startsWith("studio-auth="));

    if (authCookie) {
      setAuthenticated(true);
    } else {
      router.replace("/studio/login");
    }
    setChecking(false);
  }, [router]);

  return { authenticated, checking };
}
