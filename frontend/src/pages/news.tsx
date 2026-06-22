import { Link } from "wouter";
import { Calendar } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { news } from "@/lib/data";

const extendedNews = [
  ...news,
  { id: "4", title: "Мультинаука получила аккредитацию в ККСОН МОН РК", date: "15 мая 2026", snippet: "Журнал включён в реестр изданий, рекомендованных для публикации научных результатов диссертаций." },
  { id: "5", title: "Открытый вебинар: как подать статью в журнал", date: "5 мая 2026", snippet: "Редакция проводит онлайн-встречу для потенциальных авторов. Регистрация открыта." },
  { id: "6", title: "Выпуск №1 достиг 1 000 загрузок", date: "20 апреля 2026", snippet: "Первый номер журнала преодолел отметку в тысячу загрузок PDF-файлов за три месяца." },
];

export function News() {
  return (
    <Layout>
      <div className="text-sm text-[#94A3B8] px-8 py-3 max-w-5xl mx-auto">
        <Link href="/" className="hover:text-[#0EA5E9]">Главная</Link> / <span className="text-[#1E293B]">Новости</span>
      </div>

      <div className="max-w-5xl mx-auto px-8 pb-12">
        <h1 className="text-2xl font-bold text-[#1E293B] mb-1">Новости и объявления</h1>
        <p className="text-sm text-[#64748B] mb-8">Анонсы выпусков, конференции и мероприятия редакции</p>

        <div className="space-y-4">
          {extendedNews.map((n, i) => (
            <div key={n.id} className={`bg-white border border-[#E2E8F0] rounded-2xl p-6 hover:shadow-sm transition-shadow ${i === 0 ? "border-[#BAE6FD] bg-gradient-to-r from-[#F0F9FF] to-white" : ""}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {i === 0 && (
                    <span className="inline-block text-xs font-bold bg-[#0EA5E9] text-white rounded-full px-3 py-0.5 mb-3">Актуально</span>
                  )}
                  <h3 className="font-bold text-[#1E293B] mb-2 leading-snug">{n.title}</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">{n.snippet}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#94A3B8] whitespace-nowrap shrink-0 mt-1">
                  <Calendar className="w-3.5 h-3.5" /> {n.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
