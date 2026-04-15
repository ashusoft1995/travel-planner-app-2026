@echo off
cd /d "%~dp0"
echo.
echo Starting two windows — keep BOTH open.
echo   1) API on port 5000  (required for login)
echo   2) Website on port 3000
echo Then open: http://localhost:3000
echo.
start "EthioTravel API - port 5000" powershell -NoExit -Command "Set-Location -LiteralPath '%~dp0backend'; node server.js"
timeout /t 2 /nobreak >nul
start "EthioTravel Web - port 3000" powershell -NoExit -Command "Set-Location -LiteralPath '%~dp0frontend'; npm run dev"
echo.
pause
