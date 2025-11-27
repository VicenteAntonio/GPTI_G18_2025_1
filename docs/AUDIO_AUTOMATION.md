# 🤖 Automatización de Generación de Audio

Este documento explica cómo configurar la generación automática de audios de meditación cada 24 horas.

## 📋 Tabla de Contenidos

1. [Métodos Disponibles](#métodos-disponibles)
2. [Método 1: Scheduler Python](#método-1-scheduler-python-recomendado)
3. [Método 2: Cron Job](#método-2-cron-job-linuxmac)
4. [Método 3: Servicio Systemd](#método-3-servicio-systemd-linux)
5. [Solución de Problemas](#solución-de-problemas)

---

## Métodos Disponibles

Hay tres formas de automatizar la generación de audios:

| Método | Plataforma | Ventajas | Desventajas |
|--------|-----------|----------|-------------|
| **Scheduler Python** | Todas | Fácil de usar, multiplataforma | Requiere mantener el script ejecutándose |
| **Cron Job** | Linux/Mac | Nativo del sistema, ligero | Solo Linux/Mac |
| **Servicio Systemd** | Linux | Se ejecuta automáticamente, reinicio automático | Solo Linux con systemd |

---

## Método 1: Scheduler Python (Recomendado)

### ✅ Ventajas
- Multiplataforma (Windows, Linux, Mac)
- Fácil de configurar
- Logs detallados
- No requiere permisos especiales

### 📦 Instalación

```bash
# 1. Instalar dependencias
pip3 install -r scripts/requirements.txt

# 2. Verificar que tu .env está configurado
# Debe contener: ELEVENLABS_API_KEY=tu_api_key_aqui

# 3. Ejecutar el scheduler
python3 scripts/audio_scheduler.py
```

### ⚙️ Configuración

Puedes editar el archivo `scripts/audio_scheduler.py` para cambiar:

**Opción A: Ejecutar cada 24 horas desde el inicio**

```python
scheduler.add_job(
    generate_audio_task,
    'interval',
    hours=24,
    next_run_time=datetime.now()
)
```

**Opción B: Ejecutar todos los días a una hora específica (por defecto: 3:00 AM)**

```python
scheduler.add_job(
    generate_audio_task,
    CronTrigger(hour=3, minute=0),  # Cambiar hora y minuto aquí
)
```

### 📝 Logs

Los logs se guardan en `logs/audio_scheduler.log`

```bash
# Ver logs en tiempo real
tail -f logs/audio_scheduler.log
```

### 🛑 Detener el Scheduler

Simplemente presiona `Ctrl+C` en la terminal donde está ejecutándose.

### 💡 Ejecutar en Segundo Plano

**Linux/Mac:**
```bash
nohup python3 scripts/audio_scheduler.py > /dev/null 2>&1 &
```

**Windows:**
```powershell
Start-Process python -ArgumentList "scripts/audio_scheduler.py" -WindowStyle Hidden
```

---

## Método 2: Cron Job (Linux/Mac)

### ✅ Ventajas
- Nativo del sistema operativo
- Muy ligero
- No requiere proceso en ejecución continua

### 📦 Instalación Automática

```bash
# Ejecutar el script de configuración
bash scripts/setup_cron.sh
```

Este script te permitirá:
- Elegir la hora de ejecución diaria
- Configurar el cron job automáticamente
- Ver los logs de ejecución

### 📦 Instalación Manual

Si prefieres configurar manualmente:

```bash
# 1. Editar crontab
crontab -e

# 2. Agregar esta línea (ejecutar diariamente a las 3:00 AM)
0 3 * * * cd /home/vicente/UC/GPTI/GPTI_G18_2025_1 && source .env && python3 scripts/generate_audio.py >> logs/cron_audio.log 2>&1

# 3. Guardar y salir
```

### 🕐 Ejemplos de Horarios

```bash
# Cada día a las 3:00 AM
0 3 * * * [comando]

# Cada día a las 12:00 PM (mediodía)
0 12 * * * [comando]

# Cada día a la medianoche
0 0 * * * [comando]

# Cada 12 horas
0 */12 * * * [comando]
```

### 🔧 Comandos Útiles

```bash
# Ver cron jobs actuales
crontab -l

# Editar cron jobs
crontab -e

# Ver logs
tail -f logs/cron_audio_generation.log
```

---

## Método 3: Servicio Systemd (Linux)

### ✅ Ventajas
- Se ejecuta automáticamente al iniciar el sistema
- Reinicio automático en caso de fallo
- Mejor integración con el sistema

### 📦 Instalación

```bash
# Ejecutar el script de instalación
bash scripts/audio_scheduler_service.sh
```

Este script:
1. Crea un servicio systemd
2. Lo habilita para inicio automático
3. Inicia el servicio inmediatamente

### 🔧 Comandos del Servicio

```bash
# Ver estado
sudo systemctl status audio-scheduler

# Iniciar servicio
sudo systemctl start audio-scheduler

# Detener servicio
sudo systemctl stop audio-scheduler

# Reiniciar servicio
sudo systemctl restart audio-scheduler

# Ver logs en tiempo real
sudo journalctl -u audio-scheduler -f

# Deshabilitar inicio automático
sudo systemctl disable audio-scheduler

# Habilitar inicio automático
sudo systemctl enable audio-scheduler
```

### 📝 Logs

Los logs se guardan en:
- `logs/scheduler_service.log` - Salida estándar
- `logs/scheduler_service_error.log` - Errores
- `journalctl -u audio-scheduler` - Logs del sistema

---

## 🔍 Solución de Problemas

### El scheduler no se ejecuta

**1. Verificar API Key**
```bash
# Verificar que existe
cat .env | grep ELEVENLABS_API_KEY

# Si no existe, agregarlo
echo "ELEVENLABS_API_KEY=tu_api_key_aqui" >> .env
```

**2. Verificar dependencias**
```bash
# Reinstalar dependencias
pip3 install -r scripts/requirements.txt
```

**3. Ejecutar manualmente**
```bash
# Probar la generación manual
python3 scripts/generate_audio.py
```

### Los audios no se generan correctamente

**1. Verificar permisos de escritura**
```bash
# Verificar que el directorio existe
ls -la assets/audio/

# Crear si no existe
mkdir -p assets/audio
```

**2. Verificar espacio en disco**
```bash
df -h
```

**3. Ver logs detallados**
```bash
# Scheduler Python
tail -f logs/audio_scheduler.log

# Cron
tail -f logs/cron_audio_generation.log

# Systemd
sudo journalctl -u audio-scheduler -f
```

### Cron Job no funciona

**1. Verificar que cron está ejecutándose**
```bash
sudo systemctl status cron  # Linux
sudo systemctl status crond # CentOS/RHEL
```

**2. Verificar sintaxis del crontab**
```bash
crontab -l
```

**3. Verificar rutas absolutas**
Los cron jobs requieren rutas absolutas, no relativas.

### Servicio Systemd falla

**1. Ver logs del servicio**
```bash
sudo journalctl -u audio-scheduler -n 50 --no-pager
```

**2. Verificar el archivo de servicio**
```bash
sudo systemctl cat audio-scheduler
```

**3. Recargar y reiniciar**
```bash
sudo systemctl daemon-reload
sudo systemctl restart audio-scheduler
```

---

## 📊 Monitoreo

### Ver Próxima Ejecución (Scheduler Python)

Cuando el scheduler está ejecutándose, muestra la próxima fecha de ejecución en la consola.

### Ver Historial de Ejecuciones

```bash
# Ver últimas 20 líneas del log
tail -n 20 logs/audio_scheduler.log

# Buscar ejecuciones completadas
grep "completada exitosamente" logs/audio_scheduler.log

# Buscar errores
grep "Error" logs/audio_scheduler.log
```

### Ver Audios Generados

```bash
# Listar audios con fechas de modificación
ls -lh assets/audio/*.mp3
```

---

## 💡 Recomendaciones

1. **Hora de Ejecución**: Se recomienda ejecutar entre 2:00 AM - 4:00 AM cuando hay menos carga en el sistema.

2. **Backup**: Considera hacer backup de los audios generados periódicamente.

3. **Monitoreo**: Configura alertas para detectar fallos en la generación.

4. **Recursos**: La generación de audio consume API credits de ElevenLabs. Verifica tu cuota mensual.

5. **Logs**: Limpia los logs periódicamente para no consumir espacio en disco:
   ```bash
   # Mantener solo los últimos 1000 registros
   tail -n 1000 logs/audio_scheduler.log > logs/audio_scheduler.log.tmp
   mv logs/audio_scheduler.log.tmp logs/audio_scheduler.log
   ```

---

## 📞 Soporte

Si tienes problemas con la automatización:

1. Revisa los logs
2. Verifica la documentación de ElevenLabs
3. Asegúrate de tener suficientes créditos en tu cuenta de ElevenLabs
4. Verifica tu conexión a internet

---

## 🎯 Próximos Pasos

Una vez configurada la automatización:

1. ✅ Verificar que el primer audio se generó correctamente
2. ✅ Revisar los logs después de 24 horas
3. ✅ Configurar alertas si es necesario
4. ✅ Documentar cualquier personalización adicional

---

**¡Listo!** Tu sistema de generación automática de audios está configurado. 🎉



