@echo off
chcp 65001 >nul
setlocal

:: Получаем дату и время через PowerShell (надёжно на любой локали)
for /f "tokens=*" %%i in ('powershell -NoProfile -Command "Get-Date -Format 'yyyy-MM-dd_HH-mm'"') do set STAMP=%%i

set PROJECT_DIR=%~dp0
set BACKUP_DIR=%PROJECT_DIR%backups\%STAMP%

echo.
echo  Создание резервной копии...
echo  Папка: backups\%STAMP%
echo.

:: Создаём структуру папок
mkdir "%BACKUP_DIR%\src\assets" >nul 2>&1
mkdir "%BACKUP_DIR%\public"     >nul 2>&1

:: Копируем исходный код
copy /Y "%PROJECT_DIR%src\App.jsx"    "%BACKUP_DIR%\src\" >nul
copy /Y "%PROJECT_DIR%src\App.css"    "%BACKUP_DIR%\src\" >nul
copy /Y "%PROJECT_DIR%src\index.css"  "%BACKUP_DIR%\src\" >nul
copy /Y "%PROJECT_DIR%src\main.jsx"   "%BACKUP_DIR%\src\" >nul

:: Копируем ассеты (если есть)
if exist "%PROJECT_DIR%src\assets\" (
    xcopy /Y /E /Q "%PROJECT_DIR%src\assets\*" "%BACKUP_DIR%\src\assets\" >nul
)

:: Копируем корневые файлы
copy /Y "%PROJECT_DIR%index.html"     "%BACKUP_DIR%\" >nul
copy /Y "%PROJECT_DIR%package.json"   "%BACKUP_DIR%\" >nul
copy /Y "%PROJECT_DIR%vite.config.js" "%BACKUP_DIR%\" >nul

:: Копируем public
if exist "%PROJECT_DIR%public\" (
    xcopy /Y /E /Q "%PROJECT_DIR%public\*" "%BACKUP_DIR%\public\" >nul
)

echo  Готово! Резервная копия сохранена в:
echo  backups\%STAMP%
echo.
echo  Нажмите любую клавишу для закрытия...
pause >nul
