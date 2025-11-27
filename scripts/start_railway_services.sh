#!/bin/bash

# Script optimizado para Railway
# Solo ejecuta servicios que están dentro de este proyecto

echo "🚀 Iniciando servicios en Railway..."
echo ""

# Directorio del proyecto
PROJECT_DIR="$(cd "$(dirname "$(dirname "$0")")" && pwd)"
cd "$PROJECT_DIR" || exit 1

# Crear directorio de logs
mkdir -p logs

echo "📁 Directorio: $PROJECT_DIR"
echo ""

# Verificar Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 no encontrado"
    exit 1
fi

echo "✓ Python encontrado: $(python3 --version)"
echo ""

# Instalar dependencias Python
if [ -f "scripts/requirements.txt" ]; then
    echo "📦 Instalando dependencias Python..."
    pip3 install --no-cache-dir -q -r scripts/requirements.txt || {
        echo "⚠️  Algunas dependencias fallaron, continuando..."
    }
    echo "✓ Dependencias procesadas"
    echo ""
fi

# Función para ejecutar servicios en background
run_service() {
    local name=$1
    local command=$2
    local log_file="logs/${name}.log"
    
    echo "▶️  Iniciando $name..."
    eval "$command" > "$log_file" 2>&1 &
    local pid=$!
    echo "   PID: $pid"
    echo "   Log: $log_file"
    echo ""
    
    # Dar tiempo al servicio para iniciar
    sleep 2
    
    # Verificar si el proceso sigue corriendo
    if kill -0 $pid 2>/dev/null; then
        echo "   ✓ $name iniciado correctamente"
    else
        echo "   ⚠️  $name puede haber fallado, revisar logs"
    fi
    echo ""
}

echo "============================================"
echo "📋 SERVICIOS DISPONIBLES"
echo "============================================"
echo ""

# Iniciar Audio Scheduler (siempre disponible)
if [ -f "scripts/audio_scheduler.py" ]; then
    echo "✓ Audio Scheduler - Disponible"
    run_service "AudioScheduler" "python3 scripts/audio_scheduler.py"
else
    echo "✗ Audio Scheduler - No encontrado"
fi

echo "============================================"
echo "✅ SERVICIOS INICIADOS"
echo "============================================"
echo ""
echo "📊 Para ver logs:"
echo "   - Audio Scheduler: tail -f logs/AudioScheduler.log"
echo ""
echo "ℹ️  NOTA: Los bots de Telegram (CalmaBot y MeditaciónBot)"
echo "   deben ejecutarse por separado ya que están fuera"
echo "   de este proyecto."
echo ""
echo "💡 El scheduler generará audios cada 24h 1min"
echo ""

# Mantener el script corriendo indefinidamente
echo "⏳ Manteniendo servicios activos..."
while true; do
    sleep 60
    # Verificar que los servicios sigan corriendo
    if ! pgrep -f "audio_scheduler.py" > /dev/null; then
        echo "⚠️  [$(date)] Audio Scheduler no está corriendo, reiniciando..."
        run_service "AudioScheduler" "python3 scripts/audio_scheduler.py"
    fi
done


