# 📋 Cheat Sheet - Automatización de Audio

Referencia rápida de comandos para la automatización de generación de audio.

---

## 🚀 Inicio Rápido

```bash
# 1. Verificar que todo está listo
npm run audio:check

# 2. Iniciar scheduler (opción más fácil)
npm run audio:schedule
```

---

## 📝 Comandos Principales

### Automatización

```bash
# Iniciar scheduler Python (recomendado)
npm run audio:schedule

# Configurar cron job (Linux/Mac)
npm run audio:setup-cron

# Configurar servicio systemd (Linux)
npm run audio:setup-service

# Verificar configuración
npm run audio:check
```

### Generación Manual

```bash
# Generar todos los audios manualmente
npm run generate-audio

# Regenerar todos los audios
npm run regenerate-audio

# Probar audios existentes
npm run test-audio
```

### Logs y Monitoreo

```bash
# Ver logs en tiempo real
npm run audio:logs

# Ver últimas 50 líneas del log
tail -n 50 logs/audio_scheduler.log

# Ver todos los logs
cat logs/audio_scheduler.log

# Buscar errores
grep "Error" logs/audio_scheduler.log

# Buscar ejecuciones exitosas
grep "completada exitosamente" logs/audio_scheduler.log
```

---

## 🔧 Comandos Systemd (Linux)

```bash
# Ver estado del servicio
sudo systemctl status audio-scheduler

# Iniciar servicio
sudo systemctl start audio-scheduler

# Detener servicio
sudo systemctl stop audio-scheduler

# Reiniciar servicio
sudo systemctl restart audio-scheduler

# Ver logs del servicio
sudo journalctl -u audio-scheduler -f

# Habilitar inicio automático
sudo systemctl enable audio-scheduler

# Deshabilitar inicio automático
sudo systemctl disable audio-scheduler
```

---

## ⏰ Comandos Cron

```bash
# Ver cron jobs actuales
crontab -l

# Editar cron jobs
crontab -e

# Ver logs de cron
tail -f logs/cron_audio_generation.log

# Ver ejecuciones de cron
cat logs/cron_executions.log
```

---

## 📊 Verificación y Archivos

```bash
# Listar audios generados con fechas
ls -lh assets/audio/*.mp3

# Ver tamaño del directorio de audios
du -sh assets/audio/

# Ver espacio en disco
df -h

# Verificar proceso del scheduler
ps aux | grep audio_scheduler
```

---

## 🔑 Configuración

```bash
# Ver API key configurada
cat .env | grep ELEVENLABS_API_KEY

# Editar .env
nano .env

# Instalar/reinstalar dependencias
pip3 install -r scripts/requirements.txt
```

---

## 🛠️ Solución de Problemas

```bash
# Ver Python version
python3 --version

# Ver dependencias instaladas
pip3 list | grep -E "elevenlabs|dotenv|apscheduler"

# Probar generación manual
python3 scripts/generate_audio.py

# Ver procesos relacionados
ps aux | grep -E "python|audio"

# Matar proceso del scheduler
pkill -f audio_scheduler.py
```

---

## 📂 Rutas Importantes

```
Proyecto:           /home/vicente/UC/GPTI/GPTI_G18_2025_1
Scripts:            /home/vicente/UC/GPTI/GPTI_G18_2025_1/scripts
Audios generados:   /home/vicente/UC/GPTI/GPTI_G18_2025_1/assets/audio
Logs:               /home/vicente/UC/GPTI/GPTI_G18_2025_1/logs
Configuración:      /home/vicente/UC/GPTI/GPTI_G18_2025_1/.env
```

---

## ⏰ Formatos de Tiempo (Cron)

```bash
# Cada día a las 3:00 AM
0 3 * * *

# Cada día a las 12:00 PM
0 12 * * *

# Cada día a medianoche
0 0 * * *

# Cada 12 horas
0 */12 * * *

# Cada hora
0 * * * *

# Cada 6 horas
0 */6 * * *
```

---

## 📋 Checklist de Verificación

- [ ] Python 3 instalado
- [ ] pip3 disponible
- [ ] elevenlabs instalado
- [ ] python-dotenv instalado
- [ ] apscheduler instalado
- [ ] Archivo .env existe
- [ ] ELEVENLABS_API_KEY configurada
- [ ] Directorio assets/audio existe
- [ ] Directorio logs existe
- [ ] Scripts tienen permisos de ejecución

---

## 🎯 Comandos de Emergencia

```bash
# Detener TODOS los schedulers
pkill -f audio_scheduler.py

# Detener servicio systemd
sudo systemctl stop audio-scheduler

# Eliminar cron job
crontab -e  # (y borrar la línea manualmente)

# Limpiar logs antiguos
> logs/audio_scheduler.log

# Eliminar todos los audios
rm assets/audio/*.mp3
```

---

## 💡 Tips Útiles

1. **Ver próxima ejecución:** El scheduler muestra la próxima fecha al iniciar
2. **Logs limpios:** Usa `grep` para filtrar información específica
3. **Backup:** Haz backup de `.env` y `assets/audio/` regularmente
4. **Monitoreo:** Revisa logs después de las primeras 2-3 ejecuciones
5. **Espacio:** Verifica espacio en disco periódicamente

---

## 📞 Enlaces Rápidos

- **[Documentación Completa](./docs/AUDIO_AUTOMATION.md)**
- **[Inicio Rápido](./docs/QUICK_START_AUTOMATION.md)**
- **[README Principal](./README_AUTOMATION.md)**
- **[Resumen](./RESUMEN_AUTOMATIZACION.md)**

---

**Última actualización:** 20 Nov 2025


