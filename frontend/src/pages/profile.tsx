import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { getProfile, updateProfile } from "@/api/profile";
import { useAuthStore } from "@/store/authStore";

export function Profile() {
  const queryClient = useQueryClient();
  const { userName } = useAuthStore();
  const [saved, setSaved] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const [form, setForm] = useState({
    полное_имя: "",
    место_работы: "",
    научные_интересы: "",
    email: "",
  });

  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <Layout variant="dark">
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1E293B", marginBottom: 8 }}>
          Мой профиль
        </h1>
        <p style={{ color: "#64748B", marginBottom: 32 }}>
          {userName || "Редактирование профиля автора"}
        </p>

        {isLoading ? (
          <div style={{ color: "#94A3B8" }}>Загрузка...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            {[
              { key: "полное_имя", label: "Полное имя" },
              { key: "место_работы", label: "Место работы" },
              { key: "научные_интересы", label: "Научные интересы" },
              { key: "email", label: "Email" },
            ].map(({ key, label }) => (
              <div key={key} style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6 }}>
                  {label}
                </label>
                <input
                  type={key === "email" ? "email" : "text"}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  style={{
                    width: "100%", border: "1.5px solid #E2E8F0", borderRadius: 8,
                    padding: "10px 14px", fontSize: 14, color: "#1E293B", outline: "none",
                    background: "#fff", boxSizing: "border-box",
                  }}
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={mutation.isPending}
              style={{
                background: "#0EA5E9", color: "#fff", border: "none", borderRadius: 8,
                padding: "12px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer",
                opacity: mutation.isPending ? 0.7 : 1,
              }}
            >
              {mutation.isPending ? "Сохранение..." : "Сохранить"}
            </button>

            {saved && (
              <span style={{ marginLeft: 16, color: "#22C55E", fontWeight: 600 }}>
                ✓ Сохранено
              </span>
            )}
            {mutation.isError && (
              <span style={{ marginLeft: 16, color: "#EF4444", fontWeight: 600 }}>
                Ошибка сохранения
              </span>
            )}
          </form>
        )}
      </div>
    </Layout>
  );
}
