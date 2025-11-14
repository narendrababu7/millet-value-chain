@echo off
echo Starting Millets Value Chain Platform Frontend...
echo.

cd frontend
echo Cleaning previous installs and configuring npm registry...
if exist node_modules (
  rmdir /s /q node_modules
)
if exist package-lock.json (
  del /f /q package-lock.json
)
npm cache clean --force
npm config set registry https://registry.npmjs.org/
npm config delete proxy
npm config delete https-proxy

echo Installing dependencies (safe mode)...
npm install --legacy-peer-deps || npm install --force

echo Starting React development server...
start "Frontend Dev Server" cmd /k "set PORT=3000 && npm start"

REM Open browser to the correct dev URL after a short delay
timeout /t 5 /nobreak >nul
start "Millets Frontend" http://localhost:3000

pause
