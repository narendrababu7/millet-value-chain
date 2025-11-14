@echo off
echo Starting Blockchain Service for Millets Platform...
echo.

echo ========================================
echo Installing Blockchain Dependencies
echo ========================================
cd blockchain
npm install

echo ========================================
echo Starting Ganache (Local Ethereum Network)
echo ========================================
start "Ganache" cmd /k "npx ganache-cli --port 7545"

timeout /t 5 /nobreak >nul

echo ========================================
echo Compiling Smart Contracts
echo ========================================
npx truffle compile

echo ========================================
echo Deploying Smart Contracts
echo ========================================
npx truffle migrate --network development

echo ========================================
echo Blockchain Service Started!
echo ========================================
echo Ganache: http://localhost:7545
echo Network ID: 5777
echo.
echo Smart Contract Features:
echo ✅ Millet Batch Creation
echo ✅ Traceability Records
echo ✅ Quality Verification
echo ✅ Immutable Records
echo ✅ Blockchain Hashes
echo.

pause
