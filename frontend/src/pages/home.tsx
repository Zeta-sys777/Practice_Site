import { Link } from "wouter";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { articles, directions, stats, news, authors } from "@/lib/data";
import { DownloadModal } from "@/components/DownloadModal";
import { useState } from "react";

const stagger = { animate: { transition: { staggerChildren: 0.07 } } };
const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

export function Home() {
  const [downloadArticleId, setDownloadArticleId] = useState<string | null>(null);
  const topArticles = [...articles].sort((a, b) => b.views - a.views).slice(0, 3);
  const downloadArticle = downloadArticleId ? articles.find(a => a.id === downloadArticleId) : null;

  return (
    <Layout variant="light">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-[#E2E8F0]" style={{ background: "linear-gradient(160deg,#EFF6FF 0%,#F0F9FF 50%,#F1F5F9 100%)", minHeight: 460 }}>
        {/* glows */}
        <div className="absolute" style={{ right: -60, top: -80, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle,rgba(14,165,233,.13) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div className="absolute" style={{ right: 220, bottom: -100, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(37,99,235,.08) 0%,transparent 70%)", pointerEvents: "none" }} />

        <div className="relative" style={{ maxWidth: 1440, margin: "0 auto", padding: "72px 48px 60px", minHeight: 460 }}>
          {/* left copy */}
          <motion.div variants={stagger} initial="initial" animate="animate" style={{ maxWidth: 660, position: "relative", zIndex: 2 }}>
            <motion.div variants={fadeUp}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 999, padding: "6px 16px", marginBottom: 24 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#0EA5E9" }} />
                <span style={{ fontSize: 12, color: "#2563EB", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>Научный журнал · Казахстан</span>
              </div>
            </motion.div>
            <motion.h1 variants={fadeUp} style={{ fontSize: 54, fontWeight: 900, color: "#1E293B", lineHeight: 1.08, letterSpacing: -2, marginBottom: 18 }}>
              Наука на стыке<br /><em style={{ fontStyle: "normal", color: "#0EA5E9" }}>дисциплин</em>
            </motion.h1>
            <motion.p variants={fadeUp} style={{ fontSize: 17, color: "#64748B", lineHeight: 1.65, maxWidth: 500, marginBottom: 34 }}>
              Платформа для публикации и чтения исследований на стыке физики, права, медицины и экономики. Всё в одном месте — понятно и удобно.
            </motion.p>
            <motion.div variants={fadeUp} style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 44 }}>
              <Link href="/catalog">
                <button style={{ background: "#0EA5E9", color: "#fff", border: "none", borderRadius: 10, padding: "15px 30px", fontSize: 15, fontWeight: 700, boxShadow: "0 4px 16px rgba(14,165,233,.28)", cursor: "pointer" }}>
                  Читать исследования →
                </button>
              </Link>
              <Link href="/catalog">
                <button style={{ background: "#fff", color: "#2563EB", border: "1.5px solid #2563EB", borderRadius: 10, padding: "14px 26px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                  Смотреть тренды
                </button>
              </Link>
            </motion.div>
            <motion.div variants={fadeUp} style={{ display: "flex" }}>
              {[
                { num: "48", lbl: "публикаций" },
                { num: "7", lbl: "направлений" },
                { num: "23", lbl: "автора" },
                { num: "№3", lbl: "выпуск открыт", blue: true }
              ].map((s, i) => (
                <div key={i} style={{ paddingRight: i < 3 ? 32 : 0, marginRight: i < 3 ? 32 : 0, borderRight: i < 3 ? "1px solid #E2E8F0" : "none" }}>
                  <div style={{ fontSize: 32, fontWeight: 900, color: s.blue ? "#0EA5E9" : "#1E293B", lineHeight: 1 }}>{s.num}</div>
                  <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>{s.lbl}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* floating cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.55, delay: 0.25 } }}
            style={{ position: "absolute", right: 48, top: "50%", transform: "translateY(-50%)", width: 370, zIndex: 2 }}
          >
            {topArticles.map((a, i) => (
              <Link key={a.id} href={`/articles/${a.id}`}>
                <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: "18px 20px", marginBottom: 12, boxShadow: "0 4px 20px rgba(0,0,0,.06)", position: "relative", cursor: "pointer" }}>
                  {i === 0 && (
                    <div style={{ position: "absolute", top: -10, right: 14, background: "#F97316", color: "#fff", fontSize: 11, fontWeight: 700, borderRadius: 999, padding: "3px 10px" }}>🔥 Топ-1</div>
                  )}
                  <div style={{ fontSize: 11, color: "#0EA5E9", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 7 }}>{a.direction}</div>
                  <div style={{ fontSize: 14, color: "#1E293B", fontWeight: 600, lineHeight: 1.4, marginBottom: 8 }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: "#94A3B8", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span>{a.authors[0].split(" (")[0]}</span>
                    <span style={{ background: "#F0F9FF", color: "#0EA5E9", borderRadius: 999, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>{a.views.toLocaleString()} просм.</span>
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── РАЗДЕЛЫ ПЛАТФОРМЫ ── */}
      <section style={{ padding: "44px 48px 36px", maxWidth: 1440, margin: "0 auto" }}>
        <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 18 }}>Разделы платформы</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
          {[
            { icon: "🔬", name: "Направления", desc: "7 областей на стыке наук — от медицины до финансов", count: "7 тем", href: "/catalog", featured: true, link: "Смотреть все →" },
            { icon: "🔥", name: "Популярное", desc: "Самые читаемые статьи — что актуально прямо сейчас", count: "Топ-10", href: "/catalog", link: "Открыть →" },
            { icon: "👤", name: "Авторы", desc: "Учёные и исследователи, публикующиеся в Мультинауке", count: "23 автора", href: "/authors", link: "Все авторы →" },
            { icon: "📈", name: "Тренды", desc: "Динамика интереса к темам — что набирает популярность", count: "Обновляется", href: "/catalog", link: "Смотреть →" }
          ].map((c) => (
            <Link key={c.name} href={c.href}>
              <div style={{
                background: c.featured ? "linear-gradient(135deg,#F0F9FF,#fff)" : "#fff",
                border: c.featured ? "1px solid #BAE6FD" : "1px solid #E2E8F0",
                borderRadius: 16,
                padding: "24px 20px",
                cursor: "pointer",
                position: "relative",
                height: "100%"
              }}>
                <div style={{ fontSize: 24, marginBottom: 12 }}>{c.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1E293B", marginBottom: 6 }}>{c.name}</div>
                <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.5 }}>{c.desc}</div>
                <div style={{ position: "absolute", top: 14, right: 14, fontSize: 11, background: "#EFF6FF", color: "#2563EB", borderRadius: 999, padding: "3px 10px", fontWeight: 700 }}>{c.count}</div>
                <div style={{ display: "block", marginTop: 14, fontSize: 13, color: "#0EA5E9", fontWeight: 600 }}>{c.link}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── ПОПУЛЯРНОЕ ── */}
      <section style={{ margin: "0 48px 44px", background: "#fff", border: "1px solid #E2E8F0", borderRadius: 18, padding: "26px 30px", maxWidth: "calc(1440px - 96px)", marginLeft: 48 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1E293B", display: "flex", alignItems: "center", gap: 8 }}>🔥 Популярное прямо сейчас</h2>
          <Link href="/catalog" style={{ fontSize: 13, color: "#0EA5E9", fontWeight: 600, textDecoration: "none" }}>Все публикации →</Link>
        </div>
        <div style={{ display: "flex", gap: 0 }}>
          {topArticles.map((a, i) => (
            <Link key={a.id} href={`/articles/${a.id}`} style={{ flex: 1, paddingRight: i < 2 ? 24 : 0, marginRight: i < 2 ? 24 : 0, borderRight: i < 2 ? "1px solid #F1F5F9" : "none", textDecoration: "none" }}>
              <div style={{ fontSize: 38, fontWeight: 900, color: "#F1F5F9", lineHeight: 1 }}>0{i + 1}</div>
              <div style={{ fontSize: 11, color: "#0EA5E9", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 7 }}>{a.direction}</div>
              <div style={{ fontSize: 14, color: "#1E293B", fontWeight: 600, lineHeight: 1.45, marginBottom: 8 }}>{a.title}</div>
              <div style={{ fontSize: 12, color: "#94A3B8" }}>{a.authors[0].split(" (")[0]} · {a.views.toLocaleString()} просмотров</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── НАПРАВЛЕНИЯ ── */}
      <section style={{ margin: "0 48px 44px", maxWidth: "calc(1440px - 96px)" }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1E293B", marginBottom: 14 }}>Научные направления</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 10 }}>
          {directions.map((d) => (
            <Link key={d.slug} href={`/directions/${d.slug}`}>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "16px 10px", textAlign: "center", cursor: "pointer" }}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{d.icon}</div>
                <div style={{ fontSize: 11, color: "#1E293B", fontWeight: 600, lineHeight: 1.35 }}>{d.name}</div>
                <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>{d.count} статей</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── АВТОРЫ + НОВОСТИ ── */}
      <section style={{ margin: "0 48px 44px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: "calc(1440px - 96px)" }}>
        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 26 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: "#1E293B", marginBottom: 6 }}>Авторы платформы</h3>
          <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.5, marginBottom: 18 }}>23 учёных из ведущих университетов Казахстана — КазНУ, НИИ медицинской физики и других организаций.</p>
          <div style={{ display: "flex", marginBottom: 18 }}>
            {authors.map((a, i) => (
              <div key={a.id} style={{ width: 44, height: 44, borderRadius: "50%", border: "2px solid #fff", background: "#BFDBFE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#1E293B", marginRight: -10, boxShadow: "0 2px 8px rgba(0,0,0,.08)", zIndex: authors.length - i, position: "relative" }}>
                {a.initials}
              </div>
            ))}
            <div style={{ width: 44, height: 44, borderRadius: "50%", border: "2px solid #fff", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#2563EB", boxShadow: "0 2px 8px rgba(0,0,0,.08)" }}>+19</div>
          </div>
          <Link href="/authors" style={{ fontSize: 13, color: "#0EA5E9", fontWeight: 600, textDecoration: "none" }}>Все авторы →</Link>
        </div>

        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 26 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: "#1E293B", marginBottom: 6 }}>Новости и объявления</h3>
          <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.5, marginBottom: 16 }}>Анонсы выпусков, конференции, мероприятия редакции.</p>
          {news.map((n) => (
            <div key={n.id} style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: "13px 16px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <span style={{ fontSize: 13, color: "#1E293B", fontWeight: 500, lineHeight: 1.4 }}>{n.title}</span>
              <span style={{ fontSize: 11, color: "#94A3B8", whiteSpace: "nowrap", marginLeft: 12, marginTop: 2 }}>{n.date}</span>
            </div>
          ))}
          <div style={{ marginTop: 12 }}>
            <Link href="/news" style={{ fontSize: 13, color: "#0EA5E9", fontWeight: 600, textDecoration: "none" }}>Все новости →</Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ margin: "0 48px 48px", background: "linear-gradient(135deg,#2563EB,#0EA5E9)", borderRadius: 18, padding: 44, textAlign: "center", maxWidth: "calc(1440px - 96px)" }}>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: "#fff", marginBottom: 10 }}>Готовы опубликовать исследование?</h2>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,.75)", marginBottom: 26 }}>Подайте статью в Мультинауку — рецензирование, публикация и PDF в открытом доступе</p>
        <Link href="/register">
          <span style={{ display: "inline-block", background: "#fff", color: "#2563EB", fontSize: 14, fontWeight: 700, borderRadius: 10, padding: "13px 32px", cursor: "pointer", textDecoration: "none" }}>Подать исследование →</span>
        </Link>
      </section>

      {downloadArticle && <DownloadModal article={downloadArticle} onClose={() => setDownloadArticleId(null)} />}
    </Layout>
  );
}
