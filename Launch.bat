@echo off
setlocal
cd /d "%~dp0"

set PORT=5077
set URL=http://localhost:%PORT%

:: Check if server is already running on port 5077
netstat -ano | findstr ":%PORT% " | findstr "LISTENING" >nul
if %errorlevel% neq 0 (
    echo Starting GameTracker background server...
    start "GameTracker Server" /min dotnet run --no-launch-profile
    timeout /t 3 /nobreak >nul
)

echo Launching GameTracker Desktop App...

:: 1. Try Chrome App Mode
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --app="%URL%" --window-size=1400,900
    goto end
)
if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --app="%URL%" --window-size=1400,900
    goto end
)

:: 2. Try Edge App Mode
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --app="%URL%" --window-size=1400,900
    goto end
)
if exist "C:\Program Files (x86)\Microsoft\EdgeCore\155.0.4283.62\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\EdgeCore\155.0.4283.62\msedge.exe" --app="%URL%" --window-size=1400,900
    goto end
)

:: 3. Fallback to default browser
start "" "%URL%"

:end
exit /b 0
