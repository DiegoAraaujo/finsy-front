"use client";
import { useState, type FormEvent } from "react";
import { useUser } from "../../../hooks/user/useUser";
import type { User } from "../../../contexts/user-context";
import api from "../../../services/api";
import {
  textError,
  emailError,
  passwordError,
} from "../../../utils/validation";
import { userError } from "../../../utils/userError";
import {
  formStyles,
  primaryButtonStyles,
  secondaryButtonStyles,
} from "../../../components/ui/finance-styles";
import { DotsRing } from "../../../components/ui/dots-ring";
import PasswordInput from "../../../components/PasswordInput";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function ProfileSettings({
  disabled,
  onBusyChange,
}: {
  disabled: boolean;
  onBusyChange: (busy: boolean) => void;
}) {
  const { user, setUser } = useUser();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [busy, setBusy] = useState<"save" | "reset" | null>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [resetError, setResetError] = useState("");
  const [sentTo, setSentTo] = useState("");
  const client = useQueryClient();
  const pendingKey = ["account", user?.id, "email-change"];
  const pending = useQuery({
    queryKey: pendingKey,
    enabled: !!user,
    queryFn: async () =>
      (await api.get<{ pendingEmail: string | null }>("/users/email-change"))
        .data,
  });
  if (!user) return null;
  const emailChanged =
    email.trim().toLowerCase() !== user.email.trim().toLowerCase();
  const hasChanges = name.trim() !== user.name || emailChanged;
  async function save(event: FormEvent) {
    event.preventDefault();
    if (!user || busy || disabled) return;
    setSaved(false);
    setError("");
    const invalid =
      textError(name, "o nome", 100) ||
      emailError(email) ||
      (emailChanged ? passwordError(currentPassword) : undefined);
    if (invalid) {
      setError(invalid);
      return;
    }
    if (!hasChanges) return;
    setBusy("save");
    onBusyChange(true);
    try {
      const { data: updated } = await api.put<
        User & { pendingEmail?: string; emailChangePending?: boolean }
      >("/users", {
        ...(name.trim() !== user.name ? { name: name.trim() } : {}),
        ...(emailChanged
          ? { email: email.trim().toLowerCase(), currentPassword }
          : {}),
      });
      if (updated.emailChangePending) {
        client.setQueryData(pendingKey, { pendingEmail: updated.pendingEmail });
        void client.invalidateQueries({ queryKey: pendingKey });
      }
      setUser({ id: updated.id, name: updated.name, email: updated.email });
      setName(updated.name);
      setEmail(updated.email);
      setCurrentPassword("");
      setSaved(!updated.emailChangePending);
    } catch (err) {
      setError(userError(err));
    } finally {
      setBusy(null);
      onBusyChange(false);
    }
  }
  async function requestReset() {
    if (!user || busy || disabled) return;
    setResetError("");
    setBusy("reset");
    onBusyChange(true);
    try {
      await api.post("/users/forgot-password", { email: user.email });
      setSentTo(user.email);
    } catch (err) {
      setResetError(userError(err));
    } finally {
      setBusy(null);
      onBusyChange(false);
    }
  }
  return (
    <>
      <div id="profile" className="scroll-mt-6">
        <h2 className="mb-2.5 text-sm font-semibold text-[#2f394e]">
          Dados do perfil
        </h2>
        <p className="mb-5 text-xs leading-relaxed text-[#666f81]">
          Atualize seu nome e e-mail por aqui.
        </p>
        <form className={`${formStyles} max-w-xl`} onSubmit={save}>
          <fieldset
            disabled={disabled || !!busy}
            className="flex min-w-0 flex-col gap-4.5"
          >
            <label htmlFor="profile-name">
              Nome
              <input
                id="profile-name"
                required
                maxLength={100}
                autoComplete="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSaved(false);
                }}
              />
            </label>
            <label htmlFor="profile-email">
              E-mail
              <input
                id="profile-email"
                required
                type="email"
                maxLength={254}
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setSaved(false);
                }}
              />
            </label>
            {emailChanged && (
              <div>
                <PasswordInput
                  id="profile-current-password"
                  label="Senha atual para alterar o e-mail"
                  value={currentPassword}
                  onChange={setCurrentPassword}
                />
                <p className="mt-2 text-xs text-[#718099]">
                  Confirme sua senha atual para proteger a alteração do e-mail.
                </p>
              </div>
            )}
          </fieldset>
          {error && (
            <p role="alert" className="text-sm text-[#a54c36]">
              {error}
            </p>
          )}
          {saved && (
            <p role="status" className="text-sm text-[#08795c]">
              Perfil atualizado com sucesso.
            </p>
          )}
          {pending.data?.pendingEmail && (
            <p role="status" className="text-sm leading-relaxed text-[#194bd1]">
              Confirme a alteração pelo link enviado para{" "}
              <strong className="wrap-anywhere">
                {pending.data.pendingEmail}
              </strong>
              . Seu e-mail atual continua valendo até a confirmação. O link vale
              por 30 minutos.
            </p>
          )}
          {pending.isError && (
            <button
              type="button"
              className="text-primary text-sm"
              onClick={() => void pending.refetch()}
            >
              Consultar alteração de e-mail pendente
            </button>
          )}
          <button
            className={`${primaryButtonStyles} self-start max-sm:w-full`}
            disabled={disabled || !!busy || !hasChanges}
          >
            {busy === "save" && <DotsRing decorative size={18} />}
            {busy === "save" ? "Salvando…" : "Salvar alterações"}
          </button>
        </form>
      </div>
      <div
        id="password"
        className="mt-7 scroll-mt-6 border-t border-[#e8edf6] pt-6"
      >
        <h2 className="text-sm font-semibold text-[#2f394e]">Senha</h2>
        <p className="mt-2 max-w-xl text-xs leading-relaxed text-[#666f81]">
          Enviaremos um link de redefinição para{" "}
          <strong className="wrap-anywhere">{user.email}</strong>. Você continua
          conectado ao pedir o link. As sessões serão encerradas somente depois
          que a nova senha for salva.
        </p>
        {emailChanged && (
          <p className="mt-2 text-xs text-[#718099]">
            Para receber no novo e-mail, salve a alteração do perfil primeiro.
          </p>
        )}
        {sentTo === user.email && (
          <p
            role="status"
            className="mt-3 text-sm leading-relaxed text-[#08795c]"
          >
            Pedido enviado. Confira seu e-mail e a caixa de spam. O link vale
            por 30 minutos.
          </p>
        )}
        {resetError && (
          <p role="alert" className="mt-3 text-sm text-[#a54c36]">
            {resetError}
          </p>
        )}
        <button
          type="button"
          className={`${secondaryButtonStyles} mt-4 max-sm:w-full`}
          disabled={disabled || !!busy}
          onClick={() => void requestReset()}
        >
          {busy === "reset" && <DotsRing decorative size={18} />}
          {busy === "reset"
            ? "Enviando…"
            : sentTo === user.email
              ? "Enviar novo link"
              : "Enviar link para redefinir senha"}
        </button>
      </div>
    </>
  );
}
