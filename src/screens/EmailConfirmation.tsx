"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import { useUser } from "../hooks/user/useUser";
import { removeAccessToken } from "../utils/auth";
import { userError } from "../utils/userError";
import { primaryButtonStyles } from "../components/ui/finance-styles";
import { DotsRing } from "../components/ui/dots-ring";

export default function EmailConfirmation() {
  const { user, setUser } = useUser();
  const client = useQueryClient();
  const [token] = useState(() =>
    typeof window === "undefined"
      ? ""
      : (new URLSearchParams(window.location.hash.slice(1)).get("token") ?? ""),
  );
  const [busy, setBusy] = useState(false),
    [done, setDone] = useState(false),
    [error, setError] = useState("");
  const valid = /^[a-f0-9]{64}$/.test(token);
  useEffect(() => {
    if (token) window.history.replaceState(null, "", window.location.pathname);
  }, [token]);
  async function confirm() {
    if (!valid || busy || done) return;
    setBusy(true);
    setError("");
    try {
      await api.post("/users/confirm-email", { token });
      removeAccessToken();
      client.clear();
      setUser(null);
      setDone(true);
    } catch (err) {
      setError(userError(err));
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="flex w-full flex-col gap-5 text-sm leading-relaxed text-[#43526c]">
      <h2 className="text-2xl font-semibold text-[#194bd1]">
        Confirmar novo e-mail
      </h2>
      {done ? (
        <p role="status">
          E-mail confirmado. As sessões foram encerradas para proteger sua
          conta. Entre novamente com o novo endereço.
        </p>
      ) : !valid ? (
        <p role="alert">
          O link está incompleto. Solicite uma nova alteração em Configurações.
        </p>
      ) : (
        <>
          <p>
            Ao confirmar, o novo e-mail será usado para entrar no Finsy. Suas
            sessões serão encerradas e você precisará entrar novamente.
          </p>
          {error && (
            <p role="alert" className="text-[#a54c36]">
              {error}
            </p>
          )}
          <button
            className={primaryButtonStyles}
            disabled={busy}
            onClick={() => void confirm()}
          >
            {busy && <DotsRing decorative size={18} />}Confirmar novo e-mail
          </button>
        </>
      )}
      <Link
        className="text-primary font-semibold"
        href={user && !done ? "/settings#profile" : "/login"}
      >
        {user && !done ? "Voltar para configurações" : "Entrar na conta"}
      </Link>
    </section>
  );
}
