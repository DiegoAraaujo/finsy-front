"use client";
import { cn } from "@/lib/utils";

import { useState } from "react";
import Link from "next/link";
import Redirect from "@/components/Redirect";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import TextInput from "../../components/TextInput";
import PasswordInput from "../../components/PasswordInput";
import Button from "../../components/Button";
import { createUser } from "../../services/userService";
import { useUser } from "../../hooks/user/useUser";
import { setAccessToken } from "../../utils/auth";
import { textError, emailError, passwordError } from "../../utils/validation";
const SignUp = () => {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [acceptsTerms, setAcceptsTerms] = useState(false);
  const { user, setUser } = useUser();
  const router = useRouter();
  if (user) {
    return <Redirect to="/home" replace />;
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!acceptsTerms) return void toast.warning("Leia e aceite os Termos de Uso para criar a conta.");
    const invalid = textError(name, "o nome", 100) || emailError(email) || passwordError(password, true);
    if (invalid) return void toast.warning(invalid);
    if (!email || !password || !confirmPassword || !name) {
      toast.warning("Preencha todos os campos");
      return;
    }
    if (password !== confirmPassword) {
      toast.warning("As senhas devem ser iguais");
      return;
    }
    if (password.length < 8 || new TextEncoder().encode(password).length > 72) {
      toast.warning("Use pelo menos 8 caracteres e evite senhas muito longas.");
      return;
    }
    try {
      setLoading(true);
      const { user: newUser, accessToken } = await createUser(
        email,
        password,
        name,
        confirmPassword,
        acceptsTerms,
      );
      setUser(newUser);
      setAccessToken(accessToken);
      setEmail("");
      setPassword("");
      toast.success("Sua conta está pronta. Vamos começar!");
      router.replace("/home");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="mx-auto flex h-full w-full max-w-xl flex-col items-center justify-center gap-4">
      <div
        className={cn(
          "auth-form-heading mb-4.5 w-full [&_>_p]:mt-2.5 [&_>_p]:text-[length:12px] [&_>_p]:leading-[1.8] [&_>_p]:text-[#7e879a] [&_h2]:text-[length:28px] [&_h2]:leading-[1.3] [&_h2]:font-semibold [&_h2]:tracking-[-1px] [&_h2]:text-[#194bd1] max-[761px]:[&_h2]:text-[length:26px]",
        )}
      >
        <span
          className={cn(
            "eyebrow mb-2.5 block text-[length:11px] font-[650] tracking-[1.6px] text-[#727c91]",
          )}
        >
          COMECE COM O QUE VOCÊ TEM
        </span>
        <h2>Um novo olhar para seu dinheiro.</h2>
        <p>Crie sua conta e registre sua primeira movimentação.</p>
      </div>

      <form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
        <TextInput
          id="name"
          maxLength={100}
          label="Nome"
          onChange={setName}
          value={name}
          icon="bi-person"
          placeholder="seu nome"
          type="text"
        />
        <TextInput
          id="email"
          maxLength={254}
          label="Email"
          onChange={setEmail}
          value={email}
          icon="bi-envelope"
          placeholder="seu@email.com"
          type="text"
        />
        <PasswordInput
          id="password"
          minLength={8}
          label="Senha"
          value={password}
          onChange={setPassword}
          placeholder="********"
        />
        <PasswordInput
          id="confirmPassword"
          minLength={8}
          label="Confirmar Senha"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="********"
        />
        <label className="flex items-start gap-3 text-xs leading-6 text-[#657390]">
          <input type="checkbox" required checked={acceptsTerms} onChange={e => setAcceptsTerms(e.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-[#194bd1]" />
          <span>Declaro ter 18 anos ou mais e aceito os <Link href="/terms" target="_blank" rel="noopener" className="text-primary underline">Termos de Uso</Link>. Conheça como seus dados são tratados na <Link href="/privacy" target="_blank" rel="noopener" className="text-primary underline">Política de Privacidade</Link>.</span>
        </label>
        <Button
          label="Cadastrar-se"
          type="submit"
          loading={loading}
          loadingLabel="Criando conta..."
        />
      </form>

      <div className="flex w-full items-center gap-2">
        <span className="bg-surface-subtle h-px flex-1" />
        <p className="text-secundary text-xs">OU</p>
        <span className="bg-surface-subtle h-px flex-1" />
      </div>

      <p className="text-secundary text-sm">
        Já possui uma conta?{" "}
        <Link href="/login" className="text-primary cursor-pointer font-medium">
          Fazer Login
        </Link>
      </p>
    </section>
  );
};
export default SignUp;
