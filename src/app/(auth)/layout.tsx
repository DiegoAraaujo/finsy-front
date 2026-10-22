import { Suspense } from "react";
import PublicLayout from "@/components/PublicLayout";
import Loading from "@/components/Loading";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PublicLayout>
      <Suspense fallback={<Loading label="Abrindo tela…" />}>
        {children}
      </Suspense>
    </PublicLayout>
  );
}
