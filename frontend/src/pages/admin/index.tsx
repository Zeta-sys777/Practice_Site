import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import {
  getAdminMetrics,
  getAdminSubmissions,
  updateSubmissionStatus,
  publishSubmission,
} from "@/api/admin";
import { useState } from "react";

export function AdminDashboard() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("");

  const { data: metrics } = useQuery({
    queryKey: ["admin-metrics"],
    queryFn: getAdminMetrics,
  });

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ["admin-submissions", statusFilter],
    queryFn: () => getAdminSubmissions(statusFilter ? { статус: statusFilter } : undefined),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, статус }: { id: number; статус: string }) =>
      updateSubmissionStatus(id, статус),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-submissions"] }),
  });

  const publishMutation = useMutation({
    mutationFn: publishSubmission,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-submissions"] }),
  });

  const statCard = (label: string, value: number | undefined, color = "#0EA5E9") => (
    <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "20px 24px", flex: 1 }}>
      <div style={{ fontSize: 32, fontWeight: 900, color }}>{value ?? "—"}</div>
      <div style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>{label}</div>
    </div>
  );

  return (
    <Layout variant="dark">
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1E293B", marginBottom: 32 }}>
          Панель администратора
        </h1>

        <div style={{ display: "flex", gap: 16, marginBottom: 40 }}>
          {statCard("Статей опубликовано", metrics?.total_articles)}
          {statCard("Авторов", metrics?.total_authors, "#8B5CF6")}
          {statCard("Заявок всего", metrics?.total_submissions, "#F59E0B")}
          {statCard("Ожидают проверки", metrics?.pending_submissions, "#EF4444")}
        </div>

        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#1E293B" }}>Заявки</h2>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "7px 14px", fontSize: 13, color: "#1E293B", background: "#F8FAFC" }}
            >
              <option value="">Все статусы</option>
              <option value="ожидает">Ожидает</option>
              <option value="одобрена">Одобрена</option>
              <option value="отклонена">Отклонена</option>
              <option value="опубликована">Опубликована</option>
            </select>
          </div>

          {isLoading ? (
            <div style={{ padding: 32, color: "#94A3B8" }}>Загрузка...</div>
          ) : submissions.length === 0 ? (
            <div style={{ padding: 32, color: "#94A3B8", textAlign: "center" }}>Заявок нет</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F8FAFC" }}>
                  {["Название", "Автор", "Email", "Статус", "Действия"].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {submissions.map((s) => (
                  <tr key={s.id} style={{ borderTop: "1px solid #F1F5F9" }}>
                    <td style={{ padding: "14px 16px", fontSize: 14, color: "#1E293B", maxWidth: 240 }}>
                      <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.title}</div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 14, color: "#475569" }}>{s.author_name}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#64748B" }}>{s.author_email}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{
                        padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700,
                        background: s.статус === "ожидает" ? "#FEF3C7" : s.статус === "одобрена" ? "#DCFCE7" : s.статус === "опубликована" ? "#DBEAFE" : "#FEE2E2",
                        color: s.статус === "ожидает" ? "#92400E" : s.статус === "одобрена" ? "#166534" : s.статус === "опубликована" ? "#1E40AF" : "#991B1B",
                      }}>
                        {s.статус}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        {s.статус === "ожидает" && (
                          <>
                            <button
                              onClick={() => updateMutation.mutate({ id: s.id, статус: "одобрена" })}
                              style={{ padding: "5px 12px", borderRadius: 6, border: "none", background: "#22C55E", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                            >
                              Одобрить
                            </button>
                            <button
                              onClick={() => updateMutation.mutate({ id: s.id, статус: "отклонена" })}
                              style={{ padding: "5px 12px", borderRadius: 6, border: "none", background: "#EF4444", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                            >
                              Отклонить
                            </button>
                          </>
                        )}
                        {s.статус === "одобрена" && (
                          <button
                            onClick={() => publishMutation.mutate(s.id)}
                            style={{ padding: "5px 12px", borderRadius: 6, border: "none", background: "#0EA5E9", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                          >
                            Опубликовать
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
}
