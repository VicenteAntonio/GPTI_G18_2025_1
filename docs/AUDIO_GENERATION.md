# 🎵 Generación de Audio con ElevenLabs - Guía Completa

## Descripción General

Este proyecto utiliza **ElevenLabs AI** para generar pistas de audio de meditación guiada de alta calidad en español. Las voces generadas son naturales y calmas, perfectas para sesiones de meditación.

## 📊 Pistas de Audio Disponibles

| Sesión | Archivo | Duración | Tamaño | Descripción |
|--------|---------|----------|--------|-------------|
| Sueño Rápido | `sleep-test.mp3` | ~12 seg | ~185 KB | Sesión de prueba corta |
| Relajación Matutina | `relaxation-morning.mp3` | ~1.6 min | ~1.5 MB | Meditación para empezar el día |
| Consciencia Plena | `selfawareness-mindful.mp3` | ~1.9 min | ~1.8 MB | Práctica de mindfulness |

## 🚀 Inicio Rápido

### Opción 1: Script Automatizado (Recomendado)

```bash
npm run regenerate-audio
```

Este comando ejecuta todo el proceso automáticamente:
1. Verifica que Python esté instalado
2. Instala las dependencias necesarias
3. Verifica el archivo `.env`
4. Genera las 3 pistas de audio
5. Muestra un resumen de los archivos creados

### Opción 2: Paso a Paso

```bash
# 1. Instalar dependencias de Python
pip3 install -r scripts/requirements.txt

# 2. Configurar la API key (solo la primera vez)
echo "ELEVENLABS_API_KEY=tu_api_key_aqui" > .env

# 3. Generar los audios
npm run generate-audio

# 4. Verificar que se generaron correctamente
npm run test-audio
```

## 🔑 Configuración de la API Key

### Obtener una API Key de ElevenLabs

