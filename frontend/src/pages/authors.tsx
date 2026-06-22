import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { authors } from "@/lib/data";

const extraAuthors = [
  { id: "5", name: "А. Нурланова", workplace: "КазНУ им. Аль-Фараби", interests: ["банкинг", "энтропийные модели"], initials: "АН" },
  { id: "6", name: "К. Жаксыбеков", workplace: "КазГЮУ", interests: ["юриспруденция", "термодинамика"], initials: "КЖ" },
  { id: "7", name: "М. Сейткали", workplace: "ЕНУ им. Гумилёва", interests: ["право", "физика"], initials: "МС" },
];

const allAuthors = [...authors, ...extraAuthors];

const bgColors = ["bg-[#BFDBFE]", "bg-[#BBF7D0]", "bg-[#FED7AA]", "bg-[#FECACA]", "bg-[#E9D5FF]", "bg-[#FEF08A]", "bg-[#CFFAFE]"];

export function Authors() {
  return (
    <Layout>
      <div className="text-sm text-[#94A3B8] px-8 py-3 max-w-6xl mx-auto">
        <Link href="/" className="hover:text-[#0EA5E9]">Главная</Link> / <span className="text-[#1E293B]">Авторы</span>
      </div>

      <div className="max-w-6xl mx-auto px-8 pb-12">
        <h1 className="text-2xl font-bold text-[#1E293B] mb-1">Авторы платформы</h1>
        <p className="text-sm text-[#64748B] mb-8">Учёные и исследователи, публикующиеся в Мультинауке</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allAuthors.map((a, i) => (
            <div key={a.id} className="bg-white border border-[#E2E8F0] rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-14 h-14 rounded-full ${bgColors[i % bgColors.length]} flex items-center justify-center text-lg font-black text-[#1E293B] shrink-0`}>
                  {a.initials}
                </div>
                <div>
                  <div className="font-bold text-[#1E293B]">{a.name}</div>
                  <div className="text-sm text-[#64748B]">{a.workplace}</div>
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide mb-2">Научные интересы</div>
                <div className="flex flex-wrap gap-1.5">
                  {a.interests.map(interest => (
                    <span key={interest} className="text-xs bg-[#EFF6FF] text-[#2563EB] px-3 py-1 rounded-full font-medium">{interest}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Placeholder "+16 more" card */}
          <div className="bg-[#F8FAFC] border border-dashed border-[#CBD5E1] rounded-2xl p-6 flex flex-col items-center justify-center text-center">
            <div className="flex -space-x-2 mb-3">
              {["ОК", "РА", "ТМ"].map((init, i) => (
                <div key={i} className={`w-9 h-9 rounded-full ${bgColors[(i + 3) % bgColors.length]} border-2 border-white flex items-center justify-center text-xs font-bold text-[#1E293B]`}>{init}</div>
              ))}
            </div>
            <div className="text-2xl font-black text-[#94A3B8]">+16</div>
            <div className="text-sm text-[#94A3B8] mt-1">авторов в базе</div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
