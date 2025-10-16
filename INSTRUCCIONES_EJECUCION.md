# 📱 Instrucciones para Ejecutar la Aplicación de Meditación

## ⚠️ PROBLEMA RESUELTO: Carga Infinita

Se han corregido los siguientes problemas:
- ✅ Incompatibilidades de versiones entre Expo, React Native y dependencias
- ✅ Imports con alias `@/` cambiados a rutas relativas
- ✅ Agregadas dependencias faltantes (`react-native-gesture-handler`, `react-native-reanimated`)
- ✅ Actualizado `babel.config.js` con plugin de reanimated
- ✅ Versiones compatibles con Node.js v10-v14

## 🚀 PASOS PARA EJECUTAR

### 1. Limpiar instalación anterior (IMPORTANTE)

```bash
rm -rf node_modules package-lock.json
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Limpiar caché de Expo

```bash
npx expo start --clear
```

O simplemente:

```bash
npm start
```

### 4. Conectar con Expo Go

1. **Descarga Expo Go** en tu dispositivo móvil:
   - Android: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

2. **Asegúrate de estar en la misma red WiFi** que tu computadora

3. **Escanea el código QR** que aparece en la terminal:
   - Android: Abre Expo Go y usa el escáner
   - iOS: Usa la cámara del teléfono

## 📋 VERSIONES INSTALADAS

```json
{
  "expo": "~46.0.0",
  "react": "18.0.0",
  "react-native": "0.69.9",
  "react-navigation": "^6.0.x"
}
```

Estas versiones son compatibles con Node.js v10-v18.

## 🔧 SOLUCIÓN A PROBLEMAS COMUNES

### Problema: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Problema: "Metro bundler error"
```bash
npx expo start --clear
```

### Problema: "Expo CLI not found"
Los scripts ya usan `npx expo`, no necesitas instalar Expo CLI globalmente.

### Problema: Pantalla blanca o carga infinita
1. Cierra la app en tu móvil
2. Para el servidor (`Ctrl+C`)
3. Limpia caché: `npx expo start --clear`
4. Vuelve a escanear el código QR

## ✅ VERIFICACIÓN

Si todo funciona correctamente, deberías ver:

1. **En la terminal**: Mensaje de "Metro bundler started"
2. **En tu móvil**: 
   - Pantalla de carga de Expo
   - Luego la pantalla principal con:
     - Saludo ("Buenos días/tardes/noches")
     - Estadísticas (sesiones, minutos, racha)
     - Categorías de meditación
     - Lista de sesiones disponibles

## 🎯 CARACTERÍSTICAS DE LA APP

- **Pantalla Principal**: Sesiones de meditación disponibles
- **Pantalla de Meditación**: Reproductor con temporizador
- **Pantalla de Perfil**: Estadísticas y progreso
- **Almacenamiento Local**: Tu progreso se guarda automáticamente
- **5 Categorías**: Mindfulness, Sueño, Ansiedad, Concentración, Respiración

## 📞 AYUDA

Si sigues teniendo problemas:

1. Verifica que estás en la misma red WiFi
2. Reinicia la aplicación Expo Go en tu móvil
3. Reinicia el servidor de desarrollo
4. Asegúrate de tener espacio suficiente en tu dispositivo

## 🎉 ¡LISTO!

Tu aplicación de meditación está configurada y lista para usar. ¡Disfruta tu sesión de meditación diaria! 🧘‍♀️

