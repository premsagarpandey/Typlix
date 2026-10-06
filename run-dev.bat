@echo off
title Typlix - Starting Localhost Development Server
echo ===================================================
echo   Starting Typlix Development Server (Localhost)
echo ===================================================
echo.

:: Check if node is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not found in your system PATH!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Check if node_modules exists
if not exist "node_modules\" (
    echo [INFO] Installing project dependencies first...
    call npm install
)

echo [INFO] Starting Vite dev server and opening browser automatically...
call npm run dev
pause
