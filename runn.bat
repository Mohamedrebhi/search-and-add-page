@echo off

:: Start React frontend in a new command window
cd /d "C:\Users\gigabyte\Desktop\riadh"
start cmd /k "npm start"

:: Start Flask backend in a new command window
cd /d "C:\Users\gigabyte\Desktop\riadh\src\backend"
start cmd /k "python app.py"

:: End the script
pause
