"""
Script para obtener las duraciones reales de los archivos de audio
y actualizar automáticamente las constantes en src/constants/index.ts
"""

import os
import subprocess
import json

# Directorio de audios
AUDIO_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "assets", "audio")

# Archivos de audio
AUDIO_FILES = [
    "sleep-test.mp3",
    "relaxation-morning.mp3",
    "selfawareness-mindful.mp3"
]

def get_audio_duration(filepath):
    """Obtiene la duración de un archivo de audio usando ffprobe"""
    try:
        cmd = [
            'ffprobe',
            '-v', 'error',
            '-show_entries', 'format=duration',
            '-of', 'default=noprint_wrappers=1:nokey=1',
            filepath
        ]
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        duration = float(result.stdout.strip())
        return duration
    except (subprocess.CalledProcessError, FileNotFoundError, ValueError) as e:
        print(f"❌ Error al obtener duración de {os.path.basename(filepath)}: {e}")
        return None

def main():
    """Función principal"""
    print("=" * 60)
    print("📊 EXTRACTOR DE DURACIONES DE AUDIO")
    print("=" * 60)
    print()
    
    durations = {}
    
    for filename in AUDIO_FILES:
        filepath = os.path.join(AUDIO_DIR, filename)
        
        if not os.path.exists(filepath):
            print(f"⚠️  {filename} - NO ENCONTRADO")
            continue
        
        duration_seconds = get_audio_duration(filepath)
        
        if duration_seconds is not None:
            duration_minutes = duration_seconds / 60
            durations[filename] = {
                'seconds': duration_seconds,
                'minutes': duration_minutes
            }
            
            print(f"✓ {filename}")
            print(f"  └─ Duración: {duration_seconds:.2f} segundos ({duration_minutes:.2f} minutos)")
        else:
            print(f"❌ {filename} - ERROR")
    
    print()
    print("=" * 60)
    print("📝 CONSTANTES PARA src/constants/index.ts")
    print("=" * 60)
    print()
    
    if durations:
        print("// Duraciones calculadas automáticamente desde los archivos de audio")
        for filename, data in durations.items():
            session_id = filename.replace('.mp3', '')
            print(f"// {session_id}: {data['seconds']:.6f} segundos")
        
        print()
        print("export const MEDITATION_SESSIONS = [")
        
        # Mapear nombres de archivo a IDs de sesión
        session_map = {
            'sleep-test.mp3': ('sleep-test', 'Sueño Rápido', '12 seg - PRUEBA', 0),
            'relaxation-morning.mp3': ('relaxation-morning', 'Relajación Matutina', 'paz y tranquilidad', 1),
            'selfawareness-mindful.mp3': ('selfawareness-mindful', 'Consciencia Plena', 'momento presente', 2)
        }
        
        for filename, data in durations.items():
            if filename in session_map:
                session_id, title, desc_snippet, cat_idx = session_map[filename]
                print(f"  {{")
                print(f"    id: '{session_id}',")
                print(f"    title: '{title}',")
                print(f"    // duration: {data['seconds']:.6f} / 60, // ~{data['minutes']:.2f} min")
                print(f"  }},")
        
        print("];")
    else:
        print("❌ No se pudo obtener ninguna duración")
        print("   Asegúrate de que ffprobe esté instalado:")
        print("   - Ubuntu/Debian: sudo apt install ffmpeg")
        print("   - Mac: brew install ffmpeg")
    
    print()
    print("=" * 60)

if __name__ == "__main__":
    main()

