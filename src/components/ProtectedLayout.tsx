"use client";
import Redirect from "@/components/Redirect";
import { type ReactNode } from "react";
import { useUser } from "../hooks/user/useUser";
import Loading from "./Loading";

const ProtectedLayout = ({ children }: { children: ReactNode }) => {
  const { user, isRestoring } = useUser();

  if (isRestoring) return <Loading fullScreen label="Abrindo seu espaço…" />;

  if (!user) {
    return <Redirect to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedLayout;
