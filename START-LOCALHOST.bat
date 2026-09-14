@echo off
setlocal
cd /d "%~dp0"
title Alesya landing - local preview

where node >nul 2>&1
if errorlevel 1 goto no_node

if not exist "node_modules\" (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 goto install_error
)

set "PORT="
for /f %%p in ('powershell -NoProfile -Command "$ports = 5173..5183; foreach($p in $ports){ if(-not (Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue)){ $p; break } }"') do set "PORT=%%p"
if not defined PORT set "PORT=5173"

echo.
echo Starting landing page at http://localhost:%PORT%/
echo Close this window or press Ctrl+C to stop.
echo.

start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 2; Start-Process 'http://localhost:%PORT%/'"
call npm run dev -- --host localhost --port %PORT% --strictPort
if errorlevel 1 goto server_error
exit /b 0

:no_node
echo.
echo ERROR: Node.js is not installed.
echo Install Node.js from https://nodejs.org/ and run this file again.
echo.
pause
exit /b 1

:install_error
echo.
echo ERROR: Could not install dependencies.
pause
exit /b 1

:server_error
echo.
echo ERROR: The local server stopped unexpectedly.
pause
exit /b 1
