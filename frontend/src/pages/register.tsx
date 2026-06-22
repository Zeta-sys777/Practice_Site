import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Layout } from "@/components/layout/Layout";

export function Register() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "пользователь" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError("Заполните все поля"); return; }
    if (form.password.length < 6) { setError("Пароль должен содержать минимум 6 символов"); return; }
    setLoading(true);
    setError("");
    setTimeout(() => { setLoading(false); navigate("/"); }, 900);
  };

  return (
    <Layout variant="light">
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-[#F1F5F9]">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-1 text-2xl font-black mb-4">
              <span className="text-[#1E293B]">Мульти</span><span className="text-[#0EA5E9]">наука</span>
            </Link>
            <h1 className="text-2xl font-bold text-[#1E293B]">Создать аккаунт</h1>
            <p className="text-[#64748B] text-sm mt-1">Зарегистрируйтесь, чтобы подавать статьи</p>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-1.5">Полное имя</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Ахмет Касымов"
                  className="w-full border border-[#CBD5E1] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-sky-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="author@kaznu.kz"
                  className="w-full border border-[#CBD5E1] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-sky-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-1.5">Пароль</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={set("password")}
                  placeholder="Минимум 6 символов"
                  className="w-full border border-[#CBD5E1] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-sky-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-1.5">Роль</label>
                <select
                  value={form.role}
                  onChange={set("role")}
                  className="w-full border border-[#CBD5E1] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0EA5E9] bg-white transition-all"
                >
                  <option value="пользователь">Пользователь — читать статьи</option>
                  <option value="автор">Автор — подавать заявки на публикацию</option>
                </select>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0EA5E9] text-white font-bold rounded-xl py-3 text-sm hover:bg-sky-500 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                {loading ? "Создаём аккаунт..." : "Зарегистрироваться"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-[#64748B]">
              Уже есть аккаунт?{" "}
              <Link href="/login" className="text-[#0EA5E9] font-semibold hover:underline">Войти</Link>
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
