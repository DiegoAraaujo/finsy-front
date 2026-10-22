"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "./Loading";
export default function Redirect({
  to,
  replace = true,
}: {
  to: string;
  replace?: boolean;
}) {
  const router = useRouter();
  useEffect(() => {
    if (replace) router.replace(to);
    else router.push(to);
  }, [router, to, replace]);
  return <Loading fullScreen label="Abrindo seu espaço…" />;
}
