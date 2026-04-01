import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import FinsyLogo from "../../assets/finsy_logo.png";
import TextInput from "../../components/TextInput";
import PasswordInput from "../../components/PasswordInput";
import Button from "../../components/Button";
import { login } from "../../services/UserService";
import { useUser } from "../../hooks/user/useUser";
import { setAccessToken } from "../../utils/auth";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { setUser, user } = useUser();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password) {
      toast.warning("Preencha todos os campos");
      return;
    }

    if (!emailRegex.test(email)) {
      toast.warning("Formato de email inválido");
      return;
    }

    try {
      setLoading(true);
      const {
        id,
        name,
        email: userEmail,
        accessToken,
      } = await login(email, password);
      setUser({ id, name, email: userEmail });
      setEmail("");
      setPassword("");
      setAccessToken(accessToken);
      navigate("/");
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
      <div className="flex justify-center">
        <img src={FinsyLogo} alt="Finsy logo" className="w-36 sm:w-44" />
      </div>

      <form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
        <TextInput
          id="email"
          label="Email"
          onChange={setEmail}
          value={email}
          icon="bi-envelope"
          placeholder="seu@email.com"
          type="text"
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

      <div className="flex w-full items-center gap-2">
        <span className="h-px flex-1 bg-gray-200" />
        <p className="text-xs text-gray-500 sm:text-sm">OU</p>
        <span className="h-px flex-1 bg-gray-200" />
      </div>

      <p className="text-sm text-gray-500">
        Não tem uma conta?{" "}
        <span className="cursor-pointer font-medium text-blue-600">
          Criar conta
        </span>
      </p>
    </section>
  );
};

export default Login;
