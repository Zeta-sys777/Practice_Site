import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { submitArticle } from "@/api/submit";
import { getDirections } from "@/api/directions";

export function Submit() {
  const [form, setForm] = useState({
    title: "",
    annotation: "",
    keywords: "",
    direction_id: 0,
    author_name: "",
    author_email: "",
    author_workplace: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const { data: directions = [] } = useQuery({
    queryKey: ["directions"],
    queryFn: getDirections,
  });

  const mutation = useMutation({
    mutationFn: submitArticle,
    onSuccess: () => setSubmitted(true),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  if (submitted) {
    return (
      <Layout variant="dark">
        <div style={{ maxWidth: 600, margin: "80px auto", padding: "0 24px", textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#1E293B", marginBottom: 12 }}>
            Заявка подана!
          </h2>
          <p style={{ color: "#64748B" }}>
            Мы свяжемся с вами на указанный email в течение 3–5 рабочих дней.
          </p>
        </div>
      </Layout>
    );
  }

  const field = (key: string, label: string, type: string = "text", multiline = false) => (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6 }}>
        {label}
      </label>
      {multiline ? (
        <textarea
          rows={4}
          value={form[key as keyof typeof form] as string}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          style={{ width: "100%", border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "10px 14px", fontSize: 14, color: "#1E293B", outline: "none", resize: "vertical", boxSizing: "border-box" }}
        />
      ) : (
        <input
          type={type}
          value={form[key as keyof typeof form] as string}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          style={{ width: "100%", border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "10px 14px", fontSize: 14, color: "#1E293B", outline: "none", boxSizing: "border-box" }}
        />
      )}
    </div>
  );

  return (
    <Layout variant="dark">
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1E293B", marginBottom: 8 }}>
          Подать исследование
        </h1>
        <p style={{ color: "#64748B", marginBottom: 32 }}>
          Заполните форму — редакция рассмотрит заявку в течение 5 рабочих дней.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: "24px", marginBottom: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0EA5E9", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em" }}>О статье</h3>
            {field("title", "Название статьи")}
            {field("annotation", "Аннотация", "text", true)}
            {field("keywords", "Ключевые слова (через запятую)")}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6 }}>
                Направление
              </label>
              <select
                value={form.direction_id}
                onChange={(e) => setForm({ ...form, direction_id: Number(e.target.value) })}
                style={{ width: "100%", border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "10px 14px", fontSize: 14, color: "#1E293B", background: "#fff", outline: "none" }}
              >
                <option value={0}>Выберите направление</option>
                {directions.map((d) => (
                  <option key={d.id} value={d.id}>{d.название_рус}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: "24px", marginBottom: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0EA5E9", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em" }}>Об авторе</h3>
            {field("author_name", "Полное имя")}
            {field("author_email", "Email", "email")}
            {field("author_workplace", "Место работы")}
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            style={{ background: "#0EA5E9", color: "#fff", border: "none", borderRadius: 8, padding: "14px 36px", fontSize: 15, fontWeight: 700, cursor: "pointer", opacity: mutation.isPending ? 0.7 : 1 }}
          >
            {mutation.isPending ? "Отправка..." : "Подать заявку →"}
          </button>

          {mutation.isError && (
            <p style={{ marginTop: 12, color: "#EF4444" }}>Ошибка отправки. Попробуйте снова.</p>
          )}
        </form>
      </div>
    </Layout>
  );
}
