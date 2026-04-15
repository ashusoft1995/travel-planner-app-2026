@echo off
cd /d "%~dp0"
echo.
echo Freeing ports 5000 and 3000 (closes old Node / dev servers using those ports).
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0kill-dev-ports.ps1"
echo.
pause
