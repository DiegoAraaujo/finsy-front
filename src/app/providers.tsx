"use client";
import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { UserContextProvider } from "@/contexts/UserContext";
import AppErrorBoundary from "@/components/AppErrorBoundary";

export default function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 120000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );
  return (
    <QueryClientProvider client={client}>
      <UserContextProvider>
        <AppErrorBoundary>
          <Toaster
            richColors
            position="top-right"
            closeButton
            duration={3500}
          />
          {children}
        </AppErrorBoundary>
      </UserContextProvider>
    </QueryClientProvider>
  );
}
