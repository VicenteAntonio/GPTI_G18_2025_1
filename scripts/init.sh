
#!/bin/bash

# Script de inicialización para la aplicación de Meditación
# Uso: ./scripts/init.sh

echo "🚀 Iniciando aplicación de Meditación para Expo Go"
echo "=================================================="

# Función para verificar si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar si Node.js está instalado
if ! command_exists node; then
    echo "❌ Error: Node.js no está instalado."
    echo "   Por favor instala Node.js desde https://nodejs.org/"
    exit 1
fi

# Verificar si npm está instalado
if ! command_exists npm; then
    echo "❌ Error: npm no está instalado."
    echo "   npm viene incluido con Node.js"
    exit 1
fi

# Verificar versión de Node.js (recomendada >= 18)
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Advertencia: Tu versión de Node.js es $NODE_VERSION, se recomienda >= 18"
    echo "   Algunas características pueden no funcionar correctamente"
fi

# Obtener el directorio raíz del proyecto
SCRIPT_DIR="$(dirname "$0")"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Cambiar al directorio raíz
cd "$PROJECT_ROOT"

echo "📦 Verificando dependencias..."
if [ ! -d "node_modules" ]; then
    echo "📥 Instalando dependencias por primera vez..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Error: No se pudieron instalar las dependencias"
        exit 1
    fi
else
    echo "✅ Dependencias ya instaladas"
fi

echo ""
echo "🔧 Configuración de la aplicación:"
echo "   • Nombre: Meditación Diaria"
echo "   • Framework: React Native + TypeScript"
echo "   • Plataforma: Expo"
echo "   • Directorio raíz: $(pwd)"
echo ""

echo "📱 Pasos para usar con Expo Go:"
echo "   1. Instala la aplicación 'Expo Go' en tu dispositivo móvil"
echo "   2. Asegúrate de estar en la misma red WiFi que tu computadora"
echo "   3. Escanea el código QR que aparecerá a continuación"
echo ""

echo "🚀 Iniciando servidor de desarrollo..."
echo "   Presiona 'Ctrl+C' para detener el servidor"
echo ""

# Iniciar el servidor de Expo desde el directorio raíz
echo ""
echo "✅ Configuración completa!"
echo ""
echo "📋 Para iniciar la aplicación manualmente:"
echo "   cd \"$PROJECT_ROOT\""
echo "   npx expo start"
echo ""
echo "💡 También puedes usar directamente:"
echo "   npm start"
echo ""
echo "🔗 Una vez iniciado, abre la app Expo Go en tu móvil y escanea el código QR"
echo ""
echo "🎉 ¡Tu aplicación de meditación está lista!"
echo ""

# Preguntar si quiere iniciar ahora
read -p "¿Deseas iniciar el servidor ahora? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Iniciando servidor..."
    cd "$PROJECT_ROOT"
    npx expo start --clear
else
    echo "✅ Script completado. Ejecuta 'npm start' cuando estés listo."
fi
