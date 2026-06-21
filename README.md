# Journal Backend

Серверная часть платформы научного журнала. Реализована на Node.js + Express, база данных — Supabase (PostgreSQL). Аутентификация через JWT, ролевая модель: пользователь, автор, администратор.

## Быстрый старт

```bash
# Установка зависимостей
npm install

# Создать .env (пример ниже)
# Запуск
node index.js
```

Сервер запускается на `http://localhost:3000`.

## Переменные окружения (.env)

| Переменная | Назначение |
|---|---|
| `SUPABASE_URL` | URL проекта Supabase |
| `SUPABASE_KEY` | `service_role` ключ (не `anon`) |
| `PORT` | Порт сервера (по умолчанию 3000) |
| `JWT_SECRET` | Секрет для подписи токенов |
| `ADMIN_TOKEN` | Не используется (заменён на JWT), можно оставить |

## Структура проекта

```
src/
  config/
    supabase.js         # подключение к Supabase
  middleware/
    auth.js             # verifyToken, requireRole
  routes/
    admin.js            # административные эндпоинты
    articles.js         # публичные статьи
    auth.js             # регистрация / логин
    authors.js          # список авторов
    contact.js          # форма обратной связи (заглушка)
    directions.js       # научные направления
    download.js         # скачивание PDF
    editorial.js        # редколлегия
    news.js             # новости
    profile.js          # профиль автора
    search.js           # полнотекстовый поиск
    stats.js            # статистика (главная)
    submissions.js      # заявки автора
    submit.js           # подача заявки
  utils/
    translateKeys.js    # перевод кириллических ключей в английские
.env
.gitignore
index.js
package.json
README.md
```

## API

### Публичные (без токена)

| Метод | URL | Описание |
|---|---|---|
| GET | `/api/articles` | Список статей (пагинация, фильтры по направлению и году, сортировка) |
| GET | `/api/articles/:id` | Детали статьи + счётчик просмотров |
| GET | `/api/directions` | Все направления |
| GET | `/api/directions/:slug` | Одно направление + его статьи и `articles_count` |
| GET | `/api/search?q=текст` | Поиск по названию, ключевым словам, аннотации |
| GET | `/api/news` | Новости (пагинация) |
| GET | `/api/news/:id` | Одна новость |
| GET | `/api/editorial` | Состав редколлегии |
| GET | `/api/authors` | Список авторов (публичные профили) |
| POST | `/api/register` | Регистрация (`email`, `password`, `полное_имя`, `role`) |
| POST | `/api/login` | Вход → `{ token, role }` |
| POST | `/api/contact` | Форма обратной связи (заглушка) |
| GET | `/api/stats` | Статистика: количество публикаций, направлений, авторов, выпуск |

### Авторские (требуется JWT)

Заголовок: `Authorization: Bearer <токен>`

Доступ для ролей: `автор`, `администратор`.

| Метод | URL | Описание |
|---|---|---|
| POST | `/api/submit` | Подача заявки с PDF (multipart/form-data) |
| GET | `/api/profile` | Получить свой профиль автора |
| PUT | `/api/profile` | Создать или обновить профиль автора |
| GET | `/api/submissions` | Список своих заявок |
| GET | `/api/submissions/:id` | Детали своей заявки (доступ только к своим) |

### Административные (JWT + роль `администратор`)

Заголовок: `Authorization: Bearer <токен>`

| Метод | URL | Описание |
|---|---|---|
| GET | `/api/admin/metrics` | Сводная статистика системы |
| GET | `/api/admin/submissions` | Список всех заявок (фильтр по статусу) |
| GET | `/api/admin/submissions/:id` | Заявка по ID |
| PATCH | `/api/admin/submissions/:id` | Изменить статус (`принята` / `отклонена`) |
| POST | `/api/admin/submissions/:id/publish` | Опубликовать заявку как статью |
| DELETE | `/api/admin/submissions/:id` | Удалить заявку |
| GET | `/api/admin/articles` | Все статьи (включая неопубликованные) |
| PATCH | `/api/admin/articles/:id` | Редактировать статью (поля на выбор) |
| DELETE | `/api/admin/articles/:id` | Удалить статью |
| POST | `/api/admin/news` | Создать новость |
| DELETE | `/api/admin/news/:id` | Удалить новость |

## Коды ответов

| Код | Значение |
|---|---|
| 200 | Успешно |
| 400 | Ошибка валидации |
| 401 | Неавторизован (нет или неверный токен) |
| 403 | Доступ запрещён (недостаточно прав) |
| 404 | Ресурс не найден |
| 500 | Внутренняя ошибка сервера |

## Особенности

- Все названия таблиц и большинства колонок — кириллица (в коде экранированы `\uXXXX`).
- Ответы API возвращают ключи на английском благодаря `translateKeys`.
- Для write-операций используется `service_role` ключ Supabase, что обходит RLS.
- Административные эндпоинты переведены на JWT (вместо устаревшего `x-admin-token`).

## Разработка

Автор: Зак  
Практический проект.