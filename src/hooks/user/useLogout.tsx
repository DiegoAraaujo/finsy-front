import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { logOut } from "../../services/UserService";
import { removeAccessToken } from "../../utils/auth";

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logOut,
    onSuccess: () => {
      queryClient.clear();
      removeAccessToken();
      toast.success("Sessão encerrada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
