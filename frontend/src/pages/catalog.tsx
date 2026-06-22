import { useState } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { articles, directions } from "@/lib/data";
import { DownloadModal } from "@/components/DownloadModal";

export function Catalog() {
  const [search, setSearch] = useState("");
  const [activeDir, setActiveDir] = useState<string | null>(null);
  const [year, setYear] = useState("");
  const [downloadArticleId, setDownloadArticleId] = useState<string | null>(null);

  const filtered = articles.filter(a => {
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.authors.some(au => au.toLowerCase().includes(search.toLowerCase()));
    const matchDir = !activeDir || a.direction === activeDir;
    const matchYear = !year || String(a.year) === year;
    return matchSearch && matchDir && matchYear;
  });

  const downloadArticle = downloadArticleId ? articles.find(a => a.id === downloadArticleId) : null;

  return (
    <Layout>
      {/* breadcrumb */}
      <div style={{ fontSize: 13, color: "#94A3B8", padding: "16px 32px" }}>
        <Link href="/" style={{ color: "#94A3B8", textDecoration: "none" }}>Главная</Link>
        {" / "}
        <span style={{ color: "#1E293B" }}>Каталог</span>
      </div>

      <div style={{ padding: "0 32px 40px" }}>
        <h2 style={{ fontSize: 22, color: "#1E293B", fontWeight: "bold", marginBottom: 8 }}>Каталог исследований</h2>
        <p style={{ fontSize: 14, color: "#64748B", marginBottom: 20 }}>48 публикаций по 7 научным направлениям</p>

        {/* filters */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <input
            style={{ padding: "8px 14px", border: "1px solid #CBD5E1", borderRadius: 8, fontSize: 14, color: "#64748B", background: "#fff", width: 320, outline: "none" }}
            placeholder="Поиск по названию или автору..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            style={{ padding: "8px 14px", border: "1px solid #CBD5E1", borderRadius: 8, fontSize: 14, color: "#64748B", background: "#fff", outline: "none" }}
            value={activeDir ?? ""}
            onChange={e => setActiveDir(e.target.value || null)}
          >
            <option value="">Все направления</option>
            {directions.map(d => <option key={d.slug} value={d.name}>{d.name}</option>)}
          </select>
          <select
            style={{ padding: "8px 14px", border: "1px solid #CBD5E1", borderRadius: 8, fontSize: 14, color: "#64748B", background: "#fff", outline: "none" }}
            value={year}
            onChange={e => setYear(e.target.value)}
          >
            <option value="">Все годы</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
        </div>

        {/* tag chips */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {directions.map(d => (
            <button
              key={d.slug}
              onClick={() => setActiveDir(activeDir === d.name ? null : d.name)}
              style={{
                fontSize: 12,
                padding: "6px 14px",
                borderRadius: 999,
                border: activeDir === d.name ? "1px solid #0EA5E9" : "1px solid #CBD5E1",
                color: activeDir === d.name ? "#fff" : "#1E293B",
                background: activeDir === d.name ? "#0EA5E9" : "#fff",
                cursor: "pointer"
              }}
            >{d.name}</button>
          ))}
        </div>

        {/* article cards */}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#94A3B8", fontSize: 14 }}>Статьи не найдены</div>
        )}
        {filtered.map(a => (
          <div key={a.id} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20, marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 11, color: "#0EA5E9", fontWeight: "bold", marginBottom: 6 }}>{a.direction} · {a.year}</div>
              <Link href={`/articles/${a.id}`}>
                <div style={{ fontSize: 15, color: "#1E293B", fontWeight: "bold", marginBottom: 6, lineHeight: 1.4, cursor: "pointer" }}>{a.title}</div>
              </Link>
              <div style={{ fontSize: 13, color: "#64748B", marginBottom: 4 }}>{a.authors.map(au => au.split(" (")[0]).join(", ")}</div>
              <div style={{ fontSize: 12, color: "#94A3B8" }}>Ключевые слова: {a.keywords.join(", ")}</div>
            </div>
            <button
              onClick={() => setDownloadArticleId(a.id)}
              style={{ border: "1px solid #0EA5E9", color: "#0EA5E9", borderRadius: 6, padding: "6px 14px", fontSize: 13, background: "#fff", whiteSpace: "nowrap", cursor: "pointer", flexShrink: 0, marginLeft: 16 }}
            >
              ⬇ Скачать
            </button>
          </div>
        ))}

        {/* pagination */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 20 }}>
          {[1, 2, 3].map(p => (
            <div key={p} style={{ width: 36, height: 36, borderRadius: 8, border: p === 1 ? "1px solid #0EA5E9" : "1px solid #E2E8F0", background: p === 1 ? "#0EA5E9" : "#fff", fontSize: 14, color: p === 1 ? "#fff" : "#1E293B", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              {p}
            </div>
          ))}
        </div>
      </div>

      {downloadArticle && <DownloadModal article={downloadArticle} onClose={() => setDownloadArticleId(null)} />}
    </Layout>
  );
}
