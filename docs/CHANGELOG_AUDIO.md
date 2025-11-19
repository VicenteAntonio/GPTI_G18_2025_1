# 🎵 Changelog de Integración de Audio con ElevenLabs

## Cambios Realizados

### 1. Generación de Pistas de Audio con IA

#### Scripts Creados
- **`scripts/generate_audio.py`**: Script principal para generar las 3 pistas de audio usando la API de ElevenLabs
- **`scripts/meditation_scripts.py`**: Textos de meditación guiada en español para cada sesión
- **`scripts/test_audio.py`**: Script de verificación de archivos de audio generados
- **`scripts/regenerate_audio.sh`**: Script bash automatizado para regenerar todos los audios
- **`scripts/update_durations.py`**: Utilidad para extraer duraciones reales de archivos MP3
- **`scripts/requirements.txt`**: Dependencias de Python (elevenlabs, python-dotenv)

#### Archivos de Audio Generados
- **`assets/audio/sleep-test.mp3`**: 11.83 segundos (~0.20 min)
- **`assets/audio/relaxation-morning.mp3`**: 96.91 segundos (~1.62 min)
- **`assets/audio/selfawareness-mindful.mp3`**: 112.27 segundos (~1.87 min)

### 2. Integración con la Aplicación

#### Cambios en `src/constants/index.ts`
- Agregado mapeo de archivos de audio locales usando `require()`
- Actualizado `MEDITATION_SESSIONS` con campo `audioFile`
- **Duraciones sincronizadas** con las duraciones reales de los archivos MP3

```typescript
const AUDIO_FILES = {
  'sleep-test': require('../../assets/audio/sleep-test.mp3'),
  'relaxation-morning': require('../../assets/audio/relaxation-morning.mp3'),
  'selfawareness-mindful': require('../../assets/audio/selfawareness-mindful.mp3'),
};
```

#### Cambios en `src/screens/MeditationScreen.tsx`
- Modificado `loadSound()` para cargar el archivo de audio específico de cada sesión
- Agregada configuración de modo de audio para iOS/Android
- Agregado manejo de errores con fallback a simulación
- Duraciones mostradas ahora con **2 decimales** usando `.toFixed(2)`

#### Cambios en `src/types/index.ts`
- Agregado campo `audioFile?: any` a la interfaz `MeditationSession`
- Actualizado comentario de `totalMinutes` de "entero" a "con decimales"

### 3. Sistema de Minutos con Decimales

#### Cambios en `src/services/DatabaseService.ts`
- Los minutos se **redondean a 2 decimales** al guardar
- Fórmula de betterflies actualizada para usar `floor(minutos)` en el cálculo
- Documentación actualizada con nueva fórmula

**Fórmula anterior:**
```
betterflies = minutos × 2 + floor(racha / 3) + 1
```

**Fórmula nueva:**
```
betterflies = floor(minutos) × 2 + floor(racha / 3) + 1
```

#### Cambios en Pantallas
- **`HomeScreen.tsx`**: Muestra minutos con `.toFixed(2)`
- **`ProfileScreen.tsx`**: Muestra minutos con `.toFixed(2)`
- **`MeditationScreen.tsx`**: 
  - Duración de sesión con `.toFixed(2)`
  - Alert de completado con `.toFixed(2)`

### 4. Configuración del Proyecto

#### `.env`
```bash
ELEVENLABS_API_KEY=sk_e477bd0055bb25094a3558f7e15cfac9e983b17899be8e5f
```

#### `.gitignore`
```
# Archivos de audio generados (se regeneran con scripts)
assets/audio/*.mp3
!assets/audio/.gitkeep
```

#### `package.json` - Nuevos Scripts
```json
{
  "generate-audio": "python3 scripts/generate_audio.py",
  "test-audio": "python3 scripts/test_audio.py",
  "regenerate-audio": "./scripts/regenerate_audio.sh"
}
```

### 5. Documentación

#### Archivos Creados
- **`docs/AUDIO_GENERATION.md`**: Guía completa de generación de audio con ElevenLabs
- **`scripts/README_AUDIO.md`**: Guía rápida en el directorio de scripts
- **`assets/audio/.gitkeep`**: Placeholder para el directorio de audio

#### README.md Actualizado
- Sección completa sobre generación de audio
- Tabla de pistas disponibles con duraciones correctas
- Instrucciones de uso de scripts
- Actualizada estructura del proyecto

## Características Técnicas

### Configuración de ElevenLabs
- **Modelo**: `eleven_multilingual_v2` (soporta español)
- **Voz**: `JBFqnCBsd6RMkjVDRZzb` (voz calmada y suave)
- **Formato**: MP3, 44.1kHz, 128kbps

### Expo AV Configuration
```typescript
await Audio.setAudioModeAsync({
  playsInSilentModeIOS: true,
  staysActiveInBackground: false,
  shouldDuckAndroid: true,
});
```

## Beneficios

1. **Audio Generado por IA**: Voz natural y profesional sin necesidad de grabación
2. **Fácil Personalización**: Editar textos y regenerar audios automáticamente
3. **Multilingüe**: Soporte para español con ElevenLabs
4. **Precisión**: Duraciones exactas sincronizadas con archivos reales
5. **Mantenible**: Scripts automatizados y documentación completa

## Uso para Desarrolladores

### Generar Audios
```bash
npm run generate-audio
```

### Verificar Audios
```bash
npm run test-audio
```

### Regenerar Todo
```bash
npm run regenerate-audio
```

### Agregar Nueva Sesión

1. Editar `scripts/meditation_scripts.py`:
```python
MEDITATION_TEXTS = {
    # ... textos existentes ...
    "nueva-sesion": "Tu texto de meditación..."
}
```

2. Editar `scripts/generate_audio.py`:
```python
SESSIONS_CONFIG.append({
    "id": "nueva-sesion",
    "name": "Nueva Sesión",
    "voice_id": "JBFqnCBsd6RMkjVDRZzb",
    "filename": "nueva-sesion.mp3"
})
```

3. Generar audio:
```bash
npm run generate-audio
```

4. Obtener duración real:
```bash
ffprobe -v error -show_entries format=duration \
  -of default=noprint_wrappers=1:nokey=1 \
  assets/audio/nueva-sesion.mp3
```

5. Actualizar `src/constants/index.ts` con la nueva sesión y su duración real

## Próximas Mejoras Sugeridas

- [ ] Cache de audios generados para evitar regeneración innecesaria
- [ ] Soporte para múltiples voces (masculina/femenina)
- [ ] Generación de audios en diferentes idiomas
- [ ] Control de velocidad de reproducción en la app
- [ ] Efectos de sonido ambiente (opcional)
- [ ] Exportar/compartir meditaciones personalizadas

## Notas Importantes

- Los archivos MP3 **NO** se suben al repositorio (están en `.gitignore`)
- Cada desarrollador debe generar sus propios audios localmente
- La API key de ElevenLabs es personal y no debe compartirse públicamente
- El plan gratuito de ElevenLabs permite ~10,000 caracteres/mes
- Generar las 3 sesiones consume aproximadamente 5,500 caracteres (~55% del plan gratuito)

