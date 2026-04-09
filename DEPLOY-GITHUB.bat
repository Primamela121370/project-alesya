@echo off
setlocal EnableExtensions

REM Usage:
REM   DEPLOY-GITHUB.bat
REM   DEPLOY-GITHUB.bat "your commit message"

set "BRANCH=main"
set "MSG=%~1"
set "REMOTE_URL="

if "%MSG%"=="" (
  set "MSG=deploy %date% %time%"
)

echo.
echo [1/5] Checking git repository...
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
  echo ERROR: Current folder is not a git repository.
  pause
  exit /b 1
)

echo [2/5] Checking remote origin...
git remote get-url origin >nul 2>&1
if errorlevel 1 (
  echo Remote origin is not configured.
  echo Example: https://github.com/your-user/your-repo.git
  echo.
  set /p "REMOTE_URL=Paste repository URL and press Enter: "

  if "%REMOTE_URL%"=="" (
    echo ERROR: Repository URL is empty.
    pause
    exit /b 1
  )

  git remote add origin "%REMOTE_URL%"
  if errorlevel 1 (
    echo ERROR: Failed to set origin.
    pause
    exit /b 1
  )
)

echo [3/5] Adding changes...
git add -A

echo [4/5] Creating commit...
git diff --cached --quiet
if errorlevel 1 (
  git commit -m "%MSG%"
  if errorlevel 1 (
    echo ERROR: Commit failed.
    pause
    exit /b 1
  )
) else (
  echo No new changes to commit. Continuing with push...
)

echo [5/5] Pushing to %BRANCH% (this triggers GitHub Pages deploy)...
git push -u origin %BRANCH%
if errorlevel 1 (
  echo ERROR: Push failed.
  pause
  exit /b 1
)

echo.
echo Success: code pushed and GitHub Actions deploy started.
echo Check: GitHub ^> Actions ^> "Deploy To GitHub Pages"
pause
exit /b 0
