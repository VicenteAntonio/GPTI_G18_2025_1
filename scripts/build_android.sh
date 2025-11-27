#!/bin/bash

# Script helper para builds de Android

clear

echo "╔════════════════════════════════════════════╗"
echo "║   🤖 BUILD APK ANDROID - Helper           ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Ir al directorio del proyecto
cd "$(dirname "$(dirname "$0")")" || exit 1

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Proyecto:${NC} $(pwd)"
echo ""

# Verificar que EAS CLI esté instalado
if ! command -v eas &> /dev/null; then
    echo -e "${YELLOW}⚠️  EAS CLI no está instalado${NC}"
    echo "Instalando EAS CLI..."
    npm install -g eas-cli
    echo -e "${GREEN}✓ EAS CLI instalado${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Selecciona el tipo de build:"
echo ""
echo "1) 📦 APK (Para instalar directamente)"
echo "   → Descargable e instalable"
echo "   → Puedes compartir con usuarios"
echo "   → No requiere Play Store"
echo ""
echo "2) 📦 AAB (Para Google Play Store)"
echo "   → Optimizado para Play Store"
echo "   → Menor tamaño"
echo "   → Solo para publicar en tienda"
echo ""
echo "3) 📊 Ver builds anteriores"
echo "4) 🔐 Configurar credenciales"
echo "5) ❌ Salir"
echo ""

read -p "Selecciona una opción [1-5]: " choice

case $choice in
    1)
        echo ""
        echo -e "${BLUE}📦 Iniciando build de APK...${NC}"
        echo ""
        echo "Este build generará un APK que puedes:"
        echo "  • Instalar directamente en Android"
        echo "  • Compartir con usuarios"
        echo "  • Distribuir sin Play Store"
        echo ""
        echo "⏱️  Tiempo estimado: 10-15 minutos"
        echo ""
        read -p "¿Continuar? [S/n]: " confirm
        
        if [[ ! $confirm =~ ^[Nn]$ ]]; then
            echo ""
            echo -e "${GREEN}🚀 Iniciando build...${NC}"
            npx eas build --platform android --profile preview
        else
            echo "Cancelado"
            exit 0
        fi
        ;;
    2)
        echo ""
        echo -e "${BLUE}📦 Iniciando build de AAB (Play Store)...${NC}"
        echo ""
        echo "Este build generará un AAB para:"
        echo "  • Publicar en Google Play Store"
        echo "  • Tamaño optimizado"
        echo "  • No instalable directamente"
        echo ""
        echo "⏱️  Tiempo estimado: 10-15 minutos"
        echo ""
        read -p "¿Continuar? [S/n]: " confirm
        
        if [[ ! $confirm =~ ^[Nn]$ ]]; then
            echo ""
            echo -e "${GREEN}🚀 Iniciando build...${NC}"
            npx eas build --platform android --profile production
            
            echo ""
            read -p "¿Quieres hacer submit a Play Store? [s/N]: " submit
            
            if [[ $submit =~ ^[Ss]$ ]]; then
                echo ""
                echo -e "${BLUE}📤 Submitting a Play Store...${NC}"
                npx eas submit --platform android
            fi
        else
            echo "Cancelado"
            exit 0
        fi
        ;;
    3)
        echo ""
        echo -e "${BLUE}📊 Builds anteriores:${NC}"
        echo ""
        npx eas build:list --platform android
        ;;
    4)
        echo ""
        echo -e "${BLUE}🔐 Configurando credenciales...${NC}"
        echo ""
        npx eas credentials
        ;;
    5)
        echo "Saliendo..."
        exit 0
        ;;
    *)
        echo -e "${RED}❌ Opción inválida${NC}"
        exit 1
        ;;
esac

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Proceso completado${NC}"
echo ""
echo "📝 Próximos pasos:"
echo "   1. El build estará listo en ~15 minutos"
echo "   2. Recibirás un link para descargar"
echo "   3. Descarga el APK"
echo "   4. Instala en tu Android"
echo ""
echo "💡 Ver estado: npx eas build:list"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"


