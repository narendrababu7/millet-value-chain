@echo off
echo Starting Millets Value Chain Platform...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && call venv\Scripts\activate && pip install -r requirements.txt && python app.py"

timeout /t 5 /nobreak >nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm install && npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Demo Accounts:
echo Farmer: farmer@example.com / farmer123
echo Buyer: buyer@example.com / buyer123
echo Admin: admin@milletsplatform.com / admin123
echo.

pause
