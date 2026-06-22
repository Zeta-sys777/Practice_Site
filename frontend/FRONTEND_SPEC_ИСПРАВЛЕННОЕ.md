# Мультинаука — Техническое задание: Фронтенд (React)
> **Версия:** исправленная (безопасность)  
> **Бэкенд:** Node.js + Express + Supabase (PostgreSQL) · Base URL: `http://localhost:3000`

---

## 1. Технологический стек

| Слой | Технология | Зачем |
|------|-----------|-------|
| Фреймворк | **React 18** | SPA, компонентный подход |
| Маршрутизация | **React Router v6** | Все переходы между страницами |
| Запросы к API | **TanStack Query (React Query) v5** | Кэш, загрузка, ошибки, пагинация |
| HTTP-клиент | **Axios** | Удобные инстансы с токеном, перехватчики |
| Глобальное состояние | **Zustand** | Auth-стейт (токен, роль, пользователь) |
| Стили | **Tailwind CSS** | Утилиты, быстрая вёрстка по макету |
| Типизация | **TypeScript** | Строгие типы для API и пропсов |
| Иконки | **lucide-react** | SVG-иконки |
| Куки | **js-cookie** | Хранение токена вместо localStorage |

---

## 2. Переменные окружения

```env
# .env
VITE_API_URL=http://localhost:3000
```

> ⚠️ **VITE_ADMIN_TOKEN удалён.**  
> Admin-токен **никогда не должен** попадать во фронтенд: `VITE_*` переменные вшиваются в JS-бандл и видны в браузере через F12.  
> Административные маршруты защищены на сервере по роли пользователя из JWT.

---

## 3. Zustand — хранилище авторизации (ИСПРАВЛЕНО)

```ts
// src/store/authStore.ts
import { create } from "zustand";
import Cookies from "js-cookie";

interface AuthState {
  token: string | null;
  role: string | null;
  userName: string | null;
  setAuth: (token: string, role: string, userName?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: Cookies.get("auth-token") || null,
  role: Cookies.get("auth-role") || null,
  userName: Cookies.get("auth-name") || null,

  setAuth: (token, role, userName) => {
    // Токен в куке, НЕ в localStorage
    Cookies.set("auth-token", token, { expires: 7, sameSite: "strict" });
    Cookies.set("auth-role", role, { expires: 7, sameSite: "strict" });
    if (userName) Cookies.set("auth-name", userName, { expires: 7, sameSite: "strict" });
    set({ token, role, userName: userName || null });
  },

  logout: () => {
    Cookies.remove("auth-token");
    Cookies.remove("auth-role");
    Cookies.remove("auth-name");
    set({ token: null, role: null, userName: null });
  },
}));
```

> ✅ **Почему куки лучше localStorage:**  
> - `localStorage` доступен любому JS-коду → уязвим к XSS-атакам  
> - Куки с `sameSite: "strict"` защищены от межсайтовых атак  
> - Значение всё ещё можно прочитать через `document.cookie`, но это значительно безопаснее

---

## 4. Axios — HTTP-клиент (ИСПРАВЛЕНО)

```ts
// src/api/axios.ts
import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Интерцептор: читает токен из куки, НЕ из VITE_ переменной
apiClient.interceptors.request.use((config) => {
  const token = Cookies.get("auth-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Автоматический выход при 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("auth-token");
      Cookies.remove("auth-role");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

> ⚠️ **adminClient с `x-admin-token` удалён.**  
> Все запросы (включая `/api/admin/*`) идут через `apiClient` с JWT.  
> Бэкенд проверяет `req.user.role === "администратор"` на своей стороне.

---

## 5. Требования к бэкенду (для команды бэкенда)

Для корректной работы фронтенда бэкенд должен:

```js
// Защита admin-роутов через JWT (НЕ через x-admin-token)
app.get("/api/admin/metrics",
  authenticate,          // проверяет Bearer-токен
  requireRole("администратор"),
  getMetrics
);

// При логине возвращать полное_имя пользователя
// POST /api/login → { token, role, полное_имя }
```

---

## 6. Защита маршрутов на фронтенде

```tsx
// src/router/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export function ProtectedRoute({ allowedRoles }: { allowedRoles: string[] }) {
  const { token, role } = useAuthStore();
  if (!token) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(role ?? "")) return <Navigate to="/" replace />;
  return <Outlet />;
}
```

```tsx
// src/router/index.tsx — Маршруты
{
  element: <ProtectedRoute allowedRoles={["автор", "администратор"]} />,
  children: [
    { path: "/profile", element: <ProfilePage /> },
    { path: "/submit",  element: <SubmitPage /> },
  ],
},
{
  element: <ProtectedRoute allowedRoles={["администратор"]} />,
  children: [
    { path: "/admin",              element: <AdminDashboard /> },
    { path: "/admin/submissions",  element: <AdminSubmissions /> },
    { path: "/admin/articles",     element: <AdminArticles /> },
  ],
},
```

---

## 7. Роли и ограничения интерфейса

| Элемент | Гость | Пользователь | Автор | Администратор |
|---------|-------|-------------|-------|--------------|
| Читать статьи, скачать PDF | ✅ | ✅ | ✅ | ✅ |
| Регистрация / Вход | ✅ | — | — | — |
| Подать заявку `/submit` | ❌ | ❌ | ✅ | ✅ |
| Редактировать профиль `/profile` | ❌ | ❌ | ✅ | ✅ |
| Административная панель `/admin` | ❌ | ❌ | ❌ | ✅ |

---

## 8. Зависимости

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0",
    "@tanstack/react-query": "^5.56.0",
    "axios": "^1.7.0",
    "zustand": "^4.5.0",
    "js-cookie": "^3.0.5",
    "react-hook-form": "^7.53.0",
    "zod": "^3.23.0",
    "@hookform/resolvers": "^3.9.0",
    "lucide-react": "^0.446.0"
  },
  "devDependencies": {
    "@types/js-cookie": "^3.0.6",
    "typescript": "^5.5.3",
    "vite": "^5.4.1",
    "@vitejs/plugin-react": "^4.3.1",
    "tailwindcss": "^3.4.10"
  }
}
```

---

## 9. Чеклист безопасности

- [ ] `VITE_ADMIN_TOKEN` **отсутствует** в `.env` и в коде
- [ ] JWT хранится в куке (`js-cookie`), **не** в `localStorage`
- [ ] `adminClient` с `x-admin-token` **не используется**
- [ ] Все `/api/admin/*` защищены на бэкенде по роли из JWT
- [ ] Токен автоматически удаляется при 401 ответе от сервера
- [ ] `.env` добавлен в `.gitignore`
