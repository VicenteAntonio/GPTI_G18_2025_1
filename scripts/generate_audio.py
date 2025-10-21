"""
Script para generar las pistas de audio de meditación usando ElevenLabs
"""

from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
import os
import sys

# Agregar el directorio padre al path para importar meditation_scripts
sys.path.append(os.path.dirname(__file__))
from meditation_scripts import get_meditation_text

# Cargar variables de entorno
load_dotenv()

# Inicializar cliente de ElevenLabs
elevenlabs = ElevenLabs(
    api_key=os.getenv("ELEVENLABS_API_KEY"),
)

# Configuración de las sesiones
SESSIONS_CONFIG = [
    {
        "id": "sleep-test",
        "name": "Sueño Rápido",
        "voice_id": "JBFqnCBsd6RMkjVDRZzb",  # Voz suave y calmada
        "filename": "sleep-test.mp3"
    },
    {
        "id": "relaxation-morning",
        "name": "Relajación Matutina",
        "voice_id": "JBFqnCBsd6RMkjVDRZzb",  # Voz suave y calmada
        "filename": "relaxation-morning.mp3"
    },
    {
        "id": "selfawareness-mindful",
        "name": "Consciencia Plena",
        "voice_id": "JBFqnCBsd6RMkjVDRZzb",  # Voz suave y calmada
        "filename": "selfawareness-mindful.mp3"
    }
]

# Directorio de salida para los audios
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "assets", "audio")

def ensure_output_directory():
    """Crea el directorio de salida si no existe"""
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        print(f"✓ Directorio creado: {OUTPUT_DIR}")

def generate_audio_file(session_config):
    """Genera un archivo de audio para una sesión específica"""
    session_id = session_config["id"]
    session_name = session_config["name"]
    voice_id = session_config["voice_id"]
    filename = session_config["filename"]
    
    print(f"\n📝 Generando: {session_name} ({session_id})...")
    
    # Obtener el texto de meditación
    text = get_meditation_text(session_id)
    
    if not text:
        print(f"❌ Error: No se encontró texto para la sesión '{session_id}'")
        return False
    
    try:
        # Generar audio con ElevenLabs
        print(f"🎙️  Llamando a ElevenLabs API...")
        audio = elevenlabs.text_to_speech.convert(
            text=text,
            voice_id=voice_id,
            model_id="eleven_multilingual_v2",
            output_format="mp3_44100_128",
        )
        
        # Guardar el audio
        output_path = os.path.join(OUTPUT_DIR, filename)
        print(f"💾 Guardando audio en: {output_path}")
        
        with open(output_path, "wb") as f:
            for chunk in audio:
                f.write(chunk)
        
        print(f"✅ Completado: {session_name}")
        return True
        
    except Exception as e:
        print(f"❌ Error al generar '{session_name}': {str(e)}")
        return False

def main():
    """Función principal"""
    print("=" * 60)
    print("🎵 GENERADOR DE PISTAS DE AUDIO DE MEDITACIÓN")
    print("=" * 60)
    
    # Verificar API key
    api_key = os.getenv("ELEVENLABS_API_KEY")
    if not api_key:
        print("❌ Error: No se encontró ELEVENLABS_API_KEY en el archivo .env")
        return
    
    print(f"✓ API Key encontrada: {api_key[:10]}...")
    
    # Crear directorio de salida
    ensure_output_directory()
    
    # Generar cada audio
    successful = 0
    failed = 0
    
    for session_config in SESSIONS_CONFIG:
        if generate_audio_file(session_config):
            successful += 1
        else:
            failed += 1
    
    # Resumen final
    print("\n" + "=" * 60)
    print("📊 RESUMEN")
    print("=" * 60)
    print(f"✅ Generados exitosamente: {successful}")
    print(f"❌ Fallidos: {failed}")
    print(f"📁 Directorio de salida: {OUTPUT_DIR}")
    print("=" * 60)

if __name__ == "__main__":
    main()

