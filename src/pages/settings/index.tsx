import { useNavigate } from "react-router-dom";
import SettingItem from "./components/SettingItem";
import { useLogout } from "../../hooks/user/useLogout";
import { useUser } from "../../hooks/user/useUser";

const Settings = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const { mutate: handleLogout, isPending } = useLogout();

  const onLogoutClick = () => {
    handleLogout(undefined, {
      onSuccess: () => {
        setUser(null);
      },
    });
  };

  return (
    <div className="flex h-full flex-col gap-4 px-4 py-8">
      <p className="font-bold">Configurações</p>

      <SettingItem
        description="nome e email"
        title="Dados do perfil"
        icon="bi bi-person"
        onClick={() => navigate("/settings/profile")}
      />

      <SettingItem
        description="Alterar Senha"
        title="Atualizar senha de acesso"
        icon="bi bi-shield"
        onClick={() => navigate("/settings/reset-password")}
      />

      <SettingItem
        description={isPending ? "Encerrando..." : "Sair da Conta"}
        title="Encerrar seção"
        icon="bi bi-box-arrow-right"
        variant="danger"
        onClick={onLogoutClick}
      />
    </div>
  );
};

export default Settings;
