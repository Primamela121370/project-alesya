@echo off
setlocal

cd /d "%~dp0"

set "PORT="
for /f %%p in ('powershell -NoProfile -Command "$ports = 5173..5183; foreach($p in $ports){ if(-not (Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue)){ $p; break } }"') do set "PORT=%%p"

if not defined PORT set "PORT=5173"

echo Starting local site on http://localhost:%PORT% ...
echo Opening:
echo   - http://localhost:%PORT%/
echo   - http://localhost:%PORT%/admin/login
start "" powershell -NoProfile -Command "Start-Sleep -Seconds 2; Start-Process 'http://localhost:%PORT%/'; Start-Process 'http://localhost:%PORT%/admin/login'"

npm run dev -- --host localhost --port %PORT% --strictPort
