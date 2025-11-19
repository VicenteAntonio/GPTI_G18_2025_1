# 🎵 Generador de Pistas de Audio con ElevenLabs

Este directorio contiene los scripts para generar las pistas de audio de meditación usando la API de ElevenLabs.

## 📋 Requisitos Previos

1. **Python 3.7 o superior** instalado
2. **API Key de ElevenLabs** (ya proporcionada)
3. **Conexión a internet** para llamar a la API

## 🚀 Instalación

### Paso 1: Configurar el archivo .env

Crea un archivo `.env` en la raíz del proyecto (si no existe):

```bash
cd /home/vicente/UC/GPTI/GPTI_G18_2025_1
cp .env.example .env
```

Edita el archivo `.env` y reemplaza `tu_api_key_aqui` con la API key:

```
ELEVENLABS_API_KEY=sk_e477bd0055bb25094a3558f7e15cfac9e983b17899be8e5f
```

### Paso 2: Instalar dependencias de Python

```bash
# Desde el directorio raíz del proyecto
pip install -r scripts/requirements.txt
```

O si usas `pip3`:

```bash
pip3 install -r scripts/requirements.txt
```

## 🎬 Uso

### Generar todas las pistas de audio

Ejecuta el script de generación:

```bash
# Desde el directorio raíz del proyecto
python scripts/generate_audio.py
```

O con `python3`:

```bash
python3 scripts/generate_audio.py
```

El script generará 3 archivos de audio en `assets/audio/`:
- `sleep-test.mp3` - Sesión de sueño rápido (7 segundos)
- `relaxation-morning.mp3` - Relajación matutina (10 minutos aprox.)
- `selfawareness-mindful.mp3` - Consciencia plena (10 minutos aprox.)

## 📁 Estructura de Archivos

```
scripts/
├── README_AUDIO.md          # Este archivo
├── requirements.txt         # Dependencias de Python
├── meditation_scripts.py    # Textos de meditación
└── generate_audio.py        # Script principal de generación

assets/
└── audio/                   # Audios generados (se crea automáticamente)
    ├── sleep-test.mp3
    ├── relaxation-morning.mp3
    └── selfawareness-mindful.mp3
```

## 🎙️ Configuración de Voces

Actualmente todas las sesiones usan la misma voz de ElevenLabs:
- **Voice ID**: `JBFqnCBsd6RMkjVDRZzb` (voz suave y calmada)

Puedes cambiar la voz editando el archivo `generate_audio.py` y modificando el `voice_id` en `SESSIONS_CONFIG`.

### Voces disponibles en ElevenLabs:

Para ver las voces disponibles, puedes usar:

```python
from elevenlabs.client import ElevenLabs
elevenlabs = ElevenLabs(api_key="tu_api_key")
voices = elevenlabs.voices.get_all()
for voice in voices.voices:
    print(f"{voice.name}: {voice.voice_id}")
```

## ✏️ Personalizar los Textos de Meditación

Para modificar los textos de las meditaciones:

1. Abre `scripts/meditation_scripts.py`
2. Edita el diccionario `MEDITATION_TEXTS`
3. Vuelve a ejecutar `generate_audio.py`

## 🔧 Configuración Avanzada

### Cambiar el formato de salida

En `generate_audio.py`, puedes modificar `output_format`:

```python
output_format="mp3_44100_128",  # Actual
# Otras opciones:
# "mp3_44100_64"   - MP3 de menor calidad
# "mp3_44100_192"  - MP3 de mayor calidad
# "pcm_16000"      - PCM para procesamiento
```

### Cambiar el modelo de voz

```python
model_id="eleven_multilingual_v2",  # Actual (multilingüe)
# Otras opciones:
# "eleven_monolingual_v1"  - Inglés solamente
# "eleven_turbo_v2"        - Más rápido
```

## ⚠️ Notas Importantes

1. **Costos**: Cada generación de audio consume créditos de tu cuenta de ElevenLabs
2. **Límites de API**: Verifica los límites de tu plan de ElevenLabs
3. **Tamaño de archivos**: Los archivos de audio de 10 minutos ocupan aproximadamente 1-2 MB cada uno
4. **No subir el .env**: El archivo `.env` está en `.gitignore` por seguridad

## 🐛 Solución de Problemas

### Error: "No module named 'elevenlabs'"
```bash
pip install elevenlabs python-dotenv
```

### Error: "No se encontró ELEVENLABS_API_KEY"
- Verifica que el archivo `.env` existe en la raíz del proyecto
- Verifica que la API key está correctamente escrita en `.env`

### Error de autenticación de ElevenLabs
- Verifica que la API key es válida
- Verifica que tu cuenta de ElevenLabs tiene créditos disponibles

### Los audios no se generan
- Verifica tu conexión a internet
- Verifica que el directorio `assets/audio` existe
- Revisa los mensajes de error en la consola

## 📞 Soporte

Para más información sobre ElevenLabs:
- Documentación: https://elevenlabs.io/docs
- Dashboard: https://elevenlabs.io/app

