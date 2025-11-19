"""
Script de prueba para verificar que los audios generados funcionan correctamente
"""

from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
from elevenlabs import play
import os

load_dotenv()

print("🎵 Prueba de Audio de Meditación")
print("=" * 60)
print()

# Verificar que los archivos existen
audio_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "assets", "audio")
audio_files = [
    "sleep-test.mp3",
    "relaxation-morning.mp3",
    "selfawareness-mindful.mp3"
]

print("📁 Verificando archivos de audio...")
all_exist = True
for filename in audio_files:
    filepath = os.path.join(audio_dir, filename)
    if os.path.exists(filepath):
        size = os.path.getsize(filepath) / 1024  # KB
        print(f"✓ {filename} ({size:.1f} KB)")
    else:
        print(f"❌ {filename} - NO ENCONTRADO")
        all_exist = False

print()

if not all_exist:
    print("❌ Error: Algunos archivos de audio no existen")
    print("   Ejecuta: python3 scripts/generate_audio.py")
    exit(1)

print("✅ Todos los archivos de audio existen")
print()

# Preguntar si desea reproducir el audio de prueba
print("¿Deseas reproducir el audio de prueba (sleep-test.mp3)?")
print("Este es un audio corto de 7 segundos.")
response = input("Presiona ENTER para reproducir o 'n' para salir: ")

if response.lower() != 'n':
    print()
    print("🔊 Reproduciendo audio de prueba...")
    print("   (Asegúrate de tener los altavoces encendidos)")
    print()
    
    try:
        test_audio_path = os.path.join(audio_dir, "sleep-test.mp3")
        
        # Leer el archivo de audio
        with open(test_audio_path, 'rb') as audio_file:
            audio_data = audio_file.read()
        
        # Reproducir
        play(audio_data)
        
        print()
        print("✅ Audio reproducido correctamente")
        
    except Exception as e:
        print(f"❌ Error al reproducir el audio: {str(e)}")
        print("   Esto puede deberse a que no hay un dispositivo de audio disponible")
else:
    print("Test cancelado")

print()
print("=" * 60)
print("Test completado")

