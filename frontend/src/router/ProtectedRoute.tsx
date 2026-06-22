import { Redirect } from "wouter";
import { useAuthStore } from "../store/authStore";

interface Props {
  allowedRoles: string[];
  children: React.ReactNode;
}

export function ProtectedRoute({ allowedRoles, children }: Props) {
  const { token, role } = useAuthStore();

  if (!token) return <Redirect to="/login" />;
  if (!allowedRoles.includes(role ?? "")) return <Redirect to="/" />;

  return <>{children}</>;
}
