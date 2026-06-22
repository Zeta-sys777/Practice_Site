import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";

export function Login() {
  const [, navigate] = useLocation();
  const setAuth = useAuthStore((s: { setAuth: (token: string, role: string, userName?: string) => void }) => s.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth(data.token, data.role, data.полное_имя);
      navigate("/");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    mutation.mutate({ email, password });
  };

  return (
    <Layout variant="light">
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-[#F1F5F9]">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-1 text-2xl font-black mb-4">
              <span className="text-[#1E293B]">Мульти</span><span className="text-[#0EA5E9]">наука</span>
            </Link>
            <h1 className="text-2xl font-bold text-[#1E293B]">Вход в аккаунт</h1>
            <p className="text-[#64748B] text-sm mt-1">Введите ваши данные для входа</p>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="author@kaznu.kz"
                  className="w-full border border-[#CBD5E1] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-sky-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-1.5">Пароль</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-[#CBD5E1] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-sky-100 transition-all pr-11"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B]">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {mutation.isError && (
                <p className="text-sm text-red-500">Неверный email или пароль</p>
              )}

              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full bg-[#0EA5E9] text-white font-bold rounded-xl py-3 text-sm hover:bg-sky-500 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {mutation.isPending ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                {mutation.isPending ? "Входим..." : "Войти"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-[#64748B]">
              Нет аккаунта?{" "}
              <Link href="/register" className="text-[#0EA5E9] font-semibold hover:underline">Зарегистрироваться</Link>
            </div>
          </div>

          <div className="mt-4 text-center text-xs text-[#94A3B8]">
            <Link href="/" className="hover:text-[#64748B]">← Вернуться на главную</Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
