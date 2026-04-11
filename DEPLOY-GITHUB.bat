@echo off
setlocal EnableDelayedExpansion

REM =====================================================
REM  DEPLOY-GITHUB.bat -- деплой проекта Алеся на сервер
REM  Использование:
REM    DEPLOY-GITHUB.bat              -- спросит ветку
REM    DEPLOY-GITHUB.bat main         -- деплой на БОЕВОЙ
REM    DEPLOY-GITHUB.bat test         -- деплой на ТЕСТОВЫЙ
REM    DEPLOY-GITHUB.bat main "fix"   -- с произвольным сообщением
REM =====================================================

set "BRANCH=%~1"
set "MSG=%~2"

REM --- Выбор ветки, если не задана ---
if "%BRANCH%"=="" (
  echo.
  echo  Куда деплоить?
  echo  [1] БОЕВОЙ сервер   (olesiapro.ru)       -- ветка main
  echo  [2] ТЕСТОВЫЙ сервер (test.olesiapro.ru)  -- ветка test
  echo.
  set /p "CHOICE=Введите 1 или 2: "
  if "!CHOICE!"=="1" set "BRANCH=main"
  if "!CHOICE!"=="2" set "BRANCH=test"
  if "!BRANCH!"=="" (
    echo Отмена.
    echo.
    echo  Нажмите любую клавишу для закрытия...
    pause >nul
    exit /b 1
  )
)

REM --- Сообщение коммита ---
if "%MSG%"=="" set "MSG=deploy: %date% %time%"

echo.
echo  Деплой в ветку: %BRANCH%
if "%BRANCH%"=="main"  echo  Цель: olesiapro.ru ^(БОЕВОЙ^)
if "%BRANCH%"=="test"  echo  Цель: test.olesiapro.ru ^(ТЕСТОВЫЙ^)
echo.

REM --- [1/4] Проверка git ---
echo [1/4] Проверка git-репозитория...
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
  echo.
  echo  ОШИБКА: папка не является git-репозиторием.
  echo.
  echo  Нажмите любую клавишу для закрытия...
  pause >nul
  exit /b 1
)
echo  OK

REM --- [2/4] Проверка remote ---
echo [2/4] Проверка remote origin...
git remote get-url origin >nul 2>&1
if errorlevel 1 (
  echo Remote origin не настроен.
  set /p "REMOTE_URL=Вставьте URL репозитория: "
  if "!REMOTE_URL!"=="" (
    echo Отмена.
    echo.
    echo  Нажмите любую клавишу для закрытия...
    pause >nul
    exit /b 1
  )
  git remote add origin "!REMOTE_URL!"
)
echo  OK

REM --- [3/4] Коммит ---
echo [3/4] Добавление изменений и коммит...
git add -A
git diff --cached --quiet
if errorlevel 1 (
  git commit -m "%MSG%"
  if errorlevel 1 (
    echo.
    echo  ОШИБКА: коммит не удался.
    echo.
    echo  Нажмите любую клавишу для закрытия...
    pause >nul
    exit /b 1
  )
) else (
  echo  Нет новых изменений -- пустой коммит для запуска деплоя...
  git commit --allow-empty -m "%MSG% [trigger]"
  if errorlevel 1 (
    echo.
    echo  ОШИБКА: пустой коммит не удался.
    echo.
    echo  Нажмите любую клавишу для закрытия...
    pause >nul
    exit /b 1
  )
)
echo  OK

REM --- [4/4] Push ---
echo [4/4] Отправка в GitHub ^(ветка %BRANCH%^)...
git push -u origin %BRANCH%
if errorlevel 1 (
  echo.
  echo  ОШИБКА: push не удался. Проверьте доступ к GitHub.
  echo.
  echo  Нажмите любую клавишу для закрытия...
  pause >nul
  exit /b 1
)
echo  OK

echo.
echo  ============================================
echo   УСПЕХ! Деплой запущен.
echo  ============================================
echo.
echo  GitHub Actions задеплоит файлы на сервер.
echo  Статус: https://github.com/Primamela121370/project-alesya/actions
echo.
echo  Нажмите любую клавишу для закрытия...
pause >nul
exit /b 0