# ПРОЕКТ АЛЕСЯ

Фронтенд на React + Vite с автодеплоем на GitHub Pages.

## Быстрый старт локально

```bash
npm install
npm run dev
```

## Что уже настроено

- Автодеплой: `.github/workflows/deploy-pages.yml`
- Скрипт пуша и деплоя: `DEPLOY-GITHUB.bat`
- Скрипт первичной привязки удалённого репозитория: `SETUP-GITHUB-REMOTE.bat`

## 1) Создать репозиторий на GitHub

1. На GitHub нажми `New repository`.
2. Название: например `project-alesya`.
3. Создай пустой репозиторий (без README, без .gitignore).
4. Скопируй HTTPS URL вида:
   `https://github.com/<your-user>/<your-repo>.git`

## 2) Привязать локальный проект к GitHub (один раз)

В терминале из папки проекта:

```bat
SETUP-GITHUB-REMOTE.bat https://github.com/<your-user>/<your-repo>.git
```

## 3) Деплой одной командой

Каждый раз после изменений:

```bat
DEPLOY-GITHUB.bat "обновление лендинга"
```

Что происходит:
- `git add -A`
- `git commit`
- `git push origin main`
- GitHub Actions запускает деплой на GitHub Pages автоматически.

## 4) Тестовый и основной домен

- Тестовый URL (из коробки):  
  `https://<your-user>.github.io/<your-repo>/`
- Основной домен (кастомный): на GitHub в `Settings -> Pages -> Custom domain` укажи свой домен.

### DNS для основного домена

- Для `www` обычно ставят `CNAME` на `<your-user>.github.io`
- Для корневого домена (`example.com`) обычно ставят `A` записи на IP GitHub Pages

Актуальные IP/правила всегда проверяй в официальной документации GitHub Pages:
https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
