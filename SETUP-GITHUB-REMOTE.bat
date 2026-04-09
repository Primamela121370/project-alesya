@echo off
setlocal EnableExtensions

REM Usage:
REM   SETUP-GITHUB-REMOTE.bat https://github.com/<user>/<repo>.git

set "REMOTE_URL=%~1"

if "%REMOTE_URL%"=="" (
  echo.
  echo GitHub repository URL was not passed as an argument.
  echo Example: https://github.com/your-user/your-repo.git
  echo.
  set /p "REMOTE_URL=Paste repository URL and press Enter: "
)

if "%REMOTE_URL%"=="" (
  echo ERROR: Repository URL is empty.
  pause
  exit /b 1
)

git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
  echo ERROR: Current folder is not a git repository.
  pause
  exit /b 1
)

git branch -M main
git remote remove origin >nul 2>&1
git remote add origin "%REMOTE_URL%"

echo Remote origin set to:
git remote -v

echo.
echo First push...
git push -u origin main
if errorlevel 1 (
  echo ERROR: First push failed.
  pause
  exit /b 1
)

echo Success: origin configured and main pushed.
pause
exit /b 0
