import { useMutation } from "@tanstack/react-query";
import { login, register } from "../api/auth";
import { useAuthStore } from "../store/authStore";

export const useLogin = () => {
  const setAuth = useAuthStore((s: { setAuth: (token: string, role: string, userName?: string) => void }) => s.setAuth);
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth(data.token, data.role, data.полное_имя);
    },
  });
};

export const useRegister = () =>
  useMutation({ mutationFn: register });
