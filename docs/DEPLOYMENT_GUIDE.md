# 🚀 Guía de Despliegue - Scheduler y Bots de Telegram

Este documento explica cómo mantener el **scheduler de generación de audios** y los **bots de Telegram** funcionando 24/7 en un servidor cloud.

## 📋 Índice

1. [¿Por qué necesito un servidor?](#por-qué-necesito-un-servidor)
2. [Opción 1: Railway.app (Recomendado)](#opción-1-railwayapp-gratis)
3. [Opción 2: Render.com](#opción-2-rendercom-gratis)
4. [Opción 3: Heroku](#opción-3-heroku)
5. [Opción 4: Tu propio servidor](#opción-4-tu-propio-servidor)

---

## ❓ ¿Por qué necesito un servidor?

El APK de tu aplicación móvil **NO puede ejecutar** los scripts Python del servidor porque:

- 🚫 El APK solo contiene la app móvil (React Native)
- 🚫 Android no ejecuta Python nativamente
- 🚫 El scheduler necesita correr 24/7
- 🚫 Los bots de Telegram necesitan estar siempre activos

**Solución:** Mantener estos servicios en un servidor separado:
- ✅ Audio Scheduler (genera audios cada 24h 1min)
- ✅ CalmTalk Bot (@BetterCalmTalkBot)
- ✅ Bot de Meditación (@betterMeditation)

---

## 🎯 Opción 1: Railway.app (GRATIS)

### Ventajas:
- ✅ **Gratis** (500 horas/mes gratis)
- ✅ Fácil de usar
- ✅ Deploy automático desde GitHub
- ✅ Logs en tiempo real

### Pasos:

#### 1. Preparar el código

```bash
# Asegúrate de tener estos archivos en tu proyecto:
# - railway.json
# - scripts/start_all_services.sh
# - scripts/requirements.txt
# - .env (con tus API keys)
```

#### 2. Crear cuenta en Railway

1. Ve a [railway.app](https://railway.app)
2. Regístrate con GitHub
3. Click en "New Project"

#### 3. Conectar tu repositorio

1. Selecciona "Deploy from GitHub repo"
2. Elige tu repositorio
3. Railway detectará automáticamente la configuración

#### 4. Configurar variables de entorno

En el dashboard de Railway:
1. Ve a "Variables"
2. Agrega:
   ```
   ELEVENLABS_API_KEY=tu_key_aqui
   GOOGLE_API_KEY=tu_key_aqui
   TELEGRAM_BOT_TOKEN_CALMA=8444162439:AAHjZJjQa5hKgIjbCekg46MjvO9IZDbXnCE
   TELEGRAM_BOT_TOKEN_MEDITATION=8369488380:AAGkGvfGFMqDojmy_FNidqCE48QZLdlcvJc
   ```

#### 5. Deploy

1. Railway desplegará automáticamente
2. Los servicios estarán activos 24/7
3. Verás logs en tiempo real

---

## 🎨 Opción 2: Render.com (GRATIS)

### Ventajas:
- ✅ Completamente gratis
- ✅ Deploy desde GitHub
- ✅ SSL gratis

### Pasos:

#### 1. Crear cuenta

1. Ve a [render.com](https://render.com)
2. Regístrate con GitHub

#### 2. Crear "Background Worker"

1. Click "New +"
2. Selecciona "Background Worker"
3. Conecta tu repositorio
4. Configura:
   - **Build Command:** `pip install -r scripts/requirements.txt`
   - **Start Command:** `bash scripts/start_all_services.sh`

#### 3. Variables de entorno

En Settings → Environment, agrega:
```
ELEVENLABS_API_KEY=tu_key
GOOGLE_API_KEY=tu_key
```

#### 4. Deploy

Click "Create Background Worker" y listo!

---

## 📦 Opción 3: Heroku

### Ventajas:
- ✅ Muy estable
- ✅ Ampliamente usado

### Pasos:

```bash
# 1. Instalar Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# 2. Login
heroku login

# 3. Crear app
heroku create mi-app-meditation

# 4. Configurar variables
heroku config:set ELEVENLABS_API_KEY=tu_key
heroku config:set GOOGLE_API_KEY=tu_key

# 5. Deploy
git push heroku main

# 6. Escalar worker
heroku ps:scale worker=1
```

---

## 🖥️ Opción 4: Tu Propio Servidor

### Si tienes un VPS o servidor Linux:

#### Configurar como servicio systemd:

```bash
# 1. Clonar el proyecto
cd /opt
git clone tu_repositorio
cd tu_repositorio

# 2. Instalar dependencias
pip3 install -r scripts/requirements.txt

# 3. Configurar .env
nano .env
# Agregar tus API keys

# 4. Crear servicio systemd
sudo nano /etc/systemd/system/meditation-services.service
```

Contenido del servicio:

```ini
[Unit]
Description=Meditation Services (Bots + Scheduler)
After=network.target

[Service]
Type=simple
User=tu_usuario
WorkingDirectory=/opt/tu_repositorio/GPTI_G18_2025_1
ExecStart=/usr/bin/bash scripts/start_all_services.sh
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Activar servicio:

```bash
sudo systemctl enable meditation-services
sudo systemctl start meditation-services
sudo systemctl status meditation-services

# Ver logs
sudo journalctl -u meditation-services -f
```

---

## 📊 Verificar que Todo Funciona

Una vez desplegado en cualquier plataforma:

### 1. Verificar Bots de Telegram

- Abre Telegram
- Busca `@BetterCalmTalkBot`
- Envía `/start`
- El bot debe responder ✅

### 2. Verificar Scheduler

- Revisa los logs del servidor
- Debes ver: "🚀 Scheduler iniciado correctamente"
- Cada 24h 1min verás: "Iniciando generación automática de audios"

### 3. Probar desde la App

- Abre tu app móvil
- Ve a la pestaña "Bots" 🤖
- Presiona "Abrir en Telegram"
- Ambos bots deben funcionar ✅

---

## 🔧 Troubleshooting

### Los bots no responden

1. Verifica que los tokens sean correctos
2. Revisa los logs del servidor
3. Asegúrate de que el proceso está corriendo

### El scheduler no genera audios

1. Verifica que `ELEVENLABS_API_KEY` esté configurada
2. Revisa los logs: `tail -f logs/audio_scheduler.log`
3. Verifica que haya espacio en disco

### Error de permisos

```bash
chmod +x scripts/*.sh
```

---

## 💡 Recomendación Final

Para producción, usa **Railway.app** o **Render.com** (ambos gratis):

1. ✅ Fácil de configurar
2. ✅ Deploy automático desde GitHub
3. ✅ No necesitas mantener tu computadora encendida
4. ✅ Escalable si creces

---

## 📞 Contacto

Si tienes problemas, revisa los logs en:
- `logs/CalmaBot.log`
- `logs/BotMeditacion.log`
- `logs/audio_scheduler.log`

