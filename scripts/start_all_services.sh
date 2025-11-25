#!/bin/bash

# Script para iniciar todos los servicios en un servidor
# Usado para despliegue en Railway, Render, Heroku, etc.

echo "🚀 Iniciando todos los servicios..."
echo ""

# Directorio del proyecto
PROJECT_DIR="$(cd "$(dirname "$(dirname "$0")")" && pwd)"
cd "$PROJECT_DIR" || exit 1

# Crear directorio de logs
mkdir -p logs

# Función para ejecutar servicios en background
run_service() {
    local name=$1
    local command=$2
    local log_file="logs/${name}.log"
    
    echo "▶️  Iniciando $name..."
    eval "$command" > "$log_file" 2>&1 &
    echo "   PID: $!"
    echo "   Log: $log_file"
    echo ""
}

# Instalar dependencias Python si es necesario
if [ -f "scripts/requirements.txt" ]; then
    echo "📦 Instalando dependencias Python..."
    pip3 install -q -r scripts/requirements.txt
    echo "✓ Dependencias instaladas"
    echo ""
fi

# Iniciar CalmTalk Bot
if [ -f "../Bot_texto/calmbotpy.py" ]; then
    run_service "CalmaBot" "cd ../Bot_texto && python3 calmbotpy.py"
fi

# Iniciar Bot de Meditación
if [ -f "../Bot_audio/bot.py" ] && [ -f "../Bot_audio/.env" ]; then
    run_service "BotMeditacion" "cd ../Bot_audio && python3 bot.py"
fi

# Iniciar Audio Scheduler
if [ -f "scripts/audio_scheduler.py" ]; then
    run_service "AudioScheduler" "python3 scripts/audio_scheduler.py"
fi

echo "============================================"
echo "✅ TODOS LOS SERVICIOS INICIADOS"
echo "============================================"
echo ""
echo "📊 Ver logs:"
echo "   tail -f logs/CalmaBot.log"
echo "   tail -f logs/BotMeditacion.log"
echo "   tail -f logs/AudioScheduler.log"
echo ""
echo "💡 Presiona Ctrl+C para detener todos los servicios"
echo ""

# Mantener el script corriendo
wait

