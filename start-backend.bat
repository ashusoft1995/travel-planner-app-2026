@echo off
set "PATH=%ProgramFiles%\nodejs;%PATH%"
cd /d "%~dp0backend"
if not exist node_modules (
  echo Installing backend dependencies...
  call npm install
)
echo Starting backend on http://localhost:5000 ...
call npm run dev
pause

