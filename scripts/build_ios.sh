#!/bin/bash

# Script helper para builds de iOS con EAS

echo "============================================"
echo "📱 BUILD iOS - Helper Script"
echo "============================================"
echo ""

# Ir al directorio del proyecto
cd "$(dirname "$(dirname "$0")")" || exit 1

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Proyecto:${NC} $(pwd)"
echo ""

# Verificar que EAS CLI esté instalado
if ! command -v eas &> /dev/null; then
    echo -e "${YELLOW}⚠️  EAS CLI no está instalado${NC}"
    echo "Instalando EAS CLI..."
    npm install -g eas-cli
fi

echo -e "${GREEN}✓ EAS CLI instalado${NC}"
echo ""

# Menú
echo "Selecciona el tipo de build:"
echo ""
echo "1) 🧪 Preview/Testing (para probar en tu iPhone)"
echo "2) 🚀 Production (para App Store)"
echo "3) 📱 Development (con código nativo personalizado)"
echo "4) 📊 Ver builds anteriores"
echo "5) 🔐 Configurar credenciales"
echo "6) ❌ Salir"
echo ""

read -p "Selecciona una opción [1-6]: " choice

case $choice in
    1)
        echo ""
        echo -e "${BLUE}🧪 Iniciando build de Preview...${NC}"
        echo ""
        npx eas build --platform ios --profile preview
        ;;
    2)
        echo ""
        echo -e "${BLUE}🚀 Iniciando build de Producción...${NC}"
        echo ""
        read -p "¿También quieres hacer submit a App Store después? [s/N]: " submit
        
        npx eas build --platform ios --profile production
        
        if [[ $submit =~ ^[Ss]$ ]]; then
            echo ""
            echo -e "${BLUE}📤 Submitting a App Store...${NC}"
            npx eas submit --platform ios
        fi
        ;;
    3)
        echo ""
        echo -e "${BLUE}📱 Iniciando build de Development...${NC}"
        echo ""
        npx eas build --platform ios --profile development
        ;;
    4)
        echo ""
        echo -e "${BLUE}📊 Builds anteriores:${NC}"
        echo ""
        npx eas build:list --platform ios
        ;;
    5)
        echo ""
        echo -e "${BLUE}🔐 Configurando credenciales...${NC}"
        echo ""
        npx eas credentials
        ;;
    6)
        echo "Saliendo..."
        exit 0
        ;;
    *)
        echo -e "${YELLOW}❌ Opción inválida${NC}"
        exit 1
        ;;
esac

echo ""
echo "============================================"
echo -e "${GREEN}✅ Proceso completado${NC}"
echo "============================================"

