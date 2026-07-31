@echo off
cd /d "%~dp0"
set PORT=8000

echo Starting local web server at http://localhost:%PORT%/
start "" http://localhost:%PORT%/index.html
python -m http.server %PORT%

pause
