#!/bin/bash

# Script para crear un servicio systemd que ejecuta el scheduler automáticamente
# Solo para sistemas Linux con systemd

echo "=========================================="
echo "🚀 CONFIGURACIÓN DE SERVICIO SYSTEMD"
echo "=========================================="
echo ""

# Verificar que estamos en Linux con systemd
if ! command -v systemctl &> /dev/null; then
    echo "❌ Error: systemd no está disponible en este sistema"
    echo "Esta opción solo funciona en Linux con systemd"
    echo "Usa el scheduler de Python o cron job en su lugar"
    exit 1
fi

# Verificar permisos
if [ "$EUID" -eq 0 ]; then
    echo "⚠️  Este script no debe ejecutarse como root"
    echo "Se te pedirán permisos de sudo cuando sea necesario"
    exit 1
fi

# Obtener rutas absolutas
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "📁 Directorio del proyecto: $PROJECT_DIR"
echo ""

# Verificar Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 no está instalado"
    exit 1
fi

PYTHON_PATH=$(which python3)
echo "✓ Python encontrado: $PYTHON_PATH"

# Obtener el usuario actual
CURRENT_USER=$(whoami)
echo "✓ Usuario actual: $CURRENT_USER"
echo ""

# Crear archivo de servicio
SERVICE_NAME="audio-scheduler"
SERVICE_FILE="/tmp/${SERVICE_NAME}.service"

cat > "$SERVICE_FILE" << EOL
[Unit]
Description=Scheduler de Generación Automática de Audios de Meditación
After=network.target

[Service]
Type=simple
User=$CURRENT_USER
WorkingDirectory=$PROJECT_DIR
Environment="PATH=$PATH"
ExecStart=$PYTHON_PATH $SCRIPT_DIR/audio_scheduler.py
Restart=on-failure
RestartSec=60
StandardOutput=append:$PROJECT_DIR/logs/scheduler_service.log
StandardError=append:$PROJECT_DIR/logs/scheduler_service_error.log

[Install]
WantedBy=multi-user.target
EOL

echo "✓ Archivo de servicio creado: $SERVICE_FILE"
echo ""

# Mostrar el contenido del servicio
echo "=========================================="
echo "📄 CONTENIDO DEL SERVICIO"
echo "=========================================="
cat "$SERVICE_FILE"
echo ""

# Confirmar instalación
echo "=========================================="
echo "⚠️  INSTALACIÓN"
echo "=========================================="
echo ""
echo "Este script instalará el servicio systemd que:"
echo "  • Se ejecutará automáticamente al iniciar el sistema"
echo "  • Generará audios cada 24 horas"
echo "  • Se reiniciará automáticamente si falla"
echo ""
read -p "¿Deseas continuar? [s/N]: " confirm

if [[ ! $confirm =~ ^[Ss]$ ]]; then
    echo "❌ Operación cancelada"
    rm "$SERVICE_FILE"
    exit 0
fi

# Crear directorio de logs
mkdir -p "$PROJECT_DIR/logs"

# Copiar el archivo de servicio
sudo cp "$SERVICE_FILE" "/etc/systemd/system/${SERVICE_NAME}.service"
rm "$SERVICE_FILE"

echo "✓ Servicio instalado en /etc/systemd/system/${SERVICE_NAME}.service"

# Recargar systemd
sudo systemctl daemon-reload
echo "✓ Systemd recargado"

# Habilitar el servicio
sudo systemctl enable "$SERVICE_NAME"
echo "✓ Servicio habilitado para inicio automático"

# Iniciar el servicio
sudo systemctl start "$SERVICE_NAME"
echo "✓ Servicio iniciado"
echo ""

# Verificar estado
echo "=========================================="
echo "📊 ESTADO DEL SERVICIO"
echo "=========================================="
sudo systemctl status "$SERVICE_NAME" --no-pager
echo ""

# Instrucciones
echo "=========================================="
echo "✅ INSTALACIÓN COMPLETADA"
echo "=========================================="
echo ""
echo "🔧 Comandos útiles:"
echo "   • Ver estado:          sudo systemctl status $SERVICE_NAME"
echo "   • Detener servicio:    sudo systemctl stop $SERVICE_NAME"
echo "   • Iniciar servicio:    sudo systemctl start $SERVICE_NAME"
echo "   • Reiniciar servicio:  sudo systemctl restart $SERVICE_NAME"
echo "   • Ver logs:            sudo journalctl -u $SERVICE_NAME -f"
echo "   • Deshabilitar:        sudo systemctl disable $SERVICE_NAME"
echo ""
echo "📝 Logs guardados en:"
echo "   • $PROJECT_DIR/logs/scheduler_service.log"
echo "   • $PROJECT_DIR/logs/scheduler_service_error.log"
echo ""
echo "=========================================="


