@echo off
REM ShipSmart MVP - Automated Deployment Script
REM This script helps deploy to GitHub and Vercel

echo.
echo ====================================================================
echo   ShipSmart MVP - GitHub & Vercel Deployment Helper
echo ====================================================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed or not in PATH
    echo Please install Git from: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo [1/5] Initializing Git Repository...
git init
if %errorlevel% neq 0 (
    echo ERROR: Failed to initialize git
    pause
    exit /b 1
)
echo ✅ Git repository initialized

echo.
echo [2/5] Adding all files...
git add .
echo ✅ All files staged

echo.
echo [3/5] Creating initial commit...
git commit -m "Initial commit - ShipSmart MVP - Shipping Label Management Platform"
if %errorlevel% neq 0 (
    echo ERROR: Failed to create commit
    pause
    exit /b 1
)
echo ✅ Initial commit created

echo.
echo [4/5] Setting main branch...
git branch -M main
echo ✅ Main branch set

echo.
echo ==================================================================
echo NEXT STEPS - Complete these in your browser:
echo ==================================================================
echo.
echo 1. Create GitHub Account:
echo    Go to: https://github.com/signup
echo    Sign up and verify email
echo.
echo 2. Create New Repository:
echo    Go to: https://github.com/new
echo    Repository name: shipsmart-mvp
echo    Description: Shipping Label Management Platform
echo    Choose: Public
echo    Click: Create repository
echo.
echo 3. Add GitHub Remote:
echo    After your repo is created, you'll see a command like:
echo    git remote add origin https://github.com/YOUR_USERNAME/shipsmart-mvp.git
echo    Copy that command and paste it here, then press Enter:
echo.
set /p remote_url="Enter the git remote add command (or press Enter to skip): "
if not "%remote_url%"=="" (
    %remote_url%
    echo ✅ Remote added
) else (
    echo Skipped - You can add remote manually later
)

echo.
echo 4. Push to GitHub:
echo    Once remote is set, run this command to push:
echo    git push -u origin main
echo.
echo    Or paste this: git push -u origin main
echo.
set /p push_confirm="Ready to push to GitHub? (yes/no): "
if /i "%push_confirm%"=="yes" (
    git push -u origin main
    if %errorlevel% equ 0 (
        echo ✅ Successfully pushed to GitHub!
    ) else (
        echo ERROR: Failed to push to GitHub
        echo Make sure you've added the remote URL first
    )
) else (
    echo Skipped push - you can do this manually later
)

echo.
echo ==================================================================
echo FINAL STEP - Deploy to Vercel:
echo ==================================================================
echo.
echo 1. Go to: https://vercel.com/sign-up
echo 2. Click: Continue with GitHub
echo 3. Authorize Vercel
echo 4. Click: Add New Project
echo 5. Select: Your shipsmart-mvp repository
echo 6. Click: Deploy
echo.
echo Your app will be live in 2-3 minutes at:
echo https://shipsmart-mvp.vercel.app
echo.
echo ==================================================================
echo DONE! Your app will be live globally!
echo ==================================================================
echo.
pause
