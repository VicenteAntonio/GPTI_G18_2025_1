#!/bin/bash

# Script para iniciar Expo Go - Testing en iPhone SIN cuenta de desarrollador

clear

echo "╔════════════════════════════════════════════╗"
echo "║   📱 EXPO GO - TESTING GRATUITO iOS      ║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo "Este script te permite probar tu app en iPhone"
echo "SIN necesidad de cuenta de Apple Developer ($99/año)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Verificar si Expo Go está instalado en el iPhone
echo "📋 INSTRUCCIONES:"
echo ""
echo "1️⃣  En tu iPhone:"
echo "   • Abre el App Store"
echo "   • Busca 'Expo Go'"
echo "   • Descarga e instala (es GRATIS)"
echo ""
echo "2️⃣  Cuando se inicie el servidor:"
echo "   • Abre Expo Go en tu iPhone"
echo "   • Toca 'Scan QR code'"
echo "   • Escanea el QR que aparecerá"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Ir al directorio del proyecto
cd "$(dirname "$0")/.." || exit 1

echo "📁 Directorio: $(pwd)"
echo ""

# Preguntar modo
echo "Selecciona el modo de conexión:"
echo ""
echo "1) 🔷 Normal (misma WiFi) - Recomendado"
echo "2) 🌐 Tunnel (funciona con cualquier red)"
echo "3) 📱 iOS Simulator (requiere Mac)"
echo "4) ❌ Cancelar"
echo ""

read -p "Opción [1-4]: " mode

case $mode in
    1)
        echo ""
        echo "🚀 Iniciando en modo normal..."
        echo "💡 Asegúrate de que tu iPhone y PC estén en la misma WiFi"
        echo ""
        sleep 2
        npx expo start
        ;;
    2)
        echo ""
        echo "🌐 Iniciando con tunnel..."
        echo "💡 Este modo funciona incluso con diferentes redes"
        echo "⚠️  Puede ser un poco más lento"
        echo ""
        sleep 2
        npx expo start --tunnel
        ;;
    3)
        echo ""
        echo "📱 Iniciando simulador iOS..."
        echo "⚠️  Requiere Mac con Xcode instalado"
        echo ""
        sleep 2
        npx expo start --ios
        ;;
    4)
        echo ""
        echo "❌ Cancelado"
        exit 0
        ;;
    *)
        echo ""
        echo "❌ Opción inválida"
        exit 1
        ;;
esac

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "ℹ️  Presiona Ctrl+C para detener el servidor"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"


