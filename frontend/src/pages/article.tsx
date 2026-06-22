import { useState } from "react";
import { Link, useParams } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { articles } from "@/lib/data";
import { DownloadModal } from "@/components/DownloadModal";

function getInitials(name: string) {
  return name.split(/[\s.]+/).filter(Boolean).map(p => p[0]).join("").slice(0, 2).toUpperCase();
}
function getOrg(author: string) {
  const m = author.match(/\((.+)\)/); return m ? m[1] : "Казахстан";
}
function getShortName(author: string) { return author.split(" (")[0]; }

export function Article() {
  const { id } = useParams<{ id: string }>();
  const article = articles.find(a => a.id === id);
  const [showDownload, setShowDownload] = useState(false);

  if (!article) return (
    <Layout>
      <div style={{ textAlign: "center", padding: "64px 32px", color: "#94A3B8" }}>
        Статья не найдена. <Link href="/catalog" style={{ color: "#0EA5E9" }}>Вернуться в каталог</Link>
      </div>
    </Layout>
  );

  return (
    <Layout>
      {/* breadcrumb */}
      <div style={{ fontSize: 13, color: "#94A3B8", padding: "16px 32px" }}>
        <Link href="/" style={{ color: "#94A3B8", textDecoration: "none" }}>Главная</Link>
        {" / "}
        <Link href="/catalog" style={{ color: "#94A3B8", textDecoration: "none" }}>Каталог</Link>
        {" / "}
        <span style={{ color: "#1E293B" }}>Статья</span>
      </div>

      <div style={{ padding: "0 32px 40px" }}>
        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 32 }}>
          {/* tag */}
          <div style={{ fontSize: 12, color: "#0EA5E9", fontWeight: "bold", marginBottom: 12 }}>
            {article.direction} · Выпуск №3, {article.year}
          </div>

          {/* title */}
          <h1 style={{ fontSize: 28, color: "#1E293B", fontWeight: "bold", marginBottom: 20, lineHeight: 1.3 }}>
            {article.title}
          </h1>

          {/* authors */}
          <div style={{ display: "flex", gap: 20, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
            {article.authors.map((author, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#BFDBFE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: "bold", color: "#1E293B", flexShrink: 0 }}>
                  {getInitials(getShortName(author))}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: "bold", color: "#1E293B" }}>{getShortName(author)}</div>
                  <div style={{ fontSize: 12, color: "#64748B" }}>{getOrg(author)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* divider */}
          <div style={{ borderTop: "1px solid #E2E8F0", margin: "20px 0" }} />

          {/* abstract */}
          <div style={{ fontSize: 14, fontWeight: "bold", color: "#1E293B", marginBottom: 8 }}>Аннотация</div>
          <div style={{ fontSize: 14, color: "#64748B", lineHeight: 1.6, marginBottom: 0 }}>{article.abstract}</div>

          {/* divider */}
          <div style={{ borderTop: "1px solid #E2E8F0", margin: "20px 0" }} />

          {/* keywords */}
          <div style={{ fontSize: 14, fontWeight: "bold", color: "#1E293B", marginBottom: 8 }}>Ключевые слова</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 0 }}>
            {article.keywords.map(kw => (
              <div key={kw} style={{ background: "#E0F2FE", color: "#0C4A6E", fontSize: 13, padding: "6px 14px", borderRadius: 6 }}>{kw}</div>
            ))}
          </div>

          {/* action buttons */}
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button
              onClick={() => setShowDownload(true)}
              style={{ background: "#1E293B", color: "#fff", border: "none", borderRadius: 8, padding: "12px 24px", fontSize: 14, fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
            >
              ⬇ Скачать статью
            </button>
            <Link href="/catalog">
              <button style={{ background: "#fff", color: "#2563EB", border: "1px solid #2563EB", borderRadius: 8, padding: "12px 24px", fontSize: 14, cursor: "pointer" }}>
                Перейти к выпуску №3
              </button>
            </Link>
          </div>
        </div>

        {/* похожие */}
        <div style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1E293B", marginBottom: 14 }}>Похожие статьи</h2>
          {articles.filter(a => a.id !== id && a.direction === article.direction).slice(0, 2).map(a => (
            <Link key={a.id} href={`/articles/${a.id}`} style={{ textDecoration: "none" }}>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, padding: "16px 20px", marginBottom: 8, cursor: "pointer" }}>
                <div style={{ fontSize: 11, color: "#0EA5E9", fontWeight: "bold", marginBottom: 5, textTransform: "uppercase" }}>{a.direction} · {a.year}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#1E293B" }}>{a.title}</div>
                <div style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>{a.authors.map(au => au.split(" (")[0]).join(", ")}</div>
              </div>
            </Link>
          ))}
          {articles.filter(a => a.id !== id && a.direction === article.direction).length === 0 && (
            <div style={{ fontSize: 14, color: "#94A3B8" }}>Похожих статей пока нет</div>
          )}
        </div>
      </div>

      {showDownload && <DownloadModal article={article} onClose={() => setShowDownload(false)} />}
    </Layout>
  );
}
