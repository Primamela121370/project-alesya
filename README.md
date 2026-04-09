# Project Alesya: Landing + Admin CMS MVP

Сайт репетитора на React + Vite с публичным лендингом и закрытой админкой.

## Что внутри

- Публичная часть: ` / `
- Админка:
  - `/admin/login`
  - `/admin`
  - `/admin/hero`
  - `/admin/sections`
  - `/admin/results`
  - `/admin/testimonials`
  - `/admin/faq`
  - `/admin/contacts`
  - `/admin/seo`
  - `/admin/leads`

Реализовано CRUD для hero, site settings, sections, section items, results, testimonials, faq, seo settings, leads.

## Технологии

- React + Vite + TypeScript
- React Router
- Supabase (Auth + Postgres + Storage)
- Local fallback provider (для локального MVP без Supabase)

## Локальный запуск

```bash
npm install
npm run dev
```

Открыть:

- `http://localhost:5173/`
- `http://localhost:5173/admin/login`

## Логин локального fallback

Если Supabase env не задан, работает fallback-auth:

- login: `admin`
- password: `121370`

Можно переопределить в `.env`:

```env
VITE_ADMIN_EMAIL=admin
VITE_ADMIN_PASSWORD=121370
```

## Подключение Supabase

1. Создайте проект в Supabase.
2. Выполните SQL: [supabase/schema.sql](supabase/schema.sql)
3. Добавьте `.env`:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

4. Создайте admin-пользователя в Supabase Auth (email/password).

## Проверки

```bash
npm run typecheck
npm run lint
npm run build
```

## Деплой

```powershell
.\DEPLOY-GITHUB.bat "обновление"
```
