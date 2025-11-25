# 🚀 Guía Rápida: Build iOS (5 minutos)

## ⚡ Pasos Rápidos

### 1️⃣ Prerrequisitos

- ✅ Cuenta de Apple Developer ($99/año) - **OBLIGATORIO**
- ✅ EAS CLI instalado (ya está)

### 2️⃣ Login en Expo

```bash
cd /home/vicente/UC/GPTI/GPTI_G18_2025_1
npx eas login
```

Si no tienes cuenta de Expo, créala en: https://expo.dev/signup

### 3️⃣ Configurar Proyecto

```bash
# Inicializar EAS (solo la primera vez)
npx eas build:configure
```

### 4️⃣ Configurar Credenciales de Apple

```bash
npx eas credentials
```

Necesitarás:
- **Apple ID** (tu email de Apple Developer)
- **Contraseña específica para apps** (genera una en https://appleid.apple.com/account/manage)

💡 **Tip:** EAS puede manejar certificados automáticamente - di "Yes" cuando te pregunte.

### 5️⃣ Hacer el Build

#### Para Testing:

```bash
npx eas build --platform ios --profile preview
```

#### Para App Store:

```bash
npx eas build --platform ios --profile production
```

**Tiempo:** 10-20 minutos ⏱️

### 6️⃣ Descargar el IPA

Una vez completado, EAS te dará un link:

```
https://expo.dev/accounts/[tu-usuario]/projects/[tu-proyecto]/builds/[build-id]
```

---

## 🎯 Usar el Script Helper

Para facilitar el proceso:

```bash
chmod +x scripts/build_ios.sh
./scripts/build_ios.sh
```

El script te mostrará un menú interactivo con todas las opciones.

---

## 📱 Instalar en tu iPhone

### Opción 1: TestFlight (Recomendado)

1. Build de producción:
   ```bash
   npx eas build --platform ios --profile production
   ```

2. Submit a App Store Connect:
   ```bash
   npx eas submit --platform ios
   ```

3. En App Store Connect → TestFlight
4. Agrega tu email como tester
5. Recibirás un email con el link de TestFlight
6. Descarga TestFlight desde el App Store
7. ¡Instala tu app! 🎉

### Opción 2: Instalación directa (Development)

1. Build de desarrollo:
   ```bash
   npx eas build --platform ios --profile development
   ```

2. Descarga el IPA
3. Usa Apple Configurator 2 (requiere Mac)

---

## 🚀 Publicar en App Store

```bash
# 1. Build
npx eas build --platform ios --profile production

# 2. Submit
npx eas submit --platform ios

# 3. Ve a App Store Connect y completa la información
# https://appstoreconnect.apple.com
```

---

## 📊 Builds Simultáneos (iOS + Android)

```bash
# Build para ambas plataformas
npx eas build --platform all --profile production
```

---

## 🐛 Problemas Comunes

### "No Apple Developer account"

```bash
npx eas credentials
# Sigue los pasos para agregar tu cuenta
```

### "Bundle identifier already in use"

Edita `app.json` y cambia el `bundleIdentifier`:

```json
{
  "ios": {
    "bundleIdentifier": "com.tuempresa.nombreunico"
  }
}
```

### Build falla

```bash
# Limpia e intenta de nuevo
rm -rf node_modules
npm install
npx eas build --platform ios --profile production
```

---

## 📚 Más Información

Para una guía completa, lee: **IOS_BUILD_GUIDE.md**

---

## ✅ Checklist

- [ ] Cuenta de Apple Developer activa
- [ ] EAS CLI instalado
- [ ] Login en Expo (`npx eas login`)
- [ ] Credenciales configuradas (`npx eas credentials`)
- [ ] Build exitoso
- [ ] IPA descargado
- [ ] App probada

---

**¡Eso es todo! Tu app estará lista para iPhone en minutos.** 🎉

Para soporte: https://docs.expo.dev/build/introduction/