1. Ve a [ElevenLabs](https://elevenlabs.io/)
2. Crea una cuenta o inicia sesión
3. Ve a tu [Dashboard](https://elevenlabs.io/app)
4. Navega a **Settings** → **API Keys**
5. Copia tu API key

### Configurar la API Key

Crea un archivo `.env` en la raíz del proyecto:

```bash
ELEVENLABS_API_KEY=sk_tu_api_key_aqui_muy_larga
```

⚠️ **Importante**: El archivo `.env` está en `.gitignore` y no se subirá al repositorio por seguridad.

## 📝 Estructura de los Scripts

### `scripts/meditation_scripts.py`

Contiene los textos de meditación guiada para cada sesión. Estructura:

```python
MEDITATION_TEXTS = {
    "sleep-test": "Texto corto de prueba...",
    "relaxation-morning": "Texto completo de relajación...",
    "selfawareness-mindful": "Texto completo de consciencia..."
}
```

**Personalización**: Edita este archivo para cambiar los textos de las meditaciones.

### `scripts/generate_audio.py`

Script principal que:
1. Carga la API key desde `.env`
2. Lee los textos de `meditation_scripts.py`
3. Llama a la API de ElevenLabs
4. Guarda los archivos MP3 en `assets/audio/`

**Configuración disponible**:

```python
# Voz utilizada (calmada y suave)
voice_id="JBFqnCBsd6RMkjVDRZzb"

# Modelo multilingüe (soporta español)
model_id="eleven_multilingual_v2"

# Formato de salida
output_format="mp3_44100_128"  # MP3, 44.1kHz, 128kbps
```

### `scripts/test_audio.py`

Script de prueba que:
1. Verifica que todos los archivos de audio existen
2. Muestra el tamaño de cada archivo
3. Opcionalmente reproduce el audio de prueba

```bash
npm run test-audio
```

### `scripts/regenerate_audio.sh`

Script bash completo que:
1. Verifica requisitos (Python, .env)
2. Instala dependencias automáticamente
3. Genera todos los audios
4. Muestra estadísticas de los archivos generados

```bash
npm run regenerate-audio
# o directamente:
./scripts/regenerate_audio.sh
```

## 🎙️ Configuración de Voces

### Voces Disponibles

ElevenLabs ofrece múltiples voces. La voz actual es ideal para meditación, pero puedes cambiarla.

**Para ver todas las voces disponibles**:

```python
from elevenlabs.client import ElevenLabs
import os
from dotenv import load_dotenv

load_dotenv()
client = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))

voices = client.voices.get_all()
for voice in voices.voices:
    print(f"{voice.name}: {voice.voice_id}")
```

### Cambiar de Voz

Edita `scripts/generate_audio.py` y modifica el `voice_id` en `SESSIONS_CONFIG`:

```python
SESSIONS_CONFIG = [
    {
        "id": "sleep-test",
        "voice_id": "NUEVO_VOICE_ID_AQUI",  # Cambia aquí
        ...
    }
]
```

### Usar Diferentes Voces por Sesión

Puedes usar una voz diferente para cada tipo de meditación:

```python
SESSIONS_CONFIG = [
    {
        "id": "sleep-test",
        "voice_id": "JBFqnCBsd6RMkjVDRZzb",  # Voz suave
        ...
    },
    {
        "id": "relaxation-morning",
        "voice_id": "otro_voice_id",  # Voz energética
        ...
    }
]
```

## 🎛️ Configuración Avanzada

### Cambiar el Formato de Audio

Edita `generate_audio.py` y modifica `output_format`:

```python
# Opciones disponibles:
output_format="mp3_44100_128"   # Actual (balance calidad/tamaño)
output_format="mp3_44100_64"    # Menor calidad, menor tamaño
output_format="mp3_44100_192"   # Mayor calidad, mayor tamaño
output_format="pcm_16000"       # PCM sin comprimir
output_format="ulaw_8000"       # Telefonía
```

### Cambiar el Modelo de Voz

```python
# Modelos disponibles:
model_id="eleven_multilingual_v2"  # Actual (español + 28 idiomas)
model_id="eleven_turbo_v2"         # Más rápido, menos natural
model_id="eleven_monolingual_v1"   # Solo inglés
```

### Agregar Nuevas Sesiones

1. **Agrega el texto** en `meditation_scripts.py`:

```python
MEDITATION_TEXTS = {
    # ... textos existentes ...
    "nueva-sesion": """
        Tu nuevo texto de meditación aquí...
    """
}
```

2. **Agrega la configuración** en `generate_audio.py`:

```python
SESSIONS_CONFIG = [
    # ... configuraciones existentes ...
    {
        "id": "nueva-sesion",
        "name": "Nueva Sesión",
        "voice_id": "JBFqnCBsd6RMkjVDRZzb",
        "filename": "nueva-sesion.mp3"
    }
]
```

3. **Regenera los audios**:

```bash
npm run generate-audio
```

## 💰 Costos y Límites

### Plan Gratuito de ElevenLabs

- **10,000 caracteres/mes** gratis
- Perfecto para generar las 3 sesiones iniciales
- Cada sesión de 10 minutos ≈ 2,000-3,000 caracteres

### Estimación de Uso

| Sesión | Caracteres Aprox. | % del Plan Gratuito |
|--------|-------------------|---------------------|
| Sueño Rápido | ~200 | 2% |
| Relajación Matutina | ~2,500 | 25% |
| Consciencia Plena | ~2,800 | 28% |
| **TOTAL** | **~5,500** | **~55%** |

💡 **Tip**: Con el plan gratuito puedes regenerar los audios aproximadamente 1-2 veces al mes.

### Planes de Pago

Si necesitas generar más audios:
- **Starter**: $5/mes - 30,000 caracteres
- **Creator**: $22/mes - 100,000 caracteres
- **Pro**: $99/mes - 500,000 caracteres

Ver precios actualizados en [elevenlabs.io/pricing](https://elevenlabs.io/pricing)

## 🔧 Solución de Problemas

### Error: "No module named 'elevenlabs'"

```bash
pip3 install elevenlabs python-dotenv
```

### Error: "No se encontró ELEVENLABS_API_KEY"

1. Verifica que existe el archivo `.env` en la raíz del proyecto
2. Verifica que contiene `ELEVENLABS_API_KEY=...`
3. Verifica que no hay espacios extras

```bash
# Ver el contenido del .env
cat .env
```

### Error: "Unauthorized" o "Invalid API Key"

1. Verifica que la API key es correcta
2. Verifica que tu cuenta de ElevenLabs está activa
3. Verifica que tienes créditos disponibles

```bash
# Probar manualmente
python3 -c "
from elevenlabs.client import ElevenLabs
from dotenv import load_dotenv
import os
load_dotenv()
client = ElevenLabs(api_key=os.getenv('ELEVENLABS_API_KEY'))
print('✓ API Key válida')
"
```

### Los archivos no se generan

1. Verifica que existe el directorio `assets/audio/`:
```bash
mkdir -p assets/audio
```

2. Verifica permisos de escritura:
```bash
ls -ld assets/audio/
```

3. Ejecuta el script con más información de debug:
```bash
python3 scripts/generate_audio.py
```

### Error: "Rate limit exceeded"

Has excedido el límite de solicitudes por minuto. Espera 1-2 minutos y vuelve a intentar.

### El audio se reproduce muy rápido o muy lento

Verifica el formato de salida. El formato recomendado es `mp3_44100_128`:
- 44100 Hz es la frecuencia de muestreo estándar
- 128 kbps es una buena calidad para voz

## 📊 Estadísticas de los Archivos Generados

Ver estadísticas de los archivos:

```bash
ls -lh assets/audio/
```

Ver duración de los archivos (requiere `ffmpeg`):

```bash
# Instalar ffmpeg si no lo tienes
# Ubuntu/Debian: sudo apt install ffmpeg
# Mac: brew install ffmpeg

# Ver duración
for file in assets/audio/*.mp3; do
    echo "$(basename $file): $(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 $file | awk '{print int($1/60)":"int($1%60)}')"
done
```

## 🎯 Mejores Prácticas

### 1. Versión de Control de los Textos

Los textos de meditación están en `scripts/meditation_scripts.py`, que SÍ se sube al repositorio. Esto permite:
- Versionamiento de los textos
- Colaboración en la escritura
- Historial de cambios

### 2. NO Subir los Archivos de Audio

Los archivos `.mp3` en `assets/audio/` NO deben subirse al repositorio porque:
- Son archivos binarios grandes
- Se pueden regenerar fácilmente
- Cada desarrollador puede usar su propia API key

El `.gitignore` ya incluye `assets/audio/`.

### 3. Documentar Cambios de Voz

Si cambias la voz, documenta el `voice_id` en los comentarios:

```python
# Voz: "Aria" - Femenina, calmada, perfecta para meditación
voice_id="JBFqnCBsd6RMkjVDRZzb"
```

### 4. Probar Antes de Comprometer

Antes de compartir cambios en los textos:

1. Genera los audios localmente
2. Prueba que se escuchan bien
3. Verifica la duración esperada
4. Commit los cambios en `meditation_scripts.py`

## 📚 Recursos Adicionales

### Documentación de ElevenLabs

- [Documentación oficial](https://elevenlabs.io/docs)
- [API Reference](https://elevenlabs.io/docs/api-reference)
- [Python SDK](https://github.com/elevenlabs/elevenlabs-python)
- [Playground](https://elevenlabs.io/app/speech-synthesis) - Probar voces

### Ejemplos de Uso

Ver ejemplos completos en:
- `scripts/generate_audio.py` - Generación de audio
- `scripts/test_audio.py` - Prueba y reproducción
- `scripts/meditation_scripts.py` - Textos de meditación

## 🤝 Contribuir

### Agregar Nuevos Textos de Meditación

1. Fork el repositorio
2. Edita `scripts/meditation_scripts.py`
3. Agrega tu nuevo texto en `MEDITATION_TEXTS`
4. Actualiza `SESSIONS_CONFIG` en `generate_audio.py`
5. Genera y prueba el audio localmente
6. Commit solo los archivos `.py`, NO los `.mp3`
7. Crea un Pull Request

### Mejorar la Calidad del Audio

1. Experimenta con diferentes voces
2. Ajusta los parámetros de generación
3. Documenta tus hallazgos
4. Comparte los mejores `voice_id` encontrados

## 📝 Licencia

Los scripts de generación de audio son parte del proyecto de meditación y siguen la misma licencia que el proyecto principal.

**Nota sobre ElevenLabs**: El uso de la API de ElevenLabs está sujeto a sus [Términos de Servicio](https://elevenlabs.io/terms).

