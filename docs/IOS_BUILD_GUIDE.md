# 📱 Guía Completa: Crear App para iPhone (IPA)

Esta guía te ayudará a crear tu aplicación para iPhone usando Expo EAS Build.

## 📋 Requisitos

### 1. Cuenta de Apple Developer ⚠️ **OBLIGATORIO**

- **Costo:** $99 USD/año
- **Registro:** https://developer.apple.com/programs/
- **Por qué lo necesitas:** Apple requiere esta cuenta para firmar apps y distribuirlas

### 2. Software Instalado

✅ Node.js (ya lo tienes)  
✅ Expo CLI (ya lo tienes)  
✅ EAS CLI (ya instalado)

---

## 🚀 Método 1: EAS Build (Recomendado - SIN MAC)

Este método **NO requiere una Mac** y es completamente en la nube.

### Paso 1: Login en Expo

```bash
cd /home/vicente/UC/GPTI/GPTI_G18_2025_1

# Login en Expo (crea una cuenta si no tienes)
npx eas login
```

### Paso 2: Configurar el proyecto

```bash
# Inicializar EAS en tu proyecto
npx eas build:configure
```

Esto creará/actualizará `eas.json` con la configuración de builds.

### Paso 3: Configurar credenciales de Apple

```bash
# EAS te guiará para configurar tus credenciales de Apple
npx eas credentials
```

**Opciones que te preguntará:**

1. **Apple ID:** Tu email de Apple Developer
2. **Contraseña específica para apps:** 
   - Ve a https://appleid.apple.com/account/manage
   - Genera una contraseña específica para la app
3. **EAS puede manejar tus certificados automáticamente** ✅ (Recomendado: di "Yes")

### Paso 4: Actualizar app.json

Asegúrate de que tu `app.json` tenga la configuración correcta para iOS:

```json
{
  "expo": {
    "name": "Meditación Diaria",
    "slug": "meditacion-diaria",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#4ECDC4"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.tuempresa.meditaciondiaria",
      "buildNumber": "1.0.0"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#4ECDC4"
      },
      "package": "com.tuempresa.meditaciondiaria"
    }
  }
}
```

**⚠️ IMPORTANTE:** Cambia `com.tuempresa.meditaciondiaria` por tu propio Bundle ID único.

### Paso 5: Build para iOS

#### Para Testing (distribución interna):

```bash
# Build de preview (para testear antes de subir a App Store)
npx eas build --platform ios --profile preview
```

#### Para Producción (App Store):

```bash
# Build de producción
npx eas build --platform ios --profile production
```

**Tiempo estimado:** 10-20 minutos

### Paso 6: Descargar el IPA

Una vez completado el build:

```bash
# EAS te dará un link para descargar el IPA
# Ejemplo: https://expo.dev/accounts/tu-usuario/projects/tu-proyecto/builds/...
```

---

## 📦 Tipos de Distribución para iOS

### 1. **Internal Distribution (Testing)**

Para probar en tu iPhone o el de tus testers:

```bash
npx eas build --platform ios --profile preview
```

**Cómo instalar:**
- Descarga el IPA
- Usa Apple Configurator 2 (Mac) o un servicio como TestFlight
- O instala directamente desde Expo Go app

### 2. **App Store Distribution (Producción)**

Para publicar en la App Store:

```bash
npx eas build --platform ios --profile production
```

Luego:

```bash
# Submit automáticamente a la App Store
npx eas submit --platform ios
```

### 3. **Ad Hoc Distribution**

Para distribuir a dispositivos específicos (sin App Store):

Edita `eas.json`:

```json
{
  "build": {
    "adhoc": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    }
  }
}
```

Luego:

```bash
npx eas build --platform ios --profile adhoc
```

---

## 🔧 Método 2: Build con Xcode (Requiere Mac)

Si tienes una Mac, puedes hacer un build nativo:

### Paso 1: Eject de Expo

```bash
npx expo prebuild
```

Esto genera las carpetas `ios/` y `android/` nativas.

### Paso 2: Abrir en Xcode

```bash
# En tu Mac
cd ios
open MeditacionDiaria.xcworkspace
```

### Paso 3: Configurar Signing

1. En Xcode, selecciona tu proyecto
2. Ve a "Signing & Capabilities"
3. Selecciona tu Team (Apple Developer Account)
4. Xcode configurará automáticamente los certificados

### Paso 4: Archivar y Exportar

1. En Xcode: Product → Archive
2. Una vez terminado: Distribute App
3. Selecciona el método de distribución:
   - **App Store Connect** (para App Store)
   - **Ad Hoc** (para testing interno)
   - **Development** (para tu dispositivo)

---

## 🧪 Testear la App sin publicar

### Opción 1: TestFlight (Recomendado)

TestFlight es la forma oficial de Apple para testing:

1. Build con perfil `production`
2. Submit a App Store Connect:
   ```bash
   npx eas submit --platform ios
   ```
3. En App Store Connect:
   - Ve a tu app
   - Pestaña "TestFlight"
   - Agrega testers (hasta 100 externos gratis)
4. Los testers descargan la app TestFlight
5. Instalan tu app desde TestFlight

### Opción 2: Expo Go (Solo para desarrollo)

Durante el desarrollo, usa Expo Go:

```bash
npx expo start
```

