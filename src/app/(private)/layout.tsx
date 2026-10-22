import { Suspense } from "react";
import AppLayout from "@/components/AppLayout";
import ProtectedLayout from "@/components/ProtectedLayout";
import Loading from "@/components/Loading";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedLayout>
      <AppLayout>
        <Suspense fallback={<Loading label="Abrindo tela…" />}>
          {children}
        </Suspense>
      </AppLayout>
    </ProtectedLayout>
  );
}
