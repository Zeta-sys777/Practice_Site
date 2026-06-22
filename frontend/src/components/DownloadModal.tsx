import { motion, AnimatePresence } from "framer-motion";

interface Article { id: string; title: string; }
interface Props { article: Article; onClose: () => void; }

export function DownloadModal({ article, onClose }: Props) {
  return (
    <AnimatePresence>
      <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
        {/* backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.4)", backdropFilter: "blur(4px)" }}
        />
        {/* modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.18 }}
          style={{ position: "relative", background: "#fff", borderRadius: 16, padding: 26, width: "100%", maxWidth: 400, boxShadow: "0 8px 32px rgba(0,0,0,.1)" }}
        >
          {/* header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: "#1E293B" }}>Скачать статью</h3>
            <span onClick={onClose} style={{ fontSize: 18, color: "#CBD5E1", lineHeight: 1, cursor: "pointer" }}>✕</span>
          </div>
          <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 20 }}>Выберите удобный формат</div>

          {/* PDF — primary blue */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#2563EB", borderRadius: 12, padding: 16, marginBottom: 10, cursor: "pointer" }}>
            <div style={{ width: 42, height: 42, borderRadius: 8, background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/48px-PDF_file_icon.svg.png"
                alt="PDF" width={28} height={28}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 3 }}>PDF — готов к чтению</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.65)" }}>Форматирование сохранено, удобен для просмотра и печати</div>
            </div>
            <div style={{ marginLeft: "auto", color: "rgba(255,255,255,.7)", fontSize: 18 }}>↓</div>
          </div>

          {/* secondary formats */}
          <div style={{ border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, padding: "10px 16px 8px", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Исходники — только если не нужен PDF
            </div>
            {[
              { ext: "DOCX", label: "Word (.docx)", desc: "Для редактирования и доработки текста" },
              { ext: ".TEX", label: "LaTeX (.tex)", desc: "Для вёрстки и публикации в LaTeX-системах" }
            ].map(item => (
              <div key={item.ext} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", background: "#fff", cursor: "pointer", borderBottom: "1px solid #F1F5F9" }}>
                <div style={{ width: 36, height: 36, borderRadius: 6, background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#64748B", letterSpacing: -0.5, flexShrink: 0 }}>
                  {item.ext}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#64748B", marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: "#CBD5E1" }}>{item.desc}</div>
                </div>
                <div style={{ marginLeft: "auto", color: "#E2E8F0", fontSize: 16 }}>↓</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
