import { useState } from "react";
import { Link, useParams } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { articles, directions } from "@/lib/data";
import { DownloadModal } from "@/components/DownloadModal";

const dirDescriptions: Record<string, string> = {
  "finansy-fizika": "Направление объединяет методы статистической физики, теории сложных систем и термодинамики с задачами финансового анализа: моделирование рынков, оценка рисков и прогнозирование волатильности.",
  "medicina-fizika": "Применение методов физики и математического моделирования в медицинской диагностике, биомеханике и обработке медицинских изображений для повышения точности выявления патологий.",
  "marketing-matematika": "Использование теории вероятностей, стохастических моделей и количественного анализа для исследования потребительского поведения и оптимизации маркетинговых стратегий.",
  "yurisprudenciya-matematika": "Применение алгоритмов машинного обучения и математического анализа в правовой сфере: прогнозирование судебных решений и автоматизация правового анализа.",
  "yurisprudenciya-fizika": "Исследование возможности применения законов термодинамики и физики сложных систем в качестве структурного базиса для правовой аргументации и анализа.",
  "banking-fizika": "Применение концепций физики (энтропия, термодинамические модели) к задачам банковского дела: оценка кредитного риска, управление портфелем.",
  "ekonomika-fizika": "Использование методов статистической механики и нелинейной динамики для анализа экономических систем и прогнозирования макроэкономических показателей."
};

export function Direction() {
  const { slug } = useParams<{ slug: string }>();
  const direction = directions.find(d => d.slug === slug);
  const [yearFilter, setYearFilter] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [search, setSearch] = useState("");
  const [downloadArticleId, setDownloadArticleId] = useState<string | null>(null);

  if (!direction) return (
    <Layout>
      <div style={{ textAlign: "center", padding: "64px 32px", color: "#94A3B8" }}>
        Направление не найдено. <Link href="/" style={{ color: "#0EA5E9" }}>На главную</Link>
      </div>
    </Layout>
  );

  const allDirArticles = articles.filter(a => a.direction === direction.name);
  const allAuthors = [...new Set(allDirArticles.flatMap(a => a.authors.map(au => au.split(" (")[0])))];

  const dirArticles = allDirArticles.filter(a =>
    (!yearFilter || String(a.year) === yearFilter) &&
    (!authorFilter || a.authors.some(au => au.split(" (")[0] === authorFilter)) &&
    (!search || a.title.toLowerCase().includes(search.toLowerCase()))
  );

  const downloadArticle = downloadArticleId ? articles.find(a => a.id === downloadArticleId) : null;
  const desc = dirDescriptions[slug ?? ""] ?? "Направление объединяет методы точных наук с прикладными областями на стыке дисциплин.";

  return (
    <Layout>
      {/* breadcrumb */}
      <div style={{ fontSize: 13, color: "#94A3B8", padding: "16px 32px" }}>
        <Link href="/" style={{ color: "#94A3B8", textDecoration: "none" }}>Главная</Link>
        {" / "}
        <span style={{ color: "#94A3B8" }}>Направления</span>
        {" / "}
        <span style={{ color: "#1E293B" }}>{direction.name}</span>
      </div>

      {/* blue topic banner */}
      <div style={{ background: "#2563EB", padding: "36px 32px" }}>
        <h1 style={{ fontSize: 28, color: "#fff", fontWeight: "bold", marginBottom: 10 }}>{direction.name}</h1>
        <p style={{ fontSize: 15, color: "#BFDBFE", maxWidth: 600, lineHeight: 1.55 }}>{desc}</p>
      </div>

      <div style={{ padding: "32px 32px 40px" }}>
        {/* stats row */}
        <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
          {[
            { num: direction.count, desc: "публикаций" },
            { num: allAuthors.length || 5, desc: "авторов" },
            { num: "2025–2026", desc: "годы" }
          ].map((s, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20, flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: "bold", color: "#1E293B" }}>{s.num}</div>
              <div style={{ fontSize: 13, color: "#64748B" }}>{s.desc}</div>
            </div>
          ))}
        </div>

        {/* filters */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          <select
            style={{ padding: "8px 14px", border: "1px solid #CBD5E1", borderRadius: 8, fontSize: 14, color: "#64748B", background: "#fff", outline: "none" }}
            value={yearFilter}
            onChange={e => setYearFilter(e.target.value)}
          >
            <option value="">Все годы</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
          <select
            style={{ padding: "8px 14px", border: "1px solid #CBD5E1", borderRadius: 8, fontSize: 14, color: "#64748B", background: "#fff", outline: "none" }}
            value={authorFilter}
            onChange={e => setAuthorFilter(e.target.value)}
          >
            <option value="">Все авторы</option>
            {allAuthors.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <input
            style={{ padding: "8px 14px", border: "1px solid #CBD5E1", borderRadius: 8, fontSize: 14, color: "#64748B", background: "#fff", width: 320, outline: "none" }}
            placeholder="Поиск по названию..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* article cards */}
        {dirArticles.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#94A3B8", fontSize: 14 }}>Статьи не найдены</div>
        )}
        {dirArticles.map(a => (
          <div key={a.id} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20, marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 11, color: "#0EA5E9", fontWeight: "bold", marginBottom: 6 }}>{a.year}</div>
              <Link href={`/articles/${a.id}`}>
                <div style={{ fontSize: 15, color: "#1E293B", fontWeight: "bold", marginBottom: 6, lineHeight: 1.4, cursor: "pointer" }}>{a.title}</div>
              </Link>
              <div style={{ fontSize: 13, color: "#64748B" }}>{a.authors.map(au => au.split(" (")[0]).join(", ")}</div>
            </div>
            <button
              onClick={() => setDownloadArticleId(a.id)}
              style={{ border: "1px solid #0EA5E9", color: "#0EA5E9", borderRadius: 6, padding: "6px 14px", fontSize: 13, background: "#fff", whiteSpace: "nowrap", cursor: "pointer", flexShrink: 0, marginLeft: 16 }}
            >
              ⬇ Скачать
            </button>
          </div>
        ))}
      </div>

      {downloadArticle && <DownloadModal article={downloadArticle} onClose={() => setDownloadArticleId(null)} />}
    </Layout>
  );
}
