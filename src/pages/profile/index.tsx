import { Navigate } from "react-router-dom";
import Header from "../../components/Header";
import TextInput from "../../components/TextInput";
import { useUser } from "../../hooks/user/useUser";
import Button from "../../components/Button";
import { useState } from "react";
import { toast } from "sonner";
import { updateUser } from "../../services/UserService";

const Profile = () => {
  const { user, setUser } = useUser();
  const [name, setName] = useState<string>(user?.name ?? "");
  const [email, setEmail] = useState<string>(user?.email ?? "");
  const [loading, setLoading] = useState<boolean>(false);

  if (!user) return <Navigate to="/login" />;

  const hasChanges = name !== user.name || email !== user.email;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !name) {
      toast.warning("Preencha todos os campos");
      return;
    }

    if (!emailRegex.test(email)) {
      toast.warning("Formato de email inválido");
      return;
    }

    const updates: Record<string, string> = {};

    if (email && user.email !== email) updates.email = email;
    if (name && user.name !== name) updates.name = name;

    if (Object.keys(updates).length === 0) {
      return toast.warning("Nenhuma alteração foi feita.");
    }

    try {
      setLoading(true);
      const updatedUser = await updateUser(updates);
      setUser(updatedUser);
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex h-full flex-col">
      <Header
        backTo="settings"
        title="Dados do Perfil"
        subtitle="Verifique ou edite os dados do seu perfil"
      />
      <form className="flex flex-col gap-4 px-4 py-8" onSubmit={handleSubmit}>
        <TextInput
          label="Nome"
          id="name"
          value={name}
          onChange={setName}
          icon="bi-person"
        />
        <TextInput
          label="Email"
          id="email"
          value={email}
          onChange={setEmail}
          icon="bi-envelope"
        />
        <Button
          label="Salvar Alterações"
          loading={loading}
          loadingLabel="Atualizando informações..."
          type="submit"
          disabled={!hasChanges || loading}
        />
      </form>
    </div>
  );
};

export default Profile;
