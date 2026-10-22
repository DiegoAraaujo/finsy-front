"use client";
import {
  formStyles,
  primaryButtonStyles,
} from "@/components/ui/finance-styles";

import { cn } from "@/lib/utils";
import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import api from "../services/api";
import { userError } from "../utils/userError";
import { DotsRing } from "@/components/ui/dots-ring";
import { useUser } from "../hooks/user/useUser";
import { useQueryClient } from "@tanstack/react-query";
import { removeAccessToken, removeRefreshToken } from "../utils/auth";
import { emailError, passwordError } from "../utils/validation";
import Redirect from "../components/Redirect";
export default function PasswordRecovery() {
  const { user, setUser } = useUser();
  const client = useQueryClient();
  const reset = usePathname() === "/reset-password";
  const [token] = useState(() => {
    const value =
      typeof window === "undefined"
        ? ""
        : (new URLSearchParams(window.location.hash.slice(1)).get("token") ??
          "");
    return value;
  });
  useEffect(() => {
    if (token) window.history.replaceState(null, "", window.location.pathname);
  }, [token]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setError("");
    const invalid = reset ? passwordError(password, true) : emailError(email);
    if (invalid) {
      setError(invalid);
      return;
    }
    if (reset && password !== confirmation) {
      setError("As senhas devem ser iguais.");
      return;
    }
    setBusy(true);
    try {
      await api.post(
        reset ? "/users/reset-password" : "/users/forgot-password",
        reset ? { token, password, confirmPassword: confirmation } : { email },
      );
      if (reset) {
        removeAccessToken();
        removeRefreshToken();
        client.clear();
        setUser(null);
      }
      setDone(true);
    } catch (err) {
      setError(userError(err));
    } finally {
      setBusy(false);
    }
  }
  if (user && !reset) return <Redirect to="/settings#password" />;
  return (
    <section
      className={cn(
        "auth-form-heading mb-4.5 w-full [&_>_p]:mt-2.5 [&_>_p]:text-[length:12px] [&_>_p]:leading-[1.8] [&_>_p]:text-[#7e879a] [&_h2]:text-[length:28px] [&_h2]:leading-[1.3] [&_h2]:font-semibold [&_h2]:tracking-[-1px] [&_h2]:text-[#194bd1] max-[761px]:[&_h2]:text-[length:26px]",
      )}
    >
      <h2>{reset ? "Crie uma nova senha" : "Esqueceu sua senha?"}</h2>
      {done ? (
        <p role="status">
          {reset
            ? "Senha atualizada. Entre novamente com a nova senha."
            : "Se este e-mail estiver cadastrado, você receberá um link de recuperação. Confira também a caixa de spam."}
        </p>
      ) : reset && !token ? (
        <p role="alert">
          O link de recuperação não está completo. Solicite um novo link.
        </p>
      ) : (
        <form className={cn(formStyles)} onSubmit={submit}>
          {reset ? (
            <>
              <label>
                Nova senha
                <input
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  maxLength={72}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              <label>
                Confirme a nova senha
                <input
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  maxLength={72}
                  value={confirmation}
                  onChange={(e) => setConfirmation(e.target.value)}
                />
              </label>
              <p
                className={cn(
                  "form-note text-[length:12px] leading-[1.8] text-[#666f81]",
                )}
              >
                Use pelo menos 8 caracteres. Todas as sessões serão encerradas.
              </p>
            </>
          ) : (
            <label>
              E-mail
              <input
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
          )}
          {error && (
            <p
              className={cn(
                "form-error rounded-[7px] bg-[#fff1eb] p-2.5 text-[length:13px] text-[#a54c36]",
              )}
              role="alert"
            >
              {error}
            </p>
          )}
          <button className={cn(primaryButtonStyles)} disabled={busy}>
            {busy && <DotsRing decorative size={18} className="text-current" />}
            {reset ? "Salvar nova senha" : "Enviar link de recuperação"}
          </button>
        </form>
      )}
      <Link
        className={cn(
          "text-button [&:hover]:text-primary inline-flex items-center gap-2 text-[length:12px] font-semibold text-[#485774]",
        )}
        href={
          user
            ? "/settings#password"
            : reset && (!token || error)
              ? "/forgot-password"
              : "/login"
        }
      >
        {reset && (!token || error)
          ? "Solicitar novo link"
          : user
            ? "Voltar para configurações"
            : "Voltar para entrar"}
      </Link>
    </section>
  );
}
