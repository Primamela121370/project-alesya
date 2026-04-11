@echo off
setlocal EnableExtensions EnableDelayedExpansion

REM Usage:
REM   deploy.bat
REM   deploy.bat main
REM   deploy.bat main "your commit message"

cd /d "%~dp0"
set "EXIT_CODE=0"

set "BRANCH=%~1"
if "%BRANCH%"=="" set "BRANCH=main"

set "MSG=%~2"
if "%MSG%"=="" set "MSG=update: %date% %time%"

echo.
echo [1/4] Checking git repository...
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
  echo ERROR: Current folder is not a git repository.
  set "EXIT_CODE=1"
  goto :finish
)
echo OK

echo.
echo [2/4] Checking remote origin...
git remote get-url origin >nul 2>&1
if errorlevel 1 (
  echo Remote "origin" is not configured.
  set /p "REMOTE_URL=Paste GitHub repo URL (https://github.com/user/repo.git): "
  if "!REMOTE_URL!"=="" (
    echo Cancelled: repository URL is empty.
    set "EXIT_CODE=1"
    goto :finish
  )
  git remote add origin "!REMOTE_URL!"
  if errorlevel 1 (
    echo ERROR: Failed to add remote origin.
    set "EXIT_CODE=1"
    goto :finish
  )
)
echo OK

echo.
echo [3/4] Creating commit...
git add -A
git diff --cached --quiet
if errorlevel 1 (
  git commit -m "%MSG%"
  if errorlevel 1 (
    echo ERROR: Commit failed.
    set "EXIT_CODE=1"
    goto :finish
  )
) else (
  echo No file changes. Skipping commit.
)
echo OK

echo.
echo [4/4] Pushing to GitHub branch "%BRANCH%"...
git push origin HEAD:%BRANCH%
if errorlevel 1 (
  echo ERROR: Push failed. Check your GitHub access and branch protection settings.
  set "EXIT_CODE=1"
  goto :finish
)
echo OK

:finish
echo.
if "%EXIT_CODE%"=="0" (
  echo Done. Project was pushed to GitHub: branch "%BRANCH%".
  echo Next step: run GitHub Action "Deploy Olesiapro" manually and choose target (test or production).
) else (
  echo Deploy script finished with errors.
)
echo.
echo Press any key to close this window...
pause >nul
exit /b %EXIT_CODE%
