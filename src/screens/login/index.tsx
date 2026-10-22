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
import { login } from "../../services/userService";
import { useUser } from "../../hooks/user/useUser";
import { setAccessToken } from "../../utils/auth";
import { emailError, passwordError } from "../../utils/validation";
const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { setUser, user } = useUser();
  const router = useRouter();
  if (user) {
    return <Redirect to="/home" replace />;
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const invalid = emailError(email) || passwordError(password);
    if (invalid) return void toast.warning(invalid);
    if (!email || !password) {
      toast.warning("Preencha todos os campos");
      return;
    }
    try {
      setLoading(true);
      const { user: createdUser, accessToken } = await login(email, password);
      setUser(createdUser);
      setEmail("");
      setPassword("");
      setAccessToken(accessToken);
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
          BOM TER VOCÊ POR AQUI
        </span>
        <h2>Seu espaço te espera.</h2>
        <p>Entre para acompanhar suas finanças.</p>
      </div>

      <form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
        <TextInput
          id="email"
          maxLength={254}
          label="Email"
          onChange={setEmail}
          value={email}
          icon="bi-envelope"
          placeholder="seu@email.com"
          type="email"
        />
        <PasswordInput
          id="password"
          label="Senha"
          value={password}
          onChange={setPassword}
          placeholder="********"
        />
        <Button
          label="Entrar"
          type="submit"
          loading={loading}
          loadingLabel="Entrando..."
        />
      </form>
      <Link
        href="/forgot-password"
        className={cn(
          "text-button [&:hover]:text-primary inline-flex items-center gap-2 text-[length:12px] font-semibold text-[#485774]",
        )}
      >
        Esqueci minha senha
      </Link>

      <div className="flex w-full items-center gap-2">
        <span className="bg-surface-subtle h-px flex-1" />
        <p className="text-secundary text-xs">OU</p>
        <span className="bg-surface-subtle h-px flex-1" />
      </div>

      <p className="text-secundary text-sm">
        Não tem uma conta?{" "}
        <Link
          href="/sign-up"
          className="text-primary cursor-pointer font-medium"
        >
          Criar conta
        </Link>
      </p>
    </section>
  );
};
export default Login;
