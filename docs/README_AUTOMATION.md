# 🤖 Sistema de Automatización de Generación de Audio

Este proyecto incluye un sistema completo para automatizar la generación de audios de meditación cada 24 horas usando ElevenLabs AI.

## 🚀 Inicio Rápido

```bash
# 1. Instalar dependencias
pip3 install -r scripts/requirements.txt

# 2. Ejecutar el scheduler
npm run audio:schedule
```

¡Eso es todo! Los audios se generarán automáticamente cada día a las 3:00 AM.

## 📖 Documentación Completa

- **[Guía de Inicio Rápido](./docs/QUICK_START_AUTOMATION.md)** - Configuración en 5 minutos
- **[Documentación Completa](./docs/AUDIO_AUTOMATION.md)** - Todas las opciones y configuraciones

## ⚙️ Métodos de Automatización

### 1. Scheduler Python (Recomendado) ⭐

**Ventajas:**
- ✅ Multiplataforma (Windows, Linux, Mac)
- ✅ Fácil de configurar
- ✅ Logs detallados

```bash
npm run audio:schedule
```

### 2. Cron Job (Linux/Mac)

**Ventajas:**
- ✅ Nativo del sistema
- ✅ No requiere proceso en ejecución

```bash
npm run audio:setup-cron
```

### 3. Servicio Systemd (Linux)

**Ventajas:**
- ✅ Inicio automático con el sistema
- ✅ Reinicio automático en caso de fallo

```bash
npm run audio:setup-service
```

## 📝 Comandos NPM Disponibles

```bash
# Generación Manual
npm run generate-audio          # Generar audios manualmente
npm run test-audio              # Probar audios existentes
npm run regenerate-audio        # Regenerar todos los audios

# Automatización
npm run audio:schedule          # Iniciar scheduler Python
npm run audio:setup-cron        # Configurar cron job
npm run audio:setup-service     # Configurar servicio systemd
npm run audio:logs              # Ver logs en tiempo real
```

## 📊 Estructura de Archivos

```
scripts/
├── audio_scheduler.py              # Scheduler Python principal
├── audio_scheduler_service.sh      # Instalador de servicio systemd
├── setup_cron.sh                   # Configurador de cron job
├── generate_audio.py               # Generador de audio
├── meditation_scripts.py           # Textos de meditación
└── requirements.txt                # Dependencias Python

logs/
├── audio_scheduler.log             # Logs del scheduler
├── cron_audio_generation.log       # Logs del cron
└── scheduler_service.log           # Logs del servicio

docs/
├── AUDIO_AUTOMATION.md             # Documentación completa
└── QUICK_START_AUTOMATION.md       # Inicio rápido
```

## 🔧 Configuración

### Requisitos

- Python 3.7+
- API Key de ElevenLabs
- Dependencias: `elevenlabs`, `python-dotenv`, `apscheduler`

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
ELEVENLABS_API_KEY=sk_tu_api_key_aqui
```

## 📈 Monitoreo

### Ver Logs

```bash
# Scheduler Python
tail -f logs/audio_scheduler.log

# Cron Job
tail -f logs/cron_audio_generation.log

# Servicio Systemd
sudo journalctl -u audio-scheduler -f
```

### Verificar Audios Generados

```bash
ls -lh assets/audio/*.mp3
```

## 🎯 Características

- ✅ **Generación Automática**: Crea audios cada 24 horas
- ✅ **Logs Detallados**: Registro completo de cada ejecución
- ✅ **Manejo de Errores**: Reintentos automáticos en caso de fallo
- ✅ **Múltiples Métodos**: Elige el que mejor se adapte a tu sistema
- ✅ **Fácil Configuración**: Scripts de instalación automatizados
- ✅ **Monitoreo**: Ver estado y logs en tiempo real

## 🔍 Solución de Problemas

### El scheduler no inicia

```bash
# Verificar dependencias
pip3 install -r scripts/requirements.txt

# Verificar API key
cat .env | grep ELEVENLABS_API_KEY
```

### Los audios no se generan

```bash
# Probar generación manual
npm run generate-audio

# Ver logs
cat logs/audio_scheduler.log
```

Para más ayuda, consulta la [documentación completa](./docs/AUDIO_AUTOMATION.md#solución-de-problemas).

## 💡 Recomendaciones

1. **Hora de Ejecución**: Se recomienda 2:00-4:00 AM para menor carga
2. **Backup**: Respalda los audios generados periódicamente
3. **Monitoreo**: Revisa los logs regularmente
4. **Recursos**: Verifica tu cuota de ElevenLabs mensualmente

## 📞 Soporte

Si tienes problemas:

1. ✅ Revisa los [logs](#monitoreo)
2. ✅ Consulta la [solución de problemas](./docs/AUDIO_AUTOMATION.md#solución-de-problemas)
3. ✅ Verifica tu API key de ElevenLabs
4. ✅ Asegúrate de tener conexión a internet

## 📚 Más Recursos

- [Documentación de ElevenLabs](https://elevenlabs.io/docs)
- [Guía de APScheduler](https://apscheduler.readthedocs.io/)
- [Crontab Guru](https://crontab.guru/) - Para cron expressions

---

**Desarrollado por:** Betterfly  
**Versión:** 1.0.0  
**Última actualización:** Noviembre 2025

---

**¿Listo para empezar?** 👉 [Guía de Inicio Rápido](./docs/QUICK_START_AUTOMATION.md)


