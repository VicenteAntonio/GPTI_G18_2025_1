# 🤖 Crear APK de Android - Guía Rápida (5 minutos)

Guía paso a paso para crear un **APK descargable** de tu app de Android.

---

## ⚡ Método Rápido (Recomendado)

### Paso 1: Login en Expo

```bash
cd /home/vicente/UC/GPTI/GPTI_G18_2025_1

# Login (necesitas cuenta de Expo - es GRATIS)
npx eas login
```

Si no tienes cuenta:
- Regístrate en: https://expo.dev/signup (GRATIS)
- O crea cuenta con: `npx eas login` (te preguntará)

### Paso 2: Configurar proyecto

```bash
# Solo la primera vez
npx eas build:configure
```

Esto creará/actualizará `eas.json` (ya está creado).

### Paso 3: Build del APK

```bash
# APK para instalación directa (NO para Play Store)

```

**Tiempo estimado:** 10-15 minutos ⏱️

### Paso 4: Descargar APK

Una vez completado:
1. EAS te dará un link
2. Ejemplo: `https://expo.dev/accounts/[tu-usuario]/projects/[proyecto]/builds/[id]`
3. Click en "Download"
4. Descarga el APK
5. ¡Listo para instalar!

---

## 📦 Tipos de Build para Android

### 1. **APK** (Para ti y tus usuarios)

```bash
# Build de preview (APK instalable)
npx eas build --platform android --profile preview
```

**Características:**
- ✅ Instalación directa en Android
- ✅ Puedes compartir el archivo
- ✅ No requiere Google Play Store
- ✅ Perfecto para distribución interna

### 2. **AAB** (Para Google Play Store)

```bash
# Build de producción (Google Play)
npx eas build --platform android --profile production
```

**Características:**
- ✅ Optimizado para Play Store
- ✅ Menor tamaño
- ❌ No se puede instalar directamente
- ✅ Requerido para publicar en Play Store

---

## 🎯 ¿Cuál necesitas?

### Quieres instalar directamente → **APK** (preview)

```bash
npx eas build --platform android --profile preview
```

### Quieres publicar en Play Store → **AAB** (production)

```bash
npx eas build --platform android --profile production
```

---

## 📱 Instalar APK en Android

### Método 1: Transferir directamente

1. Descarga el APK en tu PC
2. Conecta tu Android con USB
3. Copia el APK al teléfono
4. En el teléfono:
   - Abre el archivo
   - Toca "Instalar"
   - Si aparece "Fuente desconocida" → Permitir

### Método 2: Link directo

1. Sube el APK a Google Drive/Dropbox
2. Comparte el link
3. Abre el link en el Android
4. Descarga e instala

### Método 3: Desde el build de EAS

1. Abre el link del build en tu Android
2. Click en "Install"
3. El APK se descarga
4. Instala directamente

---

## 🔧 Configuración Actual

Tu `eas.json` ya está configurado con:

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"  // ← Genera APK instalable
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"  // ← Genera AAB para Play Store
      }
    }
  }
}
```

---

## 🚀 Script Helper

Usa el script para facilitar el proceso:

```bash
./scripts/build_android.sh
```

Este script te guiará paso a paso.

---

## ⚙️ Configuración Avanzada

### Cambiar nombre de la app

Edita `app.json`:

```json
{
  "expo": {
    "name": "Tu Nombre de App",
    "android": {
      "package": "com.tuempresa.tuapp"
    }
  }
}
```

### Cambiar icono

Reemplaza: `assets/icon.png` (1024x1024)

### Cambiar splash screen

Reemplaza: `assets/splash.png`

---

## 💰 Costos

### Build con EAS:
- **Gratis**: Limitado (30 builds/mes)
- **Priority**: $29/mes (builds ilimitados, más rápido)

### Publicación:
- **Distribución directa (APK)**: GRATIS ✅
- **Google Play Store**: $25 (pago único)

---

## 📊 Estado del Build

Ver builds anteriores:

```bash
# Listar todos los builds
npx eas build:list

# Ver estado de un build específico
npx eas build:view [BUILD_ID]

# Ver solo builds de Android
npx eas build:list --platform android
```

---

## 🐛 Solución de Problemas

### Error: "Not logged in"

```bash
npx eas login
```

### Error: "Project not configured"

```bash
npx eas build:configure
```

### Build falla

```bash
# Limpiar e intentar de nuevo
rm -rf node_modules
npm install
npx eas build --platform android --profile preview --clear-cache
```

### APK no se instala

1. Verifica que "Fuentes desconocidas" esté habilitado
2. En Android: Settings → Security → Unknown sources → Enable
3. O: Settings → Apps → Special access → Install unknown apps → Chrome/Downloads → Allow

---

## ✅ Checklist Antes de Build

- [ ] Cuenta de Expo creada (gratis)
- [ ] Login exitoso (`npx eas login`)
- [ ] `app.json` configurado
- [ ] `eas.json` existe
- [ ] Internet estable (el build se hace en la nube)

---

## 🎯 Comando Final

Para tu caso (APK descargable para producción):

```bash
# Login (una vez)
npx eas login

# Build APK
npx eas build --platform android --profile preview

# Espera 10-15 minutos
# Descarga el APK del link que te da
# ¡Instala en cualquier Android!
```

---

## 📱 Compartir con Usuarios

Una vez tengas el APK:

### Opción 1: Google Drive

1. Sube el APK a Google Drive
2. Cambia permisos a "Anyone with the link"
3. Comparte el link
4. Los usuarios descargan e instalan

### Opción 2: Firebase App Distribution

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Distribuir
firebase appdistribution:distribute app.apk \
  --app YOUR_APP_ID \
  --groups testers
```

### Opción 3: Link directo de EAS

```bash
# Hacer el build público
npx eas build --platform android --profile preview --non-interactive

# Compartir el link exp://... con usuarios
```

---

## 🔗 Enlaces Útiles

- [Expo EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [Android APK vs AAB](https://docs.expo.dev/build-reference/apk/)
- [Distribución sin Play Store](https://docs.expo.dev/distribution/introduction/)

---

## 💡 Próximos Pasos

1. **Haz el build**: `npx eas build --platform android --profile preview`
2. **Prueba el APK**: Instala en tu Android
3. **Comparte**: Distribuye a tus usuarios
4. **Itera**: Haz cambios y repite

**Nota:** Si más adelante quieres publicar en Play Store, solo cambia `preview` por `production`.

---

**¡Tu APK estará listo en 15 minutos!** 🚀📱

