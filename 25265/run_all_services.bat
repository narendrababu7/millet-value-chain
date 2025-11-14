@echo off
echo Starting Complete Millets Value Chain Platform...
echo.

echo ========================================
echo Starting Backend Server (Flask)
echo ========================================
start "Backend Server" cmd /k "cd backend && if not exist venv ( python -m venv venv ) && call venv\Scripts\activate && pip install -r requirements.txt && python app.py"

timeout /t 3 /nobreak >nul

echo ========================================
echo Starting AI Service (Flask)
echo ========================================
start "AI Service" cmd /k "cd ai-service && if not exist venv ( python -m venv venv ) && call venv\Scripts\activate && pip install -r requirements.txt && python app.py"

timeout /t 3 /nobreak >nul

echo ========================================
echo Starting Frontend Server (React)
echo ========================================
start "Frontend Server" cmd /k "cd frontend && npm install && npm start"

timeout /t 5 /nobreak >nul

echo ========================================
echo Starting Blockchain Service (Optional)
echo ========================================
echo To start blockchain service, run:
echo cd blockchain
echo npm install
echo truffle migrate --network development
echo npm start

echo.
echo ========================================
echo All Services Starting...
echo ========================================
echo Backend API: http://localhost:5000
echo AI Service: http://localhost:5001
echo Frontend: http://localhost:3000
echo Blockchain: http://localhost:7545 (if started)
echo.
echo Demo Accounts:
echo Farmer: farmer@example.com / farmer123
echo Buyer: buyer@example.com / buyer123
echo Admin: admin@milletsplatform.com / admin123
echo Consumer: consumer@example.com / consumer123
echo.
echo Features Available:
echo ✅ Blockchain Traceability
echo ✅ AI Price Prediction
echo ✅ Multilingual Support (English, Hindi, Tamil)
echo ✅ PWA (Progressive Web App)
echo ✅ Chatbot Integration
echo ✅ Payment Gateway (Razorpay)
echo ✅ File Upload System
echo ✅ Complete Dashboard System
echo.

start "Open Frontend" http://localhost:3000
start "Open Backend API" http://localhost:5000
start "Open AI Service Health" http://localhost:5001/health

pause
