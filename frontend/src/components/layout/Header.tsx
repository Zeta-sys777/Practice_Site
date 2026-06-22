import { Link, useRoute } from "wouter";
import { cn } from "@/lib/utils";

export function Header({ variant = "dark" }: { variant?: "light" | "dark" }) {
  const isLight = variant === "light";
  const [isCatalog] = useRoute("/catalog");
  const [isAuthors] = useRoute("/authors");
  const [isNews] = useRoute("/news");

  if (isLight) {
    return (
      <header className="bg-white border-b border-[#E2E8F0] h-16 flex items-center justify-between px-12 sticky top-0 z-50">
        <Link href="/" className="text-[#1E293B] text-xl font-black tracking-tight leading-none">
          Мульти<span className="text-[#0EA5E9]">наука</span>
        </Link>
        <nav className="flex items-center gap-7">
          <Link href="/catalog" className="text-[#64748B] text-sm font-medium hover:text-[#1E293B] transition-colors">Популярное</Link>
          <Link href="/catalog" className="text-[#64748B] text-sm font-medium hover:text-[#1E293B] transition-colors">Направления</Link>
          <Link href="/authors" className="text-[#64748B] text-sm font-medium hover:text-[#1E293B] transition-colors">Авторы</Link>
          <Link href="/catalog" className="text-[#64748B] text-sm font-medium hover:text-[#1E293B] transition-colors">Тренды</Link>
          <Link href="/news" className="text-[#64748B] text-sm font-medium hover:text-[#1E293B] transition-colors">Новости</Link>
          <span className="border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[#1E293B] text-xs font-semibold bg-[#F8FAFC] cursor-pointer">RU / KZ</span>
          <Link href="/login" className="bg-[#0EA5E9] text-white rounded-lg px-5 py-2 text-sm font-bold hover:bg-sky-500 transition-colors">
            Войти →
          </Link>
        </nav>
      </header>
    );
  }

  return (
    <header className="bg-[#1E293B] h-16 flex items-center justify-between px-8 sticky top-0 z-50">
      <Link href="/" className="text-white text-xl font-bold leading-none">
        Мультинаука
      </Link>
      <nav className="flex items-center gap-6">
        <Link href="/catalog" className={cn("text-sm cursor-pointer transition-colors hover:text-white", isCatalog ? "text-white" : "text-[#7DD3FC]")}>
          Направления
        </Link>
        <Link href="/catalog" className={cn("text-sm cursor-pointer transition-colors hover:text-white", isCatalog ? "text-white" : "text-[#7DD3FC]")}>
          Каталог
        </Link>
        <Link href="/authors" className={cn("text-sm cursor-pointer transition-colors hover:text-white", isAuthors ? "text-white" : "text-[#7DD3FC]")}>
          Авторы
        </Link>
        <Link href="/news" className={cn("text-sm cursor-pointer transition-colors hover:text-white", isNews ? "text-white" : "text-[#7DD3FC]")}>
          Новости
        </Link>
        <span className="border border-[#7DD3FC] rounded-md px-3 py-1 text-white text-xs font-semibold cursor-pointer">RU / KZ</span>
      </nav>
    </header>
  );
}
