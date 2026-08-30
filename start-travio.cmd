@echo off
setlocal
set "TRAVIO_NODE=C:\Users\HP\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"

if not exist "%TRAVIO_NODE%" (
  echo Node.js was not found. Install Node.js LTS from https://nodejs.org, then run: npm run dev
  pause
  exit /b 1
)

start "Travio API" /B "%TRAVIO_NODE%" "%~dp0server\index.js"
start "Travio Website" /B "%TRAVIO_NODE%" "%~dp0client\node_modules\vite\bin\vite.js" --host 127.0.0.1

echo Travio is starting. Open http://localhost:5173 in your browser.
echo Keep the two Travio command windows open while you use the site.
pause
