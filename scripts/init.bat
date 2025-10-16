@echo off
REM Script de inicialización para Windows
REM Uso: scripts\init.bat

echo 🚀 Iniciando aplicación de Meditación para Expo Go
echo ==================================================
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Node.js no está instalado.
    echo    Por favor instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar si npm está instalado
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: npm no está instalado.
    echo    npm viene incluido con Node.js
    pause
    exit /b 1
)

REM Obtener versión de Node.js
for /f "tokens=2 delims=v." %%i in ('node --version') do set NODE_VERSION=%%i

REM Verificar versión de Node.js (recomendada >= 18)
if %NODE_VERSION% LSS 18 (
    echo ⚠️  Advertencia: Tu versión de Node.js es %NODE_VERSION%, se recomienda >= 18
    echo    Algunas características pueden no funcionar correctamente
    echo.
)

REM Obtener el directorio raíz del proyecto
set "SCRIPT_DIR=%~dp0"
set "PROJECT_ROOT=%SCRIPT_DIR%"
for %%i in ("%SCRIPT_DIR:~0,-8%") do set "PROJECT_ROOT=%%~dpi"

echo 📦 Verificando dependencias...
if not exist "node_modules" (
    echo 📥 Instalando dependencias por primera vez...
    npm install
    if errorlevel 1 (
        echo ❌ Error: No se pudieron instalar las dependencias
        pause
        exit /b 1
    )
) else (
    echo ✅ Dependencias ya instaladas
)

echo.
echo 🔧 Configuración de la aplicación:
echo    • Nombre: Meditación Diaria
echo    • Framework: React Native + TypeScript
echo    • Plataforma: Expo
echo    • Directorio raíz: %CD%
echo.

echo 📱 Pasos para usar con Expo Go:
echo    1. Instala la aplicación 'Expo Go' en tu dispositivo móvil
echo    2. Asegúrate de estar en la misma red WiFi que tu computadora
echo    3. Escanea el código QR que aparecerá a continuación
echo.

echo 🚀 Iniciando servidor de desarrollo...
echo    Presiona 'Ctrl+C' para detener el servidor
echo.

REM Mostrar información final
echo.
echo ✅ Configuración completa!
echo.
echo 📋 Para iniciar la aplicación manualmente:
echo    cd "%PROJECT_ROOT%"
echo    npx expo start
echo.
echo 💡 También puedes usar directamente:
echo    npm start
echo.
echo 🔗 Una vez iniciado, abre la app Expo Go en tu móvil y escanea el código QR
echo.
echo 🎉 ¡Tu aplicación de meditación está lista!
echo.

REM Preguntar si quiere iniciar ahora
set /p "choice=¿Deseas iniciar el servidor ahora? (y/n): "
if /i "%choice%"=="y" (
    echo.
    echo 🚀 Iniciando servidor...
    cd /d "%PROJECT_ROOT%"
    npx expo start --clear
) else (
    echo.
    echo ✅ Script completado. Ejecuta 'npm start' cuando estés listo.
)

pause
