#!/bin/bash

# Script para verificar que la automatización está lista para usarse

echo "=========================================="
echo "🔍 VERIFICACIÓN DE AUTOMATIZACIÓN"
echo "=========================================="
echo ""

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para verificar
check_item() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
        return 0
    else
        echo -e "${RED}✗${NC} $2"
        return 1
    fi
}

# Función para advertencia
warn_item() {
    echo -e "${YELLOW}⚠${NC} $1"
}

ERRORS=0

# 1. Verificar Python
echo "📦 Verificando dependencias..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    check_item 0 "Python 3 instalado: $PYTHON_VERSION"
else
    check_item 1 "Python 3 no encontrado"
    ERRORS=$((ERRORS + 1))
fi

# 2. Verificar pip
if command -v pip3 &> /dev/null; then
    check_item 0 "pip3 disponible"
else
    check_item 1 "pip3 no encontrado"
    ERRORS=$((ERRORS + 1))
fi

# 3. Verificar dependencias Python
echo ""
echo "📚 Verificando paquetes Python..."
if pip3 show elevenlabs &> /dev/null; then
    check_item 0 "elevenlabs instalado"
else
    check_item 1 "elevenlabs no instalado"
    warn_item "Ejecuta: pip3 install -r scripts/requirements.txt"
    ERRORS=$((ERRORS + 1))
fi

if pip3 show python-dotenv &> /dev/null; then
    check_item 0 "python-dotenv instalado"
else
    check_item 1 "python-dotenv no instalado"
    warn_item "Ejecuta: pip3 install -r scripts/requirements.txt"
    ERRORS=$((ERRORS + 1))
fi

if pip3 show apscheduler &> /dev/null; then
    check_item 0 "apscheduler instalado"
else
    check_item 1 "apscheduler no instalado"
    warn_item "Ejecuta: pip3 install -r scripts/requirements.txt"
    ERRORS=$((ERRORS + 1))
fi

# 4. Verificar archivo .env
echo ""
echo "🔑 Verificando configuración..."
if [ -f "$PROJECT_DIR/.env" ]; then
    check_item 0 "Archivo .env existe"
    
    if grep -q "ELEVENLABS_API_KEY" "$PROJECT_DIR/.env"; then
        API_KEY=$(grep "ELEVENLABS_API_KEY" "$PROJECT_DIR/.env" | cut -d '=' -f 2)
        if [ -n "$API_KEY" ] && [ "$API_KEY" != "tu_api_key_aqui" ]; then
            check_item 0 "ELEVENLABS_API_KEY configurada"
        else
            check_item 1 "ELEVENLABS_API_KEY no configurada correctamente"
            warn_item "Edita .env y agrega tu API key de ElevenLabs"
            ERRORS=$((ERRORS + 1))
        fi
    else
        check_item 1 "ELEVENLABS_API_KEY no encontrada en .env"
        warn_item "Agrega: ELEVENLABS_API_KEY=tu_api_key_aqui"
        ERRORS=$((ERRORS + 1))
    fi
else
    check_item 1 "Archivo .env no existe"
    warn_item "Crea un archivo .env con: ELEVENLABS_API_KEY=tu_api_key_aqui"
    ERRORS=$((ERRORS + 1))
fi

# 5. Verificar directorios
echo ""
echo "📁 Verificando estructura de archivos..."
if [ -d "$PROJECT_DIR/assets/audio" ]; then
    check_item 0 "Directorio assets/audio existe"
else
    check_item 1 "Directorio assets/audio no existe"
    mkdir -p "$PROJECT_DIR/assets/audio"
    check_item 0 "Directorio assets/audio creado"
fi

if [ -d "$PROJECT_DIR/logs" ]; then
    check_item 0 "Directorio logs existe"
else
    mkdir -p "$PROJECT_DIR/logs"
    check_item 0 "Directorio logs creado"
fi

# 6. Verificar scripts de automatización
echo ""
echo "🤖 Verificando scripts de automatización..."
check_item $([ -f "$SCRIPT_DIR/audio_scheduler.py" ] && echo 0 || echo 1) "audio_scheduler.py existe"
check_item $([ -f "$SCRIPT_DIR/setup_cron.sh" ] && echo 0 || echo 1) "setup_cron.sh existe"
check_item $([ -f "$SCRIPT_DIR/audio_scheduler_service.sh" ] && echo 0 || echo 1) "audio_scheduler_service.sh existe"
check_item $([ -f "$SCRIPT_DIR/generate_audio.py" ] && echo 0 || echo 1) "generate_audio.py existe"

# 7. Verificar permisos de ejecución
echo ""
echo "🔐 Verificando permisos..."
check_item $([ -x "$SCRIPT_DIR/setup_cron.sh" ] && echo 0 || echo 1) "setup_cron.sh es ejecutable"
check_item $([ -x "$SCRIPT_DIR/audio_scheduler_service.sh" ] && echo 0 || echo 1) "audio_scheduler_service.sh es ejecutable"

# Resumen
echo ""
echo "=========================================="
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ TODO LISTO${NC}"
    echo "=========================================="
    echo ""
    echo "Tu sistema está configurado correctamente."
    echo ""
    echo "🚀 Próximos pasos:"
    echo ""
    echo "1. Iniciar el scheduler:"
    echo "   npm run audio:schedule"
    echo ""
    echo "2. O configurar cron job:"
    echo "   npm run audio:setup-cron"
    echo ""
    echo "3. O configurar servicio systemd (Linux):"
    echo "   npm run audio:setup-service"
    echo ""
else
    echo -e "${RED}❌ HAY $ERRORS PROBLEMA(S)${NC}"
    echo "=========================================="
    echo ""
    echo "Por favor, corrige los problemas mencionados arriba."
    echo ""
    echo "📚 Documentación:"
    echo "   • README_AUTOMATION.md"
    echo "   • docs/QUICK_START_AUTOMATION.md"
    echo "   • docs/AUDIO_AUTOMATION.md"
    echo ""
fi

echo "=========================================="



