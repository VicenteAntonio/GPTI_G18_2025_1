#!/bin/bash

# Script para regenerar las pistas de audio de meditación
# Uso: ./scripts/regenerate_audio.sh

set -e  # Salir si hay algún error

echo "🎵 Regenerador de Pistas de Audio de Meditación"
echo "================================================"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Este script debe ejecutarse desde la raíz del proyecto"
    exit 1
fi

# Verificar que Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 no está instalado"
    echo "   Instala Python 3.7+ para continuar"
    exit 1
fi

echo "✓ Python encontrado: $(python3 --version)"
echo ""

# Verificar que el archivo .env existe
if [ ! -f ".env" ]; then
    echo "⚠️  Advertencia: No se encontró el archivo .env"
    echo "   Creando .env desde .env.example..."
    
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "   ⚠️  IMPORTANTE: Edita .env y agrega tu API key de ElevenLabs"
        exit 1
    else
        echo "❌ Error: No se encontró .env.example"
        exit 1
    fi
fi

echo "✓ Archivo .env encontrado"
echo ""

# Instalar dependencias de Python
echo "📦 Instalando dependencias de Python..."
pip3 install -q -r scripts/requirements.txt

if [ $? -eq 0 ]; then
    echo "✓ Dependencias instaladas"
else
    echo "❌ Error al instalar dependencias"
    exit 1
fi

echo ""

# Crear directorio de audio si no existe
mkdir -p assets/audio

# Generar los audios
echo "🎙️  Generando pistas de audio..."
echo ""
python3 scripts/generate_audio.py

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ¡Pistas de audio generadas exitosamente!"
    echo "📁 Los archivos están en: assets/audio/"
    echo ""
    ls -lh assets/audio/
else
    echo "❌ Error al generar las pistas de audio"
    exit 1
fi

