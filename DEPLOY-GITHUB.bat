@echo off
setlocal EnableExtensions

REM Usage:
REM   DEPLOY-GITHUB.bat
REM   DEPLOY-GITHUB.bat "your commit message"

set "BRANCH=main"
set "MSG=%~1"

if "%MSG%"=="" (
  set "MSG=deploy %date% %time%"
)

echo.
echo [1/4] Checking git repository...
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
  echo ERROR: Current folder is not a git repository.
  exit /b 1
)

echo [2/4] Adding changes...
git add -A

echo [3/4] Creating commit...
git commit -m "%MSG%" >nul 2>&1
if errorlevel 1 (
  echo No new changes to commit. Continuing with push...
)

echo [4/4] Pushing to %BRANCH% (this triggers GitHub Pages deploy)...
git push -u origin %BRANCH%
if errorlevel 1 (
  echo ERROR: Push failed.
  exit /b 1
)

echo.
echo Success: code pushed and GitHub Actions deploy started.
echo Check: GitHub ^> Actions ^> "Deploy To GitHub Pages"
exit /b 0
