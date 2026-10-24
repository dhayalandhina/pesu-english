@echo off
title Pesu English
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo  Pesu English-ku Node.js venum. nodejs.org-la LTS version install pannitu, thirumba indha file-a open pannunga.
  echo.
  start "" https://nodejs.org/
  pause
  exit /b 1
)
node server.mjs
if errorlevel 1 (
  echo.
  echo  Start aagala. Details: %APPDATA%\Pesu English\server.log
  pause
)
