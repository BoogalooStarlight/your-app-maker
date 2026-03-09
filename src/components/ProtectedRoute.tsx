import { ReactNode, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

type ProtectedRouteProps = {
  children?: ReactNode;
};

const GUEST_MODE_KEY = "isGuest";

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;

    const checkAccess = async () => {
      const isGuest = localStorage.getItem(GUEST_MODE_KEY) === "true";

      if (isGuest) {
        setIsAllowed(true);
        return;
      }

      const { data } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      setIsAllowed(Boolean(data.session));
    };

    checkAccess();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const isGuest = localStorage.getItem(GUEST_MODE_KEY) === "true";
      setIsAllowed(isGuest || Boolean(session));
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (isAllowed === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white/80">
        Vérification de la session...
      </div>
    );
  }

  if (!isAllowed) {
    return <Navigate to="/auth" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