Escanea el QR con la app Expo Go en tu iPhone.

**⚠️ Limitación:** Expo Go no funciona para apps en producción que usen código nativo personalizado.

### Opción 3: Development Build

```bash
npx eas build --platform ios --profile development
```

Instala esta build en tu dispositivo para probar con código nativo.

---

## 📤 Publicar en la App Store

### Paso 1: Preparar App Store Connect

1. Ve a https://appstoreconnect.apple.com
2. Click "My Apps" → "+" → "New App"
3. Completa la información:
   - **Platform:** iOS
   - **Name:** Meditación Diaria
   - **Primary Language:** Spanish
   - **Bundle ID:** Selecciona el que configuraste
   - **SKU:** Un identificador único (ej: meditation-app-2024)

### Paso 2: Build y Submit

```bash
# Build de producción
npx eas build --platform ios --profile production

# Submit automáticamente
npx eas submit --platform ios
```

### Paso 3: Completar información en App Store Connect

1. **Screenshots:** Necesitas capturas para:
   - iPhone 6.7" (Pro Max)
   - iPhone 6.5" 
   - iPhone 5.5"
   - iPad Pro 12.9"

2. **Descripción de la App**

3. **Keywords** para búsqueda

4. **Categoría:** Health & Fitness

5. **Rating:** Selecciona la clasificación apropiada

### Paso 4: Submit para Review

1. Click "Submit for Review"
2. Apple revisará tu app (1-3 días típicamente)
3. Si es aprobada: ¡Tu app estará en la App Store! 🎉

---

## 💡 Tips y Mejores Prácticas

### 1. Bundle Identifier único

Usa un formato como:
- `com.tuempresa.nombreapp`
- `com.betterfly.meditaciondiaria`

### 2. Versioning

Para cada actualización:

```json
{
  "version": "1.0.1",  // Versión visible para usuarios
  "ios": {
    "buildNumber": "2"  // Incrementa esto en cada build
  }
}
```

### 3. Assets para iOS

Asegúrate de tener:
- ✅ `icon.png` (1024x1024)
- ✅ `splash.png` 
- ✅ Screenshots para diferentes tamaños de iPhone
- ✅ `adaptive-icon.png` (opcional para iOS pero útil)

### 4. Testing antes de publicar

```bash
# Build de preview
npx eas build --platform ios --profile preview

# Instala en tu dispositivo para probar
# O usa TestFlight
```

### 5. Builds simultáneos

Puedes hacer builds para iOS y Android al mismo tiempo:

```bash
# Build para ambas plataformas
npx eas build --platform all --profile production
```

---

## 🐛 Troubleshooting

### Error: "No Apple Developer account found"

**Solución:**
```bash
npx eas credentials
# Sigue los pasos para agregar tu cuenta
```

### Error: "Bundle identifier already in use"

**Solución:** Cambia el `bundleIdentifier` en `app.json` a uno único.

### Build falla por dependencias

**Solución:**
```bash
# Limpia e instala dependencias
rm -rf node_modules
npm install
npx eas build --platform ios --profile production
```

### No puedo instalar el IPA en mi iPhone

**Soluciones:**
1. Usa TestFlight (más fácil)
2. O configura tu dispositivo en el perfil de aprovisionamiento
3. O usa un build de "development" profile

---

## 📊 Comparación de Métodos

| Método | Requiere Mac | Costo | Facilidad | Recomendado |
|--------|--------------|-------|-----------|-------------|
| **EAS Build** | ❌ No | Gratis* | ⭐⭐⭐⭐⭐ | ✅ SÍ |
| Xcode | ✅ Sí | $99/año | ⭐⭐⭐ | Si tienes Mac |
| Expo Go | ❌ No | Gratis | ⭐⭐⭐⭐⭐ | Solo desarrollo |

*Gratis con limitaciones, $29/mes para más builds

---

## 🎯 Comandos Rápidos de Referencia

```bash
# Login
npx eas login

# Configurar proyecto
npx eas build:configure

# Build de prueba
npx eas build --platform ios --profile preview

# Build de producción
npx eas build --platform ios --profile production

# Submit a App Store
npx eas submit --platform ios

# Ver builds anteriores
npx eas build:list

# Ver estado de un build
npx eas build:view [BUILD_ID]
```

---

## 📞 Recursos Adicionales

- **Documentación oficial EAS:** https://docs.expo.dev/build/introduction/
- **Guía de App Store:** https://developer.apple.com/app-store/review/guidelines/
- **Expo Discord:** https://chat.expo.dev/
- **Human Interface Guidelines:** https://developer.apple.com/design/human-interface-guidelines/ios

---

## ✅ Checklist Pre-Publicación

Antes de publicar en la App Store:

- [ ] Cuenta de Apple Developer activa ($99/año)
- [ ] Bundle ID único configurado
- [ ] Todos los assets (icon, splash) en sus lugares
- [ ] App probada en TestFlight
- [ ] Screenshots preparados para todos los tamaños
- [ ] Descripción y keywords escritos
- [ ] Política de privacidad lista (URL)
- [ ] Términos de servicio listos (URL)
- [ ] App funciona sin bugs críticos
- [ ] Configuración de Railway.app funcionando (para bots)

---

¡Buena suerte con tu app de iPhone! 🚀📱

