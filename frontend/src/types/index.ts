export interface Article {
  id: number;
  название_рус: string;
  аннотация_рус: string;
  ключевые_слова: string;
  направление_id: number;
  направление?: Direction;
  статус: "опубликована" | "черновик";
  просмотры: number;
  авторы?: Author[];
  путь_к_pdf?: string;
  год?: number;
}

export interface Direction {
  id: number;
  slug: string;
  название_рус: string;
  описание_рус: string;
  articles_count?: number;
}

export interface Author {
  id: number;
  полное_имя: string;
  место_работы: string;
  научные_интересы: string;
  email: string;
}

export interface News {
  id: number;
  заголовок_рус: string;
  текст_рус: string;
  дата_публикации: string;
}

export interface EditorialMember {
  id: number;
  полное_имя: string;
  должность_рус: string;
  учёная_степень: string;
  email: string;
}

export interface Stats {
  publications: number;
  directions: number;
  authors: number;
  issue: number;
}

export interface Submission {
  title: string;
  annotation: string;
  keywords: string;
  direction_id: number;
  author_name: string;
  author_email: string;
  author_workplace: string;
}

export interface UserProfile {
  полное_имя: string;
  место_работы: string;
  научные_интересы: string;
  email: string;
}

export interface ArticleFilters {
  direction_id?: number;
  year?: number;
  page?: number;
  limit?: number;
  sort?: "views";
  q?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export type UserRole = "гость" | "пользователь" | "автор" | "администратор";
