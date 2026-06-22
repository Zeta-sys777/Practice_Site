import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-[#1E293B] text-slate-300 py-12 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-1 font-bold text-xl tracking-tight text-white">
              <span>Мульти</span>
              <span className="text-sky-400">наука</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Мультидисциплинарный научный журнал Казахстана. Пересечение наук, рождающее инновации.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Разделы</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/catalog" className="hover:text-white transition-colors">Каталог статей</Link></li>
              <li><Link href="/authors" className="hover:text-white transition-colors">Авторы</Link></li>
              <li><Link href="/news" className="hover:text-white transition-colors">Новости</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Информация</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">О журнале</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Правила публикации</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Редакционная коллегия</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Контакты</h4>
            <ul className="space-y-2 text-sm">
              <li>Астана, ул. Научная, 1</li>
              <li>info@multinauka.kz</li>
              <li>+7 (7172) 12-34-56</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-800 text-sm text-slate-500 flex flex-col md:flex-row items-center justify-between">
          <p>&copy; {new Date().getFullYear()} Мультинаука. Все права защищены.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a>
            <a href="#" className="hover:text-white transition-colors">Условия использования</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
