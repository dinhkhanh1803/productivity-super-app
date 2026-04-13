"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LoadingScreen } from "@/components/ui/loading-screen";

/**
 * Wraps the app and shows a loading overlay on every route change.
 */
export function RouteLoadingProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Flash the loading screen briefly on each route change
    setLoading(true);
    const id = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(id);
  }, [pathname]);

  return (
    <>
      <LoadingScreen isVisible={loading} />
      {children}
    </>
  );
}
