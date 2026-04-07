import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import FinsyLogo from "../../assets/finsy_logo.png";
import TextInput from "../../components/TextInput";
import PasswordInput from "../../components/PasswordInput";
import Button from "../../components/Button";
import { createUser } from "../../services/UserService";
import { useUser } from "../../hooks/user/useUser";

const SignUp = () => {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useUser();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password || !confirmPassword || !name) {
      toast.warning("Preencha todos os campos");
      return;
    }

    if (!emailRegex.test(email)) {
      toast.warning("Formato de email inválido");
      return;
    }

    if (password !== confirmPassword) {
      toast.warning("As senhas devem ser iguais");
      return;
    }
    try {
      setLoading(true);
      await createUser(email, password, name);
      setEmail("");
      setPassword("");
      toast.success("Conta criada com sucesso! Faça login para continuar.");
      navigate("/login");
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
          id="name"
          label="Nome"
          onChange={setName}
          value={name}
          icon="bi-person"
          placeholder="seu nome"
          type="text"
        />
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
        <PasswordInput
          id="confirmPassword"
          label="Confirmar Senha"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="********"
        />
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
        <Link to="/login" className="text-primary cursor-pointer font-medium">
          Fazer Login
        </Link>
      </p>
    </section>
  );
};

export default SignUp;
