"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Loading from "@/components/loading";

interface AuthGuardProps {
  children: React.ReactNode;
}

const authRoutes = ["/auth/login", "/auth/server"];

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { api, loading } = useAuth();

  useEffect(() => {
    if (!api && !loading) {
      if (!authRoutes.includes(pathname)) {
        router.push("/auth/login"); // Redirect to login if not authenticated
      }
    }
  }, [api, router, loading, pathname]);

  // Show a loading indicator or nothing while checking auth state
  if (loading) {
    return <Loading />;
  }

  return <>{children}</>;
};

export default AuthGuard;
