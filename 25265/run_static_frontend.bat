@echo off
echo Building static production frontend...
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

echo Creating production build...
npm run build

echo Opening production build in browser...
start "Millets Frontend (Static)" "%cd%\build\index.html"

echo If you prefer Live Server, right-click the frontend/build folder and choose 'Open with Live Server'.

pause

