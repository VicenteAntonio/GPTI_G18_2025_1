#!/bin/bash

# Script para configurar un cron job que genera audios automáticamente cada 24 horas
# Compatible con Linux y macOS

echo "=========================================="
echo "⏰ CONFIGURACIÓN DE CRON JOB"
echo "=========================================="
echo ""

# Obtener la ruta absoluta del proyecto
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "📁 Directorio del proyecto: $PROJECT_DIR"
echo ""

# Verificar que Python esté instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 no está instalado"
    echo "Por favor, instala Python 3 primero"
    exit 1
fi

echo "✓ Python 3 encontrado: $(python3 --version)"

# Verificar que el archivo .env existe
if [ ! -f "$PROJECT_DIR/.env" ]; then
    echo "⚠️  Advertencia: No se encontró el archivo .env"
    echo "Asegúrate de configurar ELEVENLABS_API_KEY en .env antes de ejecutar"
fi

# Crear directorio de logs si no existe
LOG_DIR="$PROJECT_DIR/logs"
mkdir -p "$LOG_DIR"
echo "✓ Directorio de logs: $LOG_DIR"

# Crear script de ejecución
RUNNER_SCRIPT="$SCRIPT_DIR/run_audio_generation.sh"

cat > "$RUNNER_SCRIPT" << EOL
#!/bin/bash

# Script de ejecución para el generador de audios
# Este script es llamado por cron

# Ir al directorio del proyecto
cd "$PROJECT_DIR" || exit 1

# Cargar variables de entorno
export \$(grep -v '^#' .env | xargs)

# Ejecutar el generador
python3 "$SCRIPT_DIR/generate_audio.py" >> "$LOG_DIR/cron_audio_generation.log" 2>&1

# Registrar la ejecución
echo "Ejecución completada: \$(date)" >> "$LOG_DIR/cron_executions.log"
EOL

chmod +x "$RUNNER_SCRIPT"
echo "✓ Script de ejecución creado: $RUNNER_SCRIPT"
echo ""

# Crear el cron job
echo "=========================================="
echo "🔧 CONFIGURACIÓN DEL CRON JOB"
echo "=========================================="
echo ""
echo "Elige la hora de ejecución diaria:"
echo "1) 03:00 AM (recomendado - baja carga)"
echo "2) 12:00 PM (mediodía)"
echo "3) 00:00 AM (medianoche)"
echo "4) Personalizado"
echo ""

read -p "Selecciona una opción [1-4]: " choice

case $choice in
    1)
        CRON_TIME="0 3 * * *"
        TIME_DESC="3:00 AM"
        ;;
    2)
        CRON_TIME="0 12 * * *"
        TIME_DESC="12:00 PM"
        ;;
    3)
        CRON_TIME="0 0 * * *"
        TIME_DESC="12:00 AM"
        ;;
    4)
        read -p "Ingresa la hora (0-23): " hour
        read -p "Ingresa los minutos (0-59): " minute
        CRON_TIME="$minute $hour * * *"
        TIME_DESC="$hour:$minute"
        ;;
    *)
        echo "❌ Opción inválida"
        exit 1
        ;;
esac

echo ""
echo "⏰ Se ejecutará todos los días a las $TIME_DESC"
echo ""

# Agregar el cron job
CRON_JOB="$CRON_TIME $RUNNER_SCRIPT"
CRON_COMMENT="# Generación automática de audios de meditación"

# Verificar si ya existe un cron job similar
if crontab -l 2>/dev/null | grep -q "run_audio_generation.sh"; then
    echo "⚠️  Ya existe un cron job para la generación de audios"
    read -p "¿Deseas reemplazarlo? [s/N]: " replace
    
    if [[ $replace =~ ^[Ss]$ ]]; then
        # Eliminar el cron job existente
        crontab -l 2>/dev/null | grep -v "run_audio_generation.sh" | crontab -
        echo "✓ Cron job anterior eliminado"
    else
        echo "❌ Operación cancelada"
        exit 0
    fi
fi

# Agregar el nuevo cron job
(crontab -l 2>/dev/null; echo ""; echo "$CRON_COMMENT"; echo "$CRON_JOB") | crontab -

echo "✓ Cron job configurado exitosamente"
echo ""

# Mostrar los cron jobs actuales
echo "=========================================="
echo "📋 CRON JOBS ACTUALES"
echo "=========================================="
crontab -l
echo ""

# Instrucciones finales
echo "=========================================="
echo "✅ CONFIGURACIÓN COMPLETADA"
echo "=========================================="
echo ""
echo "📝 Información:"
echo "   • El generador se ejecutará automáticamente cada día a las $TIME_DESC"
echo "   • Los logs se guardarán en: $LOG_DIR"
echo "   • Para ver los logs: tail -f $LOG_DIR/cron_audio_generation.log"
echo ""
echo "🔧 Comandos útiles:"
echo "   • Ver cron jobs:     crontab -l"
echo "   • Editar cron jobs:  crontab -e"
echo "   • Eliminar cron job: crontab -e (y eliminar la línea manualmente)"
echo ""
echo "💡 Nota: Asegúrate de tener configurado ELEVENLABS_API_KEY en .env"
echo ""
echo "=========================================="

