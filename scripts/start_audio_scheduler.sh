#!/bin/bash

# Script para iniciar el scheduler de generación automática de audios
# El scheduler ejecutará la generación cada 24 horas y 1 minuto

echo "============================================"
echo "🎵 INICIANDO SCHEDULER DE AUDIOS"
echo "============================================"
echo ""

# Obtener directorio del proyecto
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR" || exit 1

echo "📁 Directorio: $PROJECT_DIR"
echo ""

# Verificar Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 no está instalado"
    exit 1
fi

echo "✓ Python encontrado: $(python3 --version)"

# Verificar .env
if [ ! -f ".env" ]; then
    echo "⚠️  Advertencia: No se encontró .env"
    echo "   Algunas funcionalidades pueden no funcionar correctamente"
fi

# Verificar dependencias
echo "📦 Verificando dependencias..."
pip3 install -q -r scripts/requirements.txt

if [ $? -eq 0 ]; then
    echo "✓ Dependencias instaladas"
else
    echo "❌ Error al instalar dependencias"
    exit 1
fi

echo ""
echo "============================================"
echo "⏰ CONFIGURACIÓN"
echo "============================================"
echo "• Frecuencia: Cada 24 horas y 1 minuto"
echo "• Primera ejecución: Inmediata"
echo "• Logs: logs/audio_scheduler.log"
echo ""
echo "💡 Presiona Ctrl+C para detener"
echo "============================================"
echo ""

# Iniciar el scheduler
python3 scripts/audio_scheduler.py


