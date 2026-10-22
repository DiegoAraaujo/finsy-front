"use client";
import {
  emptyPageStyles,
  primaryButtonStyles,
} from "@/components/ui/finance-styles";

import { cn } from "@/lib/utils";
import { Component, type ReactNode } from "react";
import api from "../services/api";
export default class AppErrorBoundary extends Component<
  {
    children: ReactNode;
  },
  {
    failed: boolean;
  }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    void api.post("/client-errors", { event: "render_failed" }).catch(() => {});
  }
  render() {
    if (this.state.failed)
      return (
        <main className={cn(emptyPageStyles)}>
          <h1>Não foi possível abrir esta tela</h1>
          <p>
            Atualize a página para tentar novamente. Seus dados salvos continuam
            na sua conta.
          </p>
          <button
            className={cn(primaryButtonStyles)}
            onClick={() => window.location.reload()}
          >
            Recarregar
          </button>
        </main>
      );
    return this.props.children;
  }
}
