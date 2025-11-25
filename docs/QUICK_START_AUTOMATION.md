# ⚡ Inicio Rápido - Automatización de Audio

Guía de 5 minutos para configurar la generación automática de audios.

---

## 🎯 Opción Rápida: Scheduler Python (Recomendado)

### 1️⃣ Instalar Dependencias

```bash
pip3 install -r scripts/requirements.txt
```

### 2️⃣ Verificar Configuración

Asegúrate de tener tu API key configurada en `.env`:

```bash
# Ver si existe
cat .env | grep ELEVENLABS_API_KEY

# Si no existe, créala
echo "ELEVENLABS_API_KEY=tu_api_key_aqui" >> .env
```

### 3️⃣ Ejecutar Scheduler

```bash
# Usando npm
npm run audio:schedule

# O directamente con Python
python3 scripts/audio_scheduler.py
```

### 4️⃣ ¡Listo! 🎉

El scheduler ahora:
- ✅ Generará audios automáticamente cada día a las 3:00 AM
- ✅ Guardará logs en `logs/audio_scheduler.log`
- ✅ Se reiniciará automáticamente si hay errores

**Para detenerlo:** Presiona `Ctrl+C`

---

## 🔧 Configuración Avanzada

### Cambiar la Hora de Ejecución

Edita `scripts/audio_scheduler.py` línea 69:

```python
# Cambiar hora y minuto aquí
CronTrigger(hour=3, minute=0)  # 3:00 AM por defecto
```

Ejemplos:
- `CronTrigger(hour=12, minute=0)` → 12:00 PM (mediodía)
- `CronTrigger(hour=0, minute=0)` → 12:00 AM (medianoche)
- `CronTrigger(hour=15, minute=30)` → 3:30 PM

### Ejecutar en Segundo Plano

**Linux/Mac:**
```bash
nohup npm run audio:schedule > /dev/null 2>&1 &
```

**Ver logs:**
```bash
npm run audio:logs
# O
tail -f logs/audio_scheduler.log
```

---

## 🐧 Alternativa: Cron Job (Solo Linux/Mac)

Si prefieres usar cron (no requiere proceso en ejecución):

```bash
# Configuración automática
npm run audio:setup-cron

# Seguir las instrucciones en pantalla
```

Esto configurará un cron job que ejecutará la generación automáticamente.

---

## 🔍 Verificar que Funciona

### Ver Estado

```bash
# Ver logs en tiempo real
tail -f logs/audio_scheduler.log

# Ver último estado
tail -n 20 logs/audio_scheduler.log
```

### Probar Manualmente

```bash
# Generar audios manualmente
npm run generate-audio

# Verificar que se crearon
ls -lh assets/audio/*.mp3
```

---

## 🚨 Solución de Problemas

### "No se encontró ELEVENLABS_API_KEY"

```bash
# Agregar la API key
echo "ELEVENLABS_API_KEY=tu_api_key_aqui" > .env
```

### "ModuleNotFoundError: No module named 'apscheduler'"

```bash
# Reinstalar dependencias
pip3 install -r scripts/requirements.txt
```

### El scheduler no genera audios

1. Verifica los logs:
   ```bash
   cat logs/audio_scheduler.log
   ```

2. Prueba generar manualmente:
   ```bash
   npm run generate-audio
   ```

3. Verifica tu API key de ElevenLabs

---

## 📚 Más Información

Para configuración avanzada, consulta: [AUDIO_AUTOMATION.md](./AUDIO_AUTOMATION.md)

---

**¡Eso es todo!** Tu sistema está configurado. 🎊


