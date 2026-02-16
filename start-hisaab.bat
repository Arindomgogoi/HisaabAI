@echo off
title HisaabAI Dev Server
cd /d "c:\Users\Asus\OneDrive\Documents\hisaab-ai"
echo Waiting for Docker to start...
timeout /t 15 /nobreak > nul
echo Starting HisaabAI dev server...
npm run dev
