@echo off
set "PATH=%ProgramFiles%\nodejs;%PATH%"
cd /d "%~dp0frontend"
if not exist node_modules (
  echo Installing frontend dependencies...
  call npm install
)
echo Starting frontend on http://localhost:3000 ...
call npm run dev
pause
