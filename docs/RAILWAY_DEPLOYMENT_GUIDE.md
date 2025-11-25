# 🚂 Guía de Deployment en Railway - OPTIMIZADA

Esta guía te ayudará a desplegar correctamente tu proyecto en Railway sin timeouts.

---

## ✅ Problema Resuelto

**Antes:** Build timeout porque Railway intentaba instalar todas las dependencias de React Native  
**Ahora:** Build optimizado que solo instala lo necesario para el servidor

---

## 🎯 Qué se Despliega en Railway

Con la configuración actual, Railway desplegará:

✅ **Audio Scheduler** - Genera audios cada 24h 1min  
❌ **Bots de Telegram** - NO incluidos (explicación abajo)

---

## 📦 Archivos de Configuración

| Archivo | Propósito |
|---------|-----------|
| `nixpacks.toml` | Configuración de build de Railway |
| `.railwayignore` | Archivos a excluir del deployment |
| `railway.json` | Configuración general de Railway |
| `scripts/start_railway_services.sh` | Script optimizado de inicio |

---

## 🚀 Cómo Desplegar

### 1. Conectar a Railway

1. Ve a [railway.app](https://railway.app)
2. Regístrate con GitHub
3. Click "New Project"
4. Selecciona "Deploy from GitHub repo"
5. Elige `GPTI_G18_2025_1`

### 2. Configurar Variables de Entorno

En el dashboard de Railway, ve a "Variables" y agrega:

```
ELEVENLABS_API_KEY=sk_e477bd0055bb25094a3558f7e15cfac9e983b17899be8e5f
GOOGLE_API_KEY=AIzaSyCKVX0AXKF9wACApZgTtELDxM8g1Nu1IXs
```

### 3. Deploy Automático

Railway detectará:
- `nixpacks.toml` - Usará Python 3.11
- `package.json` - Ejecutará `npm start`
- Scripts optimizados

El deployment debería completarse en **2-3 minutos** ⚡

---

## 📊 Verificar que Funciona

### Opción 1: Ver Logs en Railway

1. Ve a tu proyecto en Railway
2. Click en la pestaña "Deployments"
3. Click en el deployment más reciente
4. Verás logs como:

```
🚀 Iniciando servicios en Railway...
✓ Python encontrado: Python 3.11.x
📦 Instalando dependencias Python...
▶️  Iniciando AudioScheduler...
✅ SERVICIOS INICIADOS
```

### Opción 2: Verificar que el Scheduler Corre

El scheduler debería:
- ✅ Iniciar sin errores
- ✅ Ejecutarse cada 24h 1min
- ✅ Generar audios automáticamente

---

## 🤖 ¿Y los Bots de Telegram?

Los bots de Telegram (`CalmaBot` y `MeditationBot`) **NO están incluidos** en este deployment porque:

1. Están en carpetas fuera del proyecto (`../Bot_texto`, `../Bot_audio`)
2. Railway solo despliega lo que está en el repositorio
3. Pueden correrse por separado (más eficiente)

### Opciones para los Bots:

#### Opción 1: Correrlos Localmente (Gratis)

Los bots ya están corriendo en tu máquina local:

```bash
# Ver si están corriendo
ps aux | grep -E "calmbotpy|bot.py"

# Si no están corriendo
cd /home/vicente/UC/GPTI
./ejecutar_bots.sh
```

**Ventaja:** Gratis, no cuesta nada  
**Desventaja:** Tu PC debe estar encendida 24/7

#### Opción 2: Deployment Separado en Railway

Crea **dos proyectos adicionales** en Railway:

**Proyecto 1: CalmaBot**
1. Sube solo la carpeta `Bot_texto/` a un nuevo repositorio
2. Deploy en Railway
3. Configura el token

**Proyecto 2: MeditationBot**
1. Sube solo la carpeta `Bot_audio/` a un nuevo repositorio
2. Deploy en Railway
3. Configura variables:
   - `TELEGRAM_BOT_TOKEN`
   - `GOOGLE_API_KEY`
   - `ELEVENLABS_API_KEY`

#### Opción 3: Otro Servicio Cloud Gratuito

- **PythonAnywhere**: Bueno para bots Python
- **Render.com**: Similar a Railway, gratis
- **Fly.io**: También con tier gratuito

---

## 💰 Costos de Railway

| Plan | Costo | Recursos |
|------|-------|----------|
| **Free** | $0 | 500 horas/mes (suficiente para 1 servicio) |
| **Hobby** | $5/mes | Recursos ilimitados |

**Para tu caso:**
- Audio Scheduler: ~720 horas/mes (siempre corriendo)
- Con plan gratuito: ❌ Excederás el límite
- Con plan Hobby: ✅ Funcionará perfectamente

---

## 🔧 Troubleshooting

### Build falla con "timed out"

Ya está arreglado con la configuración optimizada. Si persiste:

```bash
# Verifica que los archivos estén en GitHub
git pull origin main
ls -la nixpacks.toml .railwayignore
```

### "Audio Scheduler no está corriendo"

Revisa los logs en Railway. Posibles causas:
- Faltan variables de entorno
- Error en las API keys
- Problema con dependencias Python

### Servicios se reinician constantemente

Verifica las API keys:
- `ELEVENLABS_API_KEY` debe ser válida
- `GOOGLE_API_KEY` debe tener permisos

---

## 📝 Comandos Útiles

```bash
# Ver logs local del scheduler
tail -f /home/vicente/UC/GPTI/GPTI_G18_2025_1/logs/audio_scheduler.log

# Probar script de Railway localmente
cd /home/vicente/UC/GPTI/GPTI_G18_2025_1
bash scripts/start_railway_services.sh

# Ver bots corriendo localmente
ps aux | grep -E "calmbotpy|bot.py"
```

---

## ✅ Checklist de Deployment

- [ ] Código subido a GitHub (commit `774b9e8` o posterior)
- [ ] Proyecto creado en Railway
- [ ] Repositorio conectado
- [ ] Variables de entorno configuradas
- [ ] Deployment exitoso (sin timeouts)
- [ ] Logs muestran "SERVICIOS INICIADOS"
- [ ] (Opcional) Plan Hobby activado si quieres >500h/mes
- [ ] (Opcional) Bots de Telegram corriendo en local o separado

---

## 🎯 Arquitectura Final

```
┌─────────────────────────┐
│   RAILWAY (Cloud)       │
│                         │
│   ✅ Audio Scheduler    │
│   (Genera audios 24/7)  │
└─────────────────────────┘

┌─────────────────────────┐
│   TU PC LOCAL           │
│                         │
│   🤖 CalmaBot           │
│   🤖 MeditationBot      │
│   (Responden usuarios)  │
└─────────────────────────┘

┌─────────────────────────┐
│   USUARIOS              │
│                         │
│   📱 App Android (APK)  │
│   💬 Telegram           │
└─────────────────────────┘
```

---

## 📞 Siguiente Paso

Una vez que el deployment en Railway esté funcionando:

1. ✅ Audio Scheduler corriendo en Railway
2. ✅ Bots corriendo en tu PC local
3. ✅ APK funcionando en Android
4. ✅ Todo conectado y operativo

**¡Tu infraestructura está completa!** 🎉

Para mejorar:
- Considera mover los bots a Railway (proyectos separados)
- O usa PythonAnywhere para los bots (gratis para siempre)

---

## 🔗 Enlaces Útiles

- [Railway Dashboard](https://railway.app/dashboard)
- [Railway Docs](https://docs.railway.app/)
- [Nixpacks Docs](https://nixpacks.com/docs)

---

**¿Necesitas ayuda? Revisa los logs en Railway o ejecuta localmente para debug.**

