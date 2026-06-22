import { create } from "zustand";
import Cookies from "js-cookie";
import type { UserRole } from "../types";

interface AuthState {
  token: string | null;
  role: UserRole | null;
  userName: string | null;
  setAuth: (token: string, role: string, userName?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: Cookies.get("auth-token") || null,
  role: (Cookies.get("auth-role") as UserRole) || null,
  userName: Cookies.get("auth-name") || null,

  setAuth: (token, role, userName) => {
    Cookies.set("auth-token", token, { expires: 7, sameSite: "strict" });
    Cookies.set("auth-role", role, { expires: 7, sameSite: "strict" });
    if (userName) Cookies.set("auth-name", userName, { expires: 7, sameSite: "strict" });
    set({ token, role: role as UserRole, userName: userName || null });
  },

  logout: () => {
    Cookies.remove("auth-token");
    Cookies.remove("auth-role");
    Cookies.remove("auth-name");
    set({ token: null, role: null, userName: null });
  },
}));
